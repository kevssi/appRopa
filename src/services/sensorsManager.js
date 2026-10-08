// Gestor Completo de Sensores de Dispositivo para Dal
// 1. Giroscopio / Orientación (Inspección 3D de Tejidos)
// 2. Acelerómetro / Sacudida (Shake to Style & Unlock Perk)
// 3. Geolocalización (Radar de Boutiques y Mensajería Express)
// 4. Cámara / Sensor Óptico (Smart Color Matcher & Espejo Virtual)
// 5. Sensor de Luz Ambiental (Modos Adaptativos Día/Tarde)

import confetti from 'canvas-confetti';
import { pushService } from './pushNotifications.js';
import { storage } from './storage.js';

// Lista de Boutiques Dal para cálculo de distancia por Geolocation
export const DAL_BOUTIQUES = [
  {
    id: 1,
    name: 'Dal Flagship Roma Norte',
    city: 'Ciudad de México',
    address: 'Colima 184, Roma Norte, Cuauhtémoc',
    lat: 19.41940000,
    lng: -99.16220000,
    phone: '+52 55 4123 9081',
    schedule: 'Lun - Dom: 10:00 - 20:00',
    expressPickupMinutes: 15
  },
  {
    id: 2,
    name: 'Dal Atelier Polanco',
    city: 'Ciudad de México',
    address: 'Campos Elíseos 204, Polanco, Miguel Hidalgo',
    lat: 19.42980000,
    lng: -99.19150000,
    phone: '+52 55 8920 1144',
    schedule: 'Lun - Sáb: 11:00 - 20:30',
    expressPickupMinutes: 20
  },
  {
    id: 3,
    name: 'Dal Estudio Salamanca',
    city: 'Madrid',
    address: 'Calle de Claudio Coello 34, Salamanca',
    lat: 40.42620000,
    lng: -3.68650000,
    phone: '+34 91 582 9910',
    schedule: 'Lun - Sáb: 10:30 - 20:30',
    expressPickupMinutes: 15
  },
  {
    id: 4,
    name: 'Dal Espacio SoHo',
    city: 'New York',
    address: '432 Broome St, SoHo, NY 10013',
    lat: 40.72080000,
    lng: -73.99980000,
    phone: '+1 212 940 3388',
    schedule: 'Lun - Dom: 11:00 - 19:30',
    expressPickupMinutes: 25
  }
];

// Fórmula Haversine para calcular distancia en km entre dos coordenadas GPS
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

class SensorsManager {
  constructor() {
    this.gyro = {
      active: false,
      beta: 0,   // Inclinación frontal (-180 a 180)
      gamma: 0,  // Inclinación lateral (-90 a 90)
      alpha: 0   // Dirección brújula (0 a 360)
    };

    this.shake = {
      active: false,
      lastX: 0,
      lastY: 0,
      lastZ: 0,
      lastTime: 0,
      threshold: 15,
      cooldown: false
    };

    this.location = {
      active: false,
      lat: null,
      lng: null,
      accuracy: null,
      nearestBoutique: null,
      distanceKm: null,
      deliveryEtaMinutes: null
    };

    this.cameraStream = null;
    this.ambientLightLux = null;
    this.listeners = new Map();
  }

  // Suscribirse a cambios de sensores
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  // ==========================================
  // SENSOR 1: GIROSCOPIO / ORIENTACIÓN 3D
  // ==========================================
  async initGyroscope() {
    if (typeof window === 'undefined') return;

    const handleOrientation = (e) => {
      this.gyro.active = true;
      this.gyro.beta = Math.round(e.beta || 0);
      this.gyro.gamma = Math.round(e.gamma || 0);
      this.gyro.alpha = Math.round(e.alpha || 0);

      this.emit('gyroscope', { ...this.gyro });
      this.applyGlobal3DTilt(this.gyro.gamma, this.gyro.beta);
    };

    // Soporte para permisos en iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
          return true;
        }
      } catch (err) {
        console.warn('Permiso giroscopio denegado en iOS:', err);
      }
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      return true;
    }

    // Fallback de simulación con ratón en escritorio
    window.addEventListener('mousemove', (e) => {
      if (!this.gyro.active) {
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;
        this.emit('gyroscope', {
          beta: Math.round(yOffset),
          gamma: Math.round(xOffset),
          alpha: 0,
          simulated: true
        });
        this.applyGlobal3DTilt(xOffset, yOffset);
      }
    });

    return true;
  }

  // Aplicar inclinación de luz y perspectiva a elementos con clase .dal-sensor-tilt
  applyGlobal3DTilt(gamma, beta) {
    const clampedGamma = Math.max(-25, Math.min(25, gamma));
    const clampedBeta = Math.max(-25, Math.min(25, beta));

    document.documentElement.style.setProperty('--tilt-x', `${clampedGamma * 0.4}deg`);
    document.documentElement.style.setProperty('--tilt-y', `${-clampedBeta * 0.4}deg`);
    document.documentElement.style.setProperty('--shine-pos-x', `${50 + clampedGamma * 1.5}%`);
    document.documentElement.style.setProperty('--shine-pos-y', `${50 + clampedBeta * 1.5}%`);
  }

  // ==========================================
  // SENSOR 2: ACELERÓMETRO / SACUDIDA (SHAKE)
  // ==========================================
  async initShakeDetector() {
    if (typeof window === 'undefined') return;

    const handleMotion = (e) => {
      const current = e.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - this.shake.lastTime;

      if (timeDiff > 100) {
        const deltaX = Math.abs(current.x - this.shake.lastX);
        const deltaY = Math.abs(current.y - this.shake.lastY);
        const deltaZ = Math.abs(current.z - this.shake.lastZ);

        const speed = (deltaX + deltaY + deltaZ) / (timeDiff / 1000);

        if (speed > this.shake.threshold && !this.shake.cooldown) {
          this.triggerShakeAction('sensor_nativo');
        }

        this.shake.lastX = current.x;
        this.shake.lastY = current.y;
        this.shake.lastZ = current.z;
        this.shake.lastTime = currentTime;
      }
    };

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotion, true);
          this.shake.active = true;
          return true;
        }
      } catch (err) {
        console.warn('Permiso acelerómetro denegado en iOS:', err);
      }
    } else if ('ondevicemotion' in window) {
      window.addEventListener('devicemotion', handleMotion, true);
      this.shake.active = true;
      return true;
    }

    return false;
  }

  // Disparar acción al sacudir (tanto nativo por sensor como simulador)
  triggerShakeAction(source = 'simulacion') {
    if (this.shake.cooldown) return;
    this.shake.cooldown = true;

    // Vibración háptica
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([120, 60, 120, 60, 180]);
      } catch {}
    }

    // Efecto de confeti elegante (paleta Dal: salvia, terracota, arena, carbón)
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58715E', '#BA7350', '#D8D4CC', '#232220', '#EAE6DD']
      });
    } catch {}

    // Desbloquear cupón exclusivo
    const promoCode = 'DAL-FRESH15';
    storage.addDiscount({
      code: promoCode,
      percent: 15,
      description: '15% Off desbloqueado por Sensor de Movimiento Dal',
      unlockedAt: new Date().toLocaleTimeString()
    });

    // Enviar notificación Push
    pushService.sendSensorRewardNotification(promoCode, 15);

    this.emit('shake', {
      source,
      code: promoCode,
      percent: 15,
      timestamp: Date.now()
    });

    // Cooldown para evitar disparos accidentales continuos
    setTimeout(() => {
      this.shake.cooldown = false;
    }, 5000);
  }

  // ==========================================
  // SENSOR 3: GEOLOCALIZACIÓN & RADAR
  // ==========================================
  async requestGeolocation() {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalización no soportada en este navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Encontrar boutique Dal más cercana
          let nearest = null;
          let minDistance = Infinity;

          DAL_BOUTIQUES.forEach((boutique) => {
            const distance = calculateHaversineDistance(lat, lng, boutique.lat, boutique.lng);
            if (distance < minDistance) {
              minDistance = distance;
              nearest = boutique;
            }
          });

          // Calcular tiempo estimado de mensajería express (aprox 3 min por km + preparación)
          const deliveryEta = Math.min(120, Math.max(25, Math.round(minDistance * 2.8 + 20)));

          this.location = {
            active: true,
            lat,
            lng,
            accuracy,
            nearestBoutique: nearest,
            distanceKm: minDistance,
            deliveryEtaMinutes: deliveryEta
          };

          this.emit('geolocation', { ...this.location });

          // Si está a menos de 50 km, enviar notificación de proximidad
          if (minDistance < 50) {
            pushService.sendBoutiqueProximityNotification(nearest.name, minDistance);
          }

          resolve(this.location);
        },
        (error) => {
          console.warn('Geolocalización denegada o con error:', error.message);
          // Fallback predeterminado a CDMX Roma Norte
          const fallbackLat = 19.4194;
          const fallbackLng = -99.1622;
          this.location = {
            active: false,
            lat: fallbackLat,
            lng: fallbackLng,
            accuracy: 50,
            nearestBoutique: DAL_BOUTIQUES[0],
            distanceKm: 0.1,
            deliveryEtaMinutes: 25,
            isDefault: true
          };
          this.emit('geolocation', { ...this.location });
          resolve(this.location);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  // ==========================================
  // SENSOR 4: CÁMARA (COLOR MATCHER & ESPEJO)
  // ==========================================
  async startCamera(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Cámara no soportada en este dispositivo.');
    }

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      if (videoElement) {
        videoElement.srcObject = this.cameraStream;
        await videoElement.play();
      }

      this.emit('camera-started', true);
      return this.cameraStream;
    } catch (err) {
      console.warn('Error al iniciar cámara:', err.message);
      throw err;
    }
  }

  stopCamera(videoElement) {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    this.emit('camera-stopped', true);
  }

  // Analizar color predominante en el feed de la cámara
  sampleCameraColor(videoElement) {
    if (!videoElement || videoElement.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Muestreo central
    const imgData = ctx.getImageData(50, 40, 60, 40);
    const data = imgData.data;
    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

    // Recomendación estilística de Dal según paleta
    let recommendation = {
      detectedColor: hex,
      rgb: { r, g, b },
      paletteName: 'Espectro Neutro Dal',
      suggestedProducts: ['Camisa Sobrecamisa Lino Arena', 'Pantalón Plisado Salvia Muted'],
      description: 'Tu iluminación actual armoniza con linos naturales y verdes salvia desaturados.'
    };

    if (r > 160 && g > 150 && b > 140) {
      recommendation.paletteName = 'Claridad Cálida / Avena';
      recommendation.suggestedProducts = ['Jersey Cuello Mock Algodón Crudo', 'Vestido Camisero Midi Algodón'];
      recommendation.description = 'Tonalidad luminosa: perfecta para texturas marfil y tejidos canalé finos.';
    } else if (r < 80 && g < 80 && b < 80) {
      recommendation.paletteName = 'Profundidad Nocturna / Carbón';
      recommendation.suggestedProducts = ['Camiseta Pesada Cuello Caja Carbón', 'Gabardina Fluida Piedra Pálido'];
      recommendation.description = 'Contraste elevado: combina con siluetas estructuradas y gabardinas desestructuradas.';
    } else if (g > r && g > b) {
      recommendation.paletteName = 'Botánica Salvia & Tierra';
      recommendation.suggestedProducts = ['Pantalón Plisado Salvia Muted', 'Blazer Desestructurado Lino Arcilla'];
      recommendation.description = 'Armonía orgánica: ideal para combinar con sastrería relajada en arcilla y lino.';
    }

    this.emit('color-matched', recommendation);
    return recommendation;
  }

  // ==========================================
  // SENSOR 5: SENSOR DE LUZ AMBIENTAL
  // ==========================================
  initAmbientLightSensor() {
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new window.AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          this.ambientLightLux = sensor.illuminance;
          this.emit('ambient-light', { lux: sensor.illuminance });
          if (sensor.illuminance < 30) {
            document.body.classList.add('dal-evening-lounge');
          } else {
            document.body.classList.remove('dal-evening-lounge');
          }
        });
        sensor.start();
        return true;
      } catch (err) {
        console.warn('AmbientLightSensor no activo o requiere flags:', err.message);
      }
    }
    return false;
  }
}

export const sensors = new SensorsManager();

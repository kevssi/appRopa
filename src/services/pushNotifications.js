// Gestor de Notificaciones Push y Alertas para Dal
import { storage } from './storage.js';

let swRegistration = null;

// Registro inicial del Service Worker para Push
export async function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker de Dal registrado exitosamente:', swRegistration.scope);
    } catch (err) {
      console.warn('Registro de Service Worker no completado:', err.message);
    }
  }
}

// Reproducir tono sutil y suave de confirmación Dal (Web Audio API)
function playGentleAudioChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Silencioso si audio está bloqueado por el navegador
  }
}

// Mostrar Toast flotante elegante en la aplicación (punto medio, estético, sin emojis)
export function showInAppToast({ title, message, iconType = 'bell', duration = 4500 }) {
  let container = document.getElementById('dal-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'dal-toast-container';
    container.className = 'dal-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'dal-toast-card';
  toast.innerHTML = `
    <div class="dal-toast-icon">
      <i data-lucide="${iconType}"></i>
    </div>
    <div class="dal-toast-content">
      <div class="dal-toast-header">
        <span class="dal-toast-brand">Dal Push</span>
        <span class="dal-toast-time">Ahora</span>
      </div>
      <h4 class="dal-toast-title">${title}</h4>
      <p class="dal-toast-body">${message}</p>
    </div>
    <button class="dal-toast-close" aria-label="Cerrar notificación">
      <i data-lucide="x"></i>
    </button>
  `;

  // Renderizar iconos lucide en el toast
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons({ root: toast });
  }

  toast.querySelector('.dal-toast-close').addEventListener('click', () => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
}

export const pushService = {
  // Estado actual del permiso de notificación
  getPermission() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  },

  // Solicitar permiso de notificaciones push al usuario
  async requestPermission() {
    if (!('Notification' in window)) {
      showInAppToast({
        title: 'Dispositivo no compatible',
        message: 'Este navegador no soporta la API nativa de notificaciones push.',
        iconType: 'info'
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        playGentleAudioChime();
        if ('vibrate' in navigator) navigator.vibrate([60, 40, 60]);

        this.sendPushNotification({
          title: 'Notificaciones Dal Activas',
          body: 'Recibirás avisos de nuevos lanzamientos de lino, alertas de pedidos y recompensas de sensores.',
          icon: '/favicon.svg',
          tag: 'dal-welcome',
          iconType: 'check-circle'
        });
        return true;
      } else {
        showInAppToast({
          title: 'Permiso declinado',
          message: 'Las notificaciones push del navegador están desactivadas. Verás las alertas dentro de Dal.',
          iconType: 'bell-off'
        });
        return false;
      }
    } catch (err) {
      console.warn('Error al solicitar permiso de notificación:', err);
      return false;
    }
  },

  // Enviar Notificación Push (Nativa + Guardar en historial + Toast de respaldo)
  sendPushNotification({ title, body, icon = '/favicon.svg', tag = 'dal-general', iconType = 'bell' }) {
    // 1. Guardar en almacenamiento de la app
    storage.addNotification({
      title,
      body,
      tag,
      iconType
    });

    // 2. Disparar audio y vibración sutil
    playGentleAudioChime();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([70, 30, 70]);
      } catch {}
    }

    // 3. Enviar notificación push nativa si se otorgó permiso
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        if (swRegistration && swRegistration.showNotification) {
          swRegistration.showNotification(title, {
            body,
            icon,
            badge: '/favicon.svg',
            tag,
            vibrate: [100, 50, 100],
            data: { url: window.location.href }
          });
        } else {
          new Notification(title, {
            body,
            icon,
            tag
          });
        }
      } catch (e) {
        console.warn('Fallo al disparar Notification nativa:', e);
      }
    }

    // 4. Mostrar siempre Toast visual elegante en la interfaz de Dal
    showInAppToast({ title, message: body, iconType });

    // Disparar evento para actualizar contador en navbar
    window.dispatchEvent(new CustomEvent('dal:notification-received'));
  },

  // Notificación de confirmación de pedido
  sendOrderConfirmation(orderNumber, total) {
    this.sendPushNotification({
      title: 'Orden Confirmada',
      body: `Tu pedido #${orderNumber} por $${total.toFixed(2)} USD fue recibido y está en preparación en nuestro atelier.`,
      tag: 'order-update',
      iconType: 'package-check'
    });
  },

  // Notificación por interacción con sensor de sacudida
  sendSensorRewardNotification(code = 'DAL-FRESH15', discount = 15) {
    this.sendPushNotification({
      title: 'Premio por Sensor de Movimiento',
      body: `¡Sacudida detectada! Has desbloqueado el cupón ${code} con un ${discount}% de descuento en toda la tienda.`,
      tag: 'sensor-reward',
      iconType: 'sparkles'
    });
  },

  // Notificación de proximidad a Boutique Dal por GPS
  sendBoutiqueProximityNotification(boutiqueName, distanceKm) {
    this.sendPushNotification({
      title: 'Boutique Dal Cercana',
      body: `Te encuentras a solo ${distanceKm.toFixed(1)} km de ${boutiqueName}. Disfruta de recogida express en 15 minutos.`,
      tag: 'boutique-radar',
      iconType: 'map-pin'
    });
  },

  // Notificación de nuevo Drop / Lanzamiento
  sendDropAlertNotification(productName = 'Gabardina Fluida Piedra') {
    this.sendPushNotification({
      title: 'Nuevo Drop en Dal',
      body: `La pieza ${productName} acaba de sumarse a la colección limitada de temporada.`,
      tag: 'new-drop',
      iconType: 'sparkles'
    });
  }
};

// Studio Interactivo de Sensores para Dal
// 1. Giroscopio 3D | 2. Acelerómetro/Shake | 3. Geolocalización | 4. Cámara Óptica | 5. Luz Ambiental
import { sensors, DAL_BOUTIQUES } from '../services/sensorsManager.js';
import { storage } from '../services/storage.js';

export function renderSensorsStudio(sensorsState) {
  const gyro = sensorsState?.gyro || { beta: 0, gamma: 0, alpha: 0, active: false };
  const loc = sensorsState?.location || { active: false, distanceKm: null };
  const discounts = storage.getDiscounts();
  const hasPerk = discounts.some(d => d.code === 'DAL-FRESH15');

  return `
    <div class="dal-sensors-container">
      <div class="dal-section-header">
        <div>
          <div class="dal-section-subtitle">
            <i data-lucide="cpu"></i>
            <span>Hardware & Sensores Móviles</span>
          </div>
          <h2 class="dal-section-title">Studio de Sensores Dal</h2>
        </div>
        <p style="max-width: 460px; font-size: 14px; color: var(--text-secondary);">
          Dal aprovecha los sensores nativos de tu teléfono o laptop para enriquecer la experiencia de compra: perspectiva física de telas, recompensas por movimiento y entrega geolocalizada.
        </p>
      </div>

      <div class="dal-sensors-grid">
        <!-- SENSOR 1: GIROSCOPIO / ORIENTACIÓN 3D -->
        <div class="dal-sensor-card">
          <div class="dal-sensor-top">
            <div class="dal-sensor-icon-box">
              <i data-lucide="compass"></i>
            </div>
            <span class="dal-sensor-status-dot">
              <i data-lucide="activity"></i>
              ${gyro.active ? 'Activo (Sensor)' : 'Interactivo (Ratón/Giro)'}
            </span>
          </div>

          <h3>Giroscopio & Parallax 3D</h3>
          <p>
            Inclina tu teléfono para inspeccionar la caída de los linos y el brillo de los hilos orgánicos en tiempo real.
          </p>

          <div class="dal-sensor-metrics">
            <div>Beta: <strong>${gyro.beta}°</strong></div>
            <div>Gamma: <strong>${gyro.gamma}°</strong></div>
            <div>Alpha: <strong>${gyro.alpha}°</strong></div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button class="dal-btn-secondary" style="flex: 1;" id="sensor-btn-gyro-perm">
              <i data-lucide="smartphone"></i>
              <span>Calibrar Giroscopio</span>
            </button>
          </div>
        </div>

        <!-- SENSOR 2: ACELERÓMETRO / SACUDIDA (SHAKE TO STYLE) -->
        <div class="dal-sensor-card">
          <div class="dal-sensor-top">
            <div class="dal-sensor-icon-box" style="background: var(--accent-terracotta-light); color: var(--accent-terracotta);">
              <i data-lucide="zap"></i>
            </div>
            <span class="dal-sensor-status-dot" style="color: var(--accent-terracotta);">
              <i data-lucide="check-circle-2"></i>
              ${hasPerk ? 'Cupón Activo' : 'Listo para Sacudir'}
            </span>
          </div>

          <h3>Acelerómetro (Shake to Style)</h3>
          <p>
            ¡Sacude tu teléfono enérgicamente! Se activará vibración háptica, confeti y desbloquearás un 15% de descuento exclusivo.
          </p>

          <div class="dal-sensor-metrics" style="background: ${hasPerk ? 'var(--accent-terracotta-light)' : 'var(--bg-surface)'};">
            <div>Recompensa: <strong>${hasPerk ? 'DAL-FRESH15 (15% Off)' : 'Bloqueada'}</strong></div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button class="dal-btn-primary" style="flex: 1; background: var(--accent-terracotta);" id="sensor-btn-shake-test">
              <i data-lucide="sparkles"></i>
              <span>Simular Sacudida</span>
            </button>
          </div>
        </div>

        <!-- SENSOR 3: GEOLOCALIZACIÓN & RADAR DE BOUTIQUES -->
        <div class="dal-sensor-card">
          <div class="dal-sensor-top">
            <div class="dal-sensor-icon-box">
              <i data-lucide="map-pin"></i>
            </div>
            <span class="dal-sensor-status-dot">
              <i data-lucide="navigation"></i>
              ${loc.active ? 'GPS Fijado' : 'Pendiente'}
            </span>
          </div>

          <h3>Radar GPS de Boutiques</h3>
          <p>
            Calcula la distancia precisa hacia la boutique Dal más cercana y estima el tiempo de mensajería ciclista express.
          </p>

          <div class="dal-sensor-metrics">
            <div>Cercana: <strong>${loc.nearestBoutique ? loc.nearestBoutique.city : 'CDMX / Madrid'}</strong></div>
            <div>Distancia: <strong>${loc.distanceKm ? loc.distanceKm.toFixed(1) + ' km' : '--'}</strong></div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button class="dal-btn-secondary" style="flex: 1;" id="sensor-btn-locate">
              <i data-lucide="crosshair"></i>
              <span>Localizar por GPS</span>
            </button>
          </div>
        </div>

        <!-- SENSOR 4: CÁMARA (COLOR MATCHER & ESPEJO VIRTUAL) -->
        <div class="dal-sensor-card">
          <div class="dal-sensor-top">
            <div class="dal-sensor-icon-box">
              <i data-lucide="camera"></i>
            </div>
            <span class="dal-sensor-status-dot" id="camera-status-badge">
              <i data-lucide="eye"></i>
              Óptico
            </span>
          </div>

          <h3>Color Matcher & Espejo Óptico</h3>
          <p>
            Abre tu cámara frontal para escanear los colores de tu entorno o prenda actual y obtener sugerencias de corte Dal.
          </p>

          <!-- Previsualizador de cámara -->
          <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; background: #000; height: 140px; margin-bottom: 14px; display: flex; align-items: center; justify-content: center;">
            <video id="dal-camera-preview" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; display: none;"></video>
            <div id="dal-camera-placeholder" style="color: #A8A49C; font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <i data-lucide="video" style="width: 24px; height: 24px;"></i>
              <span>Cámara inactiva</span>
            </div>
          </div>

          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button class="dal-btn-secondary" style="flex: 1;" id="sensor-btn-camera-toggle">
              <i data-lucide="camera"></i>
              <span id="camera-btn-text">Iniciar Cámara</span>
            </button>
            <button class="dal-btn-primary" id="sensor-btn-sample-color" style="display: none;">
              <i data-lucide="pipette"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

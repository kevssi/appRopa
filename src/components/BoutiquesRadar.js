// Radar de Boutiques Dal y Sensor de Geolocalización
import { DAL_BOUTIQUES } from '../services/sensorsManager.js';

export function renderBoutiquesRadar(locationState) {
  const nearestId = locationState?.nearestBoutique?.id;

  return `
    <div class="dal-catalog-section">
      <div class="dal-section-header">
        <div>
          <div class="dal-section-subtitle">
            <i data-lucide="map-pin"></i>
            <span>Espacios Físicos & Atelier</span>
          </div>
          <h2 class="dal-section-title">Radar de Boutiques Dal</h2>
        </div>
        <p style="max-width: 480px; font-size: 14px; color: var(--text-secondary);">
          Encuentra tu boutique Dal más próxima. Nuestro sensor GPS calcula la distancia en tiempo real y estima el despacho express para recogida inmediata.
        </p>
      </div>

      <!-- Tarjeta de Estado del Sensor GPS -->
      <div class="dal-radar-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-size: 13px; font-weight: 600; margin-bottom: 2px;">
              Estado de Localización por Satélite
            </div>
            <div style="font-size: 12px; color: var(--text-secondary);">
              ${locationState?.active 
                ? `GPS Fijado: Lat ${locationState.lat.toFixed(4)}, Lng ${locationState.lng.toFixed(4)}` 
                : 'Sensor en espera de lectura o permisos'}
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="dal-btn-primary" id="radar-request-gps-btn">
              <i data-lucide="crosshair"></i>
              <span>Calcular Distancia a Boutiques</span>
            </button>
          </div>
        </div>

        ${locationState?.nearestBoutique ? `
          <div style="margin-top: 16px; padding: 12px 16px; background: var(--accent-sage-light); border-radius: var(--radius-sm); border: 1px solid rgba(83, 107, 88, 0.2); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i data-lucide="navigation" style="color: var(--accent-sage);"></i>
              <div>
                <strong style="color: var(--accent-sage); font-size: 13px;">Boutique más cercana:</strong>
                <span style="font-size: 13px; font-weight: 600; margin-left: 4px;">${locationState.nearestBoutique.name}</span>
                <span style="font-size: 12px; color: var(--text-secondary);">(${locationState.distanceKm.toFixed(1)} km)</span>
              </div>
            </div>
            <div style="font-size: 12px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              <i data-lucide="clock"></i>
              <span>Tiempo estimado de mensajería ciclista: ~${locationState.deliveryEtaMinutes} min</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Lista de Boutiques Dal -->
      <div class="dal-boutique-list">
        ${DAL_BOUTIQUES.map(b => {
          const isNearest = nearestId === b.id;
          return `
            <div class="dal-boutique-item ${isNearest ? 'nearest' : ''}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.1em; color: var(--accent-sage);">
                  ${b.city}
                </span>
                ${isNearest ? `
                  <span class="dal-badge dal-badge-drop" style="font-size: 10px;">
                    Más Cercana
                  </span>
                ` : ''}
              </div>

              <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 6px;">${b.name}</h4>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
                ${b.address}
              </p>

              <div style="font-size: 12px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="clock" style="width: 14px; height: 14px;"></i>
                  <span>${b.schedule}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="phone" style="width: 14px; height: 14px;"></i>
                  <span>${b.phone}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="zap" style="width: 14px; height: 14px; color: var(--accent-terracotta);"></i>
                  <span>Recogida express en tienda: ${b.expressPickupMinutes} min</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

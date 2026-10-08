// Centro de Notificaciones Push de Dal con Historial y Pruebas en Vivo
import { storage } from '../services/storage.js';
import { pushService } from '../services/pushNotifications.js';

export function renderPushNotificationCenter() {
  const permission = pushService.getPermission();
  const notifications = storage.getNotifications();
  const isGranted = permission === 'granted';

  return `
    <div class="dal-cart-backdrop" id="dal-notif-backdrop"></div>
    <aside class="dal-notif-drawer" id="dal-notif-drawer">
      <!-- Encabezado -->
      <div class="dal-cart-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i data-lucide="bell"></i>
          <h2 class="dal-cart-title">Notificaciones Push</h2>
        </div>
        <button class="dal-toast-close" id="notif-close-btn" aria-label="Cerrar notificaciones">
          <i data-lucide="x"></i>
        </button>
      </div>

      <!-- Estado del permiso y acciones -->
      <div style="padding: 16px 20px; background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <div style="font-size: 13px; font-weight: 600;">Alertas en Dispositivo</div>
            <div style="font-size: 11px; color: var(--text-secondary);">
              Estado: <strong style="color: ${isGranted ? 'var(--accent-sage)' : 'var(--accent-terracotta)'};">
                ${isGranted ? 'Habilitadas' : (permission === 'denied' ? 'Bloqueadas en navegador' : 'Pendientes de permiso')}
              </strong>
            </div>
          </div>

          ${!isGranted ? `
            <button class="dal-btn-pill" id="notif-request-perm-btn" style="background: var(--text-primary); color: white;">
              <i data-lucide="bell-ring"></i>
              <span>Activar Push</span>
            </button>
          ` : `
            <span class="dal-device-badge active">
              <i data-lucide="check"></i>
              <span>Conectado</span>
            </span>
          `}
        </div>

        <!-- Botones para probar disparadores de Push -->
        <div style="display: flex; gap: 8px;">
          <button class="dal-btn-pill" id="notif-send-test-btn" style="flex: 1; justify-content: center;">
            <i data-lucide="send"></i>
            <span>Enviar Alerta de Prueba</span>
          </button>
          <button class="dal-btn-pill" id="notif-send-drop-btn" style="flex: 1; justify-content: center;">
            <i data-lucide="sparkles"></i>
            <span>Alerta Nuevo Drop</span>
          </button>
        </div>
      </div>

      <!-- Historial de Notificaciones Recibidas -->
      <div class="dal-cart-items-list" style="padding: 16px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
            Historial de Notificaciones (${notifications.length})
          </span>
          ${notifications.length > 0 ? `
            <button class="dal-btn-pill" id="notif-clear-history-btn" style="padding: 2px 8px; font-size: 11px;">
              <i data-lucide="check-check"></i>
              <span>Marcar leídas</span>
            </button>
          ` : ''}
        </div>

        ${notifications.length === 0 ? `
          <div style="text-align: center; padding: 50px 10px; color: var(--text-muted);">
            <i data-lucide="bell-off" style="width: 40px; height: 40px; margin-bottom: 10px; stroke-width: 1.2;"></i>
            <p style="font-size: 14px; font-weight: 500; color: var(--text-secondary);">Sin notificaciones por ahora</p>
            <p style="font-size: 12px;">Realiza una compra, sacude tu teléfono o pulsa 'Enviar Alerta de Prueba'.</p>
          </div>
        ` : notifications.map(n => `
          <div class="dal-notif-card ${!n.read ? 'unread' : ''}">
            <div class="dal-sensor-icon-box" style="width: 34px; height: 34px; border-radius: 50%;">
              <i data-lucide="${n.iconType || 'bell'}"></i>
            </div>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 2px;">
                <span>${n.tag || 'Dal Push'}</span>
                <span>${n.timestamp}</span>
              </div>
              <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 2px;">${n.title}</h4>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">${n.body}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </aside>
  `;
}

// Modal de Autenticación de Dal (Iniciar Sesión / Crear Cuenta)
// Sin emojis, uso exclusivo de Lucide Icons y diseño refinado punto medio

import { storage } from '../services/storage.js';
import { pushService } from '../services/pushNotifications.js';
import confetti from 'canvas-confetti';

export function renderAuthModal(initialTab = 'register') {
  const currentUser = storage.getUser();

  // Si ya tiene sesión iniciada, mostrar tarjeta de perfil
  if (currentUser) {
    const orders = storage.getOrders();
    return `
      <div class="dal-modal-backdrop open" id="dal-auth-modal-backdrop">
        <div class="dal-modal-window" style="max-width: 500px; grid-template-columns: 1fr;">
          <button class="dal-modal-close" id="auth-close-btn" aria-label="Cerrar modal">
            <i data-lucide="x"></i>
          </button>

          <div style="padding: 36px 30px;">
            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
              <div class="dal-sensor-icon-box" style="width: 52px; height: 52px; border-radius: 50%;">
                <i data-lucide="user-check" style="width: 26px; height: 26px;"></i>
              </div>
              <div>
                <span class="dal-modal-tag" style="margin: 0;">Miembro Dal Atelier</span>
                <h2 style="font-size: 22px; font-weight: 600;">${currentUser.name}</h2>
                <div style="font-size: 13px; color: var(--text-secondary);">${currentUser.email}</div>
              </div>
            </div>

            <div style="background: var(--bg-surface); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 20px; font-size: 13px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Estilo Predilecto:</span>
                <strong>${currentUser.style || 'Lino & Orgánico'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Pedidos Realizados:</span>
                <strong>${orders.length} pedidos registrados</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Sincronización MySQL:</span>
                <strong style="color: var(--accent-sage);">Tabla users vinculada</strong>
              </div>
            </div>

            <button class="dal-btn-secondary" style="width: 100%; justify-content: center;" id="auth-logout-btn">
              <i data-lucide="log-out"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Modal para Iniciar Sesión o Crear Cuenta
  return `
    <div class="dal-modal-backdrop open" id="dal-auth-modal-backdrop">
      <div class="dal-modal-window" style="max-width: 580px; grid-template-columns: 1fr;">
        <button class="dal-modal-close" id="auth-close-btn" aria-label="Cerrar modal">
          <i data-lucide="x"></i>
        </button>

        <div style="padding: 36px 32px;">
          <!-- Beneficio de Comunidad -->
          <div style="background: var(--accent-sage-light); border: 1px solid rgba(83, 107, 88, 0.2); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
            <i data-lucide="sparkles" style="color: var(--accent-sage); width: 22px; height: 22px;"></i>
            <div style="font-size: 12px; color: var(--text-primary); line-height: 1.4;">
              <strong>Comunidad Dal Atelier:</strong> Recibe 10% de bienvenida, notificaciones push anticipadas para nuevos lanzamientos y registro en base de datos.
            </div>
          </div>

          <!-- Selector de Pestañas (Iniciar Sesión vs Crear Cuenta) -->
          <div style="display: flex; border-bottom: 1px solid var(--border-subtle); margin-bottom: 24px;">
            <button 
              type="button" 
              class="dal-nav-link ${initialTab === 'register' ? 'active' : ''}" 
              id="auth-tab-register" 
              style="padding: 10px 16px; font-size: 15px; font-weight: 600; background: none; border: none;"
            >
              Crear Cuenta
            </button>
            <button 
              type="button" 
              class="dal-nav-link ${initialTab === 'login' ? 'active' : ''}" 
              id="auth-tab-login" 
              style="padding: 10px 16px; font-size: 15px; font-weight: 600; background: none; border: none;"
            >
              Iniciar Sesión
            </button>
          </div>

          <!-- Formulario: CREAR CUENTA -->
          ${initialTab === 'register' ? `
            <form id="dal-register-form">
              <div style="margin-bottom: 16px;">
                <label class="dal-selector-label">Nombre y Apellidos</label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    id="reg-name" 
                    class="dal-promo-input" 
                    style="width: 100%; border-radius: var(--radius-sm); padding-left: 36px;" 
                    placeholder="ej. Sofía Valenzuela" 
                    required 
                  />
                  <i data-lucide="user" style="position: absolute; left: 12px; top: 11px; width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
              </div>

              <div style="margin-bottom: 16px;">
                <label class="dal-selector-label">Correo Electrónico</label>
                <div style="position: relative;">
                  <input 
                    type="email" 
                    id="reg-email" 
                    class="dal-promo-input" 
                    style="width: 100%; border-radius: var(--radius-sm); padding-left: 36px;" 
                    placeholder="sofia@dal.atelier" 
                    required 
                  />
                  <i data-lucide="mail" style="position: absolute; left: 12px; top: 11px; width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
              </div>

              <div style="margin-bottom: 16px;">
                <label class="dal-selector-label">Contraseña</label>
                <div style="position: relative;">
                  <input 
                    type="password" 
                    id="reg-password" 
                    class="dal-promo-input" 
                    style="width: 100%; border-radius: var(--radius-sm); padding-left: 36px;" 
                    placeholder="••••••••" 
                    required 
                  />
                  <i data-lucide="lock" style="position: absolute; left: 12px; top: 11px; width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
              </div>

              <div style="margin-bottom: 24px;">
                <label class="dal-selector-label">Tipo de Cuenta</label>
                <select id="reg-role" class="dal-promo-input" style="width: 100%; border-radius: var(--radius-sm);">
                  <option value="customer">Cliente Dal</option>
                  <option value="admin">Administrador de Atelier (Acceso a Dashboards)</option>
                </select>
              </div>

              <button type="submit" class="dal-btn-primary" style="width: 100%; justify-content: center; padding: 13px;">
                <i data-lucide="user-plus"></i>
                <span>Crear Cuenta en Dal Atelier</span>
              </button>
            </form>
          ` : `
            <!-- Formulario: INICIAR SESIÓN -->
            <form id="dal-login-form">
              <div style="margin-bottom: 16px;">
                <label class="dal-selector-label">Correo Electrónico</label>
                <div style="position: relative;">
                  <input 
                    type="email" 
                    id="login-email" 
                    class="dal-promo-input" 
                    style="width: 100%; border-radius: var(--radius-sm); padding-left: 36px;" 
                    placeholder="cliente@dal.com o admin@dal.com" 
                    required 
                  />
                  <i data-lucide="mail" style="position: absolute; left: 12px; top: 11px; width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <label class="dal-selector-label">Contraseña</label>
                <div style="position: relative;">
                  <input 
                    type="password" 
                    id="login-password" 
                    class="dal-promo-input" 
                    style="width: 100%; border-radius: var(--radius-sm); padding-left: 36px;" 
                    placeholder="••••••••" 
                    required 
                  />
                  <i data-lucide="lock" style="position: absolute; left: 12px; top: 11px; width: 16px; height: 16px; color: var(--text-muted);"></i>
                </div>
              </div>

              <button type="submit" class="dal-btn-primary" style="width: 100%; justify-content: center; padding: 13px; margin-bottom: 14px;">
                <i data-lucide="log-in"></i>
                <span>Entrar a mi Cuenta</span>
              </button>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 14px; display: flex; gap: 8px;">
                <button type="button" class="dal-btn-secondary" id="demo-client-login-btn" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px;">
                  <i data-lucide="user"></i>
                  <span>Demo Cliente</span>
                </button>
                <button type="button" class="dal-btn-secondary" id="demo-admin-login-btn" style="flex: 1; justify-content: center; font-size: 11px; padding: 8px; border-color: var(--accent-terra); color: var(--accent-terra);">
                  <i data-lucide="shield-check"></i>
                  <span>Demo Admin</span>
                </button>
              </div>
            </form>
          `}
        </div>
      </div>
    </div>
  `;
}

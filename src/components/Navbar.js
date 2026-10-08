// Componente de Navegación Dal con Iconos Lucide y Cero Emojis
import { storage } from '../services/storage.js';

export function renderNavbar(state) {
  const cart = storage.getCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const notifs = storage.getNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;
  const isEvening = document.body.classList.contains('dal-evening-lounge');
  const user = storage.getUser();

  return `
    <header class="dal-header">
      <div class="dal-header-inner">
        <!-- Marca y Logotipo Dal -->
        <div class="dal-brand-link" id="nav-brand-btn">
          <span class="dal-logo-text">Dal</span>
          <span class="dal-logo-sub">Atelier</span>
        </div>

        <!-- Enlaces Principales -->
        <nav class="dal-nav-links">
          <button class="dal-nav-link ${state.currentTab === 'catalog' ? 'active' : ''}" id="nav-link-catalog">
            Colección
          </button>
          <button class="dal-nav-link ${state.currentTab === 'boutiques' ? 'active' : ''}" id="nav-link-boutiques">
            Boutiques Físicas
          </button>
          ${user && user.role === 'admin' ? `
            <button class="dal-nav-link ${state.currentTab === 'database' ? 'active' : ''}" id="nav-link-database" style="color: var(--accent-terra);">
              <i data-lucide="shield-check" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
              Panel Admin MySQL
            </button>
            <button class="dal-nav-link ${state.currentTab === 'sensors' ? 'active' : ''}" id="nav-link-sensors">
              Telemetría Sensores
            </button>
          ` : ''}
        </nav>

        <!-- Botones de Acción -->
        <div class="dal-header-actions">
          <!-- Conmutador de Modo Día / Noche -->
          <button class="dal-action-btn" id="theme-toggle-btn" title="Alternar Modo Ambiental (Día / Tarde)">
            <i data-lucide="${isEvening ? 'sun' : 'moon'}"></i>
          </button>

          <!-- Centro de Notificaciones Push -->
          <button class="dal-action-btn" id="notif-toggle-btn" title="Notificaciones Push de Dal">
            <i data-lucide="bell"></i>
            ${unreadCount > 0 ? `<span class="dal-badge-count">${unreadCount}</span>` : ''}
          </button>

          <!-- Bolsa de Compras -->
          <button class="dal-action-btn" id="cart-toggle-btn" title="Bolsa de Compras">
            <i data-lucide="shopping-bag"></i>
            ${cartCount > 0 ? `<span class="dal-badge-count">${cartCount}</span>` : ''}
          </button>

          <!-- Botón de Cuenta / Iniciar Sesión / Registro -->
          ${user ? `
            <button class="dal-btn-pill" id="nav-auth-btn" title="Perfil de Miembro">
              <i data-lucide="user-check" style="color: var(--accent-sage);"></i>
              <span>${user.name.split(' ')[0]}</span>
            </button>
          ` : `
            <button class="dal-btn-pill" id="nav-auth-btn" title="Crear Cuenta o Iniciar Sesión">
              <i data-lucide="user"></i>
              <span>Cuenta</span>
            </button>
          `}
        </div>
      </div>
    </header>
  `;
}

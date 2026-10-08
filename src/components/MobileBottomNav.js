// Barra inferior de navegación nativa para dispositivos móviles (Dock)
import { storage } from '../services/storage.js';

export function renderMobileBottomNav(currentTab) {
  const cart = storage.getCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const user = storage.getUser();

  return `
    <nav class="dal-mobile-dock" id="dal-mobile-dock">
      <button class="dal-dock-item ${currentTab === 'catalog' ? 'active' : ''}" data-tab="catalog">
        <i data-lucide="home"></i>
        <span>Inicio</span>
      </button>

      <button class="dal-dock-item ${currentTab === 'boutiques' ? 'active' : ''}" data-tab="boutiques">
        <i data-lucide="map-pin"></i>
        <span>Tiendas</span>
      </button>

      <button class="dal-dock-item" id="mobile-dock-cart-btn">
        <i data-lucide="shopping-bag"></i>
        <span>Bolsa</span>
        ${cartCount > 0 ? `<span class="dal-dock-badge">${cartCount}</span>` : ''}
      </button>

      ${user && user.role === 'admin' ? `
        <button class="dal-dock-item ${currentTab === 'database' ? 'active' : ''}" data-tab="database">
          <i data-lucide="shield-check"></i>
          <span>Admin</span>
        </button>
      ` : ''}

      <button class="dal-dock-item" id="mobile-dock-auth-btn">
        <i data-lucide="user"></i>
        <span>${user ? user.name.split(' ')[0] : 'Cuenta'}</span>
      </button>
    </nav>
  `;
}

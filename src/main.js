// Dal Atelier - Aplicación Web & Móvil Principal
// Sistema E-Commerce con Sensores, Notificaciones Push y Base de Datos MySQL
// Iconos: Lucide (Cero emojis en toda la aplicación)

import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';

import './style.css';
import { storage } from './services/storage.js';
import { clothingApi } from './services/clothingApi.js';
import { pushService, initServiceWorker, showInAppToast } from './services/pushNotifications.js';
import { sensors } from './services/sensorsManager.js';

import { renderNavbar } from './components/Navbar.js';
import { renderHeroSection } from './components/HeroSection.js';
import { renderProductCard } from './components/ProductCard.js';
import { renderProductModal } from './components/ProductModal.js';
import { renderSensorsStudio } from './components/SensorsStudio.js';
import { renderCartDrawer } from './components/CartDrawer.js';
import { renderCheckoutModal } from './components/CheckoutModal.js';
import { renderPushNotificationCenter } from './components/PushNotificationCenter.js';
import { renderBoutiquesRadar } from './components/BoutiquesRadar.js';
import { renderDatabaseViewer } from './components/DatabaseViewerModal.js';
import { renderMobileBottomNav } from './components/MobileBottomNav.js';
import { renderExtendedSections } from './components/ExtendedSections.js';
import { renderAuthModal } from './components/AuthModal.js';

// Estado global de la aplicación Dal
const state = {
  currentTab: 'catalog', // 'catalog', 'sensors', 'boutiques', 'database'
  viewMode: storage.getViewMode(), // 'responsive' o 'mobile-frame'
  catalogFilters: {
    category: 'todos',
    source: 'todos',
    search: '',
    sortBy: 'newest'
  },
  activeModalProduct: null,
  selectedSize: 'M',
  selectedColorIndex: 0,
  isCartOpen: false,
  isNotifOpen: false,
  isCheckoutOpen: false,
  appliedPromo: null,
  sensorsState: {
    gyro: { beta: 0, gamma: 0, alpha: 0, active: false },
    location: { active: false, distanceKm: null }
  }
};

// Función auxiliar para actualizar e inicializar iconos de Lucide
function refreshLucideIcons() {
  try {
    createIcons({ icons });
  } catch (err) {
    console.warn('Error al actualizar iconos Lucide:', err);
  }
}

// Inicializar el markup base de la aplicación
function renderAppStructure() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const isMobileFrame = state.viewMode === 'mobile-frame';

  appEl.innerHTML = `
    <!-- Barra superior de utilidades y control de vista de pantalla (Escritorio) -->
    <div class="dal-device-bar">
      <div class="dal-device-bar-left">
        <span class="dal-device-badge active">
          <i data-lucide="shield-check"></i>
          <span>Dal Atelier E-Commerce</span>
        </span>
        <span class="dal-device-badge">
          <i data-lucide="database"></i>
          <span>dal_database.sql Listo</span>
        </span>
        <span class="dal-device-badge" id="api-status-badge">
          <i data-lucide="refresh-cw"></i>
          <span>API Ropa Conectada</span>
        </span>
      </div>

      <div class="dal-view-controls">
        <span style="font-size: 12px; color: var(--text-muted); margin-right: 4px;">Vista:</span>
        <button class="dal-btn-pill ${state.viewMode === 'responsive' ? 'active' : ''}" id="toggle-view-responsive">
          <i data-lucide="monitor"></i>
          <span>Escritorio Completo</span>
        </button>
        <button class="dal-btn-pill ${isMobileFrame ? 'active' : ''}" id="toggle-view-mobile">
          <i data-lucide="smartphone"></i>
          <span>Simulador Móvil</span>
        </button>
      </div>
    </div>

    <!-- Envoltura de aplicación (Adaptable o Marco Móvil) -->
    <div class="dal-app-wrapper ${isMobileFrame ? 'mobile-frame-mode' : ''}" id="dal-app-wrapper">
      ${isMobileFrame ? `
        <div class="dal-mobile-shell">
          <div class="dal-mobile-notch">
            <div class="dal-notch-camera"></div>
          </div>
          <div class="dal-mobile-screen" id="dal-scroll-container">
            <div id="dal-navbar-mount"></div>
            <main id="dal-main-mount"></main>
          </div>
          <div id="dal-mobile-dock-mount"></div>
        </div>
      ` : `
        <div style="width: 100%; min-height: 100vh; display: flex; flex-direction: column;">
          <div id="dal-navbar-mount"></div>
          <main id="dal-main-mount" style="flex-grow: 1;"></main>
          <div id="dal-mobile-dock-mount"></div>
        </div>
      `}
    </div>

    <!-- Monturas de Modales y Cajones -->
    <div id="dal-modal-mount"></div>
    <div id="dal-cart-mount"></div>
    <div id="dal-notif-mount"></div>
  `;

  // Montar componentes hijos
  mountNavbar();
  mountMainContent();
  mountDrawers();
  mountMobileDock();
  bindGlobalEvents();
  refreshLucideIcons();
}

// Montar la barra de navegación
function mountNavbar() {
  const mount = document.getElementById('dal-navbar-mount');
  if (!mount) return;
  mount.innerHTML = renderNavbar(state);
  bindNavbarEvents();
}

// Montar la barra inferior de navegación móvil
function mountMobileDock() {
  const mount = document.getElementById('dal-mobile-dock-mount');
  if (!mount) return;
  mount.innerHTML = renderMobileBottomNav(state.currentTab);
  
  mount.querySelectorAll('.dal-dock-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentTab = btn.getAttribute('data-tab');
      mountNavbar();
      mountMainContent();
      mountMobileDock();
      refreshLucideIcons();
    });
  });

  const cartDockBtn = document.getElementById('mobile-dock-cart-btn');
  if (cartDockBtn) {
    cartDockBtn.addEventListener('click', () => {
      state.isCartOpen = true;
      mountDrawers();
    });
  }

  const authDockBtn = document.getElementById('mobile-dock-auth-btn');
  if (authDockBtn) {
    authDockBtn.addEventListener('click', () => {
      const user = storage.getUser();
      openAuthModal(user ? 'profile' : 'login');
    });
  }
}

// Montar el contenido de la pestaña activa
function mountMainContent() {
  const main = document.getElementById('dal-main-mount');
  if (!main) return;

  if (state.currentTab === 'catalog') {
    const products = clothingApi.getAllProducts(state.catalogFilters);
    const syncInfo = clothingApi.getSyncInfo();

    main.innerHTML = `
      ${renderHeroSection(state.sensorsState)}

      <section class="dal-catalog-section">
        <!-- Barra de Búsqueda, Filtros y Sincronización API -->
        <div class="dal-filter-toolbar">
          <div class="dal-search-box">
            <i data-lucide="search" style="color: var(--text-muted); width: 16px; height: 16px;"></i>
            <input 
              type="text" 
              id="catalog-search-input" 
              placeholder="Buscar por lino, sarga, abrigos..." 
              value="${state.catalogFilters.search}"
            />
          </div>

          <div class="dal-category-chips">
            <button class="dal-chip ${state.catalogFilters.category === 'todos' ? 'active' : ''}" data-cat="todos">
              Todos (${products.length})
            </button>
            <button class="dal-chip ${state.catalogFilters.category === 'lino' ? 'active' : ''}" data-cat="lino">
              Lino & Algodón
            </button>
            <button class="dal-chip ${state.catalogFilters.category === 'sastreria' ? 'active' : ''}" data-cat="sastreria">
              Sastrería
            </button>
            <button class="dal-chip ${state.catalogFilters.category === 'punto' ? 'active' : ''}" data-cat="punto">
              Punto Suave
            </button>
            <button class="dal-chip ${state.catalogFilters.category === 'abrigos' ? 'active' : ''}" data-cat="abrigos">
              Capas & Outerwear
            </button>
            <button class="dal-chip ${state.catalogFilters.category === 'api-externa' ? 'active' : ''}" data-cat="api-externa">
              API Externa
            </button>
          </div>

          <!-- Botón de Sincronización con API de Ropa -->
          <div class="dal-source-toggle">
            <button class="dal-api-sync-btn" id="api-sync-trigger-btn" title="Llamar a Platzi Fake Store API">
              <i data-lucide="refresh-cw"></i>
              <span>Sincronizar API Ropa</span>
            </button>
          </div>
        </div>

        <!-- Rejilla de Productos con Parallax 3D de Giroscopio -->
        <div class="dal-products-grid">
          ${products.length > 0 
            ? products.map(renderProductCard).join('') 
            : `
              <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i data-lucide="package-search" style="width: 44px; height: 44px; margin-bottom: 12px; stroke-width: 1.2;"></i>
                <h4 style="font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">Sin coincidencias</h4>
                <p style="font-size: 13px;">No encontramos prendas con ese criterio. Prueba ajustando la búsqueda o sincroniza la API externa.</p>
              </div>
            `}
        </div>
      </section>

      <!-- Secciones extendidas: Lookbook, Manifiesto, Invitación de Cuenta/Login, Reseñas y Footer -->
      ${renderExtendedSections()}
    `;

    bindCatalogEvents();
    bindExtendedSectionsEvents();
  } else if (state.currentTab === 'sensors') {
    const user = storage.getUser();
    if (user && user.role === 'admin') {
      main.innerHTML = renderSensorsStudio(state.sensorsState);
      bindSensorsStudioEvents();
    } else {
      state.currentTab = 'catalog';
      mountMainContent();
      return;
    }
  } else if (state.currentTab === 'boutiques') {
    main.innerHTML = renderBoutiquesRadar(state.sensorsState.location);
    bindBoutiquesEvents();
  } else if (state.currentTab === 'database') {
    const user = storage.getUser();
    if (user && user.role === 'admin') {
      main.innerHTML = renderDatabaseViewer();
    } else {
      state.currentTab = 'catalog';
      mountMainContent();
      return;
    }
  }

  refreshLucideIcons();
}

// Montar Cajones de Carrito y Notificaciones
function mountDrawers() {
  const cartMount = document.getElementById('dal-cart-mount');
  const notifMount = document.getElementById('dal-notif-mount');

  if (cartMount) {
    cartMount.innerHTML = renderCartDrawer(state.appliedPromo);
    const drawer = document.getElementById('dal-cart-drawer');
    const backdrop = document.getElementById('dal-cart-backdrop');
    if (drawer && backdrop) {
      if (state.isCartOpen) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
      }
    }
    bindCartEvents();
  }

  if (notifMount) {
    notifMount.innerHTML = renderPushNotificationCenter();
    const drawer = document.getElementById('dal-notif-drawer');
    const backdrop = document.getElementById('dal-notif-backdrop');
    if (drawer && backdrop) {
      if (state.isNotifOpen) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
      }
    }
    bindNotifEvents();
  }

  refreshLucideIcons();
}

// Eventos de la barra de navegación superior
function bindNavbarEvents() {
  const brandBtn = document.getElementById('nav-brand-btn');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      state.currentTab = 'catalog';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  const catalogBtn = document.getElementById('nav-link-catalog');
  if (catalogBtn) {
    catalogBtn.addEventListener('click', () => {
      state.currentTab = 'catalog';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  const sensorsBtn = document.getElementById('nav-link-sensors');
  if (sensorsBtn) {
    sensorsBtn.addEventListener('click', () => {
      state.currentTab = 'sensors';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  const boutiquesBtn = document.getElementById('nav-link-boutiques');
  if (boutiquesBtn) {
    boutiquesBtn.addEventListener('click', () => {
      state.currentTab = 'boutiques';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  const databaseBtn = document.getElementById('nav-link-database');
  if (databaseBtn) {
    databaseBtn.addEventListener('click', () => {
      state.currentTab = 'database';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  // Toggle tema ambiental
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dal-evening-lounge');
      const isEvening = document.body.classList.contains('dal-evening-lounge');
      storage.saveTheme(isEvening ? 'evening' : 'fresh');
      mountNavbar();
      refreshLucideIcons();
    });
  }

  // Abrir centro de notificaciones push
  const notifBtn = document.getElementById('notif-toggle-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      state.isNotifOpen = true;
      mountDrawers();
    });
  }

  // Abrir bolsa de compras
  const cartBtn = document.getElementById('cart-toggle-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      state.isCartOpen = true;
      mountDrawers();
    });
  }

  // Abrir modal de cuenta / iniciar sesión / registro
  const authBtn = document.getElementById('nav-auth-btn');
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      const user = storage.getUser();
      openAuthModal(user ? 'profile' : 'login');
    });
  }
}

// Eventos de la sección del catálogo
function bindCatalogEvents() {
  // CTAs del Hero
  const heroCat = document.getElementById('hero-cta-catalog');
  if (heroCat) {
    heroCat.addEventListener('click', () => {
      const el = document.querySelector('.dal-catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const heroSensors = document.getElementById('hero-cta-sensors');
  if (heroSensors) {
    heroSensors.addEventListener('click', () => {
      state.currentTab = 'sensors';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
    });
  }

  // Búsqueda en catálogo
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalogFilters.search = e.target.value;
      mountMainContent();
    });
  }

  // Filtros de categorías
  document.querySelectorAll('.dal-chip[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.catalogFilters.category = chip.getAttribute('data-cat');
      mountMainContent();
    });
  });

  // Botón Sincronizar API de ropa
  const syncBtn = document.getElementById('api-sync-trigger-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      syncBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i><span>Sincronizando...</span>`;
      refreshLucideIcons();

      const result = await clothingApi.syncExternalClothing();

      if (result.success) {
        pushService.sendPushNotification({
          title: 'Prendas Sincronizadas',
          body: `Se integraron exitosamente ${result.count} piezas de la API de ropa a la colección Dal.`,
          iconType: 'sparkles'
        });
      } else {
        showInAppToast({
          title: 'Catálogo Dal Seguro',
          message: result.error || 'Operando con el catálogo de alta costura interno.',
          iconType: 'info'
        });
      }

      mountMainContent();
    });
  }

  // Abrir modal de detalle al hacer clic en tarjeta
  document.querySelectorAll('.dal-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignorar si se pulsó el botón de favoritos o añadir
      if (e.target.closest('.dal-wishlist-btn') || e.target.closest('.dal-card-add-btn')) return;
      const id = card.getAttribute('data-id');
      const prod = clothingApi.getProductById(id);
      if (prod) {
        state.activeModalProduct = prod;
        state.selectedSize = 'M';
        state.selectedColorIndex = 0;
        openProductModal();
      }
    });
  });

  // Alternar lista de deseos
  document.querySelectorAll('.dal-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-wishlist-id'));
      storage.toggleWishlist(id);
      mountMainContent();
    });
  });

  // Añadir directamente a la bolsa desde la tarjeta
  document.querySelectorAll('.dal-card-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-add-cart-id'));
      const prod = clothingApi.getProductById(id);
      if (prod) {
        addToCart(prod, 'M');
      }
    });
  });
}

// Abrir y gestionar el modal de prenda
function openProductModal() {
  const mount = document.getElementById('dal-modal-mount');
  if (!mount || !state.activeModalProduct) return;

  mount.innerHTML = renderProductModal(state.activeModalProduct, state.selectedSize, state.selectedColorIndex);
  refreshLucideIcons();

  const backdrop = document.getElementById('dal-product-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  const closeModal = () => {
    if (backdrop) backdrop.classList.remove('open');
    setTimeout(() => { mount.innerHTML = ''; }, 250);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Selectores de talla
  document.querySelectorAll('.dal-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedSize = btn.getAttribute('data-size');
      openProductModal();
    });
  });

  // Selectores de color
  document.querySelectorAll('.dal-color-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedColorIndex = Number(btn.getAttribute('data-color-index'));
      openProductModal();
    });
  });

  // Añadir a la bolsa desde el modal
  const addBtn = document.getElementById('modal-add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(state.activeModalProduct, state.selectedSize);
      closeModal();
    });
  }
}

// Añadir producto al carrito
function addToCart(product, size = 'M') {
  const cart = storage.getCart();
  const existingIndex = cart.findIndex(i => i.id === product.id && i.selectedSize === size);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      selectedSize: size,
      quantity: 1
    });
  }

  storage.saveCart(cart);
  mountNavbar();
  mountMobileDock();
  mountDrawers();

  showInAppToast({
    title: 'Añadido a la Bolsa',
    message: `${product.name} (Talla ${size}) se sumó a tu pedido.`,
    iconType: 'shopping-bag'
  });
}

// Eventos del Carrito / Bolsa
function bindCartEvents() {
  const closeBtn = document.getElementById('cart-close-btn');
  const backdrop = document.getElementById('dal-cart-backdrop');

  const closeCart = () => {
    state.isCartOpen = false;
    mountDrawers();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (backdrop) backdrop.addEventListener('click', closeCart);

  // Incrementar / decrementar
  document.querySelectorAll('[data-step-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.getAttribute('data-item-index'));
      const action = btn.getAttribute('data-step-action');
      const cart = storage.getCart();

      if (action === 'inc') {
        cart[index].quantity += 1;
      } else if (action === 'dec') {
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      storage.saveCart(cart);
      mountNavbar();
      mountMobileDock();
      mountDrawers();
    });
  });

  // Eliminar prenda
  document.querySelectorAll('[data-remove-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.getAttribute('data-remove-index'));
      const cart = storage.getCart();
      cart.splice(index, 1);
      storage.saveCart(cart);
      mountNavbar();
      mountMobileDock();
      mountDrawers();
    });
  });

  // Aplicar cupón de sensor
  const applyPromoBtn = document.getElementById('dal-cart-apply-promo-btn');
  const promoInput = document.getElementById('dal-cart-promo-input');

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'DAL-FRESH15') {
        state.appliedPromo = { code: 'DAL-FRESH15', percent: 15 };
        showInAppToast({
          title: 'Cupón Activado',
          message: '15% de descuento por sensor aplicado a tu total.',
          iconType: 'tag'
        });
      } else {
        showInAppToast({
          title: 'Cupón Inválido',
          message: 'Sacude tu dispositivo para desbloquear DAL-FRESH15.',
          iconType: 'info'
        });
      }
      mountDrawers();
    });
  }

  // Botón Proceder al Checkout
  const checkoutBtn = document.getElementById('cart-proceed-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      state.isCartOpen = false;
      mountDrawers();
      openCheckoutModal();
    });
  }
}

// Abrir modal de Checkout
function openCheckoutModal() {
  const mount = document.getElementById('dal-modal-mount');
  if (!mount) return;

  const cart = storage.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (state.appliedPromo) {
    discount = (subtotal * state.appliedPromo.percent) / 100;
  }
  const shipping = subtotal >= 120 ? 0 : 12;

  mount.innerHTML = renderCheckoutModal(subtotal, discount, shipping);
  refreshLucideIcons();

  const closeBtn = document.getElementById('checkout-close-btn');
  const backdrop = document.getElementById('dal-checkout-modal-backdrop');

  const closeCheckout = () => {
    if (backdrop) backdrop.classList.remove('open');
    setTimeout(() => { mount.innerHTML = ''; }, 250);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeCheckout);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCheckout();
    });
  }

  // Autollenar con Sensor GPS
  const gpsBtn = document.getElementById('checkout-gps-fill-btn');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', async () => {
      gpsBtn.disabled = true;
      gpsBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i><span>Localizando...</span>`;
      refreshLucideIcons();

      try {
        const loc = await sensors.requestGeolocation();
        const cityInput = document.getElementById('checkout-city');
        const addrInput = document.getElementById('checkout-address');

        if (cityInput && loc.nearestBoutique) {
          cityInput.value = loc.nearestBoutique.city;
        }
        if (addrInput && loc.nearestBoutique) {
          addrInput.value = `Próximo a ${loc.nearestBoutique.address} (GPS ${loc.lat.toFixed(3)}, ${loc.lng.toFixed(3)})`;
        }

        showInAppToast({
          title: 'Ubicación Sincronizada',
          message: `Dirección vinculada con el sensor GPS de tu dispositivo.`,
          iconType: 'crosshair'
        });
      } catch (e) {
        showInAppToast({
          title: 'GPS Manual',
          message: 'Ingresa tu dirección manualmente.',
          iconType: 'info'
        });
      }

      gpsBtn.disabled = false;
      gpsBtn.innerHTML = `<i data-lucide="crosshair"></i><span>Autollenar con GPS</span>`;
      refreshLucideIcons();
    });
  }

  // Enviar formulario y Disparar Notificación Push de Confirmación
  const form = document.getElementById('dal-checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      const totalAmount = subtotal - discount + shipping;

      storage.addOrder({
        orderNumber,
        items: cart,
        total: totalAmount,
        date: new Date().toLocaleDateString()
      });

      // Vaciar carrito
      storage.saveCart([]);
      state.appliedPromo = null;

      // Disparar Notificación Push
      pushService.sendOrderConfirmation(orderNumber, totalAmount);

      // Efecto confeti de celebración
      confetti({
        particleCount: 100,
        spread: 80,
        colors: ['#536B58', '#B56B47', '#E2DDD4']
      });

      // Mostrar pantalla de éxito dentro del modal
      const content = document.getElementById('checkout-content-container');
      if (content) {
        content.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <div class="dal-sensor-icon-box" style="width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 50%;">
              <i data-lucide="package-check" style="width: 28px; height: 28px;"></i>
            </div>
            <h2 class="dal-modal-title" style="margin-bottom: 8px;">¡Pedido #${orderNumber} Recibido!</h2>
            <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6;">
              Hemos enviado la confirmación y la notificación push a tu dispositivo. Nuestro mensajero ya está coordinando la entrega.
            </p>
            <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 24px; font-size: 13px;">
              <strong>Total abonado:</strong> $${totalAmount.toFixed(2)} USD | Pago aprobado
            </div>
            <button class="dal-btn-primary" style="margin: 0 auto;" id="checkout-finish-btn">
              <span>Volver a la Colección</span>
            </button>
          </div>
        `;
        refreshLucideIcons();

        document.getElementById('checkout-finish-btn')?.addEventListener('click', closeCheckout);
      }

      mountNavbar();
      mountMobileDock();
    });
  }
}

// Eventos del Centro de Notificaciones Push
function bindNotifEvents() {
  const closeBtn = document.getElementById('notif-close-btn');
  const backdrop = document.getElementById('dal-notif-backdrop');

  const closeNotif = () => {
    state.isNotifOpen = false;
    mountDrawers();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeNotif);
  if (backdrop) backdrop.addEventListener('click', closeNotif);

  // Solicitar permiso Push nativo
  const reqBtn = document.getElementById('notif-request-perm-btn');
  if (reqBtn) {
    reqBtn.addEventListener('click', async () => {
      await pushService.requestPermission();
      mountDrawers();
      mountNavbar();
    });
  }

  // Enviar alerta de prueba
  const testBtn = document.getElementById('notif-send-test-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      pushService.sendPushNotification({
        title: 'Dal Notificación Push',
        body: 'Alerta sincronizada en tiempo real. Sistema funcionando con precisión.',
        iconType: 'bell'
      });
      mountDrawers();
      mountNavbar();
    });
  }

  // Alerta de nuevo drop
  const dropBtn = document.getElementById('notif-send-drop-btn');
  if (dropBtn) {
    dropBtn.addEventListener('click', () => {
      pushService.sendDropAlertNotification('Camisa Sobrecamisa Lino Arena');
      mountDrawers();
      mountNavbar();
    });
  }

  // Marcar todas las notificaciones como leídas
  const clearBtn = document.getElementById('notif-clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      storage.markAllNotificationsRead();
      mountDrawers();
      mountNavbar();
    });
  }
}

// Eventos de la pestaña Studio de Sensores
function bindSensorsStudioEvents() {
  // Calibrar giroscopio
  const gyroBtn = document.getElementById('sensor-btn-gyro-perm');
  if (gyroBtn) {
    gyroBtn.addEventListener('click', async () => {
      await sensors.initGyroscope();
      showInAppToast({
        title: 'Giroscopio Activo',
        message: 'Inclina tu dispositivo para visualizar el brillo 3D.',
        iconType: 'compass'
      });
    });
  }

  // Simular Sacudida (Shake to Style)
  const shakeBtn = document.getElementById('sensor-btn-shake-test');
  if (shakeBtn) {
    shakeBtn.addEventListener('click', () => {
      sensors.triggerShakeAction('boton_estudio');
      mountMainContent();
      mountNavbar();
    });
  }

  // Localizar por GPS
  const locBtn = document.getElementById('sensor-btn-locate');
  if (locBtn) {
    locBtn.addEventListener('click', async () => {
      locBtn.disabled = true;
      try {
        const loc = await sensors.requestGeolocation();
        state.sensorsState.location = loc;
        mountMainContent();
      } catch (err) {
        showInAppToast({
          title: 'Error GPS',
          message: err.message,
          iconType: 'info'
        });
      }
      locBtn.disabled = false;
    });
  }

  // Sensor Óptico de Cámara
  const camBtn = document.getElementById('sensor-btn-camera-toggle');
  const sampleBtn = document.getElementById('sensor-btn-sample-color');
  const videoEl = document.getElementById('dal-camera-preview');
  const placeholderEl = document.getElementById('dal-camera-placeholder');

  if (camBtn && videoEl) {
    camBtn.addEventListener('click', async () => {
      if (sensors.cameraStream) {
        sensors.stopCamera(videoEl);
        camBtn.querySelector('span').textContent = 'Iniciar Cámara';
        videoEl.style.display = 'none';
        if (placeholderEl) placeholderEl.style.display = 'flex';
        if (sampleBtn) sampleBtn.style.display = 'none';
      } else {
        try {
          await sensors.startCamera(videoEl);
          camBtn.querySelector('span').textContent = 'Detener Cámara';
          videoEl.style.display = 'block';
          if (placeholderEl) placeholderEl.style.display = 'none';
          if (sampleBtn) sampleBtn.style.display = 'inline-flex';
          refreshLucideIcons();
        } catch (err) {
          showInAppToast({
            title: 'Cámara Bloqueada',
            message: 'Otorga permiso de cámara para usar el Color Matcher.',
            iconType: 'camera-off'
          });
        }
      }
    });
  }

  if (sampleBtn && videoEl) {
    sampleBtn.addEventListener('click', () => {
      const match = sensors.sampleCameraColor(videoEl);
      if (match) {
        showInAppToast({
          title: match.paletteName,
          message: match.description,
          iconType: 'pipette',
          duration: 6000
        });
      }
    });
  }
}

// Eventos de la pestaña Radar de Boutiques
function bindBoutiquesEvents() {
  const radarBtn = document.getElementById('radar-request-gps-btn');
  if (radarBtn) {
    radarBtn.addEventListener('click', async () => {
      radarBtn.disabled = true;
      radarBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i><span>Calculando...</span>`;
      refreshLucideIcons();

      const loc = await sensors.requestGeolocation();
      state.sensorsState.location = loc;
      mountMainContent();
    });
  }
}

// Abrir y gestionar el modal de autenticación (Crear cuenta / Iniciar sesión / Perfil)
function openAuthModal(initialTab = 'register') {
  const mount = document.getElementById('dal-modal-mount');
  if (!mount) return;

  mount.innerHTML = renderAuthModal(initialTab);
  refreshLucideIcons();

  const backdrop = document.getElementById('dal-auth-modal-backdrop');
  const closeBtn = document.getElementById('auth-close-btn');

  const closeAuth = () => {
    if (backdrop) backdrop.classList.remove('open');
    setTimeout(() => { mount.innerHTML = ''; }, 250);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeAuth);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAuth();
    });
  }

  // Pestañas de cambio (Crear Cuenta / Iniciar Sesión)
  const tabReg = document.getElementById('auth-tab-register');
  const tabLogin = document.getElementById('auth-tab-login');

  if (tabReg) {
    tabReg.addEventListener('click', () => {
      openAuthModal('register');
    });
  }
  if (tabLogin) {
    tabLogin.addEventListener('click', () => {
      openAuthModal('login');
    });
  }

  // Enviar formulario de Registro
  const regForm = document.getElementById('dal-register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const style = document.getElementById('reg-style').value;

      const role = document.getElementById('reg-role') ? document.getElementById('reg-role').value : 'customer';

      const newUser = {
        name,
        email,
        role,
        style: role === 'admin' ? 'Administrador de Atelier' : 'Lino & Orgánico',
        registeredAt: new Date().toLocaleDateString()
      };

      storage.saveUser(newUser);

      // Descuento de bienvenida 10%
      storage.addDiscount({
        code: 'DAL-BIENVENIDO10',
        percent: 10,
        description: '10% de cortesía por unirte a Dal Club',
        unlockedAt: new Date().toLocaleTimeString()
      });

      // Notificación push
      pushService.sendPushNotification({
        title: role === 'admin' ? '¡Modo Admin Activado!' : '¡Bienvenido a Dal Atelier!',
        body: role === 'admin' 
          ? `Hola ${name}. Tienes acceso completo al panel administrativo y telemetría.`
          : `Hola ${name}. Tu cuenta ha sido creada y tus medidas se han sincronizado.`,
        iconType: role === 'admin' ? 'shield-check' : 'user-check'
      });

      // Confeti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          colors: ['#536B58', '#B56B47', '#E2DDD4', '#FAF8F4']
        });
      } catch {}

      closeAuth();
      mountNavbar();
      mountMobileDock();
      mountMainContent();
    });
  }

  // Enviar formulario de Login
  const loginForm = document.getElementById('dal-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const nameFromEmail = email.split('@')[0];
      const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      const isAdmin = email.toLowerCase().includes('admin');

      const loggedUser = {
        name: isAdmin ? 'Elena Valdés (Admin)' : capitalized,
        email,
        role: isAdmin ? 'admin' : 'customer',
        style: isAdmin ? 'Administrador de Atelier' : 'Lino & Orgánico',
        lastLogin: new Date().toLocaleTimeString()
      };

      storage.saveUser(loggedUser);

      pushService.sendPushNotification({
        title: isAdmin ? 'Panel de Administrador Dal' : 'Sesión Iniciada en Dal',
        body: isAdmin 
          ? 'Has ingresado con permisos administrativos (Métricas y MySQL).'
          : `Bienvenido de vuelta, ${capitalized}. Preferencias sincronizadas.`,
        iconType: isAdmin ? 'shield-check' : 'user-check'
      });

      closeAuth();
      mountNavbar();
      mountMobileDock();
      mountMainContent();
    });
  }

  // Accesos rápidos Demo
  const demoClientBtn = document.getElementById('demo-client-login-btn');
  if (demoClientBtn) {
    demoClientBtn.addEventListener('click', () => {
      const loggedUser = {
        name: 'Mateo Navarro',
        email: 'cliente@dal.com',
        role: 'customer',
        style: 'Lino & Orgánico',
        lastLogin: new Date().toLocaleTimeString()
      };
      storage.saveUser(loggedUser);
      pushService.sendPushNotification({
        title: 'Sesión Iniciada (Cliente)',
        body: 'Bienvenido de vuelta, Mateo. Tu bolsa está sincronizada.',
        iconType: 'user-check'
      });
      closeAuth();
      mountNavbar();
      mountMobileDock();
      mountMainContent();
    });
  }

  const demoAdminBtn = document.getElementById('demo-admin-login-btn');
  if (demoAdminBtn) {
    demoAdminBtn.addEventListener('click', () => {
      const loggedUser = {
        name: 'Elena Valdés',
        email: 'admin@dal.com',
        role: 'admin',
        style: 'Administrador de Atelier',
        lastLogin: new Date().toLocaleTimeString()
      };
      storage.saveUser(loggedUser);
      pushService.sendPushNotification({
        title: 'Modo Administrador Activado',
        body: 'Acceso total habilitado a Métricas, Sensores y MySQL.',
        iconType: 'shield-check'
      });
      closeAuth();
      mountNavbar();
      mountMobileDock();
      mountMainContent();
    });
  }

  // Cerrar Sesión
  const logoutBtn = document.getElementById('auth-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      storage.removeUser();
      showInAppToast({
        title: 'Sesión Cerrada',
        message: 'Has salido de tu cuenta de miembro Dal.',
        iconType: 'log-out'
      });
      closeAuth();
      mountNavbar();
      mountMobileDock();
      mountMainContent();
    });
  }
}

// Eventos de las Secciones Extendidas (Lookbook, Banner de Auth y Footer)
function bindExtendedSectionsEvents() {
  // Botones de Crear Cuenta / Iniciar Sesión en el banner
  const createAccBtn = document.getElementById('home-create-account-btn');
  if (createAccBtn) {
    createAccBtn.addEventListener('click', () => {
      openAuthModal('register');
    });
  }

  const loginBtn = document.getElementById('home-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      openAuthModal('login');
    });
  }

  const profileBtn = document.getElementById('home-view-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openAuthModal('profile');
    });
  }

  // Explorar piezas desde el Lookbook
  document.querySelectorAll('.look-explore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      state.catalogFilters.category = cat;
      mountMainContent();
      const toolbar = document.querySelector('.dal-catalog-section');
      if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Enlaces de navegación en el Footer
  document.querySelectorAll('.footer-nav-link[data-cat]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-cat');
      state.currentTab = 'catalog';
      state.catalogFilters.category = cat;
      mountNavbar();
      mountMainContent();
      mountMobileDock();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.footer-nav-sensors').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentTab = 'sensors';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.footer-nav-boutiques').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentTab = 'boutiques';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.footer-nav-database').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentTab = 'database';
      mountNavbar();
      mountMainContent();
      mountMobileDock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Eventos globales (Conmutador de Vista de Pantalla Completa vs Simulador Móvil)
function bindGlobalEvents() {
  const responsiveBtn = document.getElementById('toggle-view-responsive');
  const mobileBtn = document.getElementById('toggle-view-mobile');

  if (responsiveBtn) {
    responsiveBtn.addEventListener('click', () => {
      state.viewMode = 'responsive';
      storage.saveViewMode('responsive');
      renderAppStructure();
    });
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      state.viewMode = 'mobile-frame';
      storage.saveViewMode('mobile-frame');
      renderAppStructure();
    });
  }
}

// Iniciar aplicación Dal al cargar el DOM
async function initDalApp() {
  console.log('Iniciando Dal Atelier...');

  // Registrar Service Worker para PWA y Push
  await initServiceWorker();

  // Escuchar cambios de giroscopio para actualización viva
  sensors.on('gyroscope', (data) => {
    state.sensorsState.gyro = data;
  });

  // Escuchar eventos de sacudida
  sensors.on('shake', (data) => {
    state.appliedPromo = { code: data.code, percent: data.percent };
    mountNavbar();
    mountMobileDock();
  });

  // Inicializar sensores
  sensors.initGyroscope();
  sensors.initShakeDetector();
  sensors.initAmbientLightSensor();

  // Restaurar tema guardado
  const savedTheme = storage.getTheme();
  if (savedTheme === 'evening') {
    document.body.classList.add('dal-evening-lounge');
  }

  // Escuchar evento personalizado de notificación recibida
  window.addEventListener('dal:notification-received', () => {
    mountNavbar();
    mountMobileDock();
  });

  // Render inicial
  renderAppStructure();

  // Sincronizar catálogo inicial con la API de ropa externa en segundo plano
  setTimeout(() => {
    clothingApi.syncExternalClothing().then((res) => {
      if (res.success) {
        const badge = document.getElementById('api-status-badge');
        if (badge) {
          badge.innerHTML = `<i data-lucide="check"></i><span>API Platzi Sincronizada (${res.count})</span>`;
          refreshLucideIcons();
        }
      }
    });
  }, 1000);
}

// Ejecutar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDalApp);
} else {
  initDalApp();
}

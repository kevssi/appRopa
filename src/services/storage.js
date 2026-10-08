// Gestor de persistencia local para Dal con fallback seguro en memoria para React Native / Expo Go

const memoryStore = {};
const safeStorage = {
  getItem(key) {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return memoryStore[key] || null;
      }
    }
    return memoryStore[key] || null;
  },
  setItem(key, value) {
    memoryStore[key] = value;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {}
    }
  },
  removeItem(key) {
    delete memoryStore[key];
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }
};

const KEYS = {
  CART: 'dal_cart_v1',
  WISHLIST: 'dal_wishlist_v1',
  ORDERS: 'dal_orders_v1',
  NOTIFICATIONS: 'dal_notifications_v1',
  DISCOUNTS: 'dal_discounts_v1',
  VIEW_MODE: 'dal_view_mode_v1',
  THEME: 'dal_theme_v1'
};

export const storage = {
  // Carrito de compras
  getCart() {
    try {
      return JSON.parse(safeStorage.getItem(KEYS.CART)) || [];
    } catch {
      return [];
    }
  },
  saveCart(cart) {
    safeStorage.setItem(KEYS.CART, JSON.stringify(cart));
  },

  // Lista de deseos
  getWishlist() {
    try {
      return JSON.parse(safeStorage.getItem(KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  },
  toggleWishlist(productId) {
    const list = this.getWishlist();
    const index = list.indexOf(productId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
    }
    safeStorage.setItem(KEYS.WISHLIST, JSON.stringify(list));
    return list;
  },

  // Órdenes
  getOrders() {
    try {
      return JSON.parse(safeStorage.getItem(KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  },
  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    safeStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    return orders;
  },

  // Historial de Notificaciones
  getNotifications() {
    try {
      return JSON.parse(safeStorage.getItem(KEYS.NOTIFICATIONS)) || [];
    } catch {
      return [];
    }
  },
  addNotification(notification) {
    const notifs = this.getNotifications();
    notifs.unshift({
      ...notification,
      id: 'notif_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
    safeStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs.slice(0, 30)));
    return notifs;
  },
  markAllNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    safeStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return notifs;
  },

  // Cupones de descuento desbloqueados por sensor
  getDiscounts() {
    try {
      return JSON.parse(safeStorage.getItem(KEYS.DISCOUNTS)) || [];
    } catch {
      return [];
    }
  },
  addDiscount(discount) {
    const discounts = this.getDiscounts();
    if (!discounts.some(d => d.code === discount.code)) {
      discounts.push(discount);
      safeStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(discounts));
    }
    return discounts;
  },

  // Modo de visualización (escritorio completo vs simulador móvil)
  getViewMode() {
    return safeStorage.getItem(KEYS.VIEW_MODE) || 'responsive';
  },
  saveViewMode(mode) {
    safeStorage.setItem(KEYS.VIEW_MODE, mode);
  },

  // Tema ambiental
  getTheme() {
    return safeStorage.getItem(KEYS.THEME) || 'fresh';
  },
  saveTheme(theme) {
    safeStorage.setItem(KEYS.THEME, theme);
  },

  // Usuario autenticado (Sesión Dal)
  getUser() {
    try {
      return JSON.parse(safeStorage.getItem('dal_current_user_v1')) || null;
    } catch {
      return null;
    }
  },
  saveUser(user) {
    safeStorage.setItem('dal_current_user_v1', JSON.stringify(user));
    return user;
  },
  removeUser() {
    safeStorage.removeItem('dal_current_user_v1');
  }
};

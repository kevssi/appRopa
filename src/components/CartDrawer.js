// Drawer de Bolsa de Compras Dal con Soporte de Cupones por Sensores y Lucide Icons
import { storage } from '../services/storage.js';

export function renderCartDrawer(appliedPromo = null) {
  const cart = storage.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedPromo && appliedPromo.percent) {
    discountAmount = (subtotal * appliedPromo.percent) / 100;
  }

  const shippingFee = subtotal >= 120 || cart.length === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingThreshold = 120;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return `
    <div class="dal-cart-backdrop" id="dal-cart-backdrop"></div>
    <aside class="dal-cart-drawer" id="dal-cart-drawer">
      <!-- Encabezado de la Bolsa -->
      <div class="dal-cart-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i data-lucide="shopping-bag"></i>
          <h2 class="dal-cart-title">Bolsa de Compras (${cart.length})</h2>
        </div>
        <button class="dal-toast-close" id="cart-close-btn" aria-label="Cerrar bolsa">
          <i data-lucide="x"></i>
        </button>
      </div>

      <!-- Barra de Envío Gratuito -->
      <div style="padding: 12px 24px; background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>
            ${subtotal >= freeShippingThreshold 
              ? 'Envío de cortesía activado' 
              : `Faltan $${(freeShippingThreshold - subtotal).toFixed(2)} para envío gratuito`}
          </span>
          <strong style="color: var(--accent-sage);">${progressPercent}%</strong>
        </div>
        <div style="width: 100%; height: 5px; background: var(--border-subtle); border-radius: var(--radius-full); overflow: hidden;">
          <div style="width: ${progressPercent}%; height: 100%; background: var(--accent-sage); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <!-- Lista de Prendas -->
      <div class="dal-cart-items-list">
        ${cart.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <i data-lucide="package-open" style="width: 48px; height: 48px; margin-bottom: 14px; stroke-width: 1.2;"></i>
            <p style="font-size: 15px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px;">Tu bolsa está vacía</p>
            <p style="font-size: 13px;">Explora la colección contemporánea y añade tus esenciales.</p>
          </div>
        ` : cart.map((item, index) => `
          <div class="dal-cart-item">
            <img src="${item.primary_image}" alt="${item.name}" class="dal-cart-item-img" />
            <div class="dal-cart-item-details">
              <h4 class="dal-cart-item-name">${item.name}</h4>
              <div class="dal-cart-item-meta">
                Talla: <strong>${item.selectedSize || 'M'}</strong> | $${item.price.toFixed(2)}
              </div>
              <div class="dal-cart-item-actions">
                <div class="dal-stepper">
                  <button class="dal-step-btn" data-step-action="dec" data-item-index="${index}">
                    <i data-lucide="minus"></i>
                  </button>
                  <span class="dal-step-val">${item.quantity}</span>
                  <button class="dal-step-btn" data-step-action="inc" data-item-index="${index}">
                    <i data-lucide="plus"></i>
                  </button>
                </div>
                <button class="dal-toast-close" data-remove-index="${index}" title="Eliminar">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Resumen y Checkout -->
      ${cart.length > 0 ? `
        <div class="dal-cart-footer">
          <!-- Aplicar Cupón de Descuento -->
          <div class="dal-promo-row">
            <input 
              type="text" 
              class="dal-promo-input" 
              id="dal-cart-promo-input" 
              placeholder="Código promo (ej. DAL-FRESH15)" 
              value="${appliedPromo?.code || ''}"
            />
            <button class="dal-btn-pill" id="dal-cart-apply-promo-btn">
              <i data-lucide="tag"></i>
              <span>Aplicar</span>
            </button>
          </div>

          ${appliedPromo ? `
            <div style="font-size: 12px; color: var(--accent-sage); margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="check-circle-2"></i>
              <span>Cupón ${appliedPromo.code} aplicado (-${appliedPromo.percent}%)</span>
            </div>
          ` : ''}

          <div class="dal-cart-summary-line">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>

          ${discountAmount > 0 ? `
            <div class="dal-cart-summary-line" style="color: var(--accent-terracotta);">
              <span>Descuento Sensor (${appliedPromo?.percent}%)</span>
              <span>-$${discountAmount.toFixed(2)}</span>
            </div>
          ` : ''}

          <div class="dal-cart-summary-line">
            <span>Envío Express Dal</span>
            <span>${shippingFee === 0 ? 'Gratis' : '$' + shippingFee.toFixed(2)}</span>
          </div>

          <div class="dal-cart-summary-line total">
            <span>Total</span>
            <span>$${total.toFixed(2)} USD</span>
          </div>

          <button class="dal-btn-primary" style="width: 100%; margin-top: 14px; justify-content: center;" id="cart-proceed-checkout-btn">
            <span>Proceder al Pago</span>
            <i data-lucide="arrow-right"></i>
          </button>
        </div>
      ` : ''}
    </aside>
  `;
}

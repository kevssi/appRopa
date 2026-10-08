// Modal de Finalización de Compra (Checkout) con Notificación Push en Dal
import { storage } from '../services/storage.js';
import { pushService } from '../services/pushNotifications.js';

export function renderCheckoutModal(subtotal, discountAmount = 0, shippingFee = 0) {
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return `
    <div class="dal-modal-backdrop open" id="dal-checkout-modal-backdrop">
      <div class="dal-modal-window" style="max-width: 640px; grid-template-columns: 1fr;">
        <button class="dal-modal-close" id="checkout-close-btn" aria-label="Cerrar checkout">
          <i data-lucide="x"></i>
        </button>

        <div style="padding: 36px 32px;" id="checkout-content-container">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <i data-lucide="shield-check" style="color: var(--accent-sage);"></i>
            <span class="dal-modal-tag" style="margin: 0;">Checkout Protegido Dal</span>
          </div>

          <h2 class="dal-modal-title" style="margin-bottom: 24px;">Confirmar Entrega y Pedido</h2>

          <form id="dal-checkout-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label class="dal-selector-label">Nombre Completo</label>
                <input 
                  type="text" 
                  id="checkout-name" 
                  class="dal-promo-input" 
                  style="width: 100%; border-radius: var(--radius-sm);" 
                  placeholder="ej. Mateo Navarro" 
                  required 
                  value="Mateo Navarro"
                />
              </div>

              <div>
                <label class="dal-selector-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="checkout-email" 
                  class="dal-promo-input" 
                  style="width: 100%; border-radius: var(--radius-sm);" 
                  placeholder="mateo@dal.atelier" 
                  required 
                  value="mateo@dal.atelier"
                />
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="dal-selector-label" style="margin: 0;">Dirección de Entrega</label>
                <button type="button" class="dal-btn-pill" id="checkout-gps-fill-btn" style="padding: 3px 10px; font-size: 11px;">
                  <i data-lucide="crosshair"></i>
                  <span>Autollenar con GPS</span>
                </button>
              </div>
              <input 
                type="text" 
                id="checkout-address" 
                class="dal-promo-input" 
                style="width: 100%; border-radius: var(--radius-sm);" 
                placeholder="Calle, número exterior y colonia" 
                required 
                value="Colima 184, Roma Norte"
              />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
              <div>
                <label class="dal-selector-label">Ciudad / Región</label>
                <input 
                  type="text" 
                  id="checkout-city" 
                  class="dal-promo-input" 
                  style="width: 100%; border-radius: var(--radius-sm);" 
                  placeholder="Ciudad de México" 
                  required 
                  value="Ciudad de México"
                />
              </div>

              <div>
                <label class="dal-selector-label">Método de Pago</label>
                <select id="checkout-payment" class="dal-promo-input" style="width: 100%; border-radius: var(--radius-sm);">
                  <option value="card">Tarjeta de Crédito / Débito</option>
                  <option value="applepay">Apple Pay / Google Pay</option>
                  <option value="cash_pickup">Pago en Boutique al recoger</option>
                </select>
              </div>
            </div>

            <!-- Resumen de pago -->
            <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Total a Pagar</span>
                <strong style="font-size: 16px;">$${total.toFixed(2)} USD</strong>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                <i data-lucide="bell" style="width: 14px; height: 14px;"></i>
                <span>Recibirás una notificación push instantánea con la confirmación de despacho.</span>
              </div>
            </div>

            <button type="submit" class="dal-btn-primary" style="width: 100%; justify-content: center; padding: 14px;" id="checkout-submit-btn">
              <i data-lucide="check"></i>
              <span>Pagar y Confirmar Pedido ($${total.toFixed(2)})</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

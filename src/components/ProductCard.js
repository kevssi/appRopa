// Tarjeta de Producto Dal con Soporte de Parallax 3D por Giroscopio y Lucide Icons
import { storage } from '../services/storage.js';

export function renderProductCard(product) {
  const wishlist = storage.getWishlist();
  const isWishlisted = wishlist.includes(product.id);
  const isExternal = product.source !== 'Dal Atelier';

  return `
    <article class="dal-product-card dal-sensor-tilt" data-id="${product.id}">
      <!-- Capa de brillo reflectivo dinámico controlado por giroscopio -->
      <div class="dal-card-sheen"></div>

      <!-- Contenedor de Imagen -->
      <div class="dal-card-image-box">
        <img 
          src="${product.primary_image}" 
          alt="${product.name}" 
          class="dal-card-img" 
          loading="lazy"
        />

        <!-- Insignias -->
        <div class="dal-card-badges">
          ${product.is_new_drop ? `
            <span class="dal-badge dal-badge-drop">
              Nuevo Drop
            </span>
          ` : ''}
          ${product.discount_percent > 0 ? `
            <span class="dal-badge dal-badge-discount">
              -${product.discount_percent}%
            </span>
          ` : ''}
          ${isExternal ? `
            <span class="dal-badge dal-badge-api">
              API Sincronizada
            </span>
          ` : ''}
        </div>

        <!-- Botón de Lista de Deseos -->
        <button class="dal-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}" title="Favorito">
          <i data-lucide="heart"></i>
        </button>
      </div>

      <!-- Detalles del Producto -->
      <div class="dal-card-details">
        <div class="dal-card-category">${product.categoryName || 'Dal Atelier'}</div>
        <h3 class="dal-card-name">${product.name}</h3>
        <p class="dal-card-material">${product.material_composition || '100% Fibras Naturales'}</p>

        <!-- Pie de Tarjeta con Precios y Botón de Agregar -->
        <div class="dal-card-footer">
          <div class="dal-price-group">
            <span class="dal-current-price">$${product.price.toFixed(2)}</span>
            ${product.original_price > product.price ? `
              <span class="dal-original-price">$${product.original_price.toFixed(2)}</span>
            ` : ''}
          </div>

          <button class="dal-card-add-btn" data-add-cart-id="${product.id}" title="Añadir a la Bolsa">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

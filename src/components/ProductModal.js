// Modal de Detalle de Prenda con Inspector 3D y Especificaciones Técnicas

export function renderProductModal(product, selectedSize = 'M', selectedColorIndex = 0) {
  if (!product) return '';

  const colors = product.colors || [{ name: 'Predeterminado', hex: '#6B6862' }];
  const sizes = product.sizes || ['S', 'M', 'L'];
  const activeColor = colors[selectedColorIndex] || colors[0];

  return `
    <div class="dal-modal-backdrop open" id="dal-product-modal-backdrop">
      <div class="dal-modal-window">
        <!-- Botón Cerrar -->
        <button class="dal-modal-close" id="modal-close-btn" aria-label="Cerrar">
          <i data-lucide="x"></i>
        </button>

        <!-- Galería & Inspector 3D -->
        <div class="dal-modal-gallery">
          <img 
            src="${product.primary_image}" 
            alt="${product.name}" 
            class="dal-modal-main-img" 
            id="modal-main-img"
          />
          <div class="dal-fabric-3d-hint">
            <i data-lucide="compass"></i>
            <span>Inclina tu dispositivo o mueve el cursor para inspeccionar el reflejo de la tela en 3D.</span>
          </div>
        </div>

        <!-- Información y Selectores -->
        <div class="dal-modal-info">
          <span class="dal-modal-tag">${product.categoryName || 'Dal Atelier'}</span>
          <h2 class="dal-modal-title">${product.name}</h2>
          
          <div class="dal-modal-price">
            <span>$${product.price.toFixed(2)} USD</span>
            ${product.original_price > product.price ? `
              <span class="dal-original-price">$${product.original_price.toFixed(2)}</span>
            ` : ''}
          </div>

          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.6;">
            ${product.description || product.short_description}
          </p>

          <!-- Selector de Tallas -->
          <div class="dal-selector-group">
            <span class="dal-selector-label">Talla Seleccionada: <strong id="modal-selected-size-label">${selectedSize}</strong></span>
            <div class="dal-sizes-row">
              ${sizes.map(size => `
                <button class="dal-size-btn ${size === selectedSize ? 'selected' : ''}" data-size="${size}">
                  ${size}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Selector de Colores -->
          <div class="dal-selector-group">
            <span class="dal-selector-label">Tono Textil: <strong>${activeColor.name}</strong></span>
            <div class="dal-colors-row">
              ${colors.map((c, idx) => `
                <button 
                  class="dal-color-dot ${idx === selectedColorIndex ? 'selected' : ''}" 
                  style="background-color: ${c.hex};" 
                  data-color-index="${idx}"
                  title="${c.name}"
                ></button>
              `).join('')}
            </div>
          </div>

          <!-- Composición Textil y Sostenibilidad -->
          <div class="dal-fabric-props">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="leaf"></i>
              <span><strong>Composición:</strong> ${product.material_composition || 'Fibras Orgánicas'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="shield-check"></i>
              <span><strong>Ajuste:</strong> ${product.fit_type || 'Corte Contemporáneo'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="refresh-cw"></i>
              <span><strong>Cuidado:</strong> ${product.care_instructions || 'Lavar en frío'}</span>
            </div>
          </div>

          <!-- Botón de Compra -->
          <button class="dal-btn-primary" style="width: 100%; justify-content: center;" id="modal-add-to-cart-btn" data-product-id="${product.id}">
            <i data-lucide="shopping-bag"></i>
            <span>Añadir a la Bolsa</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

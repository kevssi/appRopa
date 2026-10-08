// Visualizador de Esquema de Base de Datos MySQL para Dal
// Muestra la arquitectura relacional, datos de ejemplo y descarga de dal_database.sql

export function renderDatabaseViewer() {
  const tables = [
    {
      name: 'products',
      description: 'Catálogo de prendas, precios, composición textil, descuento y valoraciones.',
      rows: 8,
      columns: ['id', 'sku', 'name', 'category_id', 'price', 'material_composition', 'is_featured', 'is_new_drop']
    },
    {
      name: 'product_variants',
      description: 'Inventario por tallas (XS a XL), colores en código hexadecimal y existencias.',
      rows: 19,
      columns: ['id', 'product_id', 'size', 'color_name', 'color_hex', 'stock_quantity', 'sku_variant']
    },
    {
      name: 'categories',
      description: 'Familias de producto: Lino, Sastrería, Punto Suave, Outerwear y Calzado.',
      rows: 5,
      columns: ['id', 'slug', 'name', 'cover_image', 'display_order']
    },
    {
      name: 'orders & order_items',
      description: 'Registro de ventas, direcciones de entrega, coordenadas GPS y estado de despacho.',
      rows: 'Dinámico',
      columns: ['id', 'order_number', 'customer_name', 'total_amount', 'latitude', 'longitude', 'status']
    },
    {
      name: 'push_subscriptions',
      description: 'Dispositivos suscritos para recepción de notificaciones Web Push.',
      rows: 'Dinámico',
      columns: ['id', 'endpoint', 'p256dh_key', 'auth_key', 'device_type', 'is_active']
    },
    {
      name: 'sensor_interactions_log',
      description: 'Telemetría de sensores: eventos de giroscopio, sacudida, GPS y sensor de luz.',
      rows: 4,
      columns: ['id', 'user_id', 'sensor_type', 'event_payload', 'device_info', 'created_at']
    },
    {
      name: 'boutiques',
      description: 'Puntos físicos con coordenadas geográficas para cálculo de distancias por GPS.',
      rows: 4,
      columns: ['id', 'name', 'city', 'address', 'latitude', 'longitude', 'phone', 'schedule']
    }
  ];

  return `
    <div class="dal-catalog-section">
      <div class="dal-section-header">
        <div>
          <div class="dal-section-subtitle">
            <i data-lucide="database"></i>
            <span>Persistencia Relacional MySQL</span>
          </div>
          <h2 class="dal-section-title">Base de Datos de Dal (dal_db)</h2>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="/dal_database.sql" download="dal_database.sql" class="dal-btn-primary">
            <i data-lucide="download"></i>
            <span>Descargar dal_database.sql</span>
          </a>
        </div>
      </div>

      <!-- Guía de Importación Rápida -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <div class="dal-sensor-icon-box" style="width: 36px; height: 36px;">
            <i data-lucide="server"></i>
          </div>
          <h3 style="font-size: 16px; font-weight: 600;">Instrucciones para colocar en tu servidor MySQL</h3>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; font-size: 13px; color: var(--text-secondary);">
          <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Opción 1: phpMyAdmin / XAMPP / WAMP</strong>
            1. Abre tu panel phpMyAdmin.<br>
            2. Haz clic en la pestaña <strong>Importar</strong>.<br>
            3. Selecciona el archivo <code style="color: var(--accent-terracotta);">dal_database.sql</code> generado en la raíz.<br>
            4. Presiona <strong>Continuar</strong> para crear la base <code style="color: var(--accent-sage);">dal_db</code> automáticamente.
          </div>

          <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Opción 2: Consola MySQL / PowerShell</strong>
            Ejecuta el siguiente comando en tu terminal:<br>
            <code style="display: block; background: #1C1B1A; color: #E8E5DD; padding: 6px 10px; border-radius: 4px; margin-top: 6px; font-family: monospace;">
              mysql -u root -p &lt; dal_database.sql
            </code>
          </div>

          <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Opción 3: Servidor Node Express Incluido</strong>
            Configura tus credenciales en <code style="color: var(--accent-terracotta);">server/.env</code> y ejecuta:<br>
            <code style="display: block; background: #1C1B1A; color: #E8E5DD; padding: 6px 10px; border-radius: 4px; margin-top: 6px; font-family: monospace;">
              npm run server
            </code>
          </div>
        </div>
      </div>

      <!-- Tablas y Arquitectura de Datos -->
      <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Tablas Creadas en el Script SQL</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        ${tables.map(t => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 18px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="table" style="color: var(--accent-sage); width: 18px; height: 18px;"></i>
                <code style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${t.name}</code>
              </div>
              <span class="dal-badge" style="background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-subtle);">
                ${t.rows} registros
              </span>
            </div>

            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">
              ${t.description}
            </p>

            <div style="font-size: 11px; font-family: monospace; color: var(--text-muted); background: var(--bg-surface); padding: 8px; border-radius: 4px; word-break: break-all;">
              Campos: ${t.columns.join(', ')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

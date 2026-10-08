// Hero Editorial de Dal con Integración de Sensores y Estética Fresca

export function renderHeroSection(sensorsState) {
  const beta = sensorsState?.gyro?.beta || 0;
  const gamma = sensorsState?.gyro?.gamma || 0;

  return `
    <section class="dal-hero">
      <div class="dal-hero-card">
        <div class="dal-hero-content">
          <div class="dal-tag-pill">
            <i data-lucide="sparkles"></i>
            <span>Edición Limitada 2026</span>
          </div>

          <h1 class="dal-hero-title">
            Texturas Puras y <em>Caída Natural</em>
          </h1>

          <p class="dal-hero-desc">
            Piezas concebidas en lino orgánico y sarga ligera. Un balance refinado entre prestancia contemporánea y frescura para el día a día.
          </p>

          <div class="dal-hero-actions">
            <button class="dal-btn-primary" id="hero-cta-catalog">
              <span>Descubrir Catálogo</span>
              <i data-lucide="arrow-right"></i>
            </button>
            <button class="dal-btn-secondary" id="hero-cta-sensors">
              <i data-lucide="compass"></i>
              <span>Studio de Sensores</span>
            </button>
          </div>
        </div>

        <div class="dal-hero-media">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" 
            alt="Colección Dal Atelier" 
            class="dal-hero-img"
          />

          <!-- Telemetría flotante del sensor en el Hero -->
          <div class="dal-hero-sensor-float">
            <div class="dal-sensor-icon-box" style="width: 36px; height: 36px;">
              <i data-lucide="activity"></i>
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 600; color: var(--accent-sage); text-transform: uppercase;">
                Sensor Giroscopio
              </div>
              <div style="font-size: 12px; font-family: monospace; color: var(--text-primary);">
                Inclinación: ${gamma}° / ${beta}°
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

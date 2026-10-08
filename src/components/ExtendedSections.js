// Secciones de Extensión para Dal (Lookbook, Manifiesto, Invitación a Crear Cuenta / Iniciar Sesión y Footer)
// Diseño elegante y fresco, punto medio, sin emojis, uso exclusivo de Lucide Icons

import { storage } from '../services/storage.js';

export function renderExtendedSections() {
  const user = storage.getUser();

  return `
    <!-- 1. SECCIÓN EDITORIAL: LOOKBOOK DE TEMPORADA -->
    <section class="dal-lookbook-section" style="max-width: 1320px; margin: 40px auto 70px; padding: 0 24px;">
      <div class="dal-section-header">
        <div>
          <div class="dal-section-subtitle">
            <i data-lucide="layers"></i>
            <span>Combinaciones Curadas</span>
          </div>
          <h2 class="dal-section-title">El Arte de Vestir en Frescura</h2>
        </div>
        <p style="max-width: 460px; font-size: 14px; color: var(--text-secondary);">
          Siluetas pensadas para convivir en armonía cromática: tonalidades arena, salvia apagada y texturas de grano abierto.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        <!-- Look 01 -->
        <div class="dal-lookbook-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.3s ease;">
          <div style="position: relative; height: 380px; overflow: hidden;">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" 
              alt="Look Mediodía Mediterráneo" 
              style="width: 100%; height: 100%; object-fit: cover; object-position: center 20%;"
            />
            <span class="dal-badge dal-badge-drop" style="position: absolute; top: 16px; left: 16px;">
              Look 01
            </span>
          </div>
          <div style="padding: 24px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-sage); font-weight: 600;">
              Lino & Sarga Suave
            </span>
            <h3 style="font-size: 19px; font-weight: 600; margin: 6px 0 8px;">Mediodía Mediterráneo</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
              Camisa Sobrecamisa Lino Arena coordinada con Pantalón Plisado en Salvia Muted. Frescura sin perder estructura.
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <span style="font-size: 15px; font-weight: 700;">$187.00 USD</span>
              <button class="dal-btn-pill look-explore-btn" data-category="lino">
                <i data-lucide="eye"></i>
                <span>Ver Piezas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Look 02 -->
        <div class="dal-lookbook-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.3s ease;">
          <div style="position: relative; height: 380px; overflow: hidden;">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80" 
              alt="Look Atardecer Urbano" 
              style="width: 100%; height: 100%; object-fit: cover; object-position: center 15%;"
            />
            <span class="dal-badge dal-badge-drop" style="position: absolute; top: 16px; left: 16px;">
              Look 02
            </span>
          </div>
          <div style="padding: 24px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-sage); font-weight: 600;">
              Capas Ligeras
            </span>
            <h3 style="font-size: 19px; font-weight: 600; margin: 6px 0 8px;">Atardecer en Movimiento</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
              Jersey Cuello Mock en marfil con la Gabardina Fluida Piedra Pálido. Protección ligera contra la brisa vespertina.
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <span style="font-size: 15px; font-weight: 700;">$290.00 USD</span>
              <button class="dal-btn-pill look-explore-btn" data-category="abrigos">
                <i data-lucide="eye"></i>
                <span>Ver Piezas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Look 03 -->
        <div class="dal-lookbook-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.3s ease;">
          <div style="position: relative; height: 380px; overflow: hidden;">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80" 
              alt="Look Sastrería Relajada" 
              style="width: 100%; height: 100%; object-fit: cover; object-position: center 25%;"
            />
            <span class="dal-badge dal-badge-drop" style="position: absolute; top: 16px; left: 16px;">
              Look 03
            </span>
          </div>
          <div style="padding: 24px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent-sage); font-weight: 600;">
              Sastrería Desestructurada
            </span>
            <h3 style="font-size: 19px; font-weight: 600; margin: 6px 0 8px;">Atelier Nocturno</h3>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
              Blazer Francés en Lino Arcilla complementado con Camiseta Pesada Carbón y mocasín flexible de cuero canela.
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <span style="font-size: 15px; font-weight: 700;">$345.00 USD</span>
              <button class="dal-btn-pill look-explore-btn" data-category="sastreria">
                <i data-lucide="eye"></i>
                <span>Ver Piezas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SECCIÓN: MANIFIESTO DAL & VALORES FRESCOS -->
    <section style="background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 60px 24px;">
      <div style="max-width: 1320px; margin: 0 auto;">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 40px;">
          <div class="dal-section-subtitle" style="justify-content: center;">
            <i data-lucide="shield-check"></i>
            <span>Compromiso Dal</span>
          </div>
          <h2 class="dal-section-title" style="margin-top: 4px;">Fibras Nobles y Confección Consciente</h2>
          <p style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">
            Ni lujo inaccesible ni fast fashion descartable: Dal reside en el punto exacto de equilibrio.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: var(--bg-card); padding: 26px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="dal-sensor-icon-box" style="margin-bottom: 16px;">
              <i data-lucide="leaf"></i>
            </div>
            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Lino 100% Orgánico Europeo</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Cosechado en parcelas rotativas sin pesticidas químicos. Su textura respira con el cuerpo y gana suavidad con cada lavado.
            </p>
          </div>

          <div style="background: var(--bg-card); padding: 26px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="dal-sensor-icon-box" style="margin-bottom: 16px; background: var(--accent-terracotta-light); color: var(--accent-terracotta);">
              <i data-lucide="feather"></i>
            </div>
            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Patronaje Fluido y Sin Rigidez</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Prendas estructuradas que no aprisionan. Diseñadas para transitar de una reunión formal a una cena relajada sin desentonar.
            </p>
          </div>

          <div style="background: var(--bg-card); padding: 26px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div class="dal-sensor-icon-box" style="margin-bottom: 16px;">
              <i data-lucide="activity"></i>
            </div>
            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Tecnología Sensorial Integrada</h4>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Interactúa con los sensores de tu dispositivo para inspeccionar la caída 3D, localizar boutiques y recibir alertas push discretas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SECCIÓN PROMINENTE: INVITACIÓN A CREARSE UNA CUENTA O INICIAR SESIÓN -->
    <section class="dal-auth-invitation-section" style="max-width: 1320px; margin: 70px auto; padding: 0 24px;">
      <div style="background: linear-gradient(135deg, #1C1B1A 0%, #2A2826 100%); border-radius: var(--radius-lg); padding: 50px 40px; color: #FAF8F4; position: relative; overflow: hidden; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 36px; align-items: center; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);">
        <!-- Decoración geométrica sutil de fondo -->
        <div style="position: absolute; right: -50px; bottom: -50px; width: 340px; height: 340px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.08); pointer-events: none;"></div>

        <div>
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: var(--radius-full); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #D8CFBF; margin-bottom: 18px;">
            <i data-lucide="sparkles" style="color: var(--accent-terracotta);"></i>
            <span>Comunidad Dal Atelier</span>
          </div>

          <h2 style="font-family: var(--font-serif); font-size: clamp(28px, 3.5vw, 44px); font-weight: 400; line-height: 1.15; margin-bottom: 16px; color: #FAF8F4;">
            ${user ? `Bienvenido de vuelta, <em>${user.name}</em>` : 'Sé Parte de Dal. <em>Eleva tu Armario.</em>'}
          </h2>

          <p style="font-size: 15px; color: #C4BFB5; line-height: 1.6; max-width: 520px; margin-bottom: 28px;">
            ${user 
              ? 'Tu cuenta está activa y sincronizada con la base de datos MySQL dal_db. Consulta tus pedidos, direcciones guardadas y privilegios de miembro.' 
              : 'Crea tu cuenta de miembro para disfrutar de un 10% de bienvenida, guardar tus siluetas en nuestra base de datos MySQL dal_db y recibir notificaciones push de prelanzamientos exclusivos.'}
          </p>

          <!-- Acciones de cuenta -->
          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            ${user ? `
              <button class="dal-btn-primary" id="home-view-profile-btn" style="background: #F8F7F4; color: #1C1B1A;">
                <i data-lucide="user-check"></i>
                <span>Ver Mi Perfil de Miembro</span>
              </button>
            ` : `
              <button class="dal-btn-primary" id="home-create-account-btn" style="background: #F8F7F4; color: #1C1B1A;">
                <i data-lucide="user-plus"></i>
                <span>Crear Cuenta Gratuita</span>
              </button>

              <button class="dal-btn-secondary" id="home-login-btn" style="background: rgba(255, 255, 255, 0.12); color: #FAF8F4; border-color: rgba(255, 255, 255, 0.25);">
                <i data-lucide="log-in"></i>
                <span>Iniciar Sesión</span>
              </button>
            `}
          </div>
        </div>

        <!-- Columna de Privilegios de Miembro -->
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-md); padding: 24px; backdrop-filter: blur(10px);">
          <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #D8CFBF; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="check-circle" style="color: var(--accent-sage);"></i>
            <span>Privilegios de la Cuenta Dal</span>
          </h4>

          <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: #E8E4DA;">
            <li style="display: flex; align-items: flex-start; gap: 10px;">
              <i data-lucide="tag" style="width: 16px; height: 16px; color: var(--accent-terracotta); flex-shrink: 0; margin-top: 2px;"></i>
              <span><strong>10% Off de Bienvenida:</strong> Descuento directo en tu primera compra.</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 10px;">
              <i data-lucide="bell" style="width: 16px; height: 16px; color: var(--accent-sage); flex-shrink: 0; margin-top: 2px;"></i>
              <span><strong>Push Exclusivo:</strong> Alertas antes de que una cápsula de lino se agote.</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 10px;">
              <i data-lucide="database" style="width: 16px; height: 16px; color: #D8CFBF; flex-shrink: 0; margin-top: 2px;"></i>
              <span><strong>Persistencia MySQL:</strong> Historial de pedidos y tallas en tabla <code>users</code>.</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 10px;">
              <i data-lucide="truck" style="width: 16px; height: 16px; color: var(--accent-sage); flex-shrink: 0; margin-top: 2px;"></i>
              <span><strong>Entrega Preferencial:</strong> Recogida express en boutiques Dal o envío prioritario.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 4. SECCIÓN DE OPINIONES DE CLIENTES / COMUNIDAD -->
    <section style="max-width: 1320px; margin: 0 auto 70px; padding: 0 24px;">
      <div class="dal-section-header">
        <div>
          <div class="dal-section-subtitle">
            <i data-lucide="message-square"></i>
            <span>Comunidad & Reseñas</span>
          </div>
          <h2 class="dal-section-title">Voces de Quienes Visten Dal</h2>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 3px; color: var(--accent-terracotta); margin-bottom: 12px;">
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
            "La sobrecamisa de lino arena tiene una caída impecable. Ni muy formal ni descuidada, exactamente el punto medio que buscaba para primavera."
          </p>
          <div style="font-size: 12px; font-weight: 600; color: var(--text-primary);">
            Rodrigo C. <span style="font-weight: 400; color: var(--text-muted);">| Ciudad de México</span>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 3px; color: var(--accent-terracotta); margin-bottom: 12px;">
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
            "La integración con sensores es una sorpresa gratificante: sacudí el teléfono y obtuve el cupón del 15%. La gabardina fluida es un 10/10."
          </p>
          <div style="font-size: 12px; font-weight: 600; color: var(--text-primary);">
            Valeria M. <span style="font-weight: 400; color: var(--text-muted);">| Madrid</span>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 3px; color: var(--accent-terracotta); margin-bottom: 12px;">
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
            <i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor;"></i>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
            "Poder descargar el script SQL para montar la base de datos MySQL localmente demuestra la seriedad del sistema. La experiencia de compra es veloz."
          </p>
          <div style="font-size: 12px; font-weight: 600; color: var(--text-primary);">
            Esteban L. <span style="font-weight: 400; color: var(--text-muted);">| Bogotá</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FOOTER ARQUITECTÓNICO DAL -->
    <footer style="background: var(--bg-contrast); color: var(--text-light); padding: 60px 24px 30px; border-top: 1px solid var(--border-subtle);">
      <div style="max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-bottom: 40px;">
        <!-- Columna Marca -->
        <div>
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
            <span style="font-family: var(--font-serif); font-size: 32px; font-weight: 600; color: #FAF8F4;">Dal</span>
            <span style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent-sage); font-weight: 600;">Atelier</span>
          </div>
          <p style="font-size: 13px; color: #A8A49C; line-height: 1.6; margin-bottom: 20px;">
            Moda contemporánea, telas vivas y balance arquitectónico. Diseñado para vestir con soltura sin perder elegancia.
          </p>
          <div style="display: flex; gap: 10px;">
            <span class="dal-device-badge" style="background: rgba(255, 255, 255, 0.1); color: #FAF8F4; border: none;">
              <i data-lucide="globe"></i>
              <span>Dal Global</span>
            </span>
          </div>
        </div>

        <!-- Columna Colecciones -->
        <div>
          <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; margin-bottom: 16px; color: #D8CFBF;">
            Colecciones
          </h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #A8A49C;">
            <li><a href="#catalog" class="footer-nav-link" data-cat="lino">Esenciales de Lino</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="sastreria">Sastrería Fluida</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="punto">Punto & Tejidos Finos</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="abrigos">Capas & Gabardinas</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="api-externa">Prendas API Conectadas</a></li>
          </ul>
        </div>

        <!-- Columna Atención & Sostenibilidad -->
        <div>
          <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; margin-bottom: 16px; color: #D8CFBF;">
            Atelier & Cuidado
          </h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #A8A49C;">
            <li><a href="#catalog" class="footer-nav-link" data-cat="lino">Guía de Tallas & Calce</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="lino">Cuidado de Fibras Orgánicas</a></li>
            <li><a href="#boutiques" class="footer-nav-boutiques">Boutiques Físicas & Recogida</a></li>
            <li><a href="#catalog" class="footer-nav-link" data-cat="lino">Empaque Biodegradable</a></li>
            ${user && user.role === 'admin' ? `
              <li><a href="#database" class="footer-nav-database" style="color: var(--accent-terra);">Panel Admin & MySQL</a></li>
            ` : ''}
          </ul>
        </div>

        <!-- Columna Boutiques & Contacto -->
        <div>
          <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; margin-bottom: 16px; color: #D8CFBF;">
            Espacios Físicos
          </h4>
          <div style="font-size: 13px; color: #A8A49C; display: flex; flex-direction: column; gap: 8px;">
            <div>Roma Norte: Colima 184, CDMX</div>
            <div>Polanco: Campos Elíseos 204, CDMX</div>
            <div>Salamanca: Claudio Coello 34, Madrid</div>
            <div>SoHo: 432 Broome St, New York</div>
            <div style="margin-top: 8px; color: var(--accent-sage);">
              <i data-lucide="check" style="width: 14px; height: 14px; display: inline;"></i> Recogida express en 15 min
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de Copyright inferior -->
      <div style="max-width: 1320px; margin: 0 auto; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; font-size: 12px; color: #75726B;">
        <div>
          &copy; 2026 Dal Atelier. Todos los derechos reservados.
        </div>
        <div style="display: flex; gap: 20px;">
          <span>Privacidad & Datos</span>
          <span>Términos de Atelier</span>
          <span>Base de Datos MySQL</span>
        </div>
      </div>
    </footer>
  `;
}

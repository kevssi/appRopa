# Dal Atelier - App Ropa (E-Commerce Móvil & Web)

Repositorio oficial de **Dal Atelier**, una aplicación de comercio electrónico de alta moda contemporánea construida con **React Native / Expo** y backend en **Node.js (Express)** con base de datos **MySQL**, pasarela de pagos **Stripe** y soporte de **sensores de hardware en tiempo real**.

- **Repositorio GitHub**: [https://github.com/kevssi/appRopa](https://github.com/kevssi/appRopa)

---

## 🌟 Características Principales

### 1. Experiencia de Compra & Catálogo Dinámico
- **Modo Invitado**: Explora libremente el catálogo sin iniciar sesión obligatoria.
- **Catálogo de 60 Prendas de Temporada**: Familias textiles de Lino Orgánico, Sastrería Fluida, Punto Suave, Capas & Outerwear, y Calzado & Cuero.
- **Promociones de Otoño**: Banners dinámicos con cupones de temporada (`DALOTO25`, `SUAVE15`, `SOST20`).
- **Buscador en Tiempo Real y Filtros**: Búsqueda por palabra clave y filtrado instantáneo por categorías.
- **Acciones Protegidas (Gating)**: Se requiere autenticación únicamente al momento de pagar en caja o al guardar favoritos en la lista de deseos.

### 2. Autenticación Simplificada
- Formulario limpio que requiere únicamente **correo electrónico** y **contraseña** (tanto para inicio de sesión como para registro).
- Persistencia de sesión con fallback seguro en memoria / almacenamiento local.
- Perfil administrativo para gestión y monitoreo.

### 3. Sensores de Hardware Nativos (`expo-sensors` & `expo-location`)
1. **Acelerómetro (Shake Detection)**:
   - Detección de agitación del teléfono ($G > 1.85$).
   - Reordena aleatoriamente el catálogo de prendas ("Shuffling de inspiración").
   - Otorga automáticamente el cupón exclusivo `SHAKE20` (20% de descuento).
   - Compatible en Web mediante la API HTML5 `devicemotion`.
2. **Giroscopio (Tilt & Parallax 3D)**:
   - Efecto de profundidad e inclinación tridimensional en las fotografías al inspeccionar una prenda.
   - En navegadores web responde fluidamente al movimiento del cursor del ratón (`mousemove`).
3. **GPS / Geolocalización en Tiempo Real**:
   - Cálculo de distancia métrica (fórmula de Haversine) a las 4 boutiques exclusivas de Dal:
     - **Dal Roma Norte** (CDMX)
     - **Dal Polanco** (CDMX)
     - **Dal Salamanca** (Madrid)
     - **Dal SoHo** (Nueva York)
   - Barra de radar en vivo en la cabecera del catálogo que muestra la boutique más cercana.
   - Opción de "Recoger en Boutique" con selección automática de la tienda más próxima.
4. **Sensor Hub**:
   - Modal interactivo con telemetría en tiempo real (valores X, Y, Z, latitud, longitud, precisión y boutique cercana).
   - Botones de simulación para pruebas de shake y cambio de ubicación sin mover el dispositivo.

### 4. Pasarela de Pagos Stripe
- Backend Express configurado con endpoints seguros:
  - `GET /api/stripe/config`: Entrega la llave pública de Stripe.
  - `POST /api/stripe/create-payment-intent`: Genera el PaymentIntent en moneda MXN/USD.
  - `POST /api/stripe/confirm-payment`: Confirmación y registro de la orden.
- Formulario de checkout con botón de **1 toque para tarjeta de prueba** (`4242 4242 4242 4242`).

### 5. Base de Datos Relacional (MySQL)
- Script integral [`dal_database.sql`](file:///c:/Users/talam/appRopa/dal_database.sql) con:
  - Tablas: `users`, `boutiques`, `categories`, `collections`, `products`, `product_variants`, `cart_items`, `wishlist`, `orders`, `order_items`, `push_subscriptions`, `sensor_interactions_log`.
  - Inserciones de datos iniciales completas para boutiques y catálogo.

---

## 📁 Estructura del Proyecto

```
appRopa/
├── App.js                   # Interfaz móvil/web completa y lógica de vistas
├── app.json                 # Configuración de Expo y manifiesto de la app
├── dal_database.sql         # Script SQL con esquema completo MySQL y datos iniciales
├── google-services.json     # Configuración para notificaciones FCM Android
├── server/
│   ├── index.js             # API REST (Express, Stripe, MySQL, FCM)
│   ├── db.js                # Conexión MySQL pool
│   └── .env                 # Variables de entorno del backend
├── src/
│   └── services/
│       ├── notifications.js # Manejador seguro de push notifications
│       └── storage.js       # Almacenamiento local multiplataforma
└── package.json             # Dependencias optimizadas para Expo Go y Web
```

---

## 🚀 Puesta en Marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el Servidor Backend (Stripe & MySQL)
```bash
npm run server
```
El servidor arrancará en `http://localhost:4000`.

### 3. Iniciar la App Móvil / Web
Para iniciar con caché limpio en Expo:
```bash
npm start -c
```
- **Web**: Presiona `w` en la consola para abrir en el navegador.
- **Celular (misma red Wi-Fi)**: Abre la cámara (iOS) o la app **Expo Go** (Android) y escanea el código QR.
- **Celular por Túnel (distinta red o hotspot)**:
  ```bash
  npm run tunnel
  ```

---

## 📱 Solución de Problemas en el Teléfono (Expo Go)

Si al escanear el QR en tu iPhone o Android aparece un mensaje de caché o error de TurboModules:
1. Cierra completamente la app **Expo Go** en tu teléfono (deslízala hacia arriba en la vista de apps abiertas).
2. En la terminal de la computadora, detén el proceso (`Ctrl + C`) y vuelve a iniciar con:
   ```bash
   npm start -c
   ```
3. Vuelve a abrir **Expo Go** y escanea el nuevo código QR.

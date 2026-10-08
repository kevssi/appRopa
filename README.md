# Dal Atelier - App Ropa (E-Commerce Móvil)

Aplicación móvil de compras en línea (e-commerce) para atelier de moda contemporánea, desarrollada con **React Native / Expo** (compatible al 100% con **Expo Go** en Android e iOS), backend en **Node.js (Express)**, base de datos relacional **MySQL** y notificaciones push vía **Firebase Cloud Messaging (FCM)**.

---

## Características Principales

1. **Modo Invitado (Página Principal Pública)**
   - Navegación fluida por el catálogo sin necesidad de iniciar sesión obligatoria.
   - Exploración de familias textiles (Lino Orgánico, Sastrería Fluida, Punto Suave, Capas & Outerwear, Calzado & Cuero).
   - Buscador en tiempo real y vista detallada de siluetas, tallas y composiciones.
   - Bolsa de compras y lista de deseos (favoritos) accesibles de inmediato.

2. **Autenticación Simplificada**
   - **Iniciar Sesión**: Acceso directo con correo y contraseña.
   - **Crear Cuenta**: Registro ágil que solo requiere correo y contraseña.
   - Alternancia rápida entre Iniciar Sesión y Registro.

3. **Modo Administrador Exclusivo**
   - Perfil protegido para dirección de atelier.
   - Panel de control con métricas, gestión de inventario de prendas y control de pedidos.
   - Vista de prueba "Ver como Cliente" y panel de emisión de notificaciones push.

4. **Notificaciones Push con Firebase (FCM)**
   - Integración nativa con `expo-notifications` y `expo-device`.
   - Soporte para notificaciones en primer plano, segundo plano y apertura de app cerrada (Cold Start).
   - Enlace directo a detalle de pedidos (ej. *"Tu pedido #123 fue enviado"*).

---

## Estructura del Proyecto

```
appRopa/
├── App.js                   # Aplicación móvil completa y diseño de vistas
├── app.json                 # Configuración de Expo y plugins de notificaciones
├── dal_database.sql         # Script SQL con esquema MySQL y datos iniciales
├── google-services.json     # Configuración de Firebase Cloud Messaging para Android
├── server/
│   ├── index.js             # API REST en Express (Auth, Pedidos, Push FCM, Telemetría)
│   ├── db.js                # Conexión con pool MySQL (dal_db)
│   └── .env.example         # Variables de entorno de base de datos
├── src/
│   └── services/
│       ├── notifications.js # Servicio de registro FCM y canales de notificación
│       └── storage.js       # Almacenamiento local con fallback en memoria
└── package.json
```

---

## Instalación y Ejecución

### 1. Dependencias
```bash
npm install
```

### 2. Iniciar la App Móvil (Expo Go)
```bash
npm start
```
Escanea el código QR que aparece en la terminal con la app **Expo Go** en tu dispositivo Android o iOS.

### 3. Iniciar el Servidor Backend (Opcional)
```bash
node server/index.js
```

### 4. Base de Datos MySQL
Importa el archivo `dal_database.sql` en tu servidor MySQL (puerto 3306) o phpMyAdmin:
```bash
mysql -u root -p < dal_database.sql
```

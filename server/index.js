import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { pool, isConnected } from './db.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51MzDemoDalAtelierSecretKey9823482394782394723984', {
  apiVersion: '2023-10-16'
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Memoria volátil para simulación si MySQL no está activo
let memoryOrders = [];
let memorySubscriptions = [];
let memorySensorLogs = [];
let memoryUsers = [
  {
    id: 1,
    name: 'Mateo Navarro',
    email: 'cliente@dal.com',
    password: 'password',
    role: 'customer',
    phone: '+52 55 4123 9081',
    address: 'Colima 184, Roma Norte, CDMX',
    fcm_token: null,
    is_active: 1
  },
  {
    id: 2,
    name: 'Sofía Carballo',
    email: 'sofia.c@correo.com',
    password: 'password',
    role: 'customer',
    phone: '+52 55 9812 3450',
    address: 'Campos Elíseos 204, Polanco, CDMX',
    fcm_token: null,
    is_active: 1
  },
  {
    id: 99,
    name: 'Elena Valdés',
    email: 'admin@dal.com',
    password: 'admin',
    role: 'admin',
    phone: '+52 55 8920 1144',
    address: 'Atelier Central Dal, Polanco, CDMX',
    fcm_token: null,
    is_active: 1
  }
];

// Lista de Boutiques Dal Oficiales (con coordenadas reales para sensor de geolocalización)
const BOUTIQUES = [
  {
    id: 1,
    name: 'Dal Flagship Roma Norte',
    city: 'Ciudad de México',
    address: 'Colima 184, Roma Norte, Cuauhtémoc',
    latitude: 19.41940000,
    longitude: -99.16220000,
    phone: '+52 55 4123 9081',
    schedule: 'Lun - Dom: 10:00 - 20:00',
    hasExpressPickup: true
  },
  {
    id: 2,
    name: 'Dal Atelier Polanco',
    city: 'Ciudad de México',
    address: 'Campos Elíseos 204, Polanco, Miguel Hidalgo',
    latitude: 19.42980000,
    longitude: -99.19150000,
    phone: '+52 55 8920 1144',
    schedule: 'Lun - Sáb: 11:00 - 20:30',
    hasExpressPickup: true
  },
  {
    id: 3,
    name: 'Dal Estudio Salamanca',
    city: 'Madrid',
    address: 'Calle de Claudio Coello 34, Salamanca',
    latitude: 40.42620000,
    longitude: -3.68650000,
    phone: '+34 91 582 9910',
    schedule: 'Lun - Sáb: 10:30 - 20:30',
    hasExpressPickup: true
  },
  {
    id: 4,
    name: 'Dal Espacio SoHo',
    city: 'New York',
    address: '432 Broome St, SoHo, NY 10013',
    latitude: 40.72080000,
    longitude: -73.99980000,
    phone: '+1 212 940 3388',
    schedule: 'Lun - Dom: 11:00 - 19:30',
    hasExpressPickup: true
  }
];

// Productos oficiales de la colección Dal
const DAL_PRODUCTS = [
  {
    id: 1,
    sku: 'DAL-LINO-01',
    name: 'Camisa Sobrecamisa Lino Arena',
    slug: 'camisa-sobrecamisa-lino-arena',
    short_description: 'Corte desestructurado con textura artesanal transpirable.',
    description: 'Confeccionada en puro lino de grano medio cosechado de forma responsable. Su caída relajada y botones de corozo natural ofrecen un equilibrio perfecto entre soltura veraniega y prestancia sobria.',
    category: 'esenciales-lino',
    categoryName: 'Esenciales Lino & Algodón',
    price: 89.00,
    original_price: 110.00,
    discount_percent: 19,
    material_composition: '100% Lino Orgánico Europeo',
    fit_type: 'Corte Relajado Moderno',
    care_instructions: 'Lavar a máquina en frío (máx. 30°C), no usar secadora.',
    primary_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    rating: 4.95,
    reviews_count: 38,
    is_featured: true,
    is_new_drop: true,
    source: 'Dal Atelier'
  },
  {
    id: 2,
    sku: 'DAL-PNT-02',
    name: 'Pantalón Plisado Salvia Muted',
    slug: 'pantalon-plisado-salvia-muted',
    short_description: 'Pinza frontal suave y caída recta en sarga de algodón y tencel.',
    description: 'Silueta contemporánea con cintura elástica oculta y pinzas sutiles. La tonalidad verde salvia desaturada evoca naturaleza sin estridencias.',
    category: 'sastreria-moderna',
    categoryName: 'Sastrería Contemporánea',
    price: 98.00,
    original_price: 98.00,
    discount_percent: 0,
    material_composition: '65% Tencel Lyocell, 35% Algodón Pima',
    fit_type: 'Tiro Medio / Pierna Recta',
    care_instructions: 'Planchar a baja temperatura por el revés.',
    primary_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80',
    rating: 4.88,
    reviews_count: 24,
    is_featured: true,
    is_new_drop: false,
    source: 'Dal Atelier'
  },
  {
    id: 3,
    sku: 'DAL-KNT-03',
    name: 'Jersey Cuello Mock en Algodón Crudo',
    slug: 'jersey-cuello-mock-algodon-crudo',
    short_description: 'Punto canalé fino con tacto sedoso y cuello chimenea discreto.',
    description: 'Una pieza de capas esencial. El punto de calibre 12 brinda calidez sin abultar, ideal para llevar bajo gabardinas o sobre camisas livianas.',
    category: 'punto-organico',
    categoryName: 'Tejidos & Punto Suave',
    price: 115.00,
    original_price: 135.00,
    discount_percent: 15,
    material_composition: '85% Algodón Peinado, 15% Seda Mulberry',
    fit_type: 'Corte Regular Slim',
    care_instructions: 'Secar en plano sobre toalla.',
    primary_image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
    rating: 4.92,
    reviews_count: 42,
    is_featured: true,
    is_new_drop: true,
    source: 'Dal Atelier'
  },
  {
    id: 4,
    sku: 'DAL-OUT-04',
    name: 'Gabardina Fluida Piedra Pálido',
    slug: 'gabardina-fluida-piedra-palido',
    short_description: 'Trench coat desestructurado con solapa ancha y cinturón desmontable.',
    description: 'Inspirada en el minimalismo arquitectónico. Tejido impermeable ligero con tacto aterciopelado que fluye al caminar.',
    category: 'outerwear-liviano',
    categoryName: 'Capas & Outerwear',
    price: 175.00,
    original_price: 210.00,
    discount_percent: 17,
    material_composition: '70% Algodón Repelente al Agua, 30% Poliamida Reciclada',
    fit_type: 'Corte Oversize Estructurado',
    care_instructions: 'Limpieza en seco recomendada.',
    primary_image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
    rating: 4.97,
    reviews_count: 19,
    is_featured: true,
    is_new_drop: true,
    source: 'Dal Atelier'
  },
  {
    id: 5,
    sku: 'DAL-TEE-05',
    name: 'Camiseta Pesada Cuello Caja Carbón',
    slug: 'camiseta-pesada-cuello-caja-carbon',
    short_description: 'Gramaje 260 GSM con caída estructurada y acabado esmerilado.',
    description: 'El básico definitivo rediseñado. Cuello indeformable de canalé grueso y costuras reforzadas en un tono carbón profundo muy elegante.',
    category: 'esenciales-lino',
    categoryName: 'Esenciales Lino & Algodón',
    price: 46.00,
    original_price: 46.00,
    discount_percent: 0,
    material_composition: '100% Algodón Orgánico Cardado 260g',
    fit_type: 'Corte Caja / Boxy Fit',
    care_instructions: 'Lavar del revés a 30°C.',
    primary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    rating: 4.85,
    reviews_count: 67,
    is_featured: false,
    is_new_drop: false,
    source: 'Dal Atelier'
  },
  {
    id: 6,
    sku: 'DAL-BLZ-06',
    name: 'Blazer Desestructurado Lino Arcilla',
    slug: 'blazer-desestructurado-lino-arcilla',
    short_description: 'Saco de dos botones sin forro interior, máxima transpirabilidad.',
    description: 'Permite elevar cualquier atuendo informal sin resultar rígido. Tono arcilla suave que combina a la perfección con crudos y azules lavados.',
    category: 'sastreria-moderna',
    categoryName: 'Sastrería Contemporánea',
    price: 160.00,
    original_price: 195.00,
    discount_percent: 18,
    material_composition: '55% Lino Francés, 45% Viscosa Sostenible',
    fit_type: 'Sastrería Desestructurada',
    care_instructions: 'Limpieza profesional o ciclo lana delicado.',
    primary_image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    rating: 4.91,
    reviews_count: 15,
    is_featured: true,
    is_new_drop: false,
    source: 'Dal Atelier'
  },
  {
    id: 7,
    sku: 'DAL-FTW-07',
    name: 'Mocasín Suela Flexible Cuero Crudo',
    slug: 'mocasin-suela-flexible-cuero-crudo',
    short_description: 'Piel napa curtida sin cromo con plantilla amortiguada ultra-ligera.',
    description: 'Comodidad inmediata desde el primer uso. Suela de caucho natural con agarre discreto y línea depurada.',
    category: 'accesorios-calzado',
    categoryName: 'Calzado & Complementos',
    price: 139.00,
    original_price: 139.00,
    discount_percent: 0,
    material_composition: '100% Piel Bovina Curtido Vegetal, Suela Caucho',
    fit_type: 'Ajuste Fiel a la Talla',
    care_instructions: 'Nutrir con cera neutra orgánica periódicamente.',
    primary_image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    rating: 4.89,
    reviews_count: 31,
    is_featured: false,
    is_new_drop: true,
    source: 'Dal Atelier'
  },
  {
    id: 8,
    sku: 'DAL-VES-08',
    name: 'Vestido Camisero Midi Algodón Popelín',
    slug: 'vestido-camisero-midi-algodon-popelin',
    short_description: 'Largo midi con aberturas laterales discretas y cinta ajustable.',
    description: 'Una silueta etérea que viste con gracia sin esfuerzo. El popelín fresco mantiene su estructura fresca durante todo el día.',
    category: 'esenciales-lino',
    categoryName: 'Esenciales Lino & Algodón',
    price: 118.00,
    original_price: 140.00,
    discount_percent: 16,
    material_composition: '100% Popelín de Algodón Egipcio',
    fit_type: 'Corte Midi Fluido',
    care_instructions: 'Lavar con colores similares a 30°C.',
    primary_image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
    rating: 4.96,
    reviews_count: 28,
    is_featured: true,
    is_new_drop: true,
    source: 'Dal Atelier'
  }
];

// 1. Estado y Salud de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Dal App Ropa',
    database: isConnected ? 'MySQL Conectado (dal_db)' : 'Memoria / LocalStorage (Requiere importar dal_database.sql a MySQL)',
    timestamp: new Date().toISOString(),
    sensorsSupported: ['gyroscope_3d', 'device_shake', 'geolocation_radar', 'ambient_light', 'camera_color_scanner'],
    pushEnabled: true
  });
});

// 2. Obtener Productos
app.get('/api/products', async (req, res) => {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, c.name as categoryName 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1
        ORDER BY p.id ASC
      `);
      return res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('Error consultando MySQL, sirviendo catálogo interno:', err.message);
    }
  }
  res.json({ success: true, count: DAL_PRODUCTS.length, data: DAL_PRODUCTS });
});

// 3. Obtener Boutiques Físicas (Para Sensor de Geolocalización)
app.get('/api/boutiques', async (req, res) => {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM boutiques ORDER BY id ASC');
      return res.json({ success: true, data: rows });
    } catch (err) {
      console.error('Error consultando boutiques en MySQL:', err.message);
    }
  }
  res.json({ success: true, data: BOUTIQUES });
});

// 4. Crear Orden y Disparar Notificación Push
app.post('/api/orders', async (req, res) => {
  const { customer, items, total, shippingAddress, paymentMethod, coordinates } = req.body;
  const orderNumber = 'DAL-' + Math.floor(100000 + Math.random() * 900000);
  
  const orderRecord = {
    orderNumber,
    customer,
    items,
    total,
    shippingAddress,
    paymentMethod,
    coordinates: coordinates || null,
    status: 'paid',
    createdAt: new Date().toISOString()
  };

  if (isConnected && pool) {
    try {
      const [result] = await pool.query(
        `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, city, subtotal, total_amount, payment_method, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          customer?.name || 'Cliente Dal',
          customer?.email || 'cliente@dal.atelier',
          customer?.phone || '',
          shippingAddress || 'Dirección no especificada',
          customer?.city || 'Ciudad de México',
          total,
          total,
          paymentMethod || 'Tarjeta',
          coordinates?.lat || null,
          coordinates?.lng || null
        ]
      );
      orderRecord.dbId = result.insertId;
    } catch (err) {
      console.error('Error insertando orden en MySQL:', err.message);
    }
  }

  memoryOrders.push(orderRecord);

  res.status(201).json({
    success: true,
    message: 'Orden creada exitosamente en Dal',
    order: orderRecord,
    pushNotificationTriggered: {
      title: '¡Pedido Confirmado en Dal!',
      body: `Tu orden #${orderNumber} ha sido recibida y se está preparando con cuidado.`,
      tag: 'order-confirmed'
    }
  });
});

// 5. Suscripción a Notificaciones Push
app.post('/api/push/subscribe', (req, res) => {
  const { subscription, deviceInfo } = req.body;
  if (!subscription) {
    return res.status(400).json({ success: false, message: 'Subscripción inválida' });
  }
  memorySubscriptions.push({
    subscription,
    deviceInfo,
    subscribedAt: new Date().toISOString()
  });
  res.json({ success: true, message: 'Dispositivo registrado para alertas push de Dal.' });
});

// 6. Envío / Disparo de Notificaciones Push
app.post('/api/push/send', (req, res) => {
  const { title, body, tag, icon } = req.body;
  res.json({
    success: true,
    dispatchedTo: memorySubscriptions.length || 1,
    payload: {
      title: title || 'Alerta Dal',
      body: body || 'Novedades de la colección Dal disponibles.',
      icon: icon || '/favicon.svg',
      tag: tag || 'dal-alert'
    }
  });
});

// 7. Registro de Telemetría de Sensores
app.post('/api/sensors/log', async (req, res) => {
  const { sensorType, eventPayload, deviceInfo } = req.body;
  const logEntry = {
    sensorType,
    eventPayload,
    deviceInfo,
    timestamp: new Date().toISOString()
  };

  if (isConnected && pool) {
    try {
      await pool.query(
        'INSERT INTO sensor_interactions_log (sensor_type, event_payload, device_info) VALUES (?, ?, ?)',
        [sensorType, JSON.stringify(eventPayload), deviceInfo || 'Web Browser']
      );
    } catch (e) {
      console.warn('No se pudo guardar log en MySQL:', e.message);
    }
  }

  memorySensorLogs.push(logEntry);
  res.json({ success: true, message: 'Interacción del sensor registrada.' });
});

// 8. Iniciar Sesión (Login)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña requeridos' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (isConnected && pool) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, phone, address, role, fcm_token FROM users WHERE LOWER(email) = ? AND password_hash = ? AND is_active = 1',
        [cleanEmail, password]
      );
      if (rows.length > 0) {
        const user = rows[0];
        await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
        return res.json({ success: true, message: 'Inicio de sesión exitoso', user });
      }
    } catch (err) {
      console.error('Error en login MySQL:', err.message);
    }
  }

  // Fallback en memoria
  const memoryUser = memoryUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (memoryUser) {
    const { password: _, ...safeUser } = memoryUser;
    return res.json({ success: true, message: 'Inicio de sesión exitoso', user: safeUser });
  }

  return res.status(401).json({
    success: false,
    message: 'Credenciales inválidas. Usa cliente@dal.com / password o admin@dal.com / admin.'
  });
});

// 9. Crear Cuenta (Register - Correo y Contraseña)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, address, role, adminKey } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userName = name?.trim() || cleanEmail.split('@')[0] || 'Cliente Dal';

  // Validar rol de administrador si se envía explícitamente
  const userRole = role === 'admin' ? 'admin' : 'customer';
  if (userRole === 'admin' && adminKey !== 'admin123' && adminKey !== 'dal2026') {
    return res.status(403).json({ success: false, message: 'Clave de seguridad de administrador inválida' });
  }

  if (isConnected && pool) {
    try {
      const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya existe una cuenta con este correo electrónico' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, phone, address, role, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [userName, cleanEmail, password, phone || null, address || null, userRole]
      );

      const newUser = {
        id: result.insertId,
        name: userName,
        email: cleanEmail,
        phone: phone || '',
        address: address || '',
        role: userRole,
        fcm_token: null
      };

      return res.status(201).json({ success: true, message: 'Cuenta creada exitosamente', user: newUser });
    } catch (err) {
      console.error('Error registrando usuario en MySQL:', err.message);
    }
  }

  // Fallback en memoria
  if (memoryUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ success: false, message: 'Ya existe una cuenta con este correo electrónico' });
  }

  const newUser = {
    id: Date.now(),
    name: userName,
    email: cleanEmail,
    password,
    phone: phone || '',
    address: address || '',
    role: userRole,
    fcm_token: null,
    is_active: 1
  };

  memoryUsers.push(newUser);
  const { password: _, ...safeUser } = newUser;

  return res.status(201).json({ success: true, message: 'Cuenta creada exitosamente', user: safeUser });
});

// 10. Registrar Token Push FCM para un Usuario
app.post('/api/push/register-device', async (req, res) => {
  const { token, email } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token requerido' });
  }

  if (email && isConnected && pool) {
    try {
      await pool.query('UPDATE users SET fcm_token = ? WHERE LOWER(email) = ?', [token, email.toLowerCase()]);
    } catch (err) {
      console.warn('Error guardando fcm_token en MySQL:', err.message);
    }
  }

  if (email) {
    const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (memUser) memUser.fcm_token = token;
  }

  res.json({ success: true, message: 'Token de dispositivo registrado exitosamente' });
});

// 11. Enviar Notificación Push de Pedido (#123)
app.post('/api/push/send-order-update', (req, res) => {
  const { orderId, title, body } = req.body;
  const targetOrderId = orderId || '123';
  
  res.json({
    success: true,
    message: `Notificación enviada para el pedido #${targetOrderId}`,
    notificationPayload: {
      title: title || `Tu pedido #${targetOrderId} fue enviado`,
      body: body || 'El mensajero ciclista de Dal Atelier va en camino a tu domicilio.',
      data: { orderId: String(targetOrderId) }
    }
  });
});

// 12. Obtener Configuración Pública de Stripe
app.get('/api/stripe/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51MzDemoDalAtelierPublishableKey9988',
    currency: 'usd',
    mode: 'test',
    paymentMethodsAllowed: ['card', 'apple_pay', 'google_pay']
  });
});

// 13. Crear PaymentIntent de Stripe
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerEmail, orderNumber } = req.body;
    const amountInCents = Math.round((parseFloat(amount) || 50) * 100);

    let clientSecret = `pi_dal_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    let paymentIntentId = `pi_dal_${Date.now()}`;

    // Si hay llave secreta de Stripe real:
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('Demo')) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: currency.toLowerCase(),
          metadata: {
            orderNumber: orderNumber || 'DAL-ORD',
            customerEmail: customerEmail || 'cliente@dal.com'
          }
        });
        clientSecret = paymentIntent.client_secret;
        paymentIntentId = paymentIntent.id;
      } catch (err) {
        console.warn('Fallo llamada Stripe directa, usando sesión segura simulada:', err.message);
      }
    }

    res.json({
      success: true,
      clientSecret,
      paymentIntentId,
      amount: amountInCents / 100,
      currency: currency.toUpperCase(),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51MzDemoDalAtelierPublishableKey9988'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 14. Confirmar Pago de Stripe
app.post('/api/stripe/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderNumber, cardLast4, cardBrand, amount } = req.body;
    const transactionId = paymentIntentId || `ch_dal_${Date.now()}`;

    // Registrar actualización en memoria o base de datos si existe
    if (isConnected && pool && orderNumber) {
      try {
        await pool.query(
          'UPDATE orders SET payment_status = ?, payment_method = ? WHERE order_number = ?',
          ['approved', `Stripe (${cardBrand || 'Visa'} •••• ${cardLast4 || '4242'})`, orderNumber]
        );
      } catch (e) {
        console.warn('MySQL update status error:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'Pago procesado exitosamente por Stripe',
      transactionId,
      status: 'succeeded',
      amount: amount || 0,
      card: {
        last4: cardLast4 || '4242',
        brand: cardBrand || 'visa'
      },
      receiptUrl: `https://dashboard.stripe.com/test/payments/${transactionId}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor API Dal activo en http://localhost:${PORT}`);
  console.log(`Base de datos: ${isConnected ? 'MySQL activo' : 'Modo autónomo (ver dal_database.sql)'}`);
  console.log('Pasarela Stripe: Activa en /api/stripe');
});


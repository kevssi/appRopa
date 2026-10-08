-- ==========================================================
-- DAL CLOTHING - BASE DE DATOS OFICIAL (MYSQL)
-- Aplicación Web & Móvil Dal - Sistema E-Commerce & Sensores
-- ==========================================================
-- Codificación recomendada: utf8mb4
-- Compatible con MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+

CREATE DATABASE IF NOT EXISTS `dal_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `dal_db`;

-- Desactivar temporalmente revisión de llaves foráneas para reinicio limpio
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `sensor_interactions_log`;
DROP TABLE IF EXISTS `push_notifications_log`;
DROP TABLE IF EXISTS `push_subscriptions`;
DROP TABLE IF EXISTS `external_api_sync_log`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `wishlist`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `collections`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `boutiques`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 1. TABLA: USERS (Clientes y Administradores)
-- ----------------------------------------------------------
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `role` ENUM('customer', 'admin', 'editor') DEFAULT 'customer',
    `avatar_url` VARCHAR(255) NULL,
    `preferred_style` VARCHAR(80) DEFAULT 'minimalist',
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. TABLA: CATEGORIES (Categorías de Vestimenta)
-- ----------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(80) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `cover_image` VARCHAR(255) NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. TABLA: COLLECTIONS (Colecciones Temporales Dal)
-- ----------------------------------------------------------
CREATE TABLE `collections` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(80) NOT NULL UNIQUE,
    `title` VARCHAR(120) NOT NULL,
    `subtitle` VARCHAR(200) NULL,
    `season` VARCHAR(50) DEFAULT 'Atelier Continuo',
    `is_active` BOOLEAN DEFAULT TRUE,
    `banner_image` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. TABLA: PRODUCTS (Prendas y Calzado)
-- ----------------------------------------------------------
CREATE TABLE `products` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sku` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(180) NOT NULL UNIQUE,
    `short_description` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `collection_id` INT UNSIGNED NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) NULL,
    `discount_percent` INT DEFAULT 0,
    `material_composition` VARCHAR(180) DEFAULT '100% Fibras Orgánicas',
    `fit_type` VARCHAR(80) DEFAULT 'Corte Relajado',
    `care_instructions` VARCHAR(255) DEFAULT 'Lavar en frío con ciclo delicado, secar a la sombra.',
    `primary_image` VARCHAR(255) NOT NULL,
    `secondary_image` VARCHAR(255) NULL,
    `rating` DECIMAL(3, 2) DEFAULT 4.90,
    `reviews_count` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_new_drop` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `external_api_id` VARCHAR(100) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_products_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE SET NULL,
    INDEX `idx_product_category` (`category_id`),
    INDEX `idx_product_featured` (`is_featured`),
    INDEX `idx_product_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. TABLA: PRODUCT_VARIANTS (Tallas, Colores y Stock)
-- ----------------------------------------------------------
CREATE TABLE `product_variants` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL,
    `size` ENUM('XS', 'S', 'M', 'L', 'XL', 'Única') NOT NULL,
    `color_name` VARCHAR(60) NOT NULL,
    `color_hex` VARCHAR(10) NOT NULL DEFAULT '#000000',
    `stock_quantity` INT NOT NULL DEFAULT 10,
    `sku_variant` VARCHAR(80) NOT NULL UNIQUE,
    CONSTRAINT `fk_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    INDEX `idx_variant_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. TABLA: BOUTIQUES (Tiendas físicas para Geolocation Sensor)
-- ----------------------------------------------------------
CREATE TABLE `boutiques` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `schedule` VARCHAR(120) DEFAULT 'Lun - Dom: 10:00 - 20:00',
    `has_express_pickup` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. TABLA: ORDERS (Órdenes y Pedidos)
-- ----------------------------------------------------------
CREATE TABLE `orders` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(30) NOT NULL UNIQUE,
    `user_id` INT UNSIGNED NULL,
    `customer_name` VARCHAR(120) NOT NULL,
    `customer_email` VARCHAR(150) NOT NULL,
    `customer_phone` VARCHAR(30) NULL,
    `shipping_address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `latitude` DECIMAL(10, 8) NULL,
    `longitude` DECIMAL(11, 8) NULL,
    `status` ENUM('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `shipping_fee` DECIMAL(10, 2) DEFAULT 0.00,
    `discount_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) DEFAULT 'Tarjeta / Apple Pay',
    `payment_status` ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_order_number` (`order_number`),
    INDEX `idx_order_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. TABLA: ORDER_ITEMS (Detalles de Productos en Orden)
-- ----------------------------------------------------------
CREATE TABLE `order_items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `product_name` VARCHAR(160) NOT NULL,
    `selected_size` VARCHAR(10) NOT NULL,
    `selected_color` VARCHAR(50) NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `total_price` DECIMAL(10, 2) NOT NULL,
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. TABLA: PUSH_SUBSCRIPTIONS (Dispositivos suscritos a Push)
-- ----------------------------------------------------------
CREATE TABLE `push_subscriptions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `endpoint` TEXT NOT NULL,
    `p256dh_key` VARCHAR(255) NULL,
    `auth_key` VARCHAR(255) NULL,
    `device_type` ENUM('web_desktop', 'mobile_android', 'mobile_ios', 'unknown') DEFAULT 'web_desktop',
    `user_agent` VARCHAR(255) NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_push_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 10. TABLA: PUSH_NOTIFICATIONS_LOG (Historial de Envíos Push)
-- ----------------------------------------------------------
CREATE TABLE `push_notifications_log` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(160) NOT NULL,
    `body` TEXT NOT NULL,
    `icon_url` VARCHAR(255) DEFAULT '/favicon.ico',
    `target_url` VARCHAR(255) DEFAULT '/',
    `category_tag` VARCHAR(60) DEFAULT 'dal_general',
    `sent_count` INT DEFAULT 1,
    `status` ENUM('queued', 'sent', 'failed') DEFAULT 'sent',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 11. TABLA: SENSOR_INTERACTIONS_LOG (Telemetría de Sensores)
-- Registra eventos de giroscopio, acelerómetro/sacudida, GPS y cámara
-- ----------------------------------------------------------
CREATE TABLE `sensor_interactions_log` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `sensor_type` ENUM('gyroscope_3d', 'device_shake', 'geolocation_radar', 'camera_color_scanner', 'ambient_light') NOT NULL,
    `event_payload` JSON NULL,
    `device_info` VARCHAR(150) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_sensor_type` (`sensor_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 12. TABLA: EXTERNAL_API_SYNC_LOG (Sincronización con APIs de Ropa)
-- ----------------------------------------------------------
CREATE TABLE `external_api_sync_log` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `api_source` VARCHAR(80) NOT NULL, -- Platzi Fake Store API, FakeStoreAPI, etc.
    `items_synced` INT DEFAULT 0,
    `status` ENUM('success', 'warning', 'error') DEFAULT 'success',
    `response_snippet` TEXT NULL,
    `synced_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- REGISTROS INICIALES / SEED DATA PARA DAL
-- ==========================================================

-- Categorías
INSERT INTO `categories` (`id`, `slug`, `name`, `description`, `cover_image`, `display_order`) VALUES
(1, 'esenciales-lino', 'Esenciales Lino & Algodón', 'Prendas con textura natural, frescas y atemporales.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 1),
(2, 'punto-organico', 'Tejidos & Punto Suave', 'Prendas de media estación tejidas en hilos finos y sostenibles.', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', 2),
(3, 'sastreria-moderna', 'Sastrería Contemporánea', 'Cortes relajados y siluetas fluidas sin rigidez.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', 3),
(4, 'outerwear-liviano', 'Capas & Outerwear', 'Abrigos ligeros, sobrecamisas y gabardinas estructuradas.', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80', 4),
(5, 'accesorios-calzado', 'Calzado & Complementos', 'Cuero vegetal, siluetas minimalistas y accesorios versátiles.', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80', 5);

-- Colecciones
INSERT INTO `collections` (`id`, `slug`, `title`, `subtitle`, `season`, `is_active`, `banner_image`) VALUES
(1, 'dal-origenes', 'Dal Origines 2026', 'Texturas puras, paleta arena, salvia y carbón mate.', 'Primavera / Verano 2026', 1, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'),
(2, 'calma-urbana', 'Calma Urbana', 'Elegancia funcional pensada para el movimiento continuo.', 'Edición Limitada', 1, 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80');

-- Boutiques Dal (Para Geolocation Sensor)
INSERT INTO `boutiques` (`id`, `name`, `city`, `address`, `latitude`, `longitude`, `phone`, `schedule`) VALUES
(1, 'Dal Flagship Roma Norte', 'Ciudad de México', 'Colima 184, Roma Norte, Cuauhtémoc', 19.41940000, -99.16220000, '+52 55 4123 9081', 'Lun - Dom: 10:00 - 20:00'),
(2, 'Dal Atelier Polanco', 'Ciudad de México', 'Campos Elíseos 204, Polanco, Miguel Hidalgo', 19.42980000, -99.19150000, '+52 55 8920 1144', 'Lun - Sáb: 11:00 - 20:30'),
(3, 'Dal Estudio Salamanca', 'Madrid', 'Calle de Claudio Coello 34, Salamanca', 40.42620000, -3.68650000, '+34 91 582 9910', 'Lun - Sáb: 10:30 - 20:30'),
(4, 'Dal Espacio SoHo', 'New York', '432 Broome St, SoHo, NY 10013', 40.72080000, -73.99980000, '+1 212 940 3388', 'Lun - Dom: 11:00 - 19:30');

-- Productos Dal
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `short_description`, `description`, `category_id`, `collection_id`, `price`, `original_price`, `discount_percent`, `material_composition`, `fit_type`, `care_instructions`, `primary_image`, `secondary_image`, `rating`, `reviews_count`, `is_featured`, `is_new_drop`) VALUES
(1, 'DAL-LINO-01', 'Camisa Sobrecamisa Lino Arena', 'camisa-sobrecamisa-lino-arena', 'Corte desestructurado con textura artesanal transpirable.', 'Confeccionada en puro lino de grano medio cosechado de forma responsable. Su caída relajada y botones de corozo natural ofrecen un equilibrio perfecto entre soltura veraniega y prestancia sobria.', 1, 1, 89.00, 110.00, 19, '100% Lino Orgánico Europeo', 'Corte Relajado Moderno', 'Lavar a máquina en frío (máx. 30°C), no usar secadora.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 4.95, 38, 1, 1),
(2, 'DAL-PNT-02', 'Pantalón Plisado Salvia Muted', 'pantalon-plisado-salvia-muted', 'Pinza frontal suave y caída recta en sarga de algodón y tencel.', 'Silueta contemporánea con cintura elástica oculta y pinzas sutiles. La tonalidad verde salvia desaturada evoca naturaleza sin estridencias.', 3, 1, 98.00, 98.00, 0, '65% Tencel Lyocell, 35% Algodón Pima', 'Tiro Medio / Pierna Recta', 'Planchar a baja temperatura por el revés.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80', 4.88, 24, 1, 0),
(3, 'DAL-KNT-03', 'Jersey Cuello Mock en Algodón Crudo', 'jersey-cuello-mock-algodon-crudo', 'Punto canalé fino con tacto sedoso y cuello chimenea discreto.', 'Una pieza de capas esencial. El punto de calibre 12 brinda calidez sin abultar, ideal para llevar bajo gabardinas o sobre camisas livianas.', 2, 1, 115.00, 135.00, 15, '85% Algodón Peinado, 15% Seda Mulberry', 'Corte Regular Slim', 'Secar en plano sobre toalla.', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80', 4.92, 42, 1, 1),
(4, 'DAL-OUT-04', 'Gabardina Fluida Piedra Pálido', 'gabardina-fluida-piedra-palido', 'Trench coat desestructurado con solapa ancha y cinturón desmontable.', 'Inspirada en el minimalismo arquitectónico. Tejido impermeable ligero con tacto aterciopelado que fluye al caminar.', 4, 2, 175.00, 210.00, 17, '70% Algodón Repelente al Agua, 30% Poliamida Reciclada', 'Corte Oversize Estructurado', 'Limpieza en seco recomendada.', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80', 4.97, 19, 1, 1),
(5, 'DAL-TEE-05', 'Camiseta Pesada Cuello Caja Carbón', 'camiseta-pesada-cuello-caja-carbon', 'Gramaje 260 GSM con caída estructurada y acabado esmerilado.', 'El básico definitivo rediseñado. Cuello indeformable de canalé grueso y costuras reforzadas en un tono carbón profundo muy elegante.', 1, 1, 46.00, 46.00, 0, '100% Algodón Orgánico Cardado 260g', 'Corte Caja / Boxy Fit', 'Lavar del revés a 30°C.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 4.85, 67, 0, 0),
(6, 'DAL-BLZ-06', 'Blazer Desestructurado Lino Arcilla', 'blazer-desestructurado-lino-arcilla', 'Saco de dos botones sin forro interior, máxima transpirabilidad.', 'Permite elevar cualquier atuendo informal sin resultar rígido. Tono arcilla suave que combina a la perfección con crudos y azules lavados.', 3, 2, 160.00, 195.00, 18, '55% Lino Francés, 45% Viscosa Sostenible', 'Sastrería Desestructurada', 'Limpieza profesional o ciclo lana delicado.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 4.91, 15, 1, 0),
(7, 'DAL-FTW-07', 'Mocasín Suela Flexible Cuero Crudo', 'mocasin-suela-flexible-cuero-crudo', 'Piel napa curtida sin cromo con plantilla amortiguada ultra-ligera.', 'Comodidad inmediata desde el primer uso. Suela de caucho natural con agarre discreto y línea depurada.', 5, 2, 139.00, 139.00, 0, '100% Piel Bovina Curtido Vegetal, Suela Caucho', 'Ajuste Fiel a la Talla', 'Nutrir con cera neutra orgánica periódicamente.', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80', 4.89, 31, 0, 1),
(8, 'DAL-VES-08', 'Vestido Camisero Midi Algodón Popelín', 'vestido-camisero-midi-algodon-popelin', 'Largo midi con aberturas laterales discretas y cinta ajustable.', 'Una silueta etérea que viste con gracia sin esfuerzo. El popelín fresco mantiene su estructura fresca durante todo el día.', 1, 1, 118.00, 140.00, 16, '100% Popelín de Algodón Egipcio', 'Corte Midi Fluido', 'Lavar con colores similares a 30°C.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80', 4.96, 28, 1, 1);

-- Variantes de Productos
INSERT INTO `product_variants` (`product_id`, `size`, `color_name`, `color_hex`, `stock_quantity`, `sku_variant`) VALUES
(1, 'S', 'Arena Natural', '#E4DFD3', 14, 'DAL-LINO-01-S-ARENA'),
(1, 'M', 'Arena Natural', '#E4DFD3', 22, 'DAL-LINO-01-M-ARENA'),
(1, 'L', 'Arena Natural', '#E4DFD3', 18, 'DAL-LINO-01-L-ARENA'),
(1, 'M', 'Verde Salvia', '#8A9A86', 15, 'DAL-LINO-01-M-SALVIA'),
(2, 'S', 'Salvia Muted', '#8A9A86', 10, 'DAL-PNT-02-S-SALVIA'),
(2, 'M', 'Salvia Muted', '#8A9A86', 16, 'DAL-PNT-02-M-SALVIA'),
(2, 'L', 'Salvia Muted', '#8A9A86', 12, 'DAL-PNT-02-L-SALVIA'),
(3, 'S', 'Crudo Marfil', '#F4F2EB', 20, 'DAL-KNT-03-S-CRUDO'),
(3, 'M', 'Crudo Marfil', '#F4F2EB', 25, 'DAL-KNT-03-M-CRUDO'),
(3, 'L', 'Crudo Marfil', '#F4F2EB', 15, 'DAL-KNT-03-L-CRUDO'),
(4, 'M', 'Piedra Pálido', '#D8D4CC', 8, 'DAL-OUT-04-M-PIEDRA'),
(4, 'L', 'Piedra Pálido', '#D8D4CC', 11, 'DAL-OUT-04-L-PIEDRA'),
(5, 'S', 'Carbón Mate', '#242426', 30, 'DAL-TEE-05-S-CARBON'),
(5, 'M', 'Carbón Mate', '#242426', 45, 'DAL-TEE-05-M-CARBON'),
(5, 'L', 'Carbón Mate', '#242426', 35, 'DAL-TEE-05-L-CARBON'),
(6, 'M', 'Arcilla Terracota', '#B77C68', 9, 'DAL-BLZ-06-M-ARCILLA'),
(7, 'M', 'Cuero Canela', '#A06E4D', 14, 'DAL-FTW-07-M-CANELA'),
(8, 'S', 'Blanco Óptico Calmo', '#FBFBFB', 12, 'DAL-VES-08-S-BLANCO'),
(8, 'M', 'Blanco Óptico Calmo', '#FBFBFB', 18, 'DAL-VES-08-M-BLANCO');

-- Plantillas y Registros de Push Notifications
INSERT INTO `push_notifications_log` (`title`, `body`, `category_tag`, `sent_count`, `status`) VALUES
('Dal Capsule: Nueva Entrega de Lino', 'Descubre 4 siluetas frescas confeccionadas en fibras orgánicas.', 'dal_drops', 1420, 'sent'),
('Tu pedido #DAL-8921 va en camino', 'El mensajero ciclista está a 15 minutos de tu ubicación.', 'dal_orders', 1, 'sent'),
('Sensor de Movimiento: Descuento Descubierto', 'Has desbloqueado un 15% de cortesía por interactuar con Dal Studio.', 'dal_sensor_rewards', 85, 'sent');

-- Logs de Sensores de Ejemplo
INSERT INTO `sensor_interactions_log` (`sensor_type`, `event_payload`, `device_info`) VALUES
('gyroscope_3d', '{"tilt_x": 12.4, "tilt_y": -8.1, "fabric_sheen_rendered": true}', 'Mobile Safari iOS 18'),
('device_shake', '{"threshold": 18.5, "unlocked_perk": "FRESH15", "vibration_fired": true}', 'Chrome Mobile Android 15'),
('geolocation_radar', '{"distance_km": 1.8, "nearest_boutique": "Dal Flagship Roma Norte"}', 'PWA Geolocation API'),
('ambient_light', '{"lux": 45, "adaptive_theme": "dal_dusk"}', 'Ambient Light Sensor W3C');

-- ==========================================================
-- FIN DEL SCRIPT DE BASE DE DATOS DAL
-- ==========================================================

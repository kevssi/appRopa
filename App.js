import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import {
  ShoppingBag,
  Search,
  Heart,
  Plus,
  Minus,
  X,
  Layers,
  Sparkles,
  Compass,
  Navigation,
  Radio,
  Zap,
  User,
  Bell,
  ArrowRight,
  MapPin,
  Check,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Tag,
  Clock,
  Phone,
  Lock,
  Mail,
  LogIn,
  LogOut,
  Package,
  PackageCheck,
  PackagePlus,
  Eye,
  EyeOff
} from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as Location from 'expo-location';
import { registerForPushNotificationsAsync, sendTokenToBackend } from './src/services/notifications';

const { width } = Dimensions.get('window');
// Proporción móvil exacta de 2 columnas con espacio equilibrado
const CARD_WIDTH = (width - 40) / 2;

// Catálogo Exclusivo Dal Atelier con control de inventario y estado
const INITIAL_PRODUCTS = [
  {
    id: 1,
    sku: 'DAL-LINO-01',
    name: 'Camisa Sobrecamisa Lino Arena',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 89.0,
    originalPrice: 110.0,
    discount: 19,
    material: '100% Lino Orgánico Europeo',
    fit: 'Corte Relajado Moderno',
    care: 'Lavar en frío a 30°C, secar a la sombra.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    colors: ['#E4DFD3', '#8A9A86', '#2C2B2A'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    active: true,
    isNew: true
  },
  {
    id: 2,
    sku: 'DAL-PNT-02',
    name: 'Pantalón Plisado Salvia Muted',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 98.0,
    originalPrice: 98.0,
    discount: 0,
    material: '65% Tencel Lyocell, 35% Algodón Pima',
    fit: 'Tiro Medio / Pierna Recta',
    care: 'Planchar a baja temperatura.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    colors: ['#8A9A86', '#42413E'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 18,
    active: true,
    isNew: false
  },
  {
    id: 3,
    sku: 'DAL-FTW-03',
    name: 'Mocasín Flexible Cuero Crudo',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 139.0,
    originalPrice: 139.0,
    discount: 0,
    material: '100% Piel Bovina Curtido Vegetal, Suela Caucho',
    fit: 'Fiel a la Talla',
    care: 'Nutrir con cera neutra orgánica.',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    colors: ['#A06E4D', '#1C1B1A'],
    sizes: ['40', '41', '42', '43'],
    stock: 16,
    active: true,
    isNew: true
  },
  {
    id: 4,
    sku: 'DAL-KNT-04',
    name: 'Jersey Cuello Mock Algodón Crudo',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 115.0,
    originalPrice: 135.0,
    discount: 15,
    material: '85% Algodón Peinado, 15% Seda Mulberry',
    fit: 'Corte Regular Slim',
    care: 'Secar en plano sobre toalla.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    colors: ['#F4F2EB', '#D2C3B2'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14,
    active: true,
    isNew: true
  },
  {
    id: 5,
    sku: 'DAL-OUT-05',
    name: 'Gabardina Fluida Piedra Pálido',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 175.0,
    originalPrice: 210.0,
    discount: 17,
    material: '70% Algodón Repelente, 30% Poliamida Reciclada',
    fit: 'Corte Oversize Estructurado',
    care: 'Limpieza en seco recomendada.',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
    colors: ['#D8D4CC', '#4A5B4F'],
    sizes: ['S', 'M', 'L'],
    stock: 9,
    active: true,
    isNew: true
  },
  {
    id: 6,
    sku: 'DAL-VES-06',
    name: 'Vestido Camisero Midi Popelín',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 118.0,
    originalPrice: 140.0,
    discount: 16,
    material: '100% Popelín Algodón Egipcio',
    fit: 'Corte Midi Fluido',
    care: 'Lavar con colores similares a 30°C.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    colors: ['#FBFBFB', '#879FB5'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 12,
    active: true,
    isNew: true
  },
  {
    id: 7,
    sku: 'DAL-BLZ-07',
    name: 'Blazer Desestructurado Lino Arcilla',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 160.0,
    originalPrice: 195.0,
    discount: 18,
    material: '55% Lino Francés, 45% Viscosa Sostenible',
    fit: 'Sastrería Relajada',
    care: 'Limpieza profesional.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    colors: ['#B77C68', '#C4B59D'],
    sizes: ['S', 'M', 'L'],
    stock: 11,
    active: true,
    isNew: false
  },
  {
    id: 8,
    sku: 'DAL-SNK-08',
    name: 'Zapatilla Urbana Piel Napa Blanca',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 148.0,
    originalPrice: 175.0,
    discount: 15,
    material: 'Piel Bovina Italiana y Suela Látex Natural',
    fit: 'Calce Cómodo Todo el Día',
    care: 'Limpiar con paño húmedo.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    colors: ['#F9F9F9', '#DCD8CF'],
    sizes: ['39', '40', '41', '42', '43'],
    stock: 18,
    active: true,
    isNew: false
  },
  {
    id: 9,
    sku: 'DAL-KNT-09',
    name: 'Cárdigan Abierto Merino Marfil',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 128.0,
    originalPrice: 150.0,
    discount: 15,
    material: '100% Lana Merino Extrafina 19.5µ',
    fit: 'Corte Amplio de Hombros Caídos',
    care: 'Secar en plano horizontal.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    colors: ['#F7F5EE', '#8C7E6D'],
    sizes: ['S', 'M', 'L'],
    stock: 16,
    active: true,
    isNew: true
  },
  {
    id: 10,
    sku: 'DAL-SAF-10',
    name: 'Chaqueta Safari Lino Encerado',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 168.0,
    originalPrice: 195.0,
    discount: 14,
    material: 'Lino Grueso Encerado al Agua',
    fit: 'Cuatro Bolsillos de Parche y Cinturón',
    care: 'Limpiar con esponja húmeda.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    colors: ['#7A6D56', '#2F332D'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 9,
    active: true,
    isNew: true
  },
  {
    id: 11,
    sku: 'DAL-TEE-11',
    name: 'Camiseta Pesada Cuello Caja Carbón',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 46.0,
    originalPrice: 46.0,
    discount: 0,
    material: '100% Algodón Orgánico Cardado 260g',
    fit: 'Corte Boxy Fit',
    care: 'Lavar del revés a máquina.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    colors: ['#242426', '#FFFFFF'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 35,
    active: true,
    isNew: false
  },
  {
    id: 12,
    sku: 'DAL-PAL-12',
    name: 'Pantalón Palazzo Sarga Nude',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 112.0,
    originalPrice: 130.0,
    discount: 14,
    material: '100% Sarga de Algodón Pima Peinado',
    fit: 'Pierna Extra Ancha de Caída Suave',
    care: 'Planchado tibio.',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    colors: ['#E8DFC8', '#262422'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 17,
    active: true,
    isNew: true
  },
  {
    id: 13,
    sku: 'DAL-SAN-13',
    name: 'Sandalia Tiras Cruzadas Cuero',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 110.0,
    originalPrice: 130.0,
    discount: 15,
    material: '100% Piel Flor Curtido Natural, Planta Anatómica',
    fit: 'Ajuste Ergonómico',
    care: 'Hidratar con bálsamo natural.',
    image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80',
    colors: ['#7A4B29', '#1C1B1A'],
    sizes: ['38', '39', '40', '41', '42'],
    stock: 20,
    active: true,
    isNew: true
  },
  {
    id: 14,
    sku: 'DAL-POLO-14',
    name: 'Suéter Cuello Polo Hilo Suave',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 99.0,
    originalPrice: 99.0,
    discount: 0,
    material: '80% Algodón Pima, 20% Cashmere',
    fit: 'Ajuste Regular Natural',
    care: 'Lavar a mano a 20°C.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    colors: ['#4E5B50', '#D6CEC2'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 23,
    active: true,
    isNew: false
  },
  {
    id: 15,
    sku: 'DAL-PRK-15',
    name: 'Parka Cortaviento Repelente Mineral',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 152.0,
    originalPrice: 180.0,
    discount: 15,
    material: 'Algodón Técnico Hidrófugo Mate',
    fit: 'Silueta Flotante con Capucha Oculta',
    care: 'Lavar en frío sin suavizante.',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
    colors: ['#3A3E3B', '#CFCCC4'],
    sizes: ['S', 'M', 'L'],
    stock: 11,
    active: true,
    isNew: false
  },
  {
    id: 16,
    sku: 'DAL-LINO-16',
    name: 'Blusa Cuello Mao Lino Crudo',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 76.0,
    originalPrice: 92.0,
    discount: 17,
    material: '100% Lino Belga Prelavado',
    fit: 'Corte Holgado Contemporáneo',
    care: 'Planchar a vapor con prenda húmeda.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
    colors: ['#EFECE6', '#524F4A'],
    sizes: ['S', 'M', 'L'],
    stock: 22,
    active: true,
    isNew: true
  },
  {
    id: 17,
    sku: 'DAL-VST-17',
    name: 'Chaleco Sastre Botones Corozo',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 88.0,
    originalPrice: 105.0,
    discount: 16,
    material: '50% Lino, 50% Algodón Crudo',
    fit: 'Corte Recto Desestructurado',
    care: 'Limpieza en seco o lavado suave.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    colors: ['#EFECE6', '#B77C68'],
    sizes: ['S', 'M', 'L'],
    stock: 21,
    active: true,
    isNew: false
  },
  {
    id: 18,
    sku: 'DAL-CHE-18',
    name: 'Bota Chelsea Piel Flexible Arena',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 165.0,
    originalPrice: 195.0,
    discount: 15,
    material: 'Ante Hidrófugo Tratado y Elásticos Laterales',
    fit: 'Ajuste Suave al Tobillo',
    care: 'Cepillar en seco.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    colors: ['#C4B7A6', '#2F2D2A'],
    sizes: ['40', '41', '42', '43', '44'],
    stock: 15,
    active: true,
    isNew: true
  },
  {
    id: 19,
    sku: 'DAL-CLD-19',
    name: 'Jersey Calado Bruma Matinal',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 105.0,
    originalPrice: 125.0,
    discount: 16,
    material: '100% Hilo de Seda Rústica y Algodón',
    fit: 'Tejido Abierto Liviano',
    care: 'Guardar doblado, no colgar.',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80',
    colors: ['#C4B59D', '#EFECE6'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 13,
    active: true,
    isNew: true
  },
  {
    id: 20,
    sku: 'DAL-OVS-20',
    name: 'Sobrecamisa Acolchada Canela',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 142.0,
    originalPrice: 142.0,
    discount: 0,
    material: 'Exterior Lino Pesado, Relleno Térmico Reciclado',
    fit: 'Corte Boxy Oversize',
    care: 'Lavado corto a 30°C.',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',
    colors: ['#9E6845', '#3A3836'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 14,
    active: true,
    isNew: true
  },
  {
    id: 21,
    sku: 'DAL-BER-21',
    name: 'Bermuda Plisada Lino Oliva',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 68.0,
    originalPrice: 68.0,
    discount: 0,
    material: '100% Lino Rústico Transpirable',
    fit: 'Corte Recto por la Rodilla',
    care: 'Lavar en ciclo delicado.',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    colors: ['#536B58', '#E4DFD3'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 28,
    active: true,
    isNew: false
  },
  {
    id: 22,
    sku: 'DAL-SUIT-22',
    name: 'Traje Dos Piezas Arena Calmo',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 245.0,
    originalPrice: 290.0,
    discount: 15,
    material: 'Lana Fría Tropical 120s y Seda',
    fit: 'Sastrería Relajada Contemporánea',
    care: 'Limpieza profesional recomendada.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['#D6CEC2', '#3D453E'],
    sizes: ['48', '50', '52', '54'],
    stock: 7,
    active: true,
    isNew: true
  },
  {
    id: 23,
    sku: 'DAL-MUL-23',
    name: 'Mule Destalonado Cuero Chocolate',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 125.0,
    originalPrice: 125.0,
    discount: 0,
    material: 'Cuero Semibrillo Flexible, Tacón Bloque 2cm',
    fit: 'Fiel a la Talla',
    care: 'Crema incolora nutritiva.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    colors: ['#422918', '#A48261'],
    sizes: ['37', '38', '39', '40', '41'],
    stock: 12,
    active: true,
    isNew: true
  },
  {
    id: 24,
    sku: 'DAL-KNT-24',
    name: 'Jersey Trenzado Lana Merino Ocre',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 135.0,
    originalPrice: 160.0,
    discount: 16,
    material: '100% Lana Merino Virgen de Cosecha Responsable',
    fit: 'Tejido Grueso Suave Estructurado',
    care: 'Lavar a mano con jabón neutro.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    colors: ['#C48F42', '#EFECE6'],
    sizes: ['S', 'M', 'L'],
    stock: 14,
    active: true,
    isNew: true
  },
  {
    id: 25,
    sku: 'DAL-OUT-25',
    name: 'Abrigo Batín Lana y Cachemira Camel',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 260.0,
    originalPrice: 310.0,
    discount: 16,
    material: '80% Lana Doble Faz, 20% Cachemira Orgánica',
    fit: 'Corte Maxi Envolvente con Cinturón',
    care: 'Limpieza especializada en seco.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    colors: ['#A67C52', '#3D3833'],
    sizes: ['S', 'M', 'L'],
    stock: 8,
    active: true,
    isNew: true
  },
  {
    id: 26,
    sku: 'DAL-SHI-26',
    name: 'Camisa Fluida Añil Lavado',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 94.0,
    originalPrice: 115.0,
    discount: 18,
    material: '70% Lino Orgánico, 30% Tencel',
    fit: 'Corte Regular Drapeado',
    care: 'Secar a la sombra.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    colors: ['#4E6578', '#EFECE6'],
    sizes: ['M', 'L', 'XL'],
    stock: 15,
    active: true,
    isNew: true
  },
  {
    id: 27,
    sku: 'DAL-DBL-27',
    name: 'Blazer Cruzado Grafito Mate',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 185.0,
    originalPrice: 220.0,
    discount: 16,
    material: '70% Lana Virgen, 30% Seda',
    fit: 'Doble Abotonadura Moderna',
    care: 'Limpieza especializada.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    colors: ['#2B2B2E', '#8A9A86'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 10,
    active: true,
    isNew: true
  },
  {
    id: 28,
    sku: 'DAL-DER-28',
    name: 'Zapato Derby Cuero Envejecido',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 170.0,
    originalPrice: 195.0,
    discount: 13,
    material: '100% Cuero Vacuno Plena Flor, Cosido Blake',
    fit: 'Horma Clásica Ergonómica',
    care: 'Crema hidratante y cepillado crin.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    colors: ['#5A3B28', '#1F1B18'],
    sizes: ['40', '41', '42', '43', '44'],
    stock: 11,
    active: true,
    isNew: true
  },
  {
    id: 29,
    sku: 'DAL-KNT-29',
    name: 'Top Punto Espalda Descubierta',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 82.0,
    originalPrice: 98.0,
    discount: 16,
    material: '70% Viscosa Sostenible, 30% Hilo Lino Fino',
    fit: 'Silueta Entallada con Caída',
    care: 'Lavar en bolsa de red protectora.',
    image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80',
    colors: ['#D9C6B0', '#2C2B29'],
    sizes: ['XS', 'S', 'M'],
    stock: 19,
    active: true,
    isNew: true
  },
  {
    id: 30,
    sku: 'DAL-TRN-30',
    name: 'Trench Coat Oversize Beige Puro',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 215.0,
    originalPrice: 250.0,
    discount: 14,
    material: '100% Gabardina de Algodón Peinado Hidro-Repelente',
    fit: 'Corte Maxi Flotante con Dragona en Hombros',
    care: 'Plancha tibia sin vapor.',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    colors: ['#D5C9B7', '#42413E'],
    sizes: ['S', 'M', 'L'],
    stock: 10,
    active: true,
    isNew: true
  },
  {
    id: 31,
    sku: 'DAL-TUN-31',
    name: 'Vestido Túnica Lino Arena',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 132.0,
    originalPrice: 155.0,
    discount: 15,
    material: '100% Lino de Cosecha Sostenible',
    fit: 'Silueta Éterea Maxi',
    care: 'Lavar a mano en agua fría.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    colors: ['#D6CDBF', '#383633'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 8,
    active: true,
    isNew: false
  },
  {
    id: 32,
    sku: 'DAL-SKR-32',
    name: 'Falda Midi Abertura Frontal',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 92.0,
    originalPrice: 92.0,
    discount: 0,
    material: '100% Viscosa Pesada Eco-Tex',
    fit: 'Tiro Alto con Abertura Discreta',
    care: 'Lavar en frío.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    colors: ['#A89279', '#1A1918'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 14,
    active: true,
    isNew: false
  },
  {
    id: 33,
    sku: 'DAL-SNK-33',
    name: 'Sneaker Retro Piel Suave Crema',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 140.0,
    originalPrice: 165.0,
    discount: 15,
    material: 'Piel Nubuck Grano Fino y Forro Transpirable',
    fit: 'Suela Amortiguada para Caminata',
    care: 'Limpiar con cepillo de cerdas suaves.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    colors: ['#EAE4D7', '#938B80'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    stock: 16,
    active: true,
    isNew: true
  },
  {
    id: 34,
    sku: 'DAL-KNT-34',
    name: 'Jersey Cuello Redondo Lana Alpaca',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 145.0,
    originalPrice: 175.0,
    discount: 17,
    material: '60% Baby Alpaca, 40% Lana Merino Orgánica',
    fit: 'Corte Cuadrado Abrigador',
    care: 'Secar extendido horizontalmente.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    colors: ['#C9B89D', '#3F443E'],
    sizes: ['S', 'M', 'L'],
    stock: 12,
    active: true,
    isNew: true
  },
  {
    id: 35,
    sku: 'DAL-OUT-35',
    name: 'Abrigo Minimalista Lana Alpaca',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 275.0,
    originalPrice: 320.0,
    discount: 14,
    material: '70% Lana Virgen Alpina, 30% Alpaca Peruana',
    fit: 'Estructura Recta sin Solapas',
    care: 'Limpieza en seco profesional.',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
    colors: ['#2F3033', '#8B7F72'],
    sizes: ['S', 'M', 'L'],
    stock: 7,
    active: true,
    isNew: true
  },
  {
    id: 36,
    sku: 'DAL-JOG-36',
    name: 'Pantalón Jogger Lino Tabaco',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 84.0,
    originalPrice: 84.0,
    discount: 0,
    material: '80% Lino Europeo, 20% Algodón',
    fit: 'Tiro Alto con Cordón Ceñidor',
    care: 'Lavar del revés a 30°C.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    colors: ['#8C5D3D', '#EFECE6'],
    sizes: ['S', 'M', 'L'],
    stock: 19,
    active: true,
    isNew: true
  },
  {
    id: 37,
    sku: 'DAL-CRG-37',
    name: 'Pantalón Cargo Sastrería Crema',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 119.0,
    originalPrice: 140.0,
    discount: 15,
    material: 'Sarga de Algodón Egipcio y Seda',
    fit: 'Bolsillos Planos Integrados y Caída Ancha',
    care: 'Lavar en frío.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    colors: ['#E6DEC9', '#474540'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 15,
    active: true,
    isNew: true
  },
  {
    id: 38,
    sku: 'DAL-BOT-38',
    name: 'Botín Cordones Cuero Artesanal',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 185.0,
    originalPrice: 215.0,
    discount: 14,
    material: 'Cuero Encerado Rústico y Suela Vibram Ligera',
    fit: 'Caña Media con Plantilla Anatómica',
    care: 'Tratar con grasa de caballo natural.',
    image: 'https://images.unsplash.com/photo-1534653299134-96a1713c70c9?auto=format&fit=crop&w=800&q=80',
    colors: ['#4A2E1B', '#1B1917'],
    sizes: ['40', '41', '42', '43', '44'],
    stock: 10,
    active: true,
    isNew: false
  },
  {
    id: 39,
    sku: 'DAL-KNT-39',
    name: 'Jersey Trenzado Cuello Redondo Humo',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 110.0,
    originalPrice: 130.0,
    discount: 15,
    material: '100% Hilo de Bambú y Algodón Pima',
    fit: 'Tacto Sedoso Ultraligero',
    care: 'Lavar en programa de lana.',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    colors: ['#A4A09B', '#E5E1D8'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    active: true,
    isNew: true
  },
  {
    id: 40,
    sku: 'DAL-BKR-40',
    name: 'Cazadora Cuero Suave Estilo Biker',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 255.0,
    originalPrice: 299.0,
    discount: 15,
    material: 'Piel Ovina Napa Extra Suave con Forro Seda',
    fit: 'Corte Entallado Moderno con Cremalleras Ocultas',
    care: 'Especialista en pieles.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    colors: ['#1C1B1A', '#524338'],
    sizes: ['S', 'M', 'L'],
    stock: 8,
    active: true,
    isNew: true
  },
  {
    id: 41,
    sku: 'DAL-VES-41',
    name: 'Vestido Tirantes Lino Terracota',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 122.0,
    originalPrice: 145.0,
    discount: 16,
    material: '100% Lino Orgánico Teñido con Arcillas Naturales',
    fit: 'Línea A con Espalda Cruzada',
    care: 'Lavar en frío, no retorcer.',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80',
    colors: ['#B86B53', '#EBD8C8'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 13,
    active: true,
    isNew: true
  },
  {
    id: 42,
    sku: 'DAL-PNT-42',
    name: 'Pantalón Cigarrette Corte Sastre',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 105.0,
    originalPrice: 125.0,
    discount: 16,
    material: 'Lana Fría Elástica y Modal Italiano',
    fit: 'Tiro Alto con Raya Marcada Permanente',
    care: 'Lavado en seco.',
    image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80',
    colors: ['#3A3E45', '#C2BCB0'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 17,
    active: true,
    isNew: false
  },
  {
    id: 43,
    sku: 'DAL-CHK-43',
    name: 'Deportiva Chunky Minimal Monocromo',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 155.0,
    originalPrice: 185.0,
    discount: 16,
    material: 'Cuero Grano y Microfibra Técnica Reciclada',
    fit: 'Suela Ligera EVA de Alta Amortiguación',
    care: 'Limpiar con espuma en seco.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    colors: ['#F3EFEA', '#B5ACA0'],
    sizes: ['38', '39', '40', '41', '42'],
    stock: 14,
    active: true,
    isNew: true
  },
  {
    id: 44,
    sku: 'DAL-PLM-44',
    name: 'Chaqueta Plumón Acolchada Crudo',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 188.0,
    originalPrice: 220.0,
    discount: 15,
    material: 'Tejido Mate Cortaviento y Relleno Ecológico DuPont',
    fit: 'Silueta Cocoon Corta y Cuello Alto',
    care: 'Lavar con pelotas de tenis en secadora suave.',
    image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80',
    colors: ['#EFECE6', '#383531'],
    sizes: ['S', 'M', 'L'],
    stock: 9,
    active: true,
    isNew: true
  },
  {
    id: 45,
    sku: 'DAL-SHI-45',
    name: 'Camisa Rayas Finas Lino Marítimo',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 92.0,
    originalPrice: 110.0,
    discount: 16,
    material: '100% Lino Francés con Rayas Tejidas en Telar',
    fit: 'Corte Clásico Relajado',
    care: 'Planchar con vapor medio.',
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80',
    colors: ['#415B76', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    active: true,
    isNew: false
  },
  {
    id: 46,
    sku: 'DAL-TRJ-46',
    name: 'Traje Monocromo Verde Eucalipto',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 258.0,
    originalPrice: 310.0,
    discount: 17,
    material: 'Lana Fría y Lino Irlandés con Forro Cupro',
    fit: 'Chaqueta Simple Abotonadura y Pantalón Fluido',
    care: 'Limpieza especializada.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    colors: ['#4E5D52', '#C6BFB3'],
    sizes: ['48', '50', '52', '54'],
    stock: 8,
    active: true,
    isNew: true
  },
  {
    id: 47,
    sku: 'DAL-PEN-47',
    name: 'Mocasín Piel Penny Loafer Coñac',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 162.0,
    originalPrice: 190.0,
    discount: 15,
    material: '100% Piel Bovina Flor Brillada con Pátina Artesanal',
    fit: 'Fiel a la Talla con Interior Acolchado',
    care: 'Brillo con gamuza de algodón.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    colors: ['#8A4B24', '#211E1C'],
    sizes: ['40', '41', '42', '43', '44'],
    stock: 13,
    active: true,
    isNew: true
  },
  {
    id: 48,
    sku: 'DAL-KNT-48',
    name: 'Suéter Cuello Cisne Cashmere Grafito',
    type: 'punto',
    typeName: 'Punto Suave',
    price: 158.0,
    originalPrice: 190.0,
    discount: 17,
    material: '50% Cachemira Mongola, 50% Lana Merino Extrafina',
    fit: 'Corte Regular con Ribete Acanalado Fino',
    care: 'Lavar con champú para lana a mano.',
    image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80',
    colors: ['#3A393E', '#9E9C97'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    active: true,
    isNew: true
  },
  {
    id: 49,
    sku: 'DAL-JKT-49',
    name: 'Sobrecamisa Algodón Cepillado Mostaza',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 115.0,
    originalPrice: 135.0,
    discount: 15,
    material: '100% Algodón Pesado de Telar Tradicional 320g',
    fit: 'Corte Boxy con Bolsillos de Solapa',
    care: 'Lavar a máquina a 30°C.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    colors: ['#C48A36', '#2F2E2C'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 16,
    active: true,
    isNew: false
  },
  {
    id: 50,
    sku: 'DAL-VES-50',
    name: 'Vestido Fluido Escote Halter Nude',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 138.0,
    originalPrice: 165.0,
    discount: 16,
    material: '60% Lino Orgánico, 40% Viscosa Brillante',
    fit: 'Silueta Columna con Caída en la Espalda',
    care: 'Lavar a mano en agua fría.',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80',
    colors: ['#EADBCB', '#6F6359'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 11,
    active: true,
    isNew: true
  },
  {
    id: 51,
    sku: 'DAL-BER-51',
    name: 'Bermuda Sastrería Lino Antracita',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 78.0,
    originalPrice: 92.0,
    discount: 15,
    material: '70% Lino Pesado, 30% Lana Fría',
    fit: 'Pinzas Delanteras y Cintura Limpia',
    care: 'Lavar en frío y planchar tibio.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80',
    colors: ['#35363A', '#D9D5CC'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    active: true,
    isNew: true
  },
  {
    id: 52,
    sku: 'DAL-TOT-52',
    name: 'Bolso Tote Cuero Grano Arena',
    type: 'calzado',
    typeName: 'Calzado & Cuero',
    price: 158.0,
    originalPrice: 185.0,
    discount: 15,
    material: '100% Cuero Vacuno con Acabado Grano Natural y Costuras Vistas',
    fit: 'Gran Capacidad con Compartimento Interno',
    care: 'Nutrir con bálsamo específico.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    colors: ['#D2B79A', '#1F1E1D'],
    sizes: ['Única'],
    stock: 14,
    active: true,
    isNew: true
  },
  {
    id: 53,
    sku: 'DAL-VNT-53',
    name: 'Camisa Cuadro Ventana Lino Gris',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 88.0,
    originalPrice: 88.0,
    discount: 0,
    material: '100% Lino Natural Hilado en Seco',
    fit: 'Corte Recto Tradicional',
    care: 'Lavar a máquina suave.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['#8C8C91', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 21,
    active: true,
    isNew: false
  },
  {
    id: 54,
    sku: 'DAL-KIM-54',
    name: 'Kimono Estructurado Seda Wabi',
    type: 'sastreria',
    typeName: 'Sastrería Fluida',
    price: 195.0,
    originalPrice: 230.0,
    discount: 15,
    material: 'Seda Rústica y Algodón Orgánico Japonés',
    fit: 'Mangas Amplias y Cinturón Obi Extraíble',
    care: 'Limpieza en seco profesional.',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    colors: ['#282A2E', '#9E856E'],
    sizes: ['S', 'M', 'L'],
    stock: 9,
    active: true,
    isNew: true
  },
  {
    id: 55,
    sku: 'DAL-DNM-55',
    name: 'Camisa Vaquera Deslavada Artesanal',
    type: 'capas',
    typeName: 'Capas & Outerwear',
    price: 98.0,
    originalPrice: 115.0,
    discount: 15,
    material: '100% Denim Algodón Orgánico 8oz Lavado al Ozono',
    fit: 'Corte Relajado con Botones de Nácar',
    care: 'Lavar del revés para preservar tono.',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    colors: ['#5C748C', '#DCD3C7'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    active: true,
    isNew: false
  },
  {
    id: 56,
    sku: 'DAL-RST-56',
    name: 'Camisa Resort Estampado Botánico',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 85.0,
    originalPrice: 105.0,
    discount: 19,
    material: 'Lino Ligero 100% con Tintes Vegetales',
    fit: 'Cuello Camp y Silueta Amplia de Verano',
    care: 'Lavar en frío.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    colors: ['#617362', '#EFECE6'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    active: true,
    isNew: true
  },
  {
    id: 57,
    sku: 'DAL-MAX-57',
    name: 'Vestido Maxi Lino Rústico Canela',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 148.0,
    originalPrice: 175.0,
    discount: 15,
    material: '100% Lino Pesado con Aberturas Laterales',
    fit: 'Caída Recta Estilizada de Gran Movimiento',
    care: 'Secar en plano.',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80',
    colors: ['#A05D3D', '#2B2725'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 12,
    active: true,
    isNew: true
  },
  {
    id: 58,
    sku: 'DAL-OXF-58',
    name: 'Camisa Oversize Algodón Oxford',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 89.0,
    originalPrice: 89.0,
    discount: 0,
    material: '100% Algodón Oxford Egipcio Suave',
    fit: 'Silueta Extra Amplia Contemporánea',
    care: 'Planchar con vapor medio.',
    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80',
    colors: ['#F7F7F8', '#667C8D'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 26,
    active: true,
    isNew: false
  },
  {
    id: 59,
    sku: 'DAL-DRP-59',
    name: 'Camiseta Pesada Manga Caída Blanca',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 48.0,
    originalPrice: 48.0,
    discount: 0,
    material: '100% Algodón Pima Peinado 280g',
    fit: 'Hombro Caído y Cuello Grueso Sellado',
    care: 'Lavar con ropa blanca a 30°C.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    colors: ['#FFFFFF', '#D1CCC2'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 32,
    active: true,
    isNew: true
  },
  {
    id: 60,
    sku: 'DAL-SET-60',
    name: 'Conjunto Dos Piezas Lino Minimal',
    type: 'lino',
    typeName: 'Lino Orgánico',
    price: 185.0,
    originalPrice: 220.0,
    discount: 16,
    material: '100% Lino Europeo Lavado con Piedra Pómez',
    fit: 'Top Sin Mangas y Pantalón Recto a Juego',
    care: 'Lavar en frío ciclo delicado.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    colors: ['#EBE6DC', '#3A3835'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 14,
    active: true,
    isNew: true
  }
];

// Tipos y Familias Textiles Oficiales
const CLOTHING_TYPES = [
  { id: 'todos', label: 'Todos' },
  { id: 'lino', label: 'Lino Orgánico', desc: 'Fibras naturales, livianas y transpirables.' },
  { id: 'sastreria', label: 'Sastrería Fluida', desc: 'Cortes desestructurados y siluetas contemporáneas.' },
  { id: 'punto', label: 'Punto Suave', desc: 'Tejidos de media estación en hilos finos.' },
  { id: 'capas', label: 'Capas & Outerwear', desc: 'Gabardinas y prendas ligeras para exteriores.' },
  { id: 'calzado', label: 'Calzado & Cuero', desc: 'Piel con curtido vegetal y suelas flexibles.' }
];

// Campañas Promocionales de Otoño (Visible antes de iniciar sesión)
const AUTUMN_PROMOS = [
  {
    id: 'autumn-1',
    title: 'Esencia de Otoño: Capas & Trench',
    subtitle: 'Siluetas envolventes en tonos tierra y lana pura para el cambio de clima.',
    tag: '🍁 NUEVA TEMPORADA',
    category: 'capas',
    categoryTitle: 'Capas & Outerwear',
    btnText: 'Explorar Capas',
    image: 'https://images.unsplash.com/photo-1511280394622-399bb40a74e9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'autumn-2',
    title: 'Sastrería Cálida & Lino Pesado',
    subtitle: 'Blazers desestructurados y pantalones fluidos en tonos arena y arcilla.',
    tag: '🍂 HASTA 20% OFF',
    category: 'sastreria',
    categoryTitle: 'Sastrería Fluida',
    btnText: 'Ver Sastrería',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'autumn-3',
    title: 'Punto Suave & Cuero Artesanal',
    subtitle: 'Jerséis en Baby Alpaca, chalecos y botas de piel con curtido vegetal.',
    tag: '✨ EDICIÓN LIMITADA',
    category: 'punto',
    categoryTitle: 'Punto Suave',
    btnText: 'Ver Punto & Cuero',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80'
  }
];


// Usuarios precargados de demostración (Cliente vs Administrador)
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Mateo Navarro',
    email: 'cliente@dal.com',
    password: 'password',
    role: 'customer',
    phone: '+52 55 4123 9081',
    address: 'Colima 184, Roma Norte, CDMX',
    joined: '15 Ene 2026'
  },
  {
    id: 99,
    name: 'Elena Valdés',
    email: 'admin@dal.com',
    password: 'admin',
    role: 'admin',
    phone: '+52 55 8920 1144',
    address: 'Atelier Central Dal, Polanco, CDMX',
    joined: '01 Ene 2025'
  }
];

// Pedidos precargados en el sistema
const INITIAL_ORDERS = [
  {
    id: 'DAL-8921',
    customerName: 'Mateo Navarro',
    customerEmail: 'cliente@dal.com',
    customerPhone: '+52 55 4123 9081',
    customerAddress: 'Colima 184, Roma Norte, CDMX',
    date: '08 Mar 2026, 14:30',
    total: 204.0,
    status: 'En preparación en atelier',
    statusStep: 1, // 1: Preparación, 2: En Camino, 3: Entregado
    items: [
      { name: 'Camisa Sobrecamisa Lino Arena', size: 'M', quantity: 1, price: 89.0 },
      { name: 'Jersey Cuello Mock Algodón Crudo', size: 'L', quantity: 1, price: 115.0 }
    ]
  },
  {
    id: 'DAL-7450',
    customerName: 'Sofía Carballo',
    customerEmail: 'sofia.c@correo.com',
    customerPhone: '+52 55 9812 3450',
    customerAddress: 'Campos Elíseos 204, Polanco, CDMX',
    date: '07 Mar 2026, 11:15',
    total: 175.0,
    status: 'En camino (Mensajería)',
    statusStep: 2,
    items: [
      { name: 'Gabardina Fluida Piedra Pálido', size: 'S', quantity: 1, price: 175.0 }
    ]
  },
  {
    id: 'DAL-6120',
    customerName: 'Lucas Méndez',
    customerEmail: 'lucas.m@correo.com',
    customerPhone: '+52 55 7711 9022',
    customerAddress: 'Ámsterdam 92, Condesa, CDMX',
    date: '05 Mar 2026, 18:40',
    total: 139.0,
    status: 'Entregado',
    statusStep: 3,
    items: [
      { name: 'Mocasín Flexible Cuero Crudo', size: '42', quantity: 1, price: 139.0 }
    ]
  }
];


// Boutiques Dal Oficiales para Radar de Geolocalización (Sensor 3)
const DAL_BOUTIQUES = [
  {
    id: 1,
    name: 'Dal Flagship Roma Norte',
    city: 'Ciudad de México',
    address: 'Colima 184, Roma Norte, Cuauhtémoc',
    latitude: 19.4194,
    longitude: -99.1622,
    phone: '+52 55 4123 9081',
    schedule: 'Lun - Dom: 10:00 - 20:00',
    hasExpressPickup: true
  },
  {
    id: 2,
    name: 'Dal Atelier Polanco',
    city: 'Ciudad de México',
    address: 'Campos Elíseos 204, Polanco, Miguel Hidalgo',
    latitude: 19.4298,
    longitude: -99.1915,
    phone: '+52 55 8920 1144',
    schedule: 'Lun - Sáb: 11:00 - 20:30',
    hasExpressPickup: true
  },
  {
    id: 3,
    name: 'Dal Estudio Salamanca',
    city: 'Madrid',
    address: 'Calle de Claudio Coello 34, Salamanca',
    latitude: 40.4262,
    longitude: -3.6865,
    phone: '+34 91 582 9910',
    schedule: 'Lun - Sáb: 10:30 - 20:30',
    hasExpressPickup: true
  },
  {
    id: 4,
    name: 'Dal Espacio SoHo',
    city: 'New York',
    address: '432 Broome St, SoHo, NY 10013',
    latitude: 40.7208,
    longitude: -73.9998,
    phone: '+1 212 940 3388',
    schedule: 'Lun - Dom: 11:00 - 19:30',
    hasExpressPickup: true
  }
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  // Navegación de pestañas para Cliente:
  // 'catalog', 'collections', 'wishlist', 'cart', 'account'
  // ==========================================
  // HARDWARE SENSORS STATE (3 SENSORES INTEGRADOS)
  // 1. Acelerómetro (Detección de Sacudida - Shake)
  // 2. Giroscopio (Efecto Parallax 3D e Inclinación)
  // 3. Geolocalización / GPS (Radar de Boutiques Dal)
  // ==========================================
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [accelG, setAccelG] = useState(1.0);
  const [lastShakeTimestamp, setLastShakeTimestamp] = useState(null);
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [parallax3dEnabled, setParallax3dEnabled] = useState(true);
  const [userCoords, setUserCoords] = useState({ latitude: 19.4194, longitude: -99.1622 });
  const [nearestBoutique, setNearestBoutique] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sensorsActive, setSensorsActive] = useState({
    accelerometer: false,
    gyroscope: false,
    location: false
  });

  const [activeTab, setActiveTab] = useState('catalog');

  // Modo Admin (cuando está logueado un admin):
  // 'dashboard', 'orders', 'inventory', 'database', 'push'
  const [adminSubTab, setAdminSubTab] = useState('dashboard');
  const [adminPreviewAsClient, setAdminPreviewAsClient] = useState(false);

  // Catálogo de Productos (mutable por admin)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedType, setSelectedType] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Carrito de Compras
  const [cart, setCart] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoInput, setPromoInput] = useState('');

  // Lista de Deseos (Favoritos)
  const [wishlist, setWishlist] = useState([1, 4]);

  // Modal Detalle de Prenda
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(0);

  // Modal Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Modal Nueva Prenda (Admin)
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState('lino');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMaterial, setNewProdMaterial] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdImage, setNewProdImage] = useState('');

  // Modal Notificaciones Centro
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Notificaciones Push Flotantes
  const [pushToast, setPushToast] = useState(null);

  // Lista de Usuarios del Sistema y Sesión
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null); // Inicia sin sesión (Página Principal pública / Modo Invitado)

  // Sincronizar datos de checkout cuando el usuario inicia sesión
  useEffect(() => {
    if (currentUser) {
      setCheckoutName(currentUser.name || '');
      setCheckoutAddress(currentUser.address || '');
      setCheckoutPhone(currentUser.phone || '');
    } else {
      setCheckoutName('');
      setCheckoutAddress('');
      setCheckoutPhone('');
    }
  }, [currentUser]);

  // Formulario Auth (Iniciar Sesión vs Crear Cuenta)
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('customer'); // 'customer' | 'admin'
  const [regAdminKey, setRegAdminKey] = useState('');

  // Historial de Pedidos en Vivo (compartido entre clientes y admin)
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Redactor de Notificaciones Push (Admin)
  const [adminPushTitle, setAdminPushTitle] = useState('');
  const [adminPushBody, setAdminPushBody] = useState('');

  // Notificaciones Push FCM y Detalle de Pedido
  const [fcmToken, setFcmToken] = useState(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);

  // Escuchadores de Notificaciones Push (Primer plano, Segundo plano y App cerrada)
  useEffect(() => {
    // Inicialización y escucha de los 3 Sensores de Hardware
  useEffect(() => {
    let accelSubscription = null;
    let gyroSubscription = null;
    let isMounted = true;
    let lastShakeTime = 0;

    // SENSOR 1: Acelerómetro (Detección de Sacudida del dispositivo)
    const startAccelerometer = async () => {
      try {
        const available = await Accelerometer.isAvailableAsync();
        if (available && isMounted) {
          Accelerometer.setUpdateInterval(150);
          accelSubscription = Accelerometer.addListener(({ x, y, z }) => {
            const currentG = Math.sqrt(x * x + y * y + z * z);
            setAccelG(currentG);

            // Umbral de sacudida (Shake Trigger)
            const now = Date.now();
            if (currentG > 1.85 && now - lastShakeTime > 2500) {
              lastShakeTime = now;
              handleShakeAction();
            }
          });
          setSensorsActive((prev) => ({ ...prev, accelerometer: true }));
        }
      } catch (err) {
        console.log('Acelerómetro no disponible:', err);
      }
    };

    // SENSOR 2: Giroscopio (Inclinación 3D de Telas)
    const startGyroscope = async () => {
      try {
        const available = await Gyroscope.isAvailableAsync();
        if (available && isMounted) {
          Gyroscope.setUpdateInterval(100);
          gyroSubscription = Gyroscope.addListener((data) => {
            setGyroData(data);
          });
          setSensorsActive((prev) => ({ ...prev, gyroscope: true }));
        }
      } catch (err) {
        console.log('Giroscopio no disponible:', err);
      }
    };

    // SENSOR 3: GPS / Geolocalización (Radar de Boutiques Dal)
    updateGpsLocation();

    startAccelerometer();
    startGyroscope();

    return () => {
      isMounted = false;
      if (accelSubscription) accelSubscription.remove();
      if (gyroSubscription) gyroSubscription.remove();
    };
  }, []);

  // Función al detectar sacudida física (Sensor 1)
  const handleShakeAction = () => {
    setLastShakeTimestamp(new Date().toLocaleTimeString());
    // 1. Reorganizar catálogo al azar
    setProducts((prev) => [...prev].sort(() => Math.random() - 0.5));
    // 2. Aplicar cupón de sacudida
    setAppliedPromo({ code: 'SHAKE20', percent: 20 });
    // 3. Notificación push flotante
    triggerPush(
      '📳 ¡Sacudida Detectada!',
      'Catálogo reorganizado al azar y cupón del 20% (SHAKE20) aplicado a tu bolsa.'
    );
    // 4. Log de telemetría al servidor
    logSensorEvent('device_shake', { action: 'shake_shuffle_and_promo', gForce: 2.1 });
  };

  // Función para actualizar ubicación GPS (Sensor 3)
  const updateGpsLocation = async () => {
    try {
      setIsLocating(true);
      let coords = { latitude: 19.4194, longitude: -99.1622 }; // Roma Norte default
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (loc && loc.coords) {
            coords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude
            };
          }
          setSensorsActive((prev) => ({ ...prev, location: true }));
        }
      } catch (e) {
        console.log('Permiso GPS omitido, usando fallback:', e);
      }

      setUserCoords(coords);

      // Calcular boutique más cercana
      let closest = null;
      let minDistance = 999999;
      DAL_BOUTIQUES.forEach((b) => {
        const dist = calculateDistanceKm(coords.latitude, coords.longitude, b.latitude, b.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closest = { ...b, distanceKm: dist };
        }
      });

      setNearestBoutique(closest);
      logSensorEvent('geolocation_radar', {
        userCoords: coords,
        nearestBoutique: closest?.name,
        distanceKm: closest?.distanceKm
      });
    } catch (err) {
      console.log('Error calculando GPS:', err);
    } finally {
      setIsLocating(false);
    }
  };

  // Enviar telemetría de sensor a backend
  const logSensorEvent = (sensorType, payload) => {
    fetch('http://localhost:4000/api/sensors/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sensorType,
        eventPayload: payload,
        deviceInfo: Platform.OS === 'web' ? 'Navegador Web' : `Dispositivo Móvil ${Platform.OS}`
      })
    }).catch(() => {});
  };

    // 1. Solicitar permisos y obtener Token FCM
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setFcmToken(token);
        sendTokenToBackend(token, currentUser?.email || 'cliente@dal.com');
      }
    });

    // 2. Notificación recibida en PRIMER PLANO (Foreground)
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      triggerPush(title || 'Notificación Dal', body || '');
    });

    // 3. Usuario TOCA la notificación (Segundo plano o cerrada)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      handleNotificationOpen(data);
    });

    // 4. Caso App Completamente Cerrada (Cold Start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        handleNotificationOpen(data);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Manejar apertura de notificación para ver pedido específico (ej. #123)
  const handleNotificationOpen = (data) => {
    if (!data) return;
    const orderKey = data.orderId || data.orderNumber || data.pedido;
    if (orderKey) {
      setActiveTab('account');
      const targetStr = String(orderKey);
      const found = orders.find(
        (o) => o.id === targetStr || o.id === `DAL-${targetStr}` || o.id.includes(targetStr)
      );

      if (found) {
        setSelectedOrderForDetail(found);
      } else {
        // Si es una orden enviada desde Firebase Console (ej. #123), crear el registro dinámico
        const dynamicOrder = {
          id: targetStr.startsWith('DAL-') ? targetStr : `DAL-${targetStr}`,
          customerName: currentUser?.name || 'Mateo Navarro',
          customerEmail: currentUser?.email || 'cliente@dal.com',
          customerPhone: currentUser?.phone || '+52 55 4123 9081',
          customerAddress: currentUser?.address || 'Colima 184, Roma Norte, CDMX',
          date: 'Hoy (Notificación FCM)',
          total: 187.0,
          status: 'En camino (Mensajería)',
          statusStep: 2,
          items: [
            { name: 'Camisa Sobrecamisa Lino Arena', size: 'M', quantity: 1, price: 89.0 },
            { name: 'Pantalón Plisado Salvia Muted', size: 'M', quantity: 1, price: 98.0 }
          ]
        };
        setOrders((prev) => [dynamicOrder, ...prev]);
        setSelectedOrderForDetail(dynamicOrder);
      }
      triggerPush('Pedido Abierto', `Viendo detalles de la orden #${orderKey}.`);
    }
  };

  // Disparar Notificación Push sutil
  const triggerPush = (title, body) => {
    setPushToast({ title, body, id: Date.now() });
    setTimeout(() => {
      setPushToast(null);
    }, 4500);
  };

  // Añadir Prenda al Carrito
  const addToCart = (product, size = 'M') => {
    if (product.stock <= 0) {
      Alert.alert('Prenda Agotada', 'Esta silueta no cuenta con existencias actualmente.');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    triggerPush('Prenda en la Bolsa', `${product.name} (Talla ${size}) se sumó a tu orden.`);
  };

  // Modificar cantidad en carrito
  const updateQuantity = (id, size, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id && i.size === size) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Alternar Lista de Deseos (Favoritos) - Requiere Iniciar Sesión
  const toggleWishlist = (id) => {
    if (!currentUser) {
      Alert.alert(
        'Iniciar Sesión Requerido',
        'Para guardar prendas en tu lista de deseos, por favor inicia sesión o crea tu cuenta.',
        [
          { text: 'Seguir explorando', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => setActiveTab('account') }
        ]
      );
      return;
    }
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      } else {
        triggerPush('Guardado en Favoritos', 'La prenda se sumó a tu lista de deseos.');
        return [...prev, id];
      }
    });
  };

  // Confirmar Pedido en Checkout (Requiere Iniciar Sesión)
  const handleConfirmOrder = () => {
    if (!currentUser) {
      Alert.alert(
        'Iniciar Sesión Requerido',
        'Para pagar y confirmar tu orden debes iniciar sesión.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Iniciar Sesión',
            onPress: () => {
              setIsCheckoutOpen(false);
              setActiveTab('account');
            }
          }
        ]
      );
      return;
    }
    if (!checkoutName.trim() || !checkoutAddress.trim()) {
      Alert.alert('Datos requeridos', 'Por favor ingresa tu nombre y dirección de entrega.');
      return;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `DAL-${orderNum}`,
      customerName: checkoutName,
      customerEmail: currentUser ? currentUser.email : 'cliente.invitado@dal.com',
      customerPhone: checkoutPhone,
      customerAddress: checkoutAddress,
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: total,
      status: 'En preparación en atelier',
      statusStep: 1,
      items: cart.map((c) => ({
        name: c.name,
        size: c.size,
        quantity: c.quantity,
        price: c.price
      }))
    };

    // Reducir stock de productos ordenados
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders([newOrder, ...orders]);
    setCart([]);
    setAppliedPromo(null);
    setIsCheckoutOpen(false);
    setActiveTab('account'); // Redirigir para que vea su pedido en vivo
    triggerPush(
      '¡Pedido Confirmado en Dal!',
      `Orden #${newOrder.id} recibida. Preparando en atelier artesanal.`
    );
  };

  // Iniciar Sesión Simple
  const handleLogin = () => {
    const emailToUse = loginEmail.trim().toLowerCase();
    const passToUse = loginPassword;

    if (!emailToUse || !passToUse) {
      Alert.alert('Datos Incompletos', 'Por favor ingresa tu correo electrónico y tu contraseña.');
      return;
    }

    const found = users.find(
      (u) => u.email.toLowerCase() === emailToUse && u.password === passToUse
    );

    if (found) {
      setCurrentUser(found);
      setLoginEmail('');
      setLoginPassword('');
      setShowLoginPassword(false);
      setAdminPreviewAsClient(false);
      if (fcmToken) {
        sendTokenToBackend(fcmToken, found.email);
      }
      triggerPush(
        'Bienvenido a Dal',
        `Sesión iniciada como ${found.name || found.email}.`
      );
    } else {
      Alert.alert(
        'Credenciales Incorrectas',
        'El correo o la contraseña no coinciden con ninguna cuenta registrada.'
      );
    }
  };

  // Crear Cuenta Simple (Solo Correo y Contraseña)
  const handleRegister = () => {
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPass = regPassword.trim();

    if (!cleanEmail || !cleanPass) {
      Alert.alert('Datos Incompletos', 'Por favor ingresa un correo electrónico y una contraseña.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      Alert.alert('Correo Inválido', 'Ingresa una dirección de correo electrónico válida (ej. usuario@correo.com).');
      return;
    }
    if (cleanPass.length < 4) {
      Alert.alert('Contraseña Corta', 'Tu contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      Alert.alert('Correo Existente', 'Ya existe una cuenta registrada con este correo en Dal.');
      return;
    }

    // Generar nombre amigable a partir del correo
    const emailPrefix = cleanEmail.split('@')[0];
    const generatedName = emailPrefix
      .split(/[._-]/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Cliente Dal';

    const newUser = {
      id: Date.now(),
      name: generatedName,
      email: cleanEmail,
      password: cleanPass,
      role: 'customer',
      phone: '',
      address: '',
      joined: 'Hoy'
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setRegEmail('');
    setRegPassword('');
    setShowRegPassword(false);
    setAdminPreviewAsClient(false);

    // Sincronizar token FCM con la nueva cuenta
    if (fcmToken) {
      sendTokenToBackend(fcmToken, newUser.email);
    }

    triggerPush(
      '¡Cuenta Creada!',
      `Bienvenido a Dal Atelier, ${newUser.name}.`
    );
  };

  // Cerrar Sesión
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthMode('login');
    setActiveTab('catalog');
    setAdminPreviewAsClient(false);
    triggerPush('Sesión Cerrada', 'Has salido de tu cuenta de Dal. Puedes continuar explorando el atelier.');
  };

  // Admin: Actualizar estado de pedido en tiempo real
  const handleUpdateOrderStatus = (orderId, newStep) => {
    const statusMap = {
      1: 'En preparación en atelier',
      2: 'En camino (Mensajería)',
      3: 'Entregado'
    };
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, statusStep: newStep, status: statusMap[newStep] }
          : o
      )
    );
    triggerPush('Pedido Actualizado', `La orden ${orderId} ahora está "${statusMap[newStep]}".`);
  };

  // Admin: Ajustar stock de prendas
  const handleAdjustStock = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  // Admin: Alternar prenda activa/pausada
  const handleToggleProductActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, active: !p.active } : p
      )
    );
  };

  // Admin: Agregar nueva prenda
  const handleAddNewProduct = () => {
    if (!newProdName.trim() || !newProdPrice.trim()) {
      Alert.alert('Datos requeridos', 'Por favor ingresa nombre y precio de la prenda.');
      return;
    }
    const typeObj = CLOTHING_TYPES.find((t) => t.id === newProdType) || CLOTHING_TYPES[1];
    const newProduct = {
      id: Date.now(),
      sku: `DAL-${newProdType.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newProdName.trim(),
      type: newProdType,
      typeName: typeObj.label,
      price: parseFloat(newProdPrice) || 85.0,
      originalPrice: parseFloat(newProdPrice) || 85.0,
      discount: 0,
      material: newProdMaterial.trim() || '100% Fibras Orgánicas Naturales',
      fit: 'Corte Contemporáneo Relajado',
      care: 'Lavar en frío a 30°C.',
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      colors: ['#E4DFD3', '#1A1918'],
      sizes: ['S', 'M', 'L'],
      stock: parseInt(newProdStock, 10) || 15,
      active: true,
      isNew: true
    };

    setProducts([newProduct, ...products]);
    setIsNewProductModalOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdMaterial('');
    setNewProdStock('20');
    setNewProdImage('');
    triggerPush('Prenda Publicada', `${newProduct.name} agregada al catálogo de Dal.`);
  };

  // Reorganizar prendas al azar
  const handleShuffleProducts = () => {
    setProducts((prev) => [...prev].sort(() => Math.random() - 0.5));
    triggerPush('Prendas al Azar', 'El catálogo se ha reorganizado aleatoriamente.');
  };

  // Admin: Emitir Push masivo
  const handleSendAdminPush = () => {
    if (!adminPushTitle.trim() || !adminPushBody.trim()) {
      Alert.alert('Campos vacíos', 'Ingresa título y mensaje para la notificación.');
      return;
    }
    triggerPush(adminPushTitle.trim(), adminPushBody.trim());
    setAdminPushTitle('');
    setAdminPushBody('');
  };

  // Filtrado de productos para cliente
  const filteredProducts = products.filter((item) => {
    // Si no está activo y estamos en vista cliente, ocultarlo
    if (!item.active && currentUser?.role !== 'admin') return false;
    const matchesType = selectedType === 'todos' || item.type === selectedType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Totales de Bolsa
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const shippingFee = subtotal >= 120 || cart.length === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Pedidos del usuario actual
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
          currentUser.role === 'admin'
      )
    : [];

  const isAdmin = currentUser && currentUser.role === 'admin' && !adminPreviewAsClient;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />

      {/* NOTIFICACIÓN PUSH TOAST FLOTANTE */}
      {pushToast && (
        <View style={styles.pushToast}>
          <View style={styles.pushToastIcon}>
            <Bell size={18} color="#536B58" />
          </View>
          <View style={styles.pushToastContent}>
            <Text style={styles.pushToastTitle}>{pushToast.title}</Text>
            <Text style={styles.pushToastBody}>{pushToast.body}</Text>
          </View>
          <TouchableOpacity onPress={() => setPushToast(null)} style={styles.pushToastClose}>
            <X size={16} color="#8A867E" />
          </TouchableOpacity>
        </View>
      )}

      {/* CABECERA PRINCIPAL SEGÚN ROL */}
      {isAdmin ? (
        // CABECERA MODO ADMIN
        <View style={styles.adminHeader}>
          <View>
            <View style={styles.adminBadgeRow}>
              <View style={styles.adminPill}>
                <ShieldCheck size={12} color="#FFFFFF" />
                <Text style={styles.adminPillText}>MODO ADMIN ATELIER</Text>
              </View>
            </View>
            <Text style={styles.brandTitle}>Dal Panel</Text>
            <Text style={styles.adminSubtitle}>Gestión de Catálogo, Ventas y Base de Datos</Text>
          </View>

          <View style={styles.adminHeaderActions}>
            <TouchableOpacity
              style={styles.previewClientBtn}
              onPress={() => {
                setAdminPreviewAsClient(true);
                triggerPush('Vista Cliente Activada', 'Estás navegando la app como cliente.');
              }}
            >
              <Text style={styles.previewClientBtnText}>Ver como Cliente</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutHeaderBtn} onPress={handleLogout}>
              <LogOut size={16} color="#B56B47" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // CABECERA MODO CLIENTE (O ADMIN EN VISTA PREVIA)
        <View style={styles.header}>
          <View>
            {currentUser?.role === 'admin' && adminPreviewAsClient && (
              <TouchableOpacity
                style={styles.backToAdminPill}
                onPress={() => setAdminPreviewAsClient(false)}
              >
                <ShieldCheck size={12} color="#FFFFFF" />
                <Text style={styles.backToAdminText}>Volver a Panel Admin</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.brandTitle}>Dal</Text>
            <Text style={styles.brandSubtitle}>Atelier Contemporáneo</Text>
          </View>

          <View style={styles.headerRight}>
            {!currentUser ? (
              <TouchableOpacity
                style={styles.headerLoginPill}
                onPress={() => {
                  setAuthMode('login');
                  setActiveTab('account');
                }}
              >
                <LogIn size={13} color="#536B58" />
                <Text style={styles.headerLoginText}>Entrar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.headerUserPill}
                onPress={() => setActiveTab('account')}
              >
                <User size={13} color="#1A1918" />
                <Text style={styles.headerUserText} numberOfLines={1}>
                  {currentUser.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            )}

                        {/* Botón Acceso Rápido a Sensores */}
            <TouchableOpacity
              style={styles.headerSensorBtn}
              onPress={() => setIsSensorModalOpen(true)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Compass size={17} color="#536B58" />
              <View style={styles.sensorActiveDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setIsNotifModalOpen(true)}
            >
              <Bell size={20} color="#1A1918" />
              <View style={styles.dotIndicator} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerBtn} onPress={() => setActiveTab('cart')}>
              <ShoppingBag size={20} color="#1A1918" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* VISTA ADMINISTRADOR (DASHBOARDS, ORDENES, INVENTARIO, MYSQL) */}
      {/* ============================================================== */}
      {isAdmin ? (
        <View style={styles.flex1}>
          {/* Sub-Tabs de Navegación del Administrador */}
          <View style={styles.adminSubTabsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adminSubTabs}>
              <TouchableOpacity
                style={[styles.adminSubTabItem, adminSubTab === 'dashboard' && styles.adminSubTabActive]}
                onPress={() => setAdminSubTab('dashboard')}
              >
                <Text style={[styles.adminSubTabText, adminSubTab === 'dashboard' && styles.adminSubTabTextActive]}>
                  Dashboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminSubTabItem, adminSubTab === 'orders' && styles.adminSubTabActive]}
                onPress={() => setAdminSubTab('orders')}
              >
                <Text style={[styles.adminSubTabText, adminSubTab === 'orders' && styles.adminSubTabTextActive]}>
                  Pedidos ({orders.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminSubTabItem, adminSubTab === 'inventory' && styles.adminSubTabActive]}
                onPress={() => setAdminSubTab('inventory')}
              >
                <Text style={[styles.adminSubTabText, adminSubTab === 'inventory' && styles.adminSubTabTextActive]}>
                  Inventario ({products.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminSubTabItem, adminSubTab === 'database' && styles.adminSubTabActive]}
                onPress={() => setAdminSubTab('database')}
              >
                <Text style={[styles.adminSubTabText, adminSubTab === 'database' && styles.adminSubTabTextActive]}>
                  Base de Datos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminSubTabItem, adminSubTab === 'push' && styles.adminSubTabActive]}
                onPress={() => setAdminSubTab('push')}
              >
                <Text style={[styles.adminSubTabText, adminSubTab === 'push' && styles.adminSubTabTextActive]}>
                  Campañas Push
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* TAB ADMIN 1: DASHBOARD EJECUTIVO */}
          {adminSubTab === 'dashboard' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.adminScrollContent}>
              <Text style={styles.sectionTitle}>Métricas Ejecutivas Dal</Text>
              <Text style={styles.sectionSubtitle}>Rendimiento en tiempo real del atelier y ventas.</Text>

              {/* Tarjetas KPI */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Ingresos Totales</Text>
                  <Text style={styles.kpiValue}>$24,850 USD</Text>
                  <Text style={styles.kpiTrend}>+18.4% este mes</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Pedidos Activos</Text>
                  <Text style={styles.kpiValue}>{orders.length} órdenes</Text>
                  <Text style={styles.kpiTrend}>2 en preparación</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Clientes Registrados</Text>
                  <Text style={styles.kpiValue}>{users.length} miembros</Text>
                  <Text style={styles.kpiTrend}>Alta fidelidad</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Ticket Promedio</Text>
                  <Text style={styles.kpiValue}>$126.50 USD</Text>
                  <Text style={styles.kpiTrend}>Colección Lino</Text>
                </View>
              </View>

              {/* Gráfico visual semanal de ventas */}
              <View style={styles.adminCard}>
                <Text style={styles.adminCardTitle}>Ventas Semanales (Lun - Dom)</Text>
                <Text style={styles.adminCardDesc}>Distribución de facturación de prendas de lino y sastrería.</Text>

                <View style={styles.barChartContainer}>
                  {[
                    { day: 'Lun', val: 55, amount: '$3.2k' },
                    { day: 'Mar', val: 70, amount: '$4.1k' },
                    { day: 'Mié', val: 45, amount: '$2.8k' },
                    { day: 'Jue', val: 85, amount: '$5.4k' },
                    { day: 'Vie', val: 100, amount: '$6.2k' },
                    { day: 'Sáb', val: 78, amount: '$4.8k' },
                    { day: 'Dom', val: 60, amount: '$3.5k' }
                  ].map((bar, idx) => (
                    <View key={idx} style={styles.barCol}>
                      <Text style={styles.barAmountText}>{bar.amount}</Text>
                      <View style={styles.barBackground}>
                        <View style={[styles.barFill, { height: `${bar.val}%` }]} />
                      </View>
                      <Text style={styles.barDayText}>{bar.day}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Desglose por Familia Textil */}
              <View style={styles.adminCard}>
                <Text style={styles.adminCardTitle}>Distribución por Familia Textil</Text>
                <View style={styles.distribRow}>
                  <Text style={styles.distribName}>Lino Orgánico</Text>
                  <View style={styles.distribBarWrapper}>
                    <View style={[styles.distribBar, { width: '45%', backgroundColor: '#536B58' }]} />
                  </View>
                  <Text style={styles.distribPercent}>45%</Text>
                </View>
                <View style={styles.distribRow}>
                  <Text style={styles.distribName}>Sastrería Fluida</Text>
                  <View style={styles.distribBarWrapper}>
                    <View style={[styles.distribBar, { width: '28%', backgroundColor: '#B56B47' }]} />
                  </View>
                  <Text style={styles.distribPercent}>28%</Text>
                </View>
                <View style={styles.distribRow}>
                  <Text style={styles.distribName}>Punto Suave</Text>
                  <View style={styles.distribBarWrapper}>
                    <View style={[styles.distribBar, { width: '15%', backgroundColor: '#8A9A86' }]} />
                  </View>
                  <Text style={styles.distribPercent}>15%</Text>
                </View>
                <View style={styles.distribRow}>
                  <Text style={styles.distribName}>Capas & Calzado</Text>
                  <View style={styles.distribBarWrapper}>
                    <View style={[styles.distribBar, { width: '12%', backgroundColor: '#2C2B2A' }]} />
                  </View>
                  <Text style={styles.distribPercent}>12%</Text>
                </View>
              </View>
            </ScrollView>
          )}

          {/* TAB ADMIN 2: GESTIÓN DE PEDIDOS EN VIVO */}
          {adminSubTab === 'orders' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.adminScrollContent}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Gestión de Pedidos en Vivo</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.greenPulse} />
                  <Text style={styles.liveText}>Sincronizado</Text>
                </View>
              </View>
              <Text style={styles.sectionSubtitle}>
                Actualiza el estado de despacho de tus clientes en tiempo real.
              </Text>

              {orders.map((order) => (
                <View key={order.id} style={styles.adminOrderCard}>
                  <View style={styles.adminOrderHeader}>
                    <View>
                      <Text style={styles.adminOrderId}>Orden #{order.id}</Text>
                      <Text style={styles.adminOrderCustomer}>
                        {order.customerName} • {order.date}
                      </Text>
                    </View>
                    <Text style={styles.adminOrderTotal}>${order.total.toFixed(2)} USD</Text>
                  </View>

                  <View style={styles.adminOrderDetails}>
                    <Text style={styles.adminOrderInfo}>
                      <Text style={styles.bold}>Dirección: </Text>{order.customerAddress}
                    </Text>
                    <Text style={styles.adminOrderInfo}>
                      <Text style={styles.bold}>Teléfono: </Text>{order.customerPhone}
                    </Text>
                    <Text style={styles.adminOrderInfo}>
                      <Text style={styles.bold}>Prendas: </Text>
                      {order.items.map((it) => `${it.quantity}x ${it.name} (${it.size})`).join(', ')}
                    </Text>
                  </View>

                  {/* Selector de Estado del Pedido */}
                  <Text style={styles.adminStatusLabel}>Cambiar Estado de Entrega:</Text>
                  <View style={styles.statusButtonsRow}>
                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        order.statusStep === 1 && styles.statusBtnActive1
                      ]}
                      onPress={() => handleUpdateOrderStatus(order.id, 1)}
                    >
                      <Clock size={14} color={order.statusStep === 1 ? '#FFFFFF' : '#1A1918'} />
                      <Text style={[styles.statusBtnText, order.statusStep === 1 && styles.statusBtnTextActive]}>
                        Preparando
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        order.statusStep === 2 && styles.statusBtnActive2
                      ]}
                      onPress={() => handleUpdateOrderStatus(order.id, 2)}
                    >
                      <Package size={14} color={order.statusStep === 2 ? '#FFFFFF' : '#1A1918'} />
                      <Text style={[styles.statusBtnText, order.statusStep === 2 && styles.statusBtnTextActive]}>
                        En Camino
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.statusBtn,
                        order.statusStep === 3 && styles.statusBtnActive3
                      ]}
                      onPress={() => handleUpdateOrderStatus(order.id, 3)}
                    >
                      <PackageCheck size={14} color={order.statusStep === 3 ? '#FFFFFF' : '#1A1918'} />
                      <Text style={[styles.statusBtnText, order.statusStep === 3 && styles.statusBtnTextActive]}>
                        Entregado
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* TAB ADMIN 3: CONTROL DE INVENTARIO Y CATÁLOGO */}
          {adminSubTab === 'inventory' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.adminScrollContent}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Inventario & Catálogo</Text>
                <TouchableOpacity
                  style={styles.newProductBtn}
                  onPress={() => setIsNewProductModalOpen(true)}
                >
                  <PackagePlus size={16} color="#FFFFFF" />
                  <Text style={styles.newProductBtnText}>+ Nueva Prenda</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSubtitle}>
                Modifica stock y disponibilidad visible para los clientes.
              </Text>

              {products.map((item) => (
                <View key={item.id} style={styles.adminProductRow}>
                  <Image source={{ uri: item.image }} style={styles.adminProdThumb} />
                  <View style={styles.adminProdInfo}>
                    <Text style={styles.adminProdSku}>{item.sku}</Text>
                    <Text style={styles.adminProdName}>{item.name}</Text>
                    <Text style={styles.adminProdPrice}>${item.price.toFixed(2)} USD • {item.typeName}</Text>
                  </View>

                  <View style={styles.adminProdControls}>
                    <View style={styles.stockStepper}>
                      <TouchableOpacity
                        style={styles.stockStepBtn}
                        onPress={() => handleAdjustStock(item.id, -1)}
                      >
                        <Minus size={12} color="#1A1918" />
                      </TouchableOpacity>
                      <Text style={styles.stockValText}>{item.stock}</Text>
                      <TouchableOpacity
                        style={styles.stockStepBtn}
                        onPress={() => handleAdjustStock(item.id, 1)}
                      >
                        <Plus size={12} color="#1A1918" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.activeToggleBtn,
                        item.active ? styles.activeToggleOn : styles.activeToggleOff
                      ]}
                      onPress={() => handleToggleProductActive(item.id)}
                    >
                      <Text style={styles.activeToggleText}>
                        {item.active ? 'Activo' : 'Pausado'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* TAB ADMIN 4: BASE DE DATOS MYSQL (dal_db) */}
          {adminSubTab === 'database' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.adminScrollContent}>
              <Text style={styles.sectionTitle}>Arquitectura de Base de Datos</Text>
              <Text style={styles.sectionSubtitle}>
                Esquema relacional MySQL `dal_db` implementado en `dal_database.sql`.
              </Text>

              <View style={styles.dbStatusCard}>
                <View style={styles.dbStatusDot} />
                <View>
                  <Text style={styles.dbStatusTitle}>Conexión Activa: dal_db (MySQL 8.0)</Text>
                  <Text style={styles.dbStatusDesc}>Motor InnoDB • utf8mb4_unicode_ci</Text>
                </View>
              </View>

              {[
                { table: 'users', rows: users.length, desc: 'Clientes y administradores con roles y hash de contraseña.' },
                { table: 'products', rows: products.length, desc: 'Catálogo de prendas, precios, descripciones y fibras.' },
                { table: 'product_variants', rows: products.length * 3, desc: 'Tallas (XS-XL), colores hex y control de existencias.' },
                { table: 'orders & order_items', rows: orders.length, desc: 'Ventas, direcciones y estado de entrega.' },
                { table: 'categories', rows: 5, desc: 'Familias de producto: Lino, Sastrería, Punto, Capas, Calzado.' },
                { table: 'boutiques', rows: 4, desc: 'Puntos físicos (Roma Norte, Polanco, Salamanca, SoHo).' }
              ].map((tbl, i) => (
                <View key={i} style={styles.dbTableCard}>
                  <View style={styles.dbTableHead}>
                    <Text style={styles.dbTableName}>{tbl.table}</Text>
                    <View style={styles.dbTableBadge}>
                      <Text style={styles.dbTableBadgeText}>{tbl.rows} registros</Text>
                    </View>
                  </View>
                  <Text style={styles.dbTableDesc}>{tbl.desc}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.downloadSqlBtn}
                onPress={() => {
                  Alert.alert(
                    'Esquema dal_database.sql',
                    'El archivo dal_database.sql se encuentra en la raíz del proyecto listo para importar en MySQL Workbench o phpMyAdmin.'
                  );
                }}
              >
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.downloadSqlBtnText}>Verificar Integridad SQL</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* TAB ADMIN 5: CAMPAÑAS PUSH MASIVAS */}
          {adminSubTab === 'push' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.adminScrollContent}>
              <Text style={styles.sectionTitle}>Emisión de Notificaciones Push</Text>
              <Text style={styles.sectionSubtitle}>
                Envía notificaciones a los dispositivos móviles de todos los clientes.
              </Text>

              <View style={styles.adminCard}>
                <Text style={styles.adminCardTitle}>Redactar Campaña Push</Text>

                <Text style={styles.inputLabel}>Título de la Notificación</Text>
                <TextInput
                  style={styles.adminInput}
                  placeholder="Ej. Dal Origines: Cápsula de Lino"
                  placeholderTextColor="#8A867E"
                  value={adminPushTitle}
                  onChangeText={setAdminPushTitle}
                />

                <Text style={styles.inputLabel}>Mensaje para el Cliente</Text>
                <TextInput
                  style={[styles.adminInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Ej. Descubre 4 siluetas frescas confeccionadas en fibras orgánicas."
                  placeholderTextColor="#8A867E"
                  multiline={true}
                  value={adminPushBody}
                  onChangeText={setAdminPushBody}
                />

                <TouchableOpacity style={styles.sendPushBtn} onPress={handleSendAdminPush}>
                  <Bell size={18} color="#FFFFFF" />
                  <Text style={styles.sendPushBtnText}>Disparar Notificación Push en la App</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 14 }]}>
                Campañas Enviadas Recientemente
              </Text>
              {[
                { title: 'Dal Capsule: Nueva Entrega de Lino', time: 'Hoy, 10:00 AM' },
                { title: 'Tu pedido #DAL-8921 va en camino', time: 'Ayer' },
                { title: 'Descuento de Cortesía en Atelier', time: 'Hace 3 días' }
              ].map((c, idx) => (
                <View key={idx} style={styles.sentCampaignRow}>
                  <Bell size={16} color="#536B58" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.sentCampaignTitle}>{c.title}</Text>
                    <Text style={styles.sentCampaignTime}>{c.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        /* ============================================================== */
        /* VISTA CLIENTE EXCLUSIVA (CATÁLOGO, COLECCIONES, FAVORITOS, BOLSA, MI CUENTA) */
        /* CERO DASHBOARDS, CERO TABLAS DE BD, CERO TELEMETRÍA VISIBLE */
        /* ============================================================== */
        <View style={styles.flex1}>
          {/* PESTAÑA 1: CATÁLOGO */}
          {activeTab === 'catalog' && (
            <View style={styles.flex1}>
                            {/* BARRA DE SENSORES Y RADAR BOUTIQUE DAL */}
              <TouchableOpacity
                style={styles.sensorQuickBar}
                onPress={() => setIsSensorModalOpen(true)}
                activeOpacity={0.88}
              >
                <View style={styles.sensorQuickBarLeft}>
                  <View style={styles.sensorPulseDot} />
                  <Radio size={13} color="#536B58" />
                  <Text style={styles.sensorQuickBarText} numberOfLines={1}>
                    {nearestBoutique
                      ? `Radar GPS: ${nearestBoutique.name} (${nearestBoutique.distanceKm < 1 ? Math.round(nearestBoutique.distanceKm * 1000) + 'm' : nearestBoutique.distanceKm.toFixed(1) + 'km'})`
                      : '3 Sensores Activos: Sacudida, Giroscopio 3D, GPS'}
                  </Text>
                </View>
                <View style={styles.sensorQuickBarBadge}>
                  <Text style={styles.sensorQuickBarBadgeText}>Ver Sensores</Text>
                  <ArrowRight size={11} color="#536B58" />
                </View>
              </TouchableOpacity>

              {/* Barra de Búsqueda Móvil */}
              <View style={styles.searchContainer}>
                <Search size={18} color="#8A867E" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar por lino, sastrería, abrigos..."
                  placeholderTextColor="#8A867E"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <X size={16} color="#8A867E" />
                  </TouchableOpacity>
                )}
              </View>

              {/* SECCIÓN PROMOCIONAL DE OTOÑO (Exclusiva antes de iniciar sesión) */}
              {!currentUser && (
                <View style={styles.autumnPromoContainer}>
                  <View style={styles.autumnHeaderRow}>
                    <View style={styles.autumnBadge}>
                      <Sparkles size={11} color="#B56B47" />
                      <Text style={styles.autumnBadgeText}>CAMPAÑA OTOÑO 2026</Text>
                    </View>
                    <Text style={styles.autumnSeasonalLabel}>Edición Especial</Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.autumnScrollContent}
                  >
                    {AUTUMN_PROMOS.map((promo) => (
                      <TouchableOpacity
                        key={promo.id}
                        style={styles.autumnPromoCard}
                        activeOpacity={0.92}
                        onPress={() => {
                          if (promo.category) {
                            setSelectedType(promo.category);
                            triggerPush('Campaña Otoño', `Filtrando por ${promo.categoryTitle}.`);
                          }
                        }}
                      >
                        <Image source={{ uri: promo.image }} style={styles.autumnPromoImg} />
                        <View style={styles.autumnCardGradient}>
                          <View style={styles.autumnOfferTag}>
                            <Text style={styles.autumnOfferTagText}>{promo.tag}</Text>
                          </View>
                          <Text style={styles.autumnCardTitle}>{promo.title}</Text>
                          <Text style={styles.autumnCardSubtitle}>{promo.subtitle}</Text>
                          <View style={styles.autumnActionRow}>
                            <Text style={styles.autumnActionText}>{promo.btnText}</Text>
                            <ArrowRight size={13} color="#FFFFFF" />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Selector Horizontal de Familias Textiles */}
              <View style={styles.typesScrollWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.typesScrollContent}
                >
                  {CLOTHING_TYPES.map((type) => {
                    const isActive = selectedType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        style={[styles.typeChip, isActive && styles.typeChipActive]}
                        onPress={() => setSelectedType(type.id)}
                      >
                        <Text style={[styles.typeChipText, isActive && styles.typeChipTextActive]}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Barra de Conteo y Botón Mezclar al Azar */}
              <View style={styles.catalogActionBar}>
                <Text style={styles.catalogItemsCount}>
                  {filteredProducts.length} prendas exclusivas
                </Text>
                <TouchableOpacity
                  style={styles.shuffleBtn}
                  onPress={handleShuffleProducts}
                  activeOpacity={0.7}
                >
                  <Sparkles size={13} color="#536B58" />
                  <Text style={styles.shuffleBtnText}>Mezclar al azar</Text>
                </TouchableOpacity>
              </View>

              {/* Grilla Móvil de 2 Columnas de Prendas */}
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isFav = wishlist.includes(item.id);
                  const isOutOfStock = item.stock <= 0;

                  return (
                    <TouchableOpacity
                      style={styles.productCard}
                      activeOpacity={0.88}
                      onPress={() => {
                        setSelectedProduct(item);
                        setSelectedSize('M');
                        setSelectedColor(0);
                      }}
                    >
                      <View style={styles.cardImageContainer}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />

                        {item.isNew && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>Nuevo</Text>
                          </View>
                        )}

                        {item.discount > 0 && (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>-{item.discount}%</Text>
                          </View>
                        )}

                        {isOutOfStock && (
                          <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockText}>Agotado</Text>
                          </View>
                        )}

                        <TouchableOpacity
                          style={styles.favBtn}
                          onPress={() => toggleWishlist(item.id)}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Heart
                            size={16}
                            color={isFav ? '#B56B47' : '#1A1918'}
                            fill={isFav ? '#B56B47' : 'none'}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.cardDetails}>
                        <Text style={styles.cardCategory}>{item.typeName}</Text>
                        <Text style={styles.cardName} numberOfLines={2}>
                          {item.name}
                        </Text>

                        <View style={styles.cardBottom}>
                          <View style={styles.priceRow}>
                            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                            {item.originalPrice > item.price && (
                              <Text style={styles.originalPrice}>
                                ${item.originalPrice.toFixed(2)}
                              </Text>
                            )}
                          </View>

                          <TouchableOpacity
                            style={[styles.addBtn, isOutOfStock && styles.addBtnDisabled]}
                            onPress={() => addToCart(item, 'M')}
                            disabled={isOutOfStock}
                          >
                            <Plus size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          {/* PESTAÑA 2: COLECCIONES */}
          {activeTab === 'collections' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.collectionsContainer}>
              <Text style={styles.sectionTitle}>Colecciones & Fibras</Text>
              <Text style={styles.sectionSubtitle}>
                Piezas confeccionadas con materias primas seleccionadas y caída natural.
              </Text>

              {CLOTHING_TYPES.filter((t) => t.id !== 'todos').map((type) => {
                const count = products.filter((p) => p.type === type.id && p.active).length;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.typeFamilyCard}
                    onPress={() => {
                      setSelectedType(type.id);
                      setActiveTab('catalog');
                    }}
                  >
                    <View style={styles.typeFamilyInfo}>
                      <Text style={styles.typeFamilyName}>{type.label}</Text>
                      <Text style={styles.typeFamilyDesc}>{type.desc}</Text>
                      <Text style={styles.typeFamilyCount}>{count} siluetas disponibles</Text>
                    </View>
                    <View style={styles.typeFamilyArrow}>
                      <ArrowRight size={18} color="#536B58" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* PESTAÑA 3: FAVORITOS (WISHLIST) */}
          {activeTab === 'wishlist' && (
            <View style={styles.flex1}>
              <View style={styles.tabHeaderBar}>
                <Text style={styles.sectionTitle}>Favoritos ({wishlist.length})</Text>
                <Text style={styles.sectionSubtitle}>Prendas guardadas para comprar más tarde.</Text>
              </View>

              {!currentUser ? (
                <View style={styles.emptyStateBox}>
                  <Lock size={44} color="#B56B47" />
                  <Text style={styles.emptyStateTitle}>Inicia sesión para guardar prendas</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Crea tu lista de deseos personalizada y guarda tus siluetas favoritas para cuando decidas comprar.
                  </Text>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => setActiveTab('account')}
                  >
                    <Text style={styles.primaryActionBtnText}>Iniciar Sesión / Crear Cuenta</Text>
                  </TouchableOpacity>
                </View>
              ) : wishlist.length === 0 ? (
                <View style={styles.emptyStateBox}>
                  <Heart size={44} color="#C4BFB5" />
                  <Text style={styles.emptyStateTitle}>No tienes prendas en favoritos</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Explora el catálogo y presiona el corazón en las prendas que te gusten.
                  </Text>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => setActiveTab('catalog')}
                  >
                    <Text style={styles.primaryActionBtnText}>Explorar Catálogo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={products.filter((p) => wishlist.includes(p.id))}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.productList}
                  renderItem={({ item }) => (
                    <View style={styles.productCard}>
                      <View style={styles.cardImageContainer}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <TouchableOpacity
                          style={styles.favBtn}
                          onPress={() => toggleWishlist(item.id)}
                        >
                          <Trash2 size={16} color="#B56B47" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.cardDetails}>
                        <Text style={styles.cardCategory}>{item.typeName}</Text>
                        <Text style={styles.cardName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <View style={styles.cardBottom}>
                          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                          <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => addToCart(item, 'M')}
                          >
                            <ShoppingBag size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          )}

          {/* PESTAÑA 4: BOLSA DE COMPRAS */}
          {activeTab === 'cart' && (
            <View style={styles.flex1}>
              <View style={styles.tabHeaderBar}>
                <Text style={styles.sectionTitle}>Bolsa de Compras ({cartCount})</Text>
              </View>

              {cart.length === 0 ? (
                <View style={styles.emptyStateBox}>
                  <ShoppingBag size={48} color="#C4BFB5" />
                  <Text style={styles.emptyStateTitle}>Tu bolsa está vacía</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    Descubre nuestras prendas de lino orgánico y sastrería.
                  </Text>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => setActiveTab('catalog')}
                  >
                    <Text style={styles.primaryActionBtnText}>Explorar Catálogo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <FlatList
                    data={cart}
                    keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
                    contentContainerStyle={styles.cartList}
                    renderItem={({ item }) => (
                      <View style={styles.cartItemCard}>
                        <Image source={{ uri: item.image }} style={styles.cartItemImg} />
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <Text style={styles.cartItemSize}>
                            Talla: <Text style={styles.bold}>{item.size}</Text> • ${item.price.toFixed(2)} USD
                          </Text>

                          <View style={styles.cartItemBottom}>
                            <View style={styles.stepper}>
                              <TouchableOpacity
                                style={styles.stepBtn}
                                onPress={() => updateQuantity(item.id, item.size, -1)}
                              >
                                <Minus size={14} color="#1A1918" />
                              </TouchableOpacity>
                              <Text style={styles.stepVal}>{item.quantity}</Text>
                              <TouchableOpacity
                                style={styles.stepBtn}
                                onPress={() => updateQuantity(item.id, item.size, 1)}
                              >
                                <Plus size={14} color="#1A1918" />
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                              onPress={() => updateQuantity(item.id, item.size, -item.quantity)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Trash2 size={16} color="#8A867E" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  />

                  {/* Pie de Bolsa con Descuento y Checkout */}
                  <View style={styles.cartFooter}>
                    <View style={styles.couponRow}>
                      <TextInput
                        style={styles.couponInput}
                        placeholder="Cupón (ej. DAL15 o LINO20)"
                        placeholderTextColor="#8A867E"
                        value={promoInput}
                        onChangeText={setPromoInput}
                        autoCapitalize="characters"
                      />
                      <TouchableOpacity
                        style={styles.couponApplyBtn}
                        onPress={() => {
                          const code = promoInput.trim().toUpperCase();
                          if (code === 'DAL15' || code === 'LINO20') {
                            setAppliedPromo({ code, percent: code === 'DAL15' ? 15 : 20 });
                            triggerPush('Cupón Aplicado', `Descuento del ${code === 'DAL15' ? 15 : 20}% activo.`);
                          } else {
                            Alert.alert('Cupón no válido', 'Prueba con "DAL15" o "LINO20".');
                          }
                        }}
                      >
                        <Tag size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
                    </View>

                    {discountAmount > 0 && (
                      <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: '#B56B47' }]}>
                          Descuento ({appliedPromo.percent}%)
                        </Text>
                        <Text style={[styles.summaryVal, { color: '#B56B47' }]}>
                          -${discountAmount.toFixed(2)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Envío Express</Text>
                      <Text style={styles.summaryVal}>
                        {shippingFee === 0 ? 'Gratis' : `$${shippingFee.toFixed(2)}`}
                      </Text>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalVal}>${total.toFixed(2)} USD</Text>
                    </View>

                    {!currentUser && (
                      <View style={styles.loginRequiredBanner}>
                        <View style={styles.loginRequiredIconBox}>
                          <Lock size={16} color="#B56B47" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.loginRequiredTitle}>Inicio de Sesión Requerido para Pagar</Text>
                          <Text style={styles.loginRequiredDesc}>
                            Para garantizar la seguridad de tu orden, debes iniciar sesión antes de pagar.
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.loginRequiredBtn}
                          onPress={() => setActiveTab('account')}
                        >
                          <Text style={styles.loginRequiredBtnText}>Ingresar</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.checkoutBtn}
                      onPress={() => {
                        if (!currentUser) {
                          Alert.alert(
                            'Iniciar Sesión Requerido',
                            'Para proceder al pago y procesar tu pedido necesitas iniciar sesión con tu cuenta.',
                            [
                              { text: 'Cancelar', style: 'cancel' },
                              { text: 'Iniciar Sesión', onPress: () => setActiveTab('account') }
                            ]
                          );
                          return;
                        }
                        setIsCheckoutOpen(true);
                      }}
                    >
                      <Text style={styles.checkoutBtnText}>Proceder al Pago</Text>
                      <ArrowRight size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}

          {/* PESTAÑA 5: MI CUENTA / AUTENTICACIÓN */}
          {activeTab === 'account' && (
            <ScrollView style={styles.flex1} contentContainerStyle={styles.accountContainer}>
              <Text style={styles.sectionTitle}>Cuenta Dal Atelier</Text>
              <Text style={styles.sectionSubtitle}>
                Gestión de compras, envíos y perfil de cliente.
              </Text>

              {currentUser ? (
                // PERFIL DE CLIENTE AUTENTICADO
                <View>
                  <View style={styles.profileCard}>
                    <View style={styles.avatarCircle}>
                      <User size={30} color="#536B58" />
                    </View>
                    <Text style={styles.profileName}>{currentUser.name}</Text>
                    <Text style={styles.profileEmail}>{currentUser.email}</Text>
                    <View style={styles.memberBadge}>
                      <Text style={styles.memberBadgeText}>
                        {currentUser.role === 'admin' ? 'ADMINISTRADOR ATELIER' : 'MIEMBRO EXCLUSIVO DAL'}
                      </Text>
                    </View>

                    <View style={styles.profileInfoList}>
                      <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Dirección de Envío:</Text>
                        <Text style={styles.profileInfoVal}>{currentUser.address}</Text>
                      </View>
                      <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Teléfono de Contacto:</Text>
                        <Text style={styles.profileInfoVal}>{currentUser.phone}</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                      <LogOut size={16} color="#B56B47" />
                      <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                  </View>

                  {/* SECCIÓN MIS PEDIDOS EN VIVO */}
                  <View style={styles.ordersSection}>
                    <Text style={styles.ordersSectionTitle}>Mis Pedidos ({userOrders.length})</Text>
                    <Text style={styles.ordersSectionSubtitle}>
                      Seguimiento del estado de confección y despacho en tiempo real.
                    </Text>

                    {userOrders.length === 0 ? (
                      <View style={styles.noOrdersCard}>
                        <Package size={28} color="#8A867E" />
                        <Text style={styles.noOrdersText}>Aún no has realizado pedidos.</Text>
                      </View>
                    ) : (
                      userOrders.map((ord) => (
                        <View key={ord.id} style={styles.clientOrderCard}>
                          <View style={styles.clientOrderTop}>
                            <Text style={styles.clientOrderId}>Orden #{ord.id}</Text>
                            <View
                              style={[
                                styles.clientStatusPill,
                                ord.statusStep === 3
                                  ? styles.pillDelivered
                                  : ord.statusStep === 2
                                  ? styles.pillTransit
                                  : styles.pillPrep
                              ]}
                            >
                              <Text style={styles.clientStatusText}>{ord.status}</Text>
                            </View>
                          </View>

                          <Text style={styles.clientOrderDate}>{ord.date}</Text>

                          <View style={styles.clientOrderItems}>
                            {ord.items.map((it, idx) => (
                              <Text key={idx} style={styles.clientOrderItemRow}>
                                • {it.quantity}x {it.name} (Talla {it.size})
                              </Text>
                            ))}
                          </View>

                          <View style={styles.clientOrderBottom}>
                            <Text style={styles.clientOrderTotalLabel}>Total Pagado:</Text>
                            <Text style={styles.clientOrderTotalVal}>${ord.total.toFixed(2)} USD</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                </View>
              ) : (
                // FORMULARIO: INICIAR SESIÓN / CREAR CUENTA
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                  {/* Selector Segmentado: Iniciar Sesión vs Crear Cuenta */}
                  <View style={styles.authSegmentContainer}>
                    <TouchableOpacity
                      style={[styles.authSegmentBtn, authMode === 'login' && styles.authSegmentActive]}
                      onPress={() => setAuthMode('login')}
                    >
                      <LogIn size={16} color={authMode === 'login' ? '#1A1918' : '#8A867E'} />
                      <Text style={[styles.authSegmentText, authMode === 'login' && styles.authSegmentTextActive]}>
                        Iniciar Sesión
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.authSegmentBtn, authMode === 'register' && styles.authSegmentActive]}
                      onPress={() => setAuthMode('register')}
                    >
                      <User size={16} color={authMode === 'register' ? '#1A1918' : '#8A867E'} />
                      <Text style={[styles.authSegmentText, authMode === 'register' && styles.authSegmentTextActive]}>
                        Crear Cuenta
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* FORMULARIO INICIAR SESIÓN */}
                  {authMode === 'login' ? (
                    <View style={styles.authFormCard}>
                      <Text style={styles.authTitle}>Iniciar Sesión</Text>
                      <Text style={styles.authSubtitle}>
                        Ingresa tu correo y contraseña para acceder a tu cuenta.
                      </Text>

                      <Text style={styles.inputLabel}>Correo Electrónico</Text>
                      <View style={styles.inputWithIcon}>
                        <Mail size={16} color="#8A867E" style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInputWithIcon}
                          placeholder="tu@correo.com"
                          placeholderTextColor="#8A867E"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={loginEmail}
                          onChangeText={setLoginEmail}
                        />
                      </View>

                      <Text style={styles.inputLabel}>Contraseña</Text>
                      <View style={styles.inputWithIcon}>
                        <Lock size={16} color="#8A867E" style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInputWithIcon}
                          placeholder="Tu contraseña"
                          placeholderTextColor="#8A867E"
                          secureTextEntry={!showLoginPassword}
                          value={loginPassword}
                          onChangeText={setLoginPassword}
                        />
                        <TouchableOpacity
                          style={styles.passwordToggleBtn}
                          onPress={() => setShowLoginPassword(!showLoginPassword)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          {showLoginPassword ? (
                            <EyeOff size={16} color="#8A867E" />
                          ) : (
                            <Eye size={16} color="#8A867E" />
                          )}
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleLogin}>
                        <LogIn size={18} color="#FFFFFF" />
                        <Text style={styles.primaryAuthBtnText}>Iniciar Sesión</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.authSwitchPrompt}
                        onPress={() => setAuthMode('register')}
                      >
                        <Text style={styles.authSwitchPromptText}>¿No tienes cuenta?</Text>
                        <Text style={styles.authSwitchLink}>Crear Cuenta</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // FORMULARIO CREAR CUENTA (SOLO CORREO Y CONTRASEÑA)
                    <View style={styles.authFormCard}>
                      <Text style={styles.authTitle}>Crear Cuenta</Text>
                      <Text style={styles.authSubtitle}>
                        Ingresa tu correo y una contraseña para registrarte en Dal Atelier.
                      </Text>

                      <Text style={styles.inputLabel}>Correo Electrónico</Text>
                      <View style={styles.inputWithIcon}>
                        <Mail size={16} color="#8A867E" style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInputWithIcon}
                          placeholder="tu@correo.com"
                          placeholderTextColor="#8A867E"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={regEmail}
                          onChangeText={setRegEmail}
                        />
                      </View>

                      <Text style={styles.inputLabel}>Contraseña</Text>
                      <View style={styles.inputWithIcon}>
                        <Lock size={16} color="#8A867E" style={styles.inputIcon} />
                        <TextInput
                          style={styles.textInputWithIcon}
                          placeholder="Crea una contraseña"
                          placeholderTextColor="#8A867E"
                          secureTextEntry={!showRegPassword}
                          value={regPassword}
                          onChangeText={setRegPassword}
                        />
                        <TouchableOpacity
                          style={styles.passwordToggleBtn}
                          onPress={() => setShowRegPassword(!showRegPassword)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          {showRegPassword ? (
                            <EyeOff size={16} color="#8A867E" />
                          ) : (
                            <Eye size={16} color="#8A867E" />
                          )}
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleRegister}>
                        <Check size={18} color="#FFFFFF" />
                        <Text style={styles.primaryAuthBtnText}>Crear Cuenta</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.authSwitchPrompt}
                        onPress={() => setAuthMode('login')}
                      >
                        <Text style={styles.authSwitchPromptText}>¿Ya tienes cuenta?</Text>
                        <Text style={styles.authSwitchLink}>Iniciar Sesión</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </KeyboardAvoidingView>
              )}
            </ScrollView>
          )}

          {/* DOCK INFERIOR DE NAVEGACIÓN PARA CLIENTES (5 TABS MÓVILES NATIVOS) */}
          <View style={styles.bottomDock}>
            <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('catalog')}>
              <ShoppingBag size={22} color={activeTab === 'catalog' ? '#B56B47' : '#8A867E'} />
              <Text style={[styles.dockLabel, activeTab === 'catalog' && styles.dockLabelActive]}>
                Catálogo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('collections')}>
              <Layers size={22} color={activeTab === 'collections' ? '#B56B47' : '#8A867E'} />
              <Text style={[styles.dockLabel, activeTab === 'collections' && styles.dockLabelActive]}>
                Colecciones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('wishlist')}>
              <Heart size={22} color={activeTab === 'wishlist' ? '#B56B47' : '#8A867E'} />
              {wishlist.length > 0 && (
                <View style={styles.dockBadge}>
                  <Text style={styles.dockBadgeText}>{wishlist.length}</Text>
                </View>
              )}
              <Text style={[styles.dockLabel, activeTab === 'wishlist' && styles.dockLabelActive]}>
                Favoritos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('cart')}>
              <ShoppingBag size={22} color={activeTab === 'cart' ? '#B56B47' : '#8A867E'} />
              {cartCount > 0 && (
                <View style={styles.dockBadge}>
                  <Text style={styles.dockBadgeText}>{cartCount}</Text>
                </View>
              )}
              <Text style={[styles.dockLabel, activeTab === 'cart' && styles.dockLabelActive]}>
                Bolsa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} onPress={() => setActiveTab('account')}>
              <User size={22} color={activeTab === 'account' ? '#B56B47' : '#8A867E'} />
              <Text style={[styles.dockLabel, activeTab === 'account' && styles.dockLabelActive]}>
                {currentUser ? 'Cuenta' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: DETALLE DE PRENDA */}
      {/* ============================================================== */}
      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {selectedProduct && (
              <>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedProduct(null)}
                >
                  <X size={20} color="#1A1918" />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={[
                      styles.modalImageContainer,
                      parallax3dEnabled && {
                        transform: [
                          { perspective: 900 },
                          { rotateY: `${Math.max(-12, Math.min(12, gyroData.y * 14))}deg` },
                          { rotateX: `${Math.max(-12, Math.min(12, -gyroData.x * 14))}deg` }
                        ]
                      }
                    ]}
                  >
                    <Image source={{ uri: selectedProduct.image }} style={styles.modalProductImg} />
                    {parallax3dEnabled && (
                      <View style={styles.gyroBadge}>
                        <Compass size={11} color="#FFFFFF" />
                        <Text style={styles.gyroBadgeText}>
                          Giroscopio 3D Activo ({gyroData.y.toFixed(1)}°)
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.modalCategory}>{selectedProduct.typeName}</Text>
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <Text style={styles.modalPrice}>${selectedProduct.price.toFixed(2)} USD</Text>

                    {/* Selector de Tallas */}
                    <Text style={styles.modalSectionLabel}>Talla</Text>
                    <View style={styles.sizesRow}>
                      {selectedProduct.sizes.map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[styles.sizeChip, selectedSize === s && styles.sizeChipActive]}
                          onPress={() => setSelectedSize(s)}
                        >
                          <Text style={[styles.sizeChipText, selectedSize === s && styles.sizeChipTextActive]}>
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Muestrario de Colores */}
                    <Text style={styles.modalSectionLabel}>Color</Text>
                    <View style={styles.colorsRow}>
                      {selectedProduct.colors.map((c, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[
                            styles.colorCircle,
                            { backgroundColor: c },
                            selectedColor === i && styles.colorCircleActive
                          ]}
                          onPress={() => setSelectedColor(i)}
                        />
                      ))}
                    </View>

                    {/* Especificaciones Técnicas de la Tela */}
                    <View style={styles.specsBox}>
                      <Text style={styles.specsText}>
                        <Text style={styles.bold}>Composición: </Text>
                        {selectedProduct.material}
                      </Text>
                      <Text style={styles.specsText}>
                        <Text style={styles.bold}>Ajuste: </Text>
                        {selectedProduct.fit}
                      </Text>
                      <Text style={styles.specsText}>
                        <Text style={styles.bold}>Cuidados: </Text>
                        {selectedProduct.care}
                      </Text>
                      <Text style={styles.specsText}>
                        <Text style={styles.bold}>Disponibilidad: </Text>
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} unidades en taller` : 'Agotado'}
                      </Text>
                    </View>

                    {/* Botón Añadir */}
                    <TouchableOpacity
                      style={[
                        styles.modalAddBtn,
                        selectedProduct.stock <= 0 && styles.modalAddBtnDisabled
                      ]}
                      onPress={() => {
                        addToCart(selectedProduct, selectedSize);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.stock <= 0}
                    >
                      <ShoppingBag size={18} color="#FFFFFF" />
                      <Text style={styles.modalAddBtnText}>
                        {selectedProduct.stock > 0 ? 'Añadir a la Bolsa' : 'Agotado Temporalmente'}
                      </Text>
                    </TouchableOpacity>

                    {/* Botón Guardar en Favoritos (Requiere Iniciar Sesión) */}
                    <TouchableOpacity
                      style={styles.modalSaveWishlistBtn}
                      onPress={() => toggleWishlist(selectedProduct.id)}
                    >
                      <Heart
                        size={16}
                        color={wishlist.includes(selectedProduct.id) ? '#B56B47' : '#1A1918'}
                        fill={wishlist.includes(selectedProduct.id) ? '#B56B47' : 'none'}
                      />
                      <Text style={styles.modalSaveWishlistText}>
                        {wishlist.includes(selectedProduct.id) ? 'Guardado en Favoritos' : 'Guardar en Favoritos'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: CHECKOUT RÁPIDO */}
      {/* ============================================================== */}
      <Modal
        visible={isCheckoutOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCheckoutOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsCheckoutOpen(false)}>
              <X size={20} color="#1A1918" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Entrega</Text>
              <Text style={styles.sectionSubtitle}>
                Despacho artesanal express con empaque reciclable.
              </Text>

              <View style={styles.checkoutAuthNotice}>
                <ShieldCheck size={16} color="#536B58" />
                <Text style={styles.checkoutAuthNoticeText}>
                  Comprando con la cuenta de{' '}
                  <Text style={{ fontWeight: '700', color: '#1A1918' }}>
                    {currentUser?.name || currentUser?.email || 'Usuario Dal'}
                  </Text>
                </Text>
              </View>

              <Text style={styles.inputLabel}>Nombre del Destinatario</Text>
              <TextInput
                style={styles.authInput}
                value={checkoutName}
                onChangeText={setCheckoutName}
                placeholder="Nombre y apellido"
              />

              <Text style={styles.inputLabel}>Dirección de Entrega</Text>
              <TextInput
                style={styles.authInput}
                value={checkoutAddress}
                onChangeText={setCheckoutAddress}
                placeholder="Calle, número, colonia, ciudad"
              />

              <Text style={styles.inputLabel}>Teléfono de Contacto</Text>
              <TextInput
                style={styles.authInput}
                value={checkoutPhone}
                onChangeText={setCheckoutPhone}
                keyboardType="phone-pad"
                placeholder="+52 55 ..."
              />

              {/* Método de Pago */}
              <Text style={styles.modalSectionLabel}>Método de Pago</Text>
              <View style={styles.paymentMethodsRow}>
                {[
                  { id: 'card', label: 'Tarjeta' },
                  { id: 'apple', label: 'Apple Pay' },
                  { id: 'cash', label: 'Contra Entrega' }
                ].map((pm) => (
                  <TouchableOpacity
                    key={pm.id}
                    style={[styles.paymentChip, paymentMethod === pm.id && styles.paymentChipActive]}
                    onPress={() => setPaymentMethod(pm.id)}
                  >
                    <Text style={[styles.paymentChipText, paymentMethod === pm.id && styles.paymentChipTextActive]}>
                      {pm.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.checkoutTotalRow}>
                <Text style={styles.totalLabel}>Total a Pagar</Text>
                <Text style={styles.totalVal}>${total.toFixed(2)} USD</Text>
              </View>

              <TouchableOpacity style={styles.modalAddBtn} onPress={handleConfirmOrder}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.modalAddBtnText}>Confirmar y Pagar Orden</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 3: AGREGAR PRENDA NUEVA (ADMIN) */}
      {/* ============================================================== */}
      <Modal
        visible={isNewProductModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsNewProductModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsNewProductModalOpen(false)}>
              <X size={20} color="#1A1918" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Agregar Prenda al Catálogo</Text>
              <Text style={styles.sectionSubtitle}>
                La prenda se agregará inmediatamente a la tienda de clientes.
              </Text>

              <Text style={styles.inputLabel}>Nombre de la Prenda</Text>
              <TextInput
                style={styles.authInput}
                placeholder="ej. Sobrecamisa Lino Almendra"
                placeholderTextColor="#8A867E"
                value={newProdName}
                onChangeText={setNewProdName}
              />

              <Text style={styles.inputLabel}>Familia Textil</Text>
              <View style={styles.typesRowWrap}>
                {CLOTHING_TYPES.filter((t) => t.id !== 'todos').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.typeChip, newProdType === t.id && styles.typeChipActive]}
                    onPress={() => setNewProdType(t.id)}
                  >
                    <Text style={[styles.typeChipText, newProdType === t.id && styles.typeChipTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Precio en USD</Text>
              <TextInput
                style={styles.authInput}
                placeholder="89.00"
                placeholderTextColor="#8A867E"
                keyboardType="numeric"
                value={newProdPrice}
                onChangeText={setNewProdPrice}
              />

              <Text style={styles.inputLabel}>Composición Textil</Text>
              <TextInput
                style={styles.authInput}
                placeholder="ej. 100% Lino Orgánico Francés"
                placeholderTextColor="#8A867E"
                value={newProdMaterial}
                onChangeText={setNewProdMaterial}
              />

              <Text style={styles.inputLabel}>Stock Inicial</Text>
              <TextInput
                style={styles.authInput}
                placeholder="20"
                placeholderTextColor="#8A867E"
                keyboardType="numeric"
                value={newProdStock}
                onChangeText={setNewProdStock}
              />

              <Text style={styles.inputLabel}>URL de Imagen (Opcional)</Text>
              <TextInput
                style={styles.authInput}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor="#8A867E"
                value={newProdImage}
                onChangeText={setNewProdImage}
              />

              <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddNewProduct}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.modalAddBtnText}>Publicar en la Tienda</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 4: CENTRO DE NOTIFICACIONES */}
      {/* ============================================================== */}
      <Modal
        visible={isNotifModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsNotifModalOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.notifDialog}>
            <View style={styles.rowBetween}>
              <Text style={styles.adminCardTitle}>Novedades Dal</Text>
              <TouchableOpacity onPress={() => setIsNotifModalOpen(false)}>
                <X size={18} color="#1A1918" />
              </TouchableOpacity>
            </View>

            <View style={styles.notifItem}>
              <View style={styles.notifIconCircle}>
                <Sparkles size={16} color="#536B58" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Colección Lino 2026</Text>
                <Text style={styles.notifDesc}>Texturas suaves con 19% de descuento en siluetas seleccionadas.</Text>
              </View>
            </View>

            <View style={styles.notifItem}>
              <View style={styles.notifIconCircle}>
                <ShieldCheck size={16} color="#B56B47" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Atelier Sustentable</Text>
                <Text style={styles.notifDesc}>Todas las prendas cuentan con certificado ecológico europeo.</Text>
              </View>
            </View>

            {/* Token FCM del Dispositivo */}
            <View style={styles.fcmTokenBox}>
              <Text style={styles.fcmTokenLabel}>Token FCM de este Dispositivo (Android):</Text>
              <Text style={styles.fcmTokenValue} numberOfLines={2} selectable={true}>
                {fcmToken || 'Obteniendo token de Firebase FCM...'}
              </Text>
              {fcmToken && (
                <TouchableOpacity
                  style={styles.copyTokenBtn}
                  onPress={() => {
                    Alert.alert('Token FCM Copiado', fcmToken);
                  }}
                >
                  <Text style={styles.copyTokenBtnText}>Ver / Copiar Token Completo</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.notifCloseBtn}
              onPress={() => setIsNotifModalOpen(false)}
            >
              <Text style={styles.notifCloseBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 5: DETALLE DE PEDIDO POR NOTIFICACIÓN PUSH (#123) */}
      {/* ============================================================== */}
      <Modal
        visible={!!selectedOrderForDetail}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOrderForDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {selectedOrderForDetail && (
              <>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedOrderForDetail(null)}
                >
                  <X size={20} color="#1A1918" />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent}>
                  <View style={styles.pushOrderHeaderBadge}>
                    <Bell size={14} color="#536B58" />
                    <Text style={styles.pushOrderBadgeText}>ABIERTO DESDE NOTIFICACIÓN PUSH</Text>
                  </View>

                  <Text style={styles.modalTitle}>Pedido #{selectedOrderForDetail.id}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {selectedOrderForDetail.date} • {selectedOrderForDetail.customerName}
                  </Text>

                  {/* Estado Visual de la Entrega */}
                  <View style={styles.orderTrackingBox}>
                    <View style={styles.trackingStepRow}>
                      <View style={[styles.trackingDot, styles.trackingDotActive]} />
                      <View style={styles.trackingLine} />
                      <View
                        style={[
                          styles.trackingDot,
                          selectedOrderForDetail.statusStep >= 2 && styles.trackingDotActive
                        ]}
                      />
                      <View style={styles.trackingLine} />
                      <View
                        style={[
                          styles.trackingDot,
                          selectedOrderForDetail.statusStep >= 3 && styles.trackingDotActive
                        ]}
                      />
                    </View>
                    <View style={styles.trackingLabelsRow}>
                      <Text style={styles.trackingLabelText}>Atelier</Text>
                      <Text style={[styles.trackingLabelText, { fontWeight: '700', color: '#B56B47' }]}>
                        {selectedOrderForDetail.status}
                      </Text>
                      <Text style={styles.trackingLabelText}>Entregado</Text>
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>Dirección de Envío</Text>
                  <View style={styles.infoBox}>
                    <MapPin size={16} color="#536B58" />
                    <Text style={styles.infoBoxText}>{selectedOrderForDetail.customerAddress}</Text>
                  </View>

                  <Text style={styles.inputLabel}>Prendas en este Envío</Text>
                  <View style={styles.orderItemsListBox}>
                    {selectedOrderForDetail.items.map((it, idx) => (
                      <View key={idx} style={styles.orderItemRowModal}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderItemNameModal}>{it.name}</Text>
                          <Text style={styles.orderItemSubModal}>
                            Talla: {it.size} • Cantidad: {it.quantity}
                          </Text>
                        </View>
                        <Text style={styles.orderItemPriceModal}>
                          ${(it.price * it.quantity).toFixed(2)} USD
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.checkoutTotalRow}>
                    <Text style={styles.totalLabel}>Total Pagado</Text>
                    <Text style={styles.totalVal}>${selectedOrderForDetail.total.toFixed(2)} USD</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalAddBtn}
                    onPress={() => setSelectedOrderForDetail(null)}
                  >
                    <Check size={18} color="#FFFFFF" />
                    <Text style={styles.modalAddBtnText}>Aceptar y Cerrar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
          {/* ============================================================== */}
      {/* MODAL 4: TECNOLOGÍA SENSORIAL DAL ATELIER (3 SENSORES HARDWARE) */}
      {/* ============================================================== */}
      <Modal
        visible={isSensorModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSensorModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsSensorModalOpen(false)}>
              <X size={20} color="#1A1918" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent}>
              <View style={styles.sensorModalHeaderBadge}>
                <Radio size={14} color="#536B58" />
                <Text style={styles.sensorModalHeaderBadgeText}>TECNOLOGÍA SENSORIAL INTEGRADA</Text>
              </View>

              <Text style={styles.modalTitle}>3 Sensores de Hardware</Text>
              <Text style={styles.sectionSubtitle}>
                Sensores móviles activos vinculados en tiempo real con Dal Atelier.
              </Text>

              {/* SENSOR 1: ACELERÓMETRO (DETECCIÓN DE SACUDIDA) */}
              <View style={styles.sensorCard}>
                <View style={styles.sensorCardHeader}>
                  <View style={styles.sensorIconContainer}>
                    <Zap size={18} color="#B56B47" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sensorCardTitle}>1. Acelerómetro (Shake Sensor)</Text>
                    <Text style={styles.sensorCardSubtitle}>Detección de Sacudida Física</Text>
                  </View>
                  <View style={styles.sensorStatusBadgeActive}>
                    <Text style={styles.sensorStatusTextActive}>EN VIVO</Text>
                  </View>
                </View>

                <View style={styles.sensorMetricRow}>
                  <Text style={styles.sensorMetricLabel}>Fuerza Gravitacional G:</Text>
                  <Text style={styles.sensorMetricVal}>{accelG.toFixed(2)} G</Text>
                </View>

                {/* Barra dinámica de fuerza G */}
                <View style={styles.sensorBarTrack}>
                  <View
                    style={[
                      styles.sensorBarFill,
                      { width: `${Math.min(100, (accelG / 2.5) * 100)}%` }
                    ]}
                  />
                </View>

                <Text style={styles.sensorCardDesc}>
                  Sacude físicamente tu dispositivo para reorganizar el catálogo al azar y desbloquear el cupón exclusivo del 20% de descuento (SHAKE20).
                </Text>

                <TouchableOpacity
                  style={styles.sensorActionBtn}
                  onPress={() => {
                    handleShakeAction();
                  }}
                  activeOpacity={0.8}
                >
                  <Zap size={15} color="#FFFFFF" />
                  <Text style={styles.sensorActionBtnText}>Simular Sacudida de Celular</Text>
                </TouchableOpacity>

                {lastShakeTimestamp && (
                  <Text style={styles.lastEventText}>Última sacudida detectada: {lastShakeTimestamp}</Text>
                )}
              </View>

              {/* SENSOR 2: GIROSCOPIO (INCLINACIÓN 3D Y PERSPECTIVA) */}
              <View style={styles.sensorCard}>
                <View style={styles.sensorCardHeader}>
                  <View style={styles.sensorIconContainer}>
                    <Compass size={18} color="#536B58" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sensorCardTitle}>2. Giroscopio (3D Parallax Tilt)</Text>
                    <Text style={styles.sensorCardSubtitle}>Inclinación & Movimiento 3D</Text>
                  </View>
                  <View style={styles.sensorStatusBadgeActive}>
                    <Text style={styles.sensorStatusTextActive}>ACTIVO</Text>
                  </View>
                </View>

                <View style={styles.gyroAxisGrid}>
                  <View style={styles.gyroAxisCol}>
                    <Text style={styles.gyroAxisLabel}>Eje X</Text>
                    <Text style={styles.gyroAxisVal}>{gyroData.x.toFixed(2)}</Text>
                  </View>
                  <View style={styles.gyroAxisCol}>
                    <Text style={styles.gyroAxisLabel}>Eje Y</Text>
                    <Text style={styles.gyroAxisVal}>{gyroData.y.toFixed(2)}</Text>
                  </View>
                  <View style={styles.gyroAxisCol}>
                    <Text style={styles.gyroAxisLabel}>Eje Z</Text>
                    <Text style={styles.gyroAxisVal}>{gyroData.z.toFixed(2)}</Text>
                  </View>
                </View>

                <Text style={styles.sensorCardDesc}>
                  Al abrir el detalle de cualquier prenda, inclina tu teléfono hacia los lados o arriba para ver la caída, reflejo y profundidad 3D de la tela.
                </Text>

                <TouchableOpacity
                  style={[styles.sensorToggleBtn, parallax3dEnabled && styles.sensorToggleBtnActive]}
                  onPress={() => {
                    setParallax3dEnabled(!parallax3dEnabled);
                    triggerPush(
                      'Giroscopio 3D',
                      !parallax3dEnabled ? 'Efecto 3D de telas activado.' : 'Efecto 3D pausado.'
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Compass size={15} color={parallax3dEnabled ? '#FFFFFF' : '#1A1918'} />
                  <Text style={[styles.sensorToggleBtnText, parallax3dEnabled && styles.sensorToggleBtnTextActive]}>
                    {parallax3dEnabled ? 'Efecto 3D de Telas: Activado' : 'Efecto 3D de Telas: Pausado'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SENSOR 3: GEOLOCALIZACIÓN GPS (RADAR DE BOUTIQUES) */}
              <View style={styles.sensorCard}>
                <View style={styles.sensorCardHeader}>
                  <View style={styles.sensorIconContainer}>
                    <Navigation size={18} color="#2A5C8A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sensorCardTitle}>3. Geolocalización (GPS Radar)</Text>
                    <Text style={styles.sensorCardSubtitle}>Ubicación & Cercanía de Boutiques</Text>
                  </View>
                  <View style={styles.sensorStatusBadgeActive}>
                    <Text style={styles.sensorStatusTextActive}>GPS ON</Text>
                  </View>
                </View>

                <View style={styles.gpsCoordinatesRow}>
                  <Text style={styles.gpsCoordText}>
                    Lat: <Text style={styles.bold}>{userCoords.latitude.toFixed(4)}</Text> • Lon: <Text style={styles.bold}>{userCoords.longitude.toFixed(4)}</Text>
                  </Text>
                </View>

                {nearestBoutique && (
                  <View style={styles.nearestBoutiqueBox}>
                    <View style={styles.nearestBoutiqueHead}>
                      <Text style={styles.nearestBoutiqueName}>{nearestBoutique.name}</Text>
                      <View style={styles.distBadge}>
                        <Text style={styles.distBadgeText}>
                          {nearestBoutique.distanceKm < 1
                            ? Math.round(nearestBoutique.distanceKm * 1000) + ' m'
                            : nearestBoutique.distanceKm.toFixed(1) + ' km'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.nearestBoutiqueAddress}>{nearestBoutique.address}</Text>
                    <Text style={styles.nearestBoutiqueSchedule}>{nearestBoutique.schedule}</Text>
                    <Text style={styles.nearestBoutiquePickup}>✓ Retiro Express en Atelier Disponible Hoy</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.gpsRefreshBtn}
                  onPress={updateGpsLocation}
                  disabled={isLocating}
                  activeOpacity={0.8}
                >
                  <Radio size={15} color="#1A1918" />
                  <Text style={styles.gpsRefreshBtnText}>
                    {isLocating ? 'Calculando posición GPS...' : 'Actualizar Radar GPS'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalAddBtn}
                onPress={() => setIsSensorModalOpen(false)}
              >
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.modalAddBtnText}>Cerrar y Volver a la Tienda</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // ==========================================
  // ESTILOS DE SENSORES HARDWARE
  // ==========================================
  headerSensorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7EEE8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#D4E2D6'
  },
  sensorActiveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#536B58'
  },
  sensorQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  sensorQuickBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  sensorPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#536B58'
  },
  sensorQuickBarText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#263629',
    flex: 1
  },
  sensorQuickBarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E7EEE8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  sensorQuickBarBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#536B58'
  },
  modalImageContainer: {
    width: '100%',
    height: 290,
    position: 'relative',
    overflow: 'hidden'
  },
  gyroBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(26, 25, 24, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  gyroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  sensorModalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E7EEE8',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8
  },
  sensorModalHeaderBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#536B58',
    letterSpacing: 0.5
  },
  sensorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  sensorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  sensorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  sensorCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  sensorCardSubtitle: {
    fontSize: 11,
    color: '#6E6A63'
  },
  sensorStatusBadgeActive: {
    backgroundColor: '#E7EEE8',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  sensorStatusTextActive: {
    fontSize: 9,
    fontWeight: '800',
    color: '#536B58'
  },
  sensorMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  sensorMetricLabel: {
    fontSize: 11,
    color: '#6E6A63'
  },
  sensorMetricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B56B47'
  },
  sensorBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EFECE6',
    overflow: 'hidden',
    marginBottom: 8
  },
  sensorBarFill: {
    height: '100%',
    backgroundColor: '#B56B47',
    borderRadius: 3
  },
  sensorCardDesc: {
    fontSize: 11,
    color: '#6E6A63',
    lineHeight: 15,
    marginBottom: 10
  },
  sensorActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#B56B47',
    paddingVertical: 9,
    borderRadius: 10
  },
  sensorActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  lastEventText: {
    fontSize: 10,
    color: '#536B58',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center'
  },
  gyroAxisGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  gyroAxisCol: {
    flex: 1,
    backgroundColor: '#F8F7F4',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  gyroAxisLabel: {
    fontSize: 10,
    color: '#8A867E',
    fontWeight: '700'
  },
  gyroAxisVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1918',
    marginTop: 2
  },
  sensorToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingVertical: 9,
    borderRadius: 10
  },
  sensorToggleBtnActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  sensorToggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1918'
  },
  sensorToggleBtnTextActive: {
    color: '#FFFFFF'
  },
  gpsCoordinatesRow: {
    backgroundColor: '#F8F7F4',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  gpsCoordText: {
    fontSize: 11,
    color: '#524F4A',
    textAlign: 'center'
  },
  nearestBoutiqueBox: {
    backgroundColor: '#F7FAF7',
    borderWidth: 1,
    borderColor: '#D4E2D6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  nearestBoutiqueHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3
  },
  nearestBoutiqueName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#263629'
  },
  distBadge: {
    backgroundColor: '#536B58',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  distBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  nearestBoutiqueAddress: {
    fontSize: 11,
    color: '#524F4A'
  },
  nearestBoutiqueSchedule: {
    fontSize: 10,
    color: '#8A867E',
    marginTop: 2
  },
  nearestBoutiquePickup: {
    fontSize: 10,
    fontWeight: '700',
    color: '#536B58',
    marginTop: 4
  },
  gpsRefreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingVertical: 9,
    borderRadius: 10
  },
  gpsRefreshBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1918'
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F4'
  },
  flex1: {
    flex: 1
  },
  bold: {
    fontWeight: '700'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  // Push Toast Flotante
  pushToast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  pushToastIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E7EEE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  pushToastContent: {
    flex: 1
  },
  pushToastTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  pushToastBody: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2
  },
  pushToastClose: {
    padding: 4
  },

  // Cabecera Cliente
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F7F4',
    borderBottomWidth: 1,
    borderBottomColor: '#EBE7DE'
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#1A1918'
  },
  brandSubtitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#536B58',
    fontWeight: '600'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerLoginPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E7EEE8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CFDEC4'
  },
  headerLoginText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#536B58'
  },
  headerUserPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EFE6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    maxWidth: 105
  },
  headerUserText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1918'
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  dotIndicator: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B56B47'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#B56B47',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  backToAdminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1918',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
    alignSelf: 'flex-start'
  },
  backToAdminText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },

  // Cabecera Administrador
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DA'
  },
  adminBadgeRow: {
    marginBottom: 2
  },
  adminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B56B47',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  adminPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  adminSubtitle: {
    fontSize: 11,
    color: '#6E6A63'
  },
  adminHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  previewClientBtn: {
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14
  },
  previewClientBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1918'
  },
  logoutHeaderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FDF7F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E4DC'
  },

  // Admin Sub-Tabs
  adminSubTabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DA'
  },
  adminSubTabs: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  adminSubTabItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  adminSubTabActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  adminSubTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6A63'
  },
  adminSubTabTextActive: {
    color: '#FFFFFF'
  },

  // Contenido Admin Scroll
  adminScrollContent: {
    padding: 16,
    paddingBottom: 40
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  kpiCard: {
    width: (width - 42) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A867E',
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1A1918',
    marginVertical: 4
  },
  kpiTrend: {
    fontSize: 11,
    color: '#536B58',
    fontWeight: '600'
  },

  // Tarjeta Admin Genérica
  adminCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 16
  },
  adminCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1918'
  },
  adminCardDesc: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2,
    marginBottom: 14
  },

  // Gráfico de Barras
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
    paddingHorizontal: 4
  },
  barCol: {
    alignItems: 'center',
    flex: 1
  },
  barAmountText: {
    fontSize: 9,
    color: '#8A867E',
    marginBottom: 4
  },
  barBackground: {
    width: 14,
    height: 90,
    backgroundColor: '#F3EFE6',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    backgroundColor: '#B56B47',
    borderRadius: 7
  },
  barDayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1918',
    marginTop: 6
  },

  // Distribución
  distribRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  distribName: {
    width: 110,
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1918'
  },
  distribBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3EFE6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10
  },
  distribBar: {
    height: '100%',
    borderRadius: 4
  },
  distribPercent: {
    width: 32,
    fontSize: 11,
    fontWeight: '700',
    color: '#6E6A63',
    textAlign: 'right'
  },

  // Pedidos Admin
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E7EEE8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#536B58'
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#536B58'
  },
  adminOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 14
  },
  adminOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EFE6',
    paddingBottom: 10,
    marginBottom: 10
  },
  adminOrderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1918'
  },
  adminOrderCustomer: {
    fontSize: 11,
    color: '#6E6A63',
    marginTop: 2
  },
  adminOrderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B56B47'
  },
  adminOrderDetails: {
    gap: 4,
    marginBottom: 12
  },
  adminOrderInfo: {
    fontSize: 12,
    color: '#524F4A',
    lineHeight: 16
  },
  adminStatusLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#8A867E',
    marginBottom: 6
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 6
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    backgroundColor: '#F8F7F4'
  },
  statusBtnActive1: {
    backgroundColor: '#8A9A86',
    borderColor: '#8A9A86'
  },
  statusBtnActive2: {
    backgroundColor: '#B56B47',
    borderColor: '#B56B47'
  },
  statusBtnActive3: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  statusBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1918'
  },
  statusBtnTextActive: {
    color: '#FFFFFF'
  },

  // Inventario Admin
  newProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1918',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16
  },
  newProductBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  adminProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 10
  },
  adminProdThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#EFECE6'
  },
  adminProdInfo: {
    flex: 1,
    marginLeft: 10
  },
  adminProdSku: {
    fontSize: 9,
    fontWeight: '700',
    color: '#536B58',
    textTransform: 'uppercase'
  },
  adminProdName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1918'
  },
  adminProdPrice: {
    fontSize: 11,
    color: '#6E6A63',
    marginTop: 2
  },
  adminProdControls: {
    alignItems: 'flex-end',
    gap: 6
  },
  stockStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 8,
    backgroundColor: '#F8F7F4'
  },
  stockStepBtn: {
    padding: 5
  },
  stockValText: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#1A1918'
  },
  activeToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  activeToggleOn: {
    backgroundColor: '#E7EEE8'
  },
  activeToggleOff: {
    backgroundColor: '#FBEBEB'
  },
  activeToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1918'
  },

  // Base de Datos MySQL Admin
  dbStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E7EEE8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CFDEC4'
  },
  dbStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#536B58'
  },
  dbStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263629'
  },
  dbStatusDesc: {
    fontSize: 11,
    color: '#536B58',
    marginTop: 1
  },
  dbTableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 8
  },
  dbTableHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  dbTableName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  dbTableBadge: {
    backgroundColor: '#F3EFE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  dbTableBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6E6A63'
  },
  dbTableDesc: {
    fontSize: 11,
    color: '#6E6A63'
  },
  downloadSqlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#536B58',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8
  },
  downloadSqlBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // Push Admin
  adminInput: {
    height: 42,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1A1918',
    marginBottom: 10
  },
  sendPushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B56B47',
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 6
  },
  sendPushBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  sentCampaignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginTop: 8
  },
  sentCampaignTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1918'
  },
  sentCampaignTime: {
    fontSize: 10,
    color: '#8A867E'
  },

  // ==========================================
  // ESTILOS DE VISTA CLIENTE
  // ==========================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1918'
  },
  typesScrollWrapper: {
    marginBottom: 8
  },
  typesScrollContent: {
    paddingHorizontal: 16,
    gap: 8
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  typeChipActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6A63'
  },
  typeChipTextActive: {
    color: '#FFFFFF'
  },

  // Banner de Invitado en Página Principal (Sin Iniciar Sesión)
  guestBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  guestBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDF7F4',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3E4DC',
    marginBottom: 6
  },
  guestBannerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B56B47',
    letterSpacing: 0.5
  },
  guestBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1918',
    marginBottom: 4
  },
  guestBannerDesc: {
    fontSize: 11,
    color: '#6E6A63',
    lineHeight: 16,
    marginBottom: 12
  },
  guestBannerActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  guestBannerBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1A1918',
    paddingVertical: 10,
    borderRadius: 10
  },
  guestBannerBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  guestBannerBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingVertical: 10,
    borderRadius: 10
  },
  guestBannerBtnSecondaryText: {
    color: '#1A1918',
    fontSize: 12,
    fontWeight: '700'
  },
  guestPerksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
    paddingTop: 10
  },
  guestPerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  guestPerkText: {
    fontSize: 10,
    color: '#536B58',
    fontWeight: '600'
  },

  // Banner de Bienvenida para Usuario Autenticado
  userWelcomeBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    marginTop: 6,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  userWelcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E7EEE8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },
  userWelcomeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#536B58',
    letterSpacing: 0.5
  },
  userWelcomeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1918'
  },
  userWelcomeSubtitle: {
    fontSize: 11,
    color: '#6E6A63',
    marginTop: 2
  },

  // Grilla de Productos
    // Sección Promocional de Otoño (Antes de Iniciar Sesión)
  autumnPromoContainer: {
    marginVertical: 10
  },
  autumnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8
  },
  autumnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FDF5E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3E5C8'
  },
  autumnBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B56B47',
    letterSpacing: 0.5
  },
  autumnSeasonalLabel: {
    fontSize: 11,
    color: '#8A867E',
    fontWeight: '600'
  },
  autumnScrollContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  autumnPromoCard: {
    width: CARD_WIDTH * 1.68,
    height: 195,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1918',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  autumnPromoImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.8
  },
  autumnCardGradient: {
    flex: 1,
    backgroundColor: 'rgba(26, 25, 24, 0.48)',
    padding: 14,
    justifyContent: 'flex-end'
  },
  autumnOfferTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#B56B47',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },
  autumnOfferTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  autumnCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3
  },
  autumnCardSubtitle: {
    fontSize: 11,
    color: '#F4F2EB',
    lineHeight: 15,
    marginBottom: 8
  },
  autumnActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  autumnActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  // Banner Requerir Inicio de Sesión en Carrito
  loginRequiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7F4',
    borderWidth: 1,
    borderColor: '#F3E4DC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 10
  },
  loginRequiredIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E4DC'
  },
  loginRequiredTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1918'
  },
  loginRequiredDesc: {
    fontSize: 10,
    color: '#6E6A63',
    marginTop: 2
  },
  loginRequiredBtn: {
    backgroundColor: '#1A1918',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  loginRequiredBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },

  // Checkout Autenticado Notice
  checkoutAuthNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E7EEE8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CFDEC4'
  },
  checkoutAuthNoticeText: {
    fontSize: 12,
    color: '#263629'
  },

  catalogActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 4
  },
  catalogItemsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A867E'
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E7EEE8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4E2D6'
  },
  shuffleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#263629'
  },
  productList: {
    paddingHorizontal: 12,
    paddingBottom: 95
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 4,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 1.25,
    backgroundColor: '#EFECE6'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#536B58',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  discountBadge: {
    position: 'absolute',
    top: 26,
    left: 8,
    backgroundColor: '#B56B47',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(26, 25, 24, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardDetails: {
    padding: 10
  },
  cardCategory: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#536B58',
    fontWeight: '700',
    marginBottom: 2
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1918',
    lineHeight: 16,
    height: 32
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1918'
  },
  originalPrice: {
    fontSize: 11,
    color: '#8A867E',
    textDecorationLine: 'line-through'
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1918',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addBtnDisabled: {
    backgroundColor: '#C4BFB5'
  },

  // Colecciones
  collectionsContainer: {
    padding: 20,
    paddingBottom: 95
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1918'
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6E6A63',
    marginTop: 3,
    marginBottom: 16
  },
  typeFamilyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  typeFamilyInfo: {
    flex: 1
  },
  typeFamilyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1918'
  },
  typeFamilyDesc: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2
  },
  typeFamilyCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#536B58',
    marginTop: 6
  },
  typeFamilyArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Estados Vacíos
  tabHeaderBar: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  emptyStateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 60
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1918',
    marginTop: 12
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#6E6A63',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20
  },
  primaryActionBtn: {
    backgroundColor: '#1A1918',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // Carrito / Bolsa
  cartList: {
    padding: 16,
    paddingBottom: 20
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  cartItemImg: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: '#EFECE6'
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  cartItemSize: {
    fontSize: 11,
    color: '#6E6A63',
    marginTop: 2
  },
  cartItemBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  stepBtn: {
    padding: 6
  },
  stepVal: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    color: '#1A1918'
  },
  cartFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E4DA',
    padding: 16,
    paddingBottom: 90
  },
  couponRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  couponInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#1A1918'
  },
  couponApplyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1A1918',
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6E6A63'
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1918'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E8E4DA',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1918'
  },
  totalVal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B56B47'
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1918',
    paddingVertical: 14,
    borderRadius: 24
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },

  // Perfil & Autenticación
  accountContainer: {
    padding: 20,
    paddingBottom: 95
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 20
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E7EEE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1918'
  },
  profileEmail: {
    fontSize: 13,
    color: '#6E6A63',
    marginTop: 2
  },
  memberBadge: {
    backgroundColor: '#F3EFE6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#536B58',
    letterSpacing: 0.5
  },
  profileInfoList: {
    width: '100%',
    backgroundColor: '#F8F7F4',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16
  },
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileInfoLabel: {
    fontSize: 11,
    color: '#8A867E'
  },
  profileInfoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1918'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3E4DC',
    backgroundColor: '#FDF7F4'
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B56B47'
  },

  // Mis Pedidos
  ordersSection: {
    marginTop: 4
  },
  ordersSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1918'
  },
  ordersSectionSubtitle: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2,
    marginBottom: 12
  },
  noOrdersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  noOrdersText: {
    fontSize: 12,
    color: '#8A867E',
    marginTop: 8
  },
  clientOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    marginBottom: 12
  },
  clientOrderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clientOrderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1918'
  },
  clientStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  pillPrep: {
    backgroundColor: '#E7EEE8'
  },
  pillTransit: {
    backgroundColor: '#FDF7F4'
  },
  pillDelivered: {
    backgroundColor: '#EFECE6'
  },
  clientStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1A1918'
  },
  clientOrderDate: {
    fontSize: 11,
    color: '#8A867E',
    marginTop: 2,
    marginBottom: 8
  },
  clientOrderItems: {
    borderTopWidth: 1,
    borderTopColor: '#F8F7F4',
    paddingTop: 8,
    gap: 3
  },
  clientOrderItemRow: {
    fontSize: 12,
    color: '#524F4A'
  },
  clientOrderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8F7F4',
    paddingTop: 8,
    marginTop: 8
  },
  clientOrderTotalLabel: {
    fontSize: 12,
    color: '#6E6A63'
  },
  clientOrderTotalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B56B47'
  },

  // Auth Segment y Formulario
  authSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFECE6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16
  },
  authSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10
  },
  authSegmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  authSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A867E'
  },
  authSegmentTextActive: {
    color: '#1A1918',
    fontWeight: '700'
  },
  authFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1918'
  },
  authSubtitle: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2,
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#8A867E',
    marginBottom: 5,
    marginTop: 8
  },
  authInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1A1918',
    backgroundColor: '#F8F7F4',
    marginBottom: 6
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8F7F4',
    marginBottom: 6
  },
  inputIcon: {
    marginRight: 8
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 13,
    color: '#1A1918'
  },
  passwordToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authSwitchPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 4
  },
  authSwitchPromptText: {
    fontSize: 12,
    color: '#6E6A63'
  },
  authSwitchLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B56B47'
  },
  primaryAuthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1918',
    paddingVertical: 13,
    borderRadius: 22,
    marginTop: 16
  },
  primaryAuthBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },

  // Accesos Rápidos
  quickAccessSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3EFE6',
    paddingTop: 16,
    marginTop: 18
  },
  quickAccessTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#8A867E',
    marginBottom: 8
  },
  quickAccessBtnsRow: {
    flexDirection: 'row',
    gap: 8
  },
  quickAccessBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFDEC4',
    backgroundColor: '#F8F7F4'
  },
  quickAccessBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#536B58'
  },

  // Selector Rol Registro
  rolePickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  roleChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  roleChipActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6A63'
  },
  roleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  adminKeyBox: {
    backgroundColor: '#FDF7F4',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3E4DC',
    marginTop: 6
  },

  // Barra de Navegación Inferior (Dock)
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 76 : 64,
    backgroundColor: '#F8F7F4',
    borderTopWidth: 1,
    borderTopColor: '#E8E4DA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 8
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8A867E',
    marginTop: 3
  },
  dockLabelActive: {
    color: '#B56B47',
    fontWeight: '700'
  },
  dockBadge: {
    position: 'absolute',
    top: -3,
    right: 2,
    backgroundColor: '#B56B47',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  dockBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },

  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 25, 24, 0.6)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  modalProductImg: {
    width: '100%',
    height: 290,
    resizeMode: 'cover'
  },
  modalContent: {
    padding: 20
  },
  modalCategory: {
    fontSize: 11,
    textTransform: 'uppercase',
    color: '#536B58',
    fontWeight: '700',
    marginBottom: 4
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1918',
    marginBottom: 4
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B56B47',
    marginBottom: 14
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1A1918',
    marginBottom: 8,
    marginTop: 6
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  sizeChip: {
    minWidth: 44,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E4DA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7F4'
  },
  sizeChipActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  sizeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  sizeChipTextActive: {
    color: '#FFFFFF'
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8E4DA'
  },
  colorCircleActive: {
    borderColor: '#1A1918',
    transform: [{ scale: 1.15 }]
  },
  specsBox: {
    backgroundColor: '#F8F7F4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 4
  },
  specsText: {
    fontSize: 12,
    color: '#6E6A63',
    lineHeight: 16
  },
  modalAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1A1918',
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 6
  },
  modalAddBtnDisabled: {
    backgroundColor: '#C4BFB5'
  },
  modalAddBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  modalSaveWishlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 10
  },
  modalSaveWishlistText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },

  // Checkout Modal
  checkoutGuestNotice: {
    backgroundColor: '#FDF7F4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3E4DC',
    marginBottom: 12
  },
  checkoutGuestNoticeText: {
    fontSize: 11,
    color: '#6E6A63',
    lineHeight: 16
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  paymentChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8F7F4',
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  paymentChipActive: {
    backgroundColor: '#1A1918',
    borderColor: '#1A1918'
  },
  paymentChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E6A63'
  },
  paymentChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  checkoutTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E4DA',
    marginVertical: 10
  },
  typesRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },

  // Modal Centro de Notificaciones
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(26, 25, 24, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  notifDialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 14
  },
  notifIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  },
  notifDesc: {
    fontSize: 12,
    color: '#6E6A63',
    marginTop: 2
  },
  notifCloseBtn: {
    backgroundColor: '#1A1918',
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 18
  },
  notifCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // Token FCM Box
  fcmTokenBox: {
    backgroundColor: '#F8F7F4',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  fcmTokenLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1918',
    marginBottom: 4
  },
  fcmTokenValue: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#536B58'
  },
  copyTokenBtn: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center'
  },
  copyTokenBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1918'
  },

  // Modal Detalle Pedido Notificación Push
  pushOrderHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E7EEE8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8
  },
  pushOrderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#536B58'
  },
  orderTrackingBox: {
    backgroundColor: '#F8F7F4',
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E4DA'
  },
  trackingStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  trackingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D6D1C4'
  },
  trackingDotActive: {
    backgroundColor: '#B56B47'
  },
  trackingLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E8E4DA'
  },
  trackingLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  trackingLabelText: {
    fontSize: 10,
    color: '#6E6A63'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F7F4',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  infoBoxText: {
    fontSize: 12,
    color: '#1A1918'
  },
  orderItemsListBox: {
    backgroundColor: '#F8F7F4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8
  },
  orderItemRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderItemNameModal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1918'
  },
  orderItemSubModal: {
    fontSize: 11,
    color: '#6E6A63'
  },
  orderItemPriceModal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1918'
  }
});

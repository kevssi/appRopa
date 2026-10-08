// Servicio de Integración con APIs de Ropa y Catálogo Dal

// Catálogo propio exclusivo Dal (Atelier de fibras naturales y sarga contemporánea)
export const DAL_SIGNATURE_PRODUCTS = [
  {
    id: 1,
    sku: 'DAL-LINO-01',
    name: 'Camisa Sobrecamisa Lino Arena',
    slug: 'camisa-sobrecamisa-lino-arena',
    short_description: 'Corte desestructurado con textura artesanal transpirable.',
    description: 'Confeccionada en puro lino de grano medio cosechado de forma responsable. Su caída relajada y botones de corozo natural ofrecen un equilibrio perfecto entre soltura veraniega y prestancia sobria.',
    category: 'lino',
    categoryName: 'Esenciales Lino & Algodón',
    price: 89.00,
    original_price: 110.00,
    discount_percent: 19,
    material_composition: '100% Lino Orgánico Europeo',
    fit_type: 'Corte Relajado Moderno',
    care_instructions: 'Lavar a máquina en frío (máx. 30°C), secar a la sombra.',
    primary_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
    secondary_image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    rating: 4.95,
    reviews_count: 38,
    is_featured: true,
    is_new_drop: true,
    source: 'Dal Atelier',
    colors: [
      { name: 'Arena Natural', hex: '#E4DFD3' },
      { name: 'Verde Salvia', hex: '#8A9A86' },
      { name: 'Carbón Suave', hex: '#2C2B2A' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    sku: 'DAL-PNT-02',
    name: 'Pantalón Plisado Salvia Muted',
    slug: 'pantalon-plisado-salvia-muted',
    short_description: 'Pinza frontal suave y caída recta en sarga de algodón y tencel.',
    description: 'Silueta contemporánea con cintura elástica oculta y pinzas sutiles. La tonalidad verde salvia desaturada evoca naturaleza sin estridencias.',
    category: 'sastreria',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Salvia Muted', hex: '#8A9A86' },
      { name: 'Gris Grafito', hex: '#42413E' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 3,
    sku: 'DAL-KNT-03',
    name: 'Jersey Cuello Mock Algodón Crudo',
    slug: 'jersey-cuello-mock-algodon-crudo',
    short_description: 'Punto canalé fino con tacto sedoso y cuello chimenea discreto.',
    description: 'Una pieza de capas esencial. El punto de calibre 12 brinda calidez sin abultar, ideal para llevar bajo gabardinas o sobre camisas livianas.',
    category: 'punto',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Crudo Marfil', hex: '#F4F2EB' },
      { name: 'Avena Tostada', hex: '#D2C3B2' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 4,
    sku: 'DAL-OUT-04',
    name: 'Gabardina Fluida Piedra Pálido',
    slug: 'gabardina-fluida-piedra-palido',
    short_description: 'Trench coat desestructurado con solapa ancha y cinturón desmontable.',
    description: 'Inspirada en el minimalismo arquitectónico. Tejido impermeable ligero con tacto aterciopelado que fluye al caminar.',
    category: 'abrigos',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Piedra Pálido', hex: '#D8D4CC' },
      { name: 'Verde Bosque Tenue', hex: '#4A5B4F' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 5,
    sku: 'DAL-TEE-05',
    name: 'Camiseta Pesada Cuello Caja Carbón',
    slug: 'camiseta-pesada-cuello-caja-carbon',
    short_description: 'Gramaje 260 GSM con caída estructurada y acabado esmerilado.',
    description: 'El básico definitivo rediseñado. Cuello indeformable de canalé grueso y costuras reforzadas en un tono carbón profundo muy elegante.',
    category: 'esenciales',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Carbón Mate', hex: '#242426' },
      { name: 'Blanco Puro', hex: '#FFFFFF' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 6,
    sku: 'DAL-BLZ-06',
    name: 'Blazer Desestructurado Lino Arcilla',
    slug: 'blazer-desestructurado-lino-arcilla',
    short_description: 'Saco de dos botones sin forro interior, máxima transpirabilidad.',
    description: 'Permite elevar cualquier atuendo informal sin resultar rígido. Tono arcilla suave que combina a la perfección con crudos y azules lavados.',
    category: 'sastreria',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Arcilla Terracota', hex: '#B77C68' },
      { name: 'Lino Tostado', hex: '#C4B59D' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 7,
    sku: 'DAL-FTW-07',
    name: 'Mocasín Suela Flexible Cuero Crudo',
    slug: 'mocasin-suela-flexible-cuero-crudo',
    short_description: 'Piel napa curtida sin cromo con plantilla amortiguada ultra-ligera.',
    description: 'Comodidad inmediata desde el primer uso. Suela de caucho natural con agarre discreto y línea depurada.',
    category: 'calzado',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Cuero Canela', hex: '#A06E4D' },
      { name: 'Negro Mate', hex: '#1C1B1A' }
    ],
    sizes: ['39', '40', '41', '42', '43', '44']
  },
  {
    id: 8,
    sku: 'DAL-VES-08',
    name: 'Vestido Camisero Midi Algodón Popelín',
    slug: 'vestido-camisero-midi-algodon-popelin',
    short_description: 'Largo midi con aberturas laterales discretas y cinta ajustable.',
    description: 'Una silueta etérea que viste con gracia sin esfuerzo. El popelín fresco mantiene su estructura fresca durante todo el día.',
    category: 'vestidos',
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
    source: 'Dal Atelier',
    colors: [
      { name: 'Blanco Óptico', hex: '#FBFBFB' },
      { name: 'Azul Egeo Lavado', hex: '#879FB5' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  }
];

// Estado en memoria de productos externos sincronizados
let externalSyncedProducts = [];
let lastSyncTimestamp = null;
let syncStatus = 'ready'; // 'ready', 'syncing', 'synced', 'error'

// Función para sanitizar imágenes provenientes de APIs externas
function sanitizeImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
  let clean = url.replace(/^[\["]+/, '').replace(/[\]"]+$/, '');
  if (!clean.startsWith('http')) {
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
  }
  return clean;
}

export const clothingApi = {
  // Sincronizar con API de ropa externa (Platzi Fake Store API / FakeStoreAPI)
  async syncExternalClothing() {
    syncStatus = 'syncing';
    try {
      // 1. Intentar con Platzi Fake Store API (Categoría 1: Clothes)
      const platziUrl = 'https://api.escuelajs.co/api/v1/products/?categoryId=1&limit=10';
      const response = await fetch(platziUrl, { signal: AbortSignal.timeout(6000) });
      
      if (!response.ok) {
        throw new Error(`Platzi API respondió con código: ${response.status}`);
      }

      const data = await response.json();
      
      externalSyncedProducts = data.slice(0, 8).map((item, index) => {
        const cleanImg = sanitizeImageUrl(item.images && item.images[0]);
        return {
          id: 1000 + item.id,
          sku: `API-EXT-${item.id}`,
          name: item.title,
          slug: `ext-${item.id}-${index}`,
          short_description: 'Prenda contemporánea sincronizada en tiempo real mediante API.',
          description: item.description || 'Prenda seleccionada para el catálogo ampliado de Dal.',
          category: 'api-externa',
          categoryName: 'Colección Global API',
          price: Number(item.price) || 65.00,
          original_price: Number(item.price) ? Math.round(Number(item.price) * 1.15) : 75.00,
          discount_percent: 12,
          material_composition: 'Mezcla Textil Algodón & Fibras Técnicas',
          fit_type: 'Corte Regular Contemporáneo',
          care_instructions: 'Lavar en frío a 30°C.',
          primary_image: cleanImg,
          secondary_image: cleanImg,
          rating: 4.80,
          reviews_count: 12,
          is_featured: false,
          is_new_drop: false,
          source: 'Platzi Clothes API',
          colors: [
            { name: 'Tono Original', hex: '#6D7973' },
            { name: 'Crudo Textura', hex: '#EDE8E1' }
          ],
          sizes: ['S', 'M', 'L']
        };
      });

      lastSyncTimestamp = new Date();
      syncStatus = 'synced';
      return { success: true, count: externalSyncedProducts.length, source: 'Platzi Fashion API' };
    } catch (err) {
      console.warn('Fallo Platzi API, intentando fallback con FakeStoreAPI...', err.message);
      
      try {
        // Fallback a Fake Store API (Prendas de hombre y mujer)
        const fakeUrl = 'https://fakestoreapi.com/products/category/men\'s%20clothing';
        const res2 = await fetch(fakeUrl, { signal: AbortSignal.timeout(5000) });
        if (res2.ok) {
          const fakeData = await res2.json();
          externalSyncedProducts = fakeData.slice(0, 4).map((item) => ({
            id: 2000 + item.id,
            sku: `FS-EXT-${item.id}`,
            name: item.title,
            slug: `fake-ext-${item.id}`,
            short_description: 'Prenda importada de catálogo textil abierto.',
            description: item.description,
            category: 'api-externa',
            categoryName: 'Colección Global API',
            price: Number(item.price) || 55.00,
            original_price: Math.round(item.price * 1.2),
            discount_percent: 15,
            material_composition: 'Algodón Clásico & Poliéster Reciclado',
            fit_type: 'Corte Estándar',
            care_instructions: 'Lavar en ciclo suave.',
            primary_image: item.image,
            secondary_image: item.image,
            rating: item.rating?.rate || 4.7,
            reviews_count: item.rating?.count || 18,
            is_featured: false,
            is_new_drop: false,
            source: 'FakeStore Clothing API',
            colors: [{ name: 'Original', hex: '#3E4E50' }],
            sizes: ['S', 'M', 'L']
          }));
          lastSyncTimestamp = new Date();
          syncStatus = 'synced';
          return { success: true, count: externalSyncedProducts.length, source: 'FakeStore API' };
        }
      } catch (err2) {
        console.warn('Ambas APIs externas no respondieron o no hay conexión de red:', err2.message);
      }

      syncStatus = 'offline';
      return { success: false, error: 'No se pudo contactar el servicio de API externa. Operando con catálogo Dal exclusivo.' };
    }
  },

  // Obtener catálogo completo combinado o filtrado
  getAllProducts(filters = {}) {
    let combined = [...DAL_SIGNATURE_PRODUCTS, ...externalSyncedProducts];

    // Filtrar por categoría
    if (filters.category && filters.category !== 'todos') {
      combined = combined.filter(p => p.category === filters.category);
    }

    // Filtrar por origen (Dal Atelier vs API Externa)
    if (filters.source && filters.source !== 'todos') {
      if (filters.source === 'dal') {
        combined = combined.filter(p => p.source === 'Dal Atelier');
      } else if (filters.source === 'api') {
        combined = combined.filter(p => p.source !== 'Dal Atelier');
      }
    }

    // Filtrar por búsqueda de texto
    if (filters.search && filters.search.trim() !== '') {
      const term = filters.search.toLowerCase().trim();
      combined = combined.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.short_description?.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.material_composition?.toLowerCase().includes(term)
      );
    }

    // Ordenamiento
    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') combined.sort((a, b) => a.price - b.price);
      if (filters.sortBy === 'price-desc') combined.sort((a, b) => b.price - a.price);
      if (filters.sortBy === 'rating') combined.sort((a, b) => b.rating - a.rating);
      if (filters.sortBy === 'newest') combined.sort((a, b) => (b.is_new_drop ? 1 : 0) - (a.is_new_drop ? 1 : 0));
    }

    return combined;
  },

  getProductById(id) {
    const combined = [...DAL_SIGNATURE_PRODUCTS, ...externalSyncedProducts];
    return combined.find(p => p.id === Number(id));
  },

  getSyncInfo() {
    return {
      status: syncStatus,
      lastSync: lastSyncTimestamp ? lastSyncTimestamp.toLocaleTimeString() : 'Pendiente',
      externalItemsCount: externalSyncedProducts.length,
      dalItemsCount: DAL_SIGNATURE_PRODUCTS.length
    };
  }
};

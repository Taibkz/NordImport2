export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
  power: number;
  fuel_type: string;
  body_type: string;
  doors: number;
  color: string;
  trust_badges?: string[];
  finance_available: boolean;
  extras: string;
  description: string;
  images: string[];
  transmission?: string;
  province?: string;
  status?: string;
  seller_id?: string;
  created_at?: string;
  profiles?: {
    email?: string;
    phone?: string;
  };
}

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    brand: 'Audi',
    model: 'A3 S-Line',
    year: 2018,
    kilometers: 85000,
    price: 18500,
    power: 150,
    fuel_type: 'Diésel',
    body_type: 'Compacto',
    doors: 5,
    color: 'Blanco',
    trust_badges: ['Revisado Oficial', 'Único Propietario'],
    finance_available: true,
    extras: 'Faros Matrix LED, Asientos deportivos S-Line, Llantas 18", Volante multifunción, Sensores de aparcamiento',
    description: 'Coche en perfecto estado, mantenimientos al día en casa oficial. Único propietario. Se entrega transferido y con 1 año de garantía.',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'
    ],
    transmission: 'Automática',
    province: 'Madrid',
    status: 'approved'
  },
  {
    id: '2',
    brand: 'BMW',
    model: 'Serie 1 118d',
    year: 2019,
    kilometers: 62000,
    price: 21000,
    power: 150,
    fuel_type: 'Diésel',
    body_type: 'Compacto',
    doors: 5,
    color: 'Gris Mate',
    trust_badges: ['Garantía 12 Meses Premium', 'Libro de Mantenimiento'],
    finance_available: true,
    extras: 'Paquete M interior y exterior, Navegador Professional, Techo solar eléctrico, Asientos calefactables',
    description: 'Paquete M interior y exterior. Consumo bajísimo. Ruedas recién cambiadas.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
    ],
    transmission: 'Manual',
    province: 'Barcelona',
    status: 'approved'
  },
  {
    id: '3',
    brand: 'Porsche',
    model: 'Macan S',
    year: 2021,
    kilometers: 34000,
    price: 65000,
    power: 380,
    fuel_type: 'Gasolina',
    body_type: 'SUV',
    doors: 5,
    color: 'Negro Profundo',
    trust_badges: ['Porsche Approved', 'Sello Calidad Mínima', 'Único Propietario'],
    finance_available: true,
    extras: 'Llantas 21" RS Spyder Design, Suspensión neumática (PASM), Asientos de cuero 14 posiciones, Techo panorámico',
    description: 'Vehículo espectacular con configuración full extras. Todas las revisiones en Centro Porsche. Impecable estado de coleccionista.',
    images: [
      'https://images.unsplash.com/photo-1503376712344-652a0340c283?auto=format&fit=crop&w=600&q=80'
    ],
    transmission: 'Automática',
    province: 'Málaga',
    status: 'approved'
  },
  {
    id: '4',
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2022,
    kilometers: 15000,
    price: 45000,
    power: 498,
    fuel_type: 'Eléctrico',
    body_type: 'Berlina',
    doors: 5,
    color: 'Azul',
    trust_badges: ['Batería 100% Vida Útil', 'Garantía Tesla Oficial'],
    finance_available: false,
    extras: 'AutoPilot Mejorado, Interior blanco, Llantas 19" Sport',
    description: 'Batería de largo alcance, estado como nuevo.',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80'
    ],
    transmission: 'Automática',
    province: 'Valencia',
    status: 'approved'
  }
];

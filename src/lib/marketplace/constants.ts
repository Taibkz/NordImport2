export const CAR_BRANDS: Record<string, string[]> = {
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i8"],
  "Mercedes-Benz": ["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Clase G", "Vito"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Arteon", "T-Cross", "T-Roc", "Tiguan", "Touareg", "ID.3", "ID.4"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Boxster", "718 Cayman"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Toyota": ["Yaris", "Corolla", "Camry", "C-HR", "RAV4", "Land Cruiser", "Hilux", "Prius"],
  "Ford": ["Fiesta", "Focus", "Mondeo", "Mustang", "Puma", "Kuga", "Explorer", "Ranger"],
  "Renault": ["Clio", "Megane", "Captur", "Kadjar", "Koleos", "Kangoo"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"]
};

export const BODY_TYPES: string[] = ["SUV", "Berlina", "Compacto", "Deportivo", "Familiar", "Monovolumen", "Cabrio", "Coupé", "Todoterreno", "Pick-up"];
export const FUEL_TYPES: string[] = ["Diésel", "Gasolina", "Híbrido", "Híbrido Enchufable", "Eléctrico", "GLP"];
export const TRANSMISSIONS: string[] = ["Automática", "Semiautomática", "Manual"];

export const PROVINCES_SPAIN: string[] = [
  "A Coruña", "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", 
  "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada", 
  "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", 
  "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Segovia", "Sevilla", 
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

export const EXTRAS_CATALOG: Record<string, string[]> = {
  Interior: ["Cuero Extendido", "Asientos Calefactables", "Asientos Ventilados", "Volante Deportivo", "Alcántara", "Head-Up Display"],
  Exterior: ["Pintura Metalizada", "Pintura Mate", "Llantas Forjadas +20", "Escape Deportivo", "Techo Solar Panorámico", "Frenos Cerámicos", "Paquete Carbono"],
  Tecnologia: ["Cámara 360º", "Control Crucero Adaptativo", "Apple CarPlay / Android Auto", "Suspensión Neumática", "Sistema Sonido Premium", "Faros Matrix LED"]
};

export interface SearchFilters {
  search: string;
  brand: string;
  model: string;
  yearMin: number;
  yearMax: number;
  powerMin: number;
  powerMax: number;
  priceMin: number;
  priceMax: number;
  fuel_type: string;
  body_type: string;
  doors: string;
  province: string;
  transmission: string;
  sortBy: string;
  extras: string[];
}

export const FILTER_DEFAULTS: SearchFilters = {
  search: '', 
  brand: '', 
  model: '', 
  yearMin: 1980, 
  yearMax: 2026, 
  powerMin: 50, 
  powerMax: 1000, 
  priceMin: 0,
  priceMax: 500000,
  fuel_type: '', 
  body_type: '', 
  doors: '',
  province: '',
  transmission: '',
  sortBy: 'default',
  extras: []
};

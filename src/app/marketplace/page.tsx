"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/marketplace/CarCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { MOCK_CARS, Car } from "@/lib/marketplace/mockData";
import { 
  CAR_BRANDS, 
  BODY_TYPES, 
  FUEL_TYPES, 
  TRANSMISSIONS, 
  FILTER_DEFAULTS, 
  PROVINCES_SPAIN, 
  EXTRAS_CATALOG,
  SearchFilters
} from "@/lib/marketplace/constants";
import { SlidersHorizontal, X, Search, ChevronDown, ArrowUpDown, RotateCcw, Check, Sparkles, AlertCircle } from "lucide-react";

export default function MarketplacePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(FILTER_DEFAULTS);
  const [dbBrandsList, setDbBrandsList] = useState<string[]>([]);
  const [dbBrandsMap, setDbBrandsMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        setCars(MOCK_CARS);
        setDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        // Obtener coches del marketplace aprobados
        const { data, error } = await supabase
          .from("cars")
          .select("*, profiles(email, phone)")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setCars(data as Car[]);
          setDemoMode(false);
        } else {
          setCars(MOCK_CARS);
          setDemoMode(true);
        }

        // Cargar marcas del diccionario de base de datos
        const { data: dictData } = await supabase
          .from("dictionary_brands")
          .select("*")
          .order("brand", { ascending: true });

        if (dictData && dictData.length > 0) {
          const bMap: Record<string, string[]> = {};
          const bNames: string[] = [];
          dictData.forEach((item: any) => {
            bNames.push(item.brand);
            bMap[item.brand] = item.models;
          });
          setDbBrandsList(bNames);
          setDbBrandsMap(bMap);
        }

      } catch (err) {
        console.error("Error fetching marketplace cars:", err);
        setCars(MOCK_CARS);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  const brandsList = dbBrandsList.length > 0 ? dbBrandsList : Object.keys(CAR_BRANDS);
  const availableModels = filters.brand ? (dbBrandsMap[filters.brand] || CAR_BRANDS[filters.brand] || []) : [];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "brand") {
      setFilters((prev) => ({ ...prev, brand: value, model: "" }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleExtra = (extra: string) => {
    setFilters((prev) => ({
      ...prev,
      extras: prev.extras.includes(extra)
        ? prev.extras.filter((e) => e !== extra)
        : [...prev.extras, extra],
    }));
  };

  const resetFilters = () => setFilters(FILTER_DEFAULTS);

  // Filtrado reactivo local en memoria
  let filteredCars = cars.filter((car) => {
    if (filters.search && !`${car.brand} ${car.model} ${car.extras || ""}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.model && car.model.toLowerCase() !== filters.model.toLowerCase()) return false;
    if (filters.fuel_type && car.fuel_type?.toLowerCase() !== filters.fuel_type.toLowerCase()) return false;
    if (filters.body_type && car.body_type?.toLowerCase() !== filters.body_type.toLowerCase()) return false;
    if (filters.transmission && car.transmission?.toLowerCase() !== filters.transmission.toLowerCase()) return false;
    if (filters.province && car.province?.toLowerCase() !== filters.province.toLowerCase()) return false;
    if (car.year < Number(filters.yearMin)) return false;
    if (car.year > Number(filters.yearMax)) return false;
    if (car.power && car.power < Number(filters.powerMin)) return false;
    if (car.power && car.power > Number(filters.powerMax)) return false;
    if (car.price < Number(filters.priceMin)) return false;
    if (car.price > Number(filters.priceMax)) return false;
    
    if (filters.doors) {
      if (filters.doors === "2/3" && car.doors > 3) return false;
      if (filters.doors === "4/5" && (car.doors < 4 || car.doors > 5)) return false;
      if (filters.doors === "+5" && car.doors <= 5) return false;
    }
    
    if (filters.extras.length > 0) {
      const carExtras = (car.extras || "").toLowerCase();
      const hasAll = filters.extras.every((ex) => carExtras.includes(ex.toLowerCase()));
      if (!hasAll) return false;
    }
    
    return true;
  });

  // Ordenación reactiva local
  if (filters.sortBy !== "default") {
    filteredCars = [...filteredCars].sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "km_asc":
          return (a.kilometers || 0) - (b.kilometers || 0);
        case "year_desc":
          return b.year - a.year;
        default:
          return 0;
      }
    });
  }

  const activeFilterCount = [
    filters.search, 
    filters.brand, 
    filters.model, 
    filters.fuel_type,
    filters.body_type, 
    filters.transmission, 
    filters.province, 
    filters.doors,
    filters.yearMin !== FILTER_DEFAULTS.yearMin, 
    filters.yearMax !== FILTER_DEFAULTS.yearMax,
    filters.powerMin !== FILTER_DEFAULTS.powerMin, 
    filters.powerMax !== FILTER_DEFAULTS.powerMax,
    filters.priceMin !== FILTER_DEFAULTS.priceMin, 
    filters.priceMax !== FILTER_DEFAULTS.priceMax,
  ].filter(Boolean).length + filters.extras.length;

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 relative min-h-screen pt-[96px] lg:pt-[116px]">
        
        {/* Banner Informativo Modo Demo */}
        {demoMode && (
          <div className="bg-accent-gold/10 border-b border-accent-gold/20 py-2.5 px-4 text-center text-xs text-neutral-800 font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent-gold shrink-0" />
            <span>Mostrando catálogo de ejemplo (Supabase sin conexión o sin datos cargados).</span>
          </div>
        )}

        {/* HERO HEADER */}
        <div className="bg-neutral-950 text-white py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-3 block">
              Marketplace Exclusivo
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Encuentra Unidades Únicas en España
            </h1>
            <p className="font-sans text-xs sm:text-base text-neutral-400 max-w-xl mx-auto">
              Compra y vende vehículos de alta gama directamente entre particulares con la seguridad y el respaldo técnico de NordImport.
            </p>
          </div>
        </div>

        {/* STICKY SEARCH & QUICK FILTERS ROW */}
        <div className="sticky top-[72px] lg:top-[80px] z-30 bg-white border-b border-neutral-200 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            
            {/* Buscador de texto */}
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Buscar marca o modelo..."
                className="w-full font-sans text-xs border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-accent-gold bg-neutral-50/50 focus:bg-white transition-all text-neutral-800 font-semibold"
              />
            </div>

            {/* Quick Select Brand (Oculto en móvil) */}
            <div className="relative hidden lg:block">
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg pl-4 pr-9 py-2.5 bg-white outline-none cursor-pointer hover:border-neutral-400 focus:border-accent-gold text-neutral-800"
              >
                <option value="">Marca</option>
                {brandsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Select Province (Oculto en móvil) */}
            <div className="relative hidden lg:block">
              <select
                name="province"
                value={filters.province}
                onChange={handleFilterChange}
                className="appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg pl-4 pr-9 py-2.5 bg-white outline-none cursor-pointer hover:border-neutral-400 focus:border-accent-gold text-neutral-800"
              >
                <option value="">Provincia</option>
                {PROVINCES_SPAIN.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Ordenación (Oculto en móvil) */}
            <div className="relative hidden sm:block">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg pl-8 pr-9 py-2.5 bg-white outline-none cursor-pointer hover:border-neutral-400 focus:border-accent-gold text-neutral-800"
              >
                <option value="default">Relevancia</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="km_asc">Menos kilómetros</option>
                <option value="year_desc">Más recientes</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Botón Filtros Drawer */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg font-sans text-xs font-bold transition-all shrink-0 ${
                activeFilterCount > 0
                  ? "bg-accent-gold border-accent-gold text-neutral-950 shadow-md"
                  : "bg-white border-neutral-300 hover:border-neutral-400 text-neutral-800"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              <span>{activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            </button>

            {/* Limpiar filtros rápidos */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-2 font-sans text-[10px] font-bold text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            )}

            {/* Contador de resultados */}
            <span className="ml-auto font-sans text-xs font-bold text-neutral-400">
              {filteredCars.length} coche{filteredCars.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Listado de extras activos en horizontal */}
          {filters.extras.length > 0 && (
            <div className="max-w-7xl mx-auto px-6 pb-3.5 flex flex-wrap gap-2">
              {filters.extras.map((extra) => (
                <button
                  key={extra}
                  onClick={() => toggleExtra(extra)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-full font-sans text-[10px] font-bold text-neutral-700 transition-all"
                >
                  <span>{extra}</span>
                  <X className="w-3 h-3 text-neutral-400 hover:text-neutral-950" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FILTER DRAWER SIDE SHEET */}
        <div 
          className={`fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 ${
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <div 
          className={`fixed top-0 right-0 h-full w-[440px] max-w-[95vw] bg-white z-[60] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-[cubic-bezier(0.16,_1,_0.3,_1)] ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-900">
                Filtros Avanzados
              </h2>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider block mt-1">
                  {activeFilterCount} filtro{activeFilterCount !== 1 ? "s" : ""} activo{activeFilterCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="cursor-pointer border border-neutral-200 hover:border-neutral-300 py-1.5 px-3.5 rounded-lg font-sans text-[10px] font-bold text-neutral-500 hover:text-neutral-900 transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar
                </button>
              )}
              <button
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Marca y Modelo */}
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                Marca y Modelo
              </span>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="w-full appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg px-4 py-3 bg-white outline-none cursor-pointer focus:border-accent-gold text-neutral-800"
                  >
                    <option value="">Cualquier marca</option>
                    {brandsList.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    name="model"
                    value={filters.model}
                    onChange={handleFilterChange}
                    disabled={!filters.brand}
                    className="w-full appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg px-4 py-3 bg-white outline-none cursor-pointer focus:border-accent-gold text-neutral-800 disabled:opacity-55"
                  >
                    <option value="">Cualquier modelo</option>
                    {availableModels.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Silueta, Combustible y Transmisión */}
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                Especificaciones Motor
              </span>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    name="body_type"
                    value={filters.body_type}
                    onChange={handleFilterChange}
                    className="w-full appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg px-4 py-3 bg-white outline-none cursor-pointer focus:border-accent-gold text-neutral-800"
                  >
                    <option value="">Carrocerías (Todas)</option>
                    {BODY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    name="fuel_type"
                    value={filters.fuel_type}
                    onChange={handleFilterChange}
                    className="w-full appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg px-4 py-3 bg-white outline-none cursor-pointer focus:border-accent-gold text-neutral-800"
                  >
                    <option value="">Combustible (Todos)</option>
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    className="w-full appearance-none font-sans text-xs font-bold border border-neutral-300 rounded-lg px-4 py-3 bg-white outline-none cursor-pointer focus:border-accent-gold text-neutral-800"
                  >
                    <option value="">Transmisión (Cualquiera)</option>
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Rango de Presupuesto */}
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                Rango de Precio (€)
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-neutral-500 font-semibold mb-1">
                    <span>Mínimo:</span>
                    <span className="text-accent-gold font-bold">{filters.priceMin.toLocaleString()} €</span>
                  </div>
                  <input
                    type="range"
                    name="priceMin"
                    min="0"
                    max="500000"
                    step="2000"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-neutral-500 font-semibold mb-1">
                    <span>Máximo:</span>
                    <span className="text-accent-gold font-bold">{filters.priceMax.toLocaleString()} €</span>
                  </div>
                  <input
                    type="range"
                    name="priceMax"
                    min="0"
                    max="500000"
                    step="2000"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                  />
                </div>
              </div>
            </div>

            {/* Rango de Emisiones/Año */}
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                Año de Fabricación
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-neutral-500 font-semibold mb-1">
                    <span>Desde:</span>
                    <span className="text-accent-gold font-bold">{filters.yearMin}</span>
                  </div>
                  <input
                    type="range"
                    name="yearMin"
                    min="1990"
                    max="2026"
                    step="1"
                    value={filters.yearMin}
                    onChange={handleFilterChange}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-neutral-500 font-semibold mb-1">
                    <span>Hasta:</span>
                    <span className="text-accent-gold font-bold">{filters.yearMax}</span>
                  </div>
                  <input
                    type="range"
                    name="yearMax"
                    min="1990"
                    max="2026"
                    step="1"
                    value={filters.yearMax}
                    onChange={handleFilterChange}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
                  />
                </div>
              </div>
            </div>

            {/* Extras en categoría */}
            {Object.entries(EXTRAS_CATALOG).map(([category, items]) => (
              <div key={category}>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                  Equipamiento: {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((extra) => (
                    <button
                      key={extra}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`cursor-pointer px-3 py-1.5 border border-neutral-200 text-[10px] font-bold rounded-full transition-all flex items-center gap-1.5 ${
                        filters.extras.includes(extra)
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      {filters.extras.includes(extra) && <Check className="w-3 h-3 text-accent-gold" />}
                      <span>{extra}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50">
            <button
              onClick={() => setDrawerOpen(false)}
              className="cursor-pointer w-full bg-neutral-950 text-white py-3.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 transition-colors text-center"
            >
              Aplicar y ver {filteredCars.length} resultado{filteredCars.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>

        {/* CORE GRID */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Cargando el inventario...
              </p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto">
              <SlidersHorizontal className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                Sin resultados
              </h2>
              <p className="font-sans text-xs text-neutral-500 mb-6">
                No hemos encontrado ningún coche que encaje con tus criterios actuales. Prueba a limpiar filtros.
              </p>
              <button
                onClick={resetFilters}
                className="cursor-pointer bg-neutral-950 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-lg hover:bg-neutral-900 transition-all flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw className="w-4 h-4" /> Limpiar Filtros
              </button>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}

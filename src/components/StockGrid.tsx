"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { Calendar, Gauge, Fuel, FileText, AlertCircle, Info } from "lucide-react";

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  precio: number;
  ano: number;
  kilometros: number;
  combustible: string;
  etiqueta_dgt: string;
  imagenes: string[];
  informe_url: string;
  disponible: boolean;
}

const MOCK_STOCK: Vehicle[] = [
  {
    id: "mock-1",
    marca: "Porsche",
    modelo: "911 Carrera S Coupe (992)",
    precio: 132900,
    ano: 2021,
    kilometros: 24500,
    combustible: "Gasolina",
    etiqueta_dgt: "C",
    imagenes: ["/cars/porsche_911.jpg"],
    informe_url: "https://www.carfax.es",
    disponible: true,
  },
  {
    id: "mock-2",
    marca: "Audi",
    modelo: "RS6 Avant TFSI V8 Quattro",
    precio: 124500,
    ano: 2022,
    kilometros: 38000,
    combustible: "Gasolina (MHEV)",
    etiqueta_dgt: "ECO",
    imagenes: ["/cars/audi_rs6.jpg"],
    informe_url: "https://www.carfax.es",
    disponible: true,
  },
  {
    id: "mock-3",
    marca: "Mercedes-Benz",
    modelo: "G-Class G 63 AMG V8 BiTurbo",
    precio: 198000,
    ano: 2022,
    kilometros: 19500,
    combustible: "Gasolina",
    etiqueta_dgt: "C",
    imagenes: ["/cars/g63.jpg"],
    informe_url: "https://www.carfax.es",
    disponible: true,
  },
];

export default function StockGrid() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    async function fetchStock() {
      setLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        setVehicles(MOCK_STOCK);
        setDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("stock")
          .select("*")
          .eq("disponible", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setVehicles(data as Vehicle[]);
          setDemoMode(false);
        } else {
          // If connection is OK but database stock table is empty, use mock data as default catalog seed
          setVehicles(MOCK_STOCK);
          setDemoMode(true);
        }
      } catch (err) {
        console.error("Error fetching stock:", err);
        setVehicles(MOCK_STOCK);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStock();
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatKilometers = (value: number) => {
    return new Intl.NumberFormat("es-ES").format(value) + " km";
  };

  return (
    <section id="stock" className="py-24 bg-slate-50 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            Últimas Adquisiciones
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 mb-4">
            Stock Seleccionado en Origen
          </h2>
          <div className="h-[2px] w-12 bg-accent-gold mb-6" />
          <p className="font-sans text-sm sm:text-base text-neutral-600">
            Vehículos verificados presencialmente listos para ser transferidos a España de inmediato, con todas las garantías de origen.
          </p>

          {/* Demo Mode Badge */}
          {demoMode && (
            <div className="mt-6 flex items-center space-x-2 bg-accent-gold/10 border border-accent-gold/20 px-4 py-2 rounded-lg text-neutral-800 text-xs font-semibold">
              <Info className="w-4 h-4 text-accent-gold shrink-0" />
              <span>Modo Demostración activo. Se muestran coches de ejemplo.</span>
            </div>
          )}
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-xs border border-neutral-200/60 h-[480px] animate-pulse"
              >
                <div className="bg-neutral-200 aspect-[16/10] w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-6 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-8 bg-neutral-200 rounded" />
                    <div className="h-8 bg-neutral-200 rounded" />
                    <div className="h-8 bg-neutral-200 rounded" />
                  </div>
                  <div className="h-10 bg-neutral-200 rounded pt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((car) => {
              const mainImage = car.imagenes && car.imagenes[0] ? car.imagenes[0] : "/cars/porsche_911.jpg";
              const isEcoOrC = car.etiqueta_dgt === "C" || car.etiqueta_dgt === "ECO" || car.etiqueta_dgt === "0";
              
              return (
                <div
                  key={car.id}
                  className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl border border-neutral-200/60 hover:border-accent-gold/40 transition-all duration-300 flex flex-col group"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={mainImage}
                      alt={`${car.marca} ${car.modelo}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Fuel Tag */}
                    <div className="absolute bottom-3 left-3 bg-neutral-900/65 backdrop-blur-xs py-1 px-2.5 rounded text-[10px] text-white font-semibold flex items-center space-x-1">
                      <Fuel className="w-3 h-3 text-accent-gold" />
                      <span>{car.combustible}</span>
                    </div>

                    {/* DGT Label Tag */}
                    {car.etiqueta_dgt && (
                      <div className="absolute top-3 right-3 flex items-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md text-white uppercase tracking-wider ${
                          isEcoOrC ? "bg-accent-green" : "bg-blue-600"
                        }`}>
                          DGT: {car.etiqueta_dgt}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand name */}
                      <span className="font-display text-xs font-semibold text-accent-gold tracking-widest uppercase">
                        {car.marca}
                      </span>
                      {/* Model name */}
                      <h3 className="font-serif text-xl font-normal text-neutral-900 group-hover:text-neutral-900 transition-colors mt-1 mb-3">
                        {car.modelo}
                      </h3>

                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-y-2 border-t border-neutral-100 pt-3 pb-4">
                        <div className="flex items-center space-x-2 text-neutral-500">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span className="font-sans text-xs font-medium">{car.ano}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-500">
                          <Gauge className="w-4 h-4 text-neutral-400" />
                          <span className="font-sans text-xs font-medium">{formatKilometers(car.kilometros)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                          Precio Importado
                        </span>
                        <span className="font-sans text-xl font-bold text-neutral-900">
                          {formatPrice(car.precio)}
                        </span>
                      </div>
                      
                      {car.informe_url && (
                        <a
                          href={car.informe_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer inline-flex items-center space-x-1.5 font-sans text-[11px] font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-800 text-neutral-700 hover:text-neutral-900 px-3.5 py-2 rounded transition-colors group/btn"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-neutral-950 transition-colors" />
                          <span>Historial</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

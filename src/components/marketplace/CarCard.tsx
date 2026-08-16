"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Gauge, Fuel, Shield, MapPin, Eye, Check } from "lucide-react";
import { Car } from "@/lib/marketplace/mockData";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const mainImage = car.images && car.images[0] ? car.images[0] : "https://images.unsplash.com/photo-1503376712344-652a0340c283?auto=format&fit=crop&w=600&q=80";

  // Formateadores
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
    <div className="group bg-white rounded-xl overflow-hidden border border-neutral-200/60 hover:border-accent-gold/40 hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <img
          src={mainImage}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Tipo Combustible */}
        {car.fuel_type && (
          <div className="absolute bottom-3 left-3 bg-neutral-900/75 backdrop-blur-xs py-1 px-2.5 rounded text-[10px] text-white font-semibold flex items-center space-x-1 border border-white/10">
            <Fuel className="w-3 h-3 text-accent-gold" />
            <span>{car.fuel_type}</span>
          </div>
        )}

        {/* Provincia / Ubicación */}
        {car.province && (
          <div className="absolute top-3 left-3 bg-neutral-900/75 backdrop-blur-xs py-1 px-2 rounded text-[9px] text-white font-bold tracking-wider uppercase flex items-center space-x-1 border border-white/10">
            <MapPin className="w-2.5 h-2.5 text-accent-gold" />
            <span>{car.province}</span>
          </div>
        )}

        {/* Insignias de confianza */}
        {car.trust_badges && car.trust_badges.length > 0 && (
          <div className="absolute top-3 right-3 flex items-center">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider shadow-md flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              Verificado
            </span>
          </div>
        )}
      </div>

      {/* Contenido / Cuerpo */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Marca */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-sans text-[8px] sm:text-[10px] font-bold text-accent-gold tracking-widest uppercase">
              {car.brand}
            </span>
            {car.power && (
              <span className="text-[8px] sm:text-[10px] font-semibold text-neutral-500 font-sans">
                {car.power} CV
              </span>
            )}
          </div>

          {/* Modelo */}
          <h3 className="font-serif text-sm sm:text-base font-normal text-neutral-900 leading-snug group-hover:text-accent-gold transition-colors duration-200 mb-2 min-h-[36px] sm:min-h-[44px] flex items-start">
            {car.model}
          </h3>

          {/* Fila de Especificaciones */}
          <div className="grid grid-cols-2 gap-y-1.5 border-t border-neutral-100 pt-2.5 pb-3">
            <div className="flex items-center space-x-1.5 text-neutral-500">
              <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="font-sans text-[10px] sm:text-xs font-semibold text-neutral-600">{car.year}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-neutral-500">
              <Gauge className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="font-sans text-[10px] sm:text-xs font-semibold text-neutral-600 truncate">
                {car.kilometers ? formatKilometers(car.kilometers) : "Consultar"}
              </span>
            </div>
          </div>
        </div>

        {/* Precio & CTA */}
        <div className="border-t border-neutral-100 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto gap-2">
          <div className="flex flex-col">
            <span className="font-sans text-[8px] text-neutral-400 uppercase tracking-wider font-semibold">
              Precio Oferta
            </span>
            <span className="font-sans text-sm sm:text-lg font-bold text-neutral-950">
              {formatPrice(car.price)}
            </span>
          </div>

          <Link
            href={`/marketplace/car/${car.id}`}
            className="cursor-pointer inline-flex items-center justify-center space-x-1 font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 text-center"
          >
            <span>Ver Ficha</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

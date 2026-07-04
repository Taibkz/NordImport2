"use client";

import React from "react";
import { Check, ShieldCheck, Sparkles, Truck, FileCheck, Search } from "lucide-react";

export default function Services() {
  const handleScrollToQuiz = () => {
    const element = document.getElementById("quiz");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            Nuestros Servicios
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 mb-4">
            Gestión Automovilística A La Carta
          </h2>
          <div className="h-[2px] w-12 bg-accent-gold mb-6" />
          <p className="font-sans text-sm sm:text-base text-neutral-600">
            Diferentes niveles de implicación para adaptarnos exactamente al grado de acompañamiento y seguridad que necesitas.
          </p>
        </div>

        {/* Services Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* TIER 1: BASICO */}
          <div className="bg-slate-50/60 hover:bg-slate-50 border border-neutral-200/70 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-neutral-900">Básico</h3>
                  <p className="font-sans text-xs text-neutral-500 font-semibold tracking-wide uppercase">Solo Gestión y Logística</p>
                </div>
              </div>
              
              <div className="h-[2px] w-full bg-neutral-200/50 mb-6" />
              
              <ul className="space-y-4 mb-8">
                {[
                  "Inspección técnica detallada en origen",
                  "Tramitación del papeleo y contratos",
                  "Gestión y transporte asegurado en camión",
                  "Preparación del expediente de homologación",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-neutral-600">
                    <Check className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                    <span className="font-sans text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={handleScrollToQuiz}
              className="cursor-pointer w-full font-sans text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-white border border-neutral-300 hover:bg-neutral-800 hover:border-neutral-800 py-3.5 rounded-lg transition-colors mt-auto text-center"
            >
              Seleccionar Gestión Básica
            </button>
          </div>

          {/* TIER 2: ESTANDAR (RECOMENDADO) */}
          <div className="bg-white border-2 border-accent-red rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl relative scale-100 lg:scale-[1.03] z-10">
            {/* Recommended Tag */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-red text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
              MÁS RECOMENDADO
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-accent-red">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-neutral-900">Estándar</h3>
                  <p className="font-sans text-xs text-accent-red font-semibold tracking-wide uppercase">Búsqueda e ITV Española</p>
                </div>
              </div>
              
              <div className="h-[2px] w-full bg-red-100/50 mb-6" />
              
              <ul className="space-y-4 mb-8">
                {[
                  "Búsqueda activa y filtrado de 3 opciones de calidad",
                  "Negociación directa de precio con el vendedor",
                  "Revisión completa en origen (vídeo/fotos e informe)",
                  "Transporte asegurado a España",
                  "Gestión de homologaciones e ITV española pasada",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-neutral-700">
                    <Check className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                    <span className="font-sans text-sm font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={handleScrollToQuiz}
              className="cursor-pointer w-full font-sans text-xs font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-red-700 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-auto text-center"
            >
              Contratar Servicio Estándar
            </button>
          </div>

          {/* TIER 3: PREMIUM (VIP) */}
          <div className="bg-neutral-900 border-2 border-accent-gold rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 shadow-xl">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-gold/15 flex items-center justify-center text-accent-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-white">Premium VIP</h3>
                  <p className="font-sans text-xs text-accent-gold font-semibold tracking-wide uppercase">Llave En Mano Absoluto</p>
                </div>
              </div>
              
              <div className="h-[2px] w-full bg-neutral-800 mb-6" />
              
              <ul className="space-y-4 mb-8">
                {[
                  "Todo lo incluido en el Plan Estándar",
                  "Matriculación definitiva completa en España",
                  "Garantía Premium de 1 año con cobertura total",
                  "Entrega a domicilio en grúa cerrada VIP",
                  "Gestión de impuestos en Hacienda y Tránsito DGT",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-neutral-300">
                    <Check className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                    <span className="font-sans text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={handleScrollToQuiz}
              className="cursor-pointer w-full font-sans text-xs font-bold uppercase tracking-wider text-accent-gold hover:text-neutral-900 border-2 border-accent-gold hover:bg-accent-gold py-3.5 rounded-lg transition-all duration-300 mt-auto text-center"
            >
              Solicitar Plan Premium VIP
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

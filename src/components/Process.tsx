"use client";

import React from "react";
import { Search, Eye, Euro, Award, Shield } from "lucide-react";

export default function Process() {
  const steps = [
    {
      num: "01",
      title: "Filtro inicial",
      desc: "Analizamos tus especificaciones y seleccionamos las 3 mejores opciones del mercado del norte de Europa que cumplan tus requisitos.",
      icon: Search,
    },
    {
      num: "02",
      title: "Vídeo-Inspección",
      desc: "Nuestros mecánicos se desplazan en origen para realizar una inspección de 150 puntos y enviarte un vídeo exhaustivo en alta definición del coche.",
      icon: Eye,
    },
    {
      num: "03",
      title: "Pago directo",
      desc: "Pagas directamente al concesionario oficial en origen sin recargos. Nord Import no retiene tu dinero, garantizando total transparencia financiera.",
      icon: Euro,
    },
    {
      num: "04",
      title: "Entrega llave en mano",
      desc: "Transportamos tu coche a España, pasamos la ITV y te lo entregamos matriculado listo para disfrutar en la puerta de tu domicilio.",
      icon: Award,
    },
  ];

  return (
    <section id="proceso" className="min-h-screen flex flex-col justify-center py-20 bg-slate-50 border-t border-neutral-100 snap-start">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 flex flex-col items-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            Garantía de Transparencia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 mb-4">
            Un Proceso Claro y Seguro
          </h2>
          <div className="h-[2px] w-12 bg-accent-gold mb-5" />
          <p className="font-sans text-xs sm:text-sm lg:text-base text-neutral-600">
            Eliminamos cualquier riesgo en tu compra estructurando cada paso del camino con auditoría independiente e informes constantes.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative max-w-md mx-auto lg:max-w-none">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[59px] left-[10%] right-[10%] h-[1px] bg-neutral-200" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center relative group pb-8 lg:pb-0"
                >
                  {/* Vertical line connector for mobile (hidden on last item) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-[1px] bg-neutral-200 lg:hidden" />
                  )}

                  {/* Step Bubble Container */}
                  <div className="relative mr-5 lg:mr-0 lg:mb-6 shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-md transition-all duration-300 group-hover:border-accent-gold group-hover:scale-105 relative z-10">
                      <IconComp className="w-6 h-6 text-accent-gold" />
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 bg-neutral-900 text-white font-sans text-[9px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {step.num}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="flex-grow pt-2 lg:pt-0">
                    <h3 className="font-serif text-lg font-medium text-neutral-950 mb-1.5 lg:mb-2 group-hover:text-accent-gold transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm lg:max-w-[260px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Banner */}
        <div className="mt-12 lg:mt-20 bg-white border border-neutral-200/60 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center text-accent-green shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm sm:text-base font-semibold text-neutral-900">Seguridad Total del Proceso</h4>
              <p className="font-sans text-[11px] sm:text-xs text-neutral-500">Firmamos contrato de mediación mercantil garantizado ante notario si lo deseas.</p>
            </div>
          </div>
          <a
            href="#quiz"
            className="cursor-pointer w-full md:w-auto font-sans text-xs font-bold uppercase tracking-wider text-accent-red hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-6 py-3 rounded-lg transition-colors text-center"
          >
            Quiero saber más
          </a>
        </div>
      </div>
    </section>
  );
}

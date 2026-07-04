"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Navigation } from "lucide-react";

export default function Hero() {
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
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
      
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-red-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* TEXT COLUMN */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          {/* Accent Gold Badge */}
          <div className="inline-flex items-center space-x-2 bg-accent-gold/10 border border-accent-gold/30 px-3.5 py-1.5 rounded-full text-accent-gold font-sans text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold animate-pulse" />
            <span>Vehículos de Alta Gama Bajo Pedido</span>
          </div>

          {/* Giant Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-neutral-900 tracking-tight leading-[1.1]">
            Importación Automovilística de <span className="font-medium underline decoration-accent-gold decoration-2 underline-offset-8">Confianza</span>.
            <br />
            <span className="font-display font-bold text-neutral-900 block mt-2 text-3xl sm:text-4xl md:text-5xl">
              Del Norte a tu Puerta.
            </span>
          </h1>

          {/* Description */}
          <p className="font-sans text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
            Gestionamos la compra, inspección exhaustiva, transporte seguro y matriculación definitiva de tu próximo coche premium desde Alemania, Suecia o Bélgica. Todo sin intermediarios y con transparencia absoluta.
          </p>

          {/* Key Trust Points */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
              </div>
              <span className="font-sans text-xs font-semibold text-neutral-700">Informe Historial Carfax</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
              </div>
              <span className="font-sans text-xs font-semibold text-neutral-700">Inspección de 150 Puntos</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={handleScrollToQuiz}
              className="cursor-pointer bg-accent-red hover:bg-red-700 text-white font-sans text-sm font-bold tracking-wider uppercase px-8 py-4 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Iniciar Búsqueda Bajo Pedido</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <a
              href="#stock"
              className="cursor-pointer bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 hover:border-neutral-300 font-sans text-sm font-bold tracking-wider uppercase px-8 py-4 rounded-md shadow-xs hover:shadow-sm text-center transition-all duration-300"
            >
              Ver Stock Disponible
            </a>
          </div>
        </div>

        {/* IMAGE/VIDEO COLUMN */}
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
          {/* Main Visual Frame */}
          <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-xl overflow-hidden border-2 border-accent-gold/20 shadow-2xl group transition-all duration-500 hover:border-accent-gold/40">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/10 to-transparent z-10" />
            
            <Image
              src="/cars/porsche_911.jpg"
              alt="Porsche 911 Carrera S - NORD IMPORT"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Float Overlay (Real-time dynamic banner) */}
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold tracking-wider text-accent-gold">
                  PORSCHE 911 CARRERA S (992)
                </span>
                <span className="bg-accent-green text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wider">
                  C
                </span>
              </div>
              <p className="font-sans text-[10px] text-white/90">
                Importado y entregado llave en mano en Madrid. Origen: Múnich, Alemania.
              </p>
              <div className="flex justify-between items-center pt-1 border-t border-white/10">
                <span className="font-sans text-xs font-medium text-white/80">Ahorro estimado</span>
                <span className="font-sans text-xs font-bold text-accent-gold">-14.200 € vs España</span>
              </div>
            </div>

            {/* Pulse Indicator */}
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-neutral-900/60 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
              </span>
              <span className="font-sans text-[10px] font-semibold text-white tracking-wide">
                Bajo pedido disponible
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

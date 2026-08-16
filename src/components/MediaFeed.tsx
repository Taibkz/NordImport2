"use client";

import React from "react";
import Image from "next/image";
import { Play, Eye, Heart } from "lucide-react";

export default function MediaFeed() {
  const simulatedReels = [
    {
      id: 1,
      title: "Inspección exhaustiva de Porsche 992 en Stuttgart 🇩🇪",
      views: "42.5K",
      likes: "3.4K",
      image: "/cars/porsche_911.jpg",
      tag: "@nordimport",
    },
    {
      id: 2,
      title: "Entregando Audi RS6 Avant llave en mano en Madrid 🇪🇸",
      views: "68.1K",
      likes: "5.2K",
      image: "/cars/audi_rs6.jpg",
      tag: "@nordimport",
    },
    {
      id: 3,
      title: "Mercedes G63 AMG cruzando los Alpes rumbo a Barcelona 🏔",
      views: "29.9K",
      likes: "2.1K",
      image: "/cars/g63.jpg",
      tag: "@nordimport",
    },
  ];

  return (
    <section id="media" className="py-16 lg:h-screen lg:snap-start lg:flex lg:flex-col lg:justify-center lg:py-0 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 flex flex-col items-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            Ecosistema de Contenidos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 mb-4">
            Nord Import en Acción
          </h2>
          <div className="h-[2px] w-12 bg-accent-gold mb-5" />
          <p className="font-sans text-xs sm:text-sm lg:text-base text-neutral-600">
            Documentamos cada viaje, revisión y entrega. Acompáñanos a los concesionarios más exclusivos de Alemania y vive el proceso en directo.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* LEFT: YouTube Embed */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-accent-gold/20 shadow-xl bg-neutral-900 group">
              <iframe
                src="https://www.youtube.com/embed/6i8d7JepgG4?autoplay=0&mute=1&loop=1&playlist=6i8d7JepgG4"
                title="Nord Import - Proceso de Importación de Coches"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <div className="mt-4 flex items-center space-x-3 text-neutral-500 justify-center lg:justify-start">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-accent-gold">
                Reportaje Completo
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span className="font-sans text-[11px] sm:text-xs">Cómo verificamos los vehículos en Alemania</span>
            </div>
          </div>

          {/* RIGHT: Tik Tok/Reels Simulation */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-base sm:text-lg font-medium text-neutral-950">
                Directos desde Origen
              </h3>
              <span className="font-sans text-[10px] sm:text-xs text-accent-red font-bold animate-pulse">
                • EN DIRECTO
              </span>
            </div>

            {/* Swipeable Reels Grid */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
              {simulatedReels.map((reel) => (
                <div
                  key={reel.id}
                  className="shrink-0 w-[46%] sm:w-[35%] snap-center md:w-auto md:shrink relative aspect-[9/16] rounded-xl overflow-hidden shadow-md group cursor-pointer border border-neutral-200"
                >
                  {/* Thumbnail Image */}
                  <Image
                    src={reel.image}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/10 to-transparent" />

                  {/* Play button indicator overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 text-white">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                  </div>

                  {/* Top handles */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="font-sans text-[8px] font-bold text-white bg-neutral-900/50 px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {reel.tag}
                    </span>
                  </div>

                  {/* Bottom details */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 text-white flex flex-col space-y-1">
                    <p className="font-sans text-[9px] sm:text-[10px] font-medium leading-tight line-clamp-2">
                      {reel.title}
                    </p>
                    <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-neutral-300 font-semibold pt-1 border-t border-white/10">
                      <span className="flex items-center space-x-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{reel.views}</span>
                      </span>
                      <span className="flex items-center space-x-0.5 text-accent-red">
                        <Heart className="w-2.5 h-2.5 fill-accent-red" />
                        <span>{reel.likes}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links Callout */}
            <div className="mt-4 lg:mt-6 bg-slate-50 border border-neutral-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white font-sans font-bold text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                  f
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white font-sans font-bold text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                  t
                </div>
                <div className="w-7 h-7 rounded-full bg-accent-gold text-neutral-900 font-sans font-bold text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                  in
                </div>
              </div>
              <span className="font-sans text-[11px] sm:text-xs text-neutral-600 font-medium">Síguenos en Tik Tok e Instagram</span>
              <span className="font-sans text-[11px] sm:text-xs font-bold text-accent-gold uppercase tracking-wider">
                @NordImport
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

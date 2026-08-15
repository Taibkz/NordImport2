"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="h-72 sm:h-96 bg-neutral-100 rounded-xl flex items-center justify-center border border-neutral-200">
        <span className="font-sans text-xs text-neutral-400 font-semibold uppercase tracking-wider">
          Sin Imágenes
        </span>
      </div>
    );
  }

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
  };

  return (
    <>
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none relative rounded-xl border border-neutral-200/50 bg-neutral-50 shadow-xs max-w-full">
        {images.map((img, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-start relative aspect-[16/10] sm:aspect-[16/9]">
            <img
              src={img}
              alt={`Imagen del vehículo ${i + 1}`}
              onClick={() => handleOpen(i)}
              className="w-full h-full object-cover cursor-zoom-in"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute bottom-4 right-4 bg-neutral-900/75 backdrop-blur-xs py-1 px-3 rounded-full text-[10px] text-white font-bold flex items-center space-x-1.5 border border-white/10 select-none">
              <Camera className="w-3 h-3 text-accent-gold" />
              <span>
                {i + 1} / {images.length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Portal seguro de pantalla completa */}
      {isFullscreen && mounted && createPortal(
        <div className="fixed inset-0 bg-neutral-950/98 z-[9999] flex flex-col items-center justify-center select-none animate-fadeIn">
          {/* Botón cerrar */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="cursor-pointer absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors border border-white/10"
            aria-label="Cerrar vista"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Imagen activa */}
          <div className="relative max-w-[95vw] max-h-[75vh] w-full h-full flex items-center justify-center px-4">
            <img
              src={images[currentIndex]}
              alt="Vista detallada"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5 animate-scaleIn"
            />
          </div>

          {/* Controles de navegación */}
          <div className="flex items-center space-x-6 mt-8">
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="cursor-pointer bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full transition-colors border border-white/10 flex items-center justify-center"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-sans text-xs text-white/60 font-semibold uppercase tracking-widest">
              {currentIndex + 1} de {images.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="cursor-pointer bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-full transition-colors border border-white/10 flex items-center justify-center"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, HelpCircle, BadgeEuro, ArrowLeft, Send } from "lucide-react";

export default function TasacionPage() {
  const [formData, setFormData] = useState({
    myCar: "",
    yearPlate: "",
    targetCar: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Procesando valoración...");

    // Simular envío de datos
    setTimeout(() => {
      console.log("Plan Renove Trade-In Request:", formData);
      
      // Abrir cliente de correo
      const bodyText = `Hola equipo de NordImport,%0A%0ADeseo tasar mi vehículo actual como parte de pago (Plan Renove):%0A%0A- Vehículo a entregar: ${formData.myCar}%0A- Año/Matrícula: ${formData.yearPlate}%0A- Vehículo de interés: ${formData.targetCar || "Cualquiera"}%0A- Teléfono de contacto: ${formData.phone}%0A- Correo electrónico: ${formData.email}`;
      window.location.href = `mailto:tasaciones@nordimport.com?subject=Solicitud de Tasación Plan Renove: ${formData.myCar}&body=${bodyText}`;

      setStatus("¡Formulario procesado! Se ha abierto tu cliente de correo.");
      setFormData({
        myCar: "",
        yearPlate: "",
        targetCar: "",
        phone: "",
        email: "",
      });
    }, 800);
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 pt-[96px] lg:pt-[116px] pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Enlace atrás */}
          <div className="mb-6">
            <Link
              href="/marketplace"
              className="text-xs font-bold text-neutral-400 hover:text-accent-gold transition-colors font-sans uppercase tracking-widest"
            >
              ← Volver al Marketplace
            </Link>
          </div>

          {/* Header de la página */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-2 block">
              Plan Renove NordImport
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 mb-3">
              Tasa tu coche actual
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Utiliza el valor de tu vehículo actual como entrada o parte del pago de tu nuevo coche importado de alta gama.
            </p>
          </div>

          {/* Tarjeta del Formulario */}
          <div className="bg-white border border-neutral-200/60 shadow-xl rounded-2xl p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Bloque 1: Datos del coche a tasar */}
              <div className="space-y-4">
                <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                  <BadgeEuro className="w-4 h-4 text-accent-gold" />
                  1. Vehículo que entregas
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Marca, Modelo y Motor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. BMW Serie 3 320d F30"
                      value={formData.myCar}
                      onChange={(e) => setFormData({ ...formData, myCar: e.target.value })}
                      className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Matrícula o Año *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1234 ABC o 2017"
                      value={formData.yearPlate}
                      onChange={(e) => setFormData({ ...formData, yearPlate: e.target.value })}
                      className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Bloque 2: Coche que te interesa */}
              <div className="space-y-4 pt-2">
                <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-gold" />
                  2. Vehículo de interés
                </h3>
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">¿Qué coche te interesa de nuestro catálogo? (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Porsche 911 Carrera S"
                    value={formData.targetCar}
                    onChange={(e) => setFormData({ ...formData, targetCar: e.target.value })}
                    className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                  />
                </div>
              </div>

              {/* Bloque 3: Datos de contacto */}
              <div className="space-y-4 pt-2">
                <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-accent-gold" />
                  3. Datos de contacto
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +34 600 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. mi.correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Botón enviar */}
              <div className="pt-4 border-t border-neutral-100">
                <button
                  type="submit"
                  className="cursor-pointer w-full bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Solicitar Valoración Gratuita</span>
                  <Send className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-neutral-400 text-center mt-3 font-sans leading-relaxed">
                  Al solicitar tu valoración, declaras estar de acuerdo con las políticas de privacidad y protección de datos locales en España. Recibirás una estimación en 24 horas.
                </p>
              </div>

              {status && (
                <p className="font-sans text-xs font-semibold text-emerald-600 text-center mt-4">
                  {status}
                </p>
              )}

            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

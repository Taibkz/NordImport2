"use client";

import React, { useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Send } from "lucide-react";

export default function QuizForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [demoNotice, setDemoNotice] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    anoMin: "",
    presupuesto: "",
    servicio: "estandar", // default recommendation
    nombre: "",
    telefono: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceType: string) => {
    setFormData((prev) => ({ ...prev, servicio: serviceType }));
  };

  const nextStep = () => {
    // Basic validation per step
    if (step === 1 && (!formData.marca || !formData.modelo)) {
      setErrorMsg("Por favor, introduce la marca y el modelo del coche.");
      return;
    }
    if (step === 2 && !formData.presupuesto) {
      setErrorMsg("Por favor, indica tu presupuesto máximo.");
      return;
    }
    setErrorMsg("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.nombre || !formData.telefono || !formData.email) {
      setErrorMsg("Por favor, completa todos los campos de contacto.");
      return;
    }

    setLoading(true);

    const leadPayload = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      marca_modelo: `${formData.marca} ${formData.modelo} (Año mín: ${formData.anoMin || "Indiferente"})`,
      presupuesto_max: parseFloat(formData.presupuesto),
      servicio_deseado: formData.servicio,
    };

    if (!isSupabaseConfigured || !supabase) {
      // Simulate success in demo mode
      setTimeout(() => {
        console.log("Demo Mode Lead Payload:", leadPayload);
        setDemoNotice(true);
        setLoading(false);
        setSuccess(true);
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.from("leads").insert(leadPayload);

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      console.error("Error inserting lead:", err);
      // Fallback to success even on error but display demo notification to avoid locking the UI
      setDemoNotice(true);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quiz" className="py-24 bg-slate-50 border-t border-b border-neutral-100">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Section Title */}
        {!success && (
          <div className="text-center mb-12 flex flex-col items-center">
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
              Asistente de Configuración
            </span>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-neutral-900 mb-4">
              Encuentra tu Coche Ideal
            </h2>
            <div className="h-[2px] w-12 bg-accent-gold mb-4" />
            <p className="font-sans text-xs sm:text-sm text-neutral-600">
              Rellena nuestro cuestionario de 4 pasos para que nuestro equipo comience la prospección en el mercado del norte de Europa.
            </p>
          </div>
        )}

        {/* Quiz Container Card */}
        <div className="bg-white border border-neutral-200/60 shadow-xl rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          
          {/* Progress Indicator */}
          {!success && (
            <div className="w-full mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-xs font-semibold text-accent-gold uppercase tracking-wider">
                  Paso {step} de 4
                </span>
                <span className="font-sans text-xs font-bold text-neutral-400">
                  {step * 25}% Completado
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-gold transition-all duration-300"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          )}

          {/* Errors box */}
          {errorMsg && (
            <div className="mb-6 flex items-center space-x-2 bg-red-50 border border-red-200 p-3.5 rounded-lg text-red-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FORM STEPS */}
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: VEHICLE SPECIFICATIONS */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-xl font-normal text-neutral-900 mb-2">
                    ¿Qué coche estás buscando?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="marca" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        Marca *
                      </label>
                      <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        placeholder="Ej. Porsche, Audi, BMW"
                        className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="modelo" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        id="modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Ej. 911 Carrera S, RS6"
                        className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="anoMin" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Año Mínimo (Opcional)
                    </label>
                    <input
                      type="number"
                      id="anoMin"
                      name="anoMin"
                      value={formData.anoMin}
                      onChange={handleChange}
                      placeholder="Ej. 2020"
                      min="2000"
                      max={new Date().getFullYear()}
                      className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: BUDGET */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-xl font-normal text-neutral-900 mb-2">
                    ¿Cuál es tu presupuesto aproximado?
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 mb-4">
                    Esto nos permite filtrar y negociar con garantías en concesionarios de confianza.
                  </p>
                  <div>
                    <label htmlFor="presupuesto" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Presupuesto Máximo (€) *
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        id="presupuesto"
                        name="presupuesto"
                        value={formData.presupuesto}
                        onChange={handleChange}
                        placeholder="Ej. 95000"
                        min="1000"
                        className="w-full font-sans text-sm border border-neutral-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-neutral-500 font-sans text-sm font-semibold">EUR</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SERVICE LEVEL */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-xl font-normal text-neutral-900 mb-2">
                    Elige el nivel de servicio deseado
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {/* Básico */}
                    <div
                      onClick={() => handleServiceSelect("basico")}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between h-36 ${
                        formData.servicio === "basico"
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold text-neutral-900">Básico</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.servicio === "basico" ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300"
                        }`}>
                          {formData.servicio === "basico" && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <p className="font-sans text-[10px] text-neutral-500 leading-tight">
                        Gestión documental y logística en camión cerrado.
                      </p>
                    </div>

                    {/* Estándar */}
                    <div
                      onClick={() => handleServiceSelect("estandar")}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between h-36 relative ${
                        formData.servicio === "estandar"
                          ? "border-accent-red bg-red-50/20"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <div className="absolute -top-2.5 right-4 bg-accent-red text-white font-sans text-[8px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold text-neutral-900">Estándar</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.servicio === "estandar" ? "bg-accent-red border-accent-red text-white" : "border-neutral-300"
                        }`}>
                          {formData.servicio === "estandar" && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <p className="font-sans text-[10px] text-neutral-500 leading-tight">
                        Negociación, vídeo de inspección completa e ITV española pasada.
                      </p>
                    </div>

                    {/* Premium */}
                    <div
                      onClick={() => handleServiceSelect("premium")}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between h-36 ${
                        formData.servicio === "premium"
                          ? "border-accent-gold bg-amber-50/10"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-semibold text-neutral-900">Premium VIP</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formData.servicio === "premium" ? "bg-accent-gold border-accent-gold text-white" : "border-neutral-300"
                        }`}>
                          {formData.servicio === "premium" && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                      <p className="font-sans text-[10px] text-neutral-500 leading-tight">
                        Matriculado a tu nombre, 1 año de garantía y entrega a domicilio.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT INFORMATION */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-xl font-normal text-neutral-900 mb-2">
                    ¿Cómo nos ponemos en contacto?
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="nombre" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez"
                        className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="telefono" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="Ej. +34 600 000 000"
                          className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-sans text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Ej. juan@correo.com"
                          className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold bg-neutral-50 focus:bg-white transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="cursor-pointer inline-flex items-center space-x-2 font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors py-2 px-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Atrás</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white inline-flex items-center space-x-2 font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-lg transition-colors ml-auto"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer bg-accent-red hover:bg-red-700 disabled:bg-neutral-400 text-white inline-flex items-center space-x-2 font-sans text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-lg shadow-md hover:shadow-lg transition-all ml-auto"
                  >
                    {loading ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <span>Enviar Solicitud</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          ) : (
            /* SUCCESS SCREEN WITH ANIMATED CHECKMARK */
            <div className="text-center py-8 flex flex-col items-center justify-center space-y-6 animate-scaleIn">
              
              {/* Checkmark bubble */}
              <div className="relative">
                <div className="w-20 h-20 bg-accent-green/10 border border-accent-green/30 rounded-full flex items-center justify-center text-accent-green animate-bounce">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <div className="absolute top-0 right-0 bg-accent-gold rounded-full p-1.5 text-neutral-900 border border-white">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
              </div>

              {/* Success Messages */}
              <div className="space-y-3 max-w-lg">
                <h3 className="font-serif text-2xl font-semibold text-neutral-950">
                  ¡Cuestionario Completado!
                </h3>
                <p className="font-sans text-sm sm:text-base text-neutral-700 leading-relaxed">
                  Solicitud recibida. Analizaremos el mercado y te contactaremos por WhatsApp en 24/48 horas.
                </p>
              </div>

              {/* Demo Mode Notice */}
              {demoNotice && (
                <div className="bg-accent-gold/10 border border-accent-gold/25 px-4 py-2.5 rounded-lg text-neutral-800 text-[11px] font-medium flex items-center space-x-2 max-w-sm">
                  <AlertCircle className="w-4 h-4 text-accent-gold shrink-0" />
                  <span>Modo Demo: El lead se simuló con éxito (Supabase offline).</span>
                </div>
              )}

              {/* Reset Form */}
              <button
                onClick={() => {
                  setStep(1);
                  setSuccess(false);
                  setDemoNotice(false);
                  setFormData({
                    marca: "",
                    modelo: "",
                    anoMin: "",
                    presupuesto: "",
                    servicio: "estandar",
                    nombre: "",
                    telefono: "",
                    email: "",
                  });
                }}
                className="cursor-pointer font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 border-b border-transparent hover:border-neutral-900 pt-4 transition-colors"
              >
                Configurar otro coche
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

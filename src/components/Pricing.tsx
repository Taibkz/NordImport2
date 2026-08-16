"use client";

import React from "react";
import { Check, Shield, HelpCircle, PhoneCall, Sparkles } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  ivaText: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
  buttonText: string;
  whatsAppText: string;
}

export default function Pricing() {
  const plans: Plan[] = [
    {
      name: "Cuota de Asesoramiento",
      price: "150 €",
      ivaText: "+ IVA",
      description: "Ideal para resolver dudas iniciales y validar opciones del mercado alemán antes de decidirte.",
      features: [
        "Asesoramiento personalizado telefónico o chat",
        "Resolución de dudas sobre homologación en España",
        "Análisis inicial de viabilidad técnica de 3 coches",
        "Orientación de costes reales e impuestos de matriculación"
      ],
      popular: false,
      color: "border-neutral-200 bg-white hover:border-neutral-300",
      buttonText: "Contratar Asesoramiento",
      whatsAppText: "Hola NordImport, estoy interesado en la Cuota de Asesoramiento (150€ + IVA)."
    },
    {
      name: "Revisión Premium en Origen",
      price: "350 €",
      ivaText: "+ IVA",
      description: "Verificación técnica presencial del coche en cualquier punto de Alemania antes de realizar la compra.",
      features: [
        "Desplazamiento presencial de perito técnico al coche",
        "Revisión completa de chasis, pintura y posibles golpes",
        "Lectura de diagnosis oficial y prueba mecánica",
        "Reporte detallado con más de 100 fotos y vídeos en alta calidad"
      ],
      popular: false,
      color: "border-neutral-200 bg-white hover:border-neutral-300",
      buttonText: "Contratar Revisión",
      whatsAppText: "Hola NordImport, estoy interesado en la Revisión Premium en Origen (350€ + IVA)."
    },
    {
      name: "Importación Completa",
      price: "990 €",
      ivaText: "Neto",
      description: "Gestión total llave en mano. Nos encargamos de todo el proceso de importación hasta la aduana española.",
      features: [
        "Gestión integral de la compra y negociación en origen",
        "Búsqueda activa y filtrado de concesionarios de confianza",
        "Inspección previa completa en origen incluida",
        "Transporte profesional asegurado en camión a España",
        "Soporte documental, contratos y firmas en Alemania"
      ],
      popular: true,
      color: "border-accent-red bg-white shadow-xl hover:shadow-2xl relative",
      buttonText: "Contratar Importación",
      whatsAppText: "Hola NordImport, estoy interesado en la Importación Completa (990€ Neto)."
    },
    {
      name: "Importación a Domicilio",
      price: "1.300 €",
      ivaText: "+ IVA",
      description: "El servicio más completo. Buscamos, revisamos y llevamos el vehículo matriculado hasta tu puerta.",
      features: [
        "Búsqueda ilimitada y negociación en tu nombre",
        "Revisión e inspección presencial certificada en origen",
        "Transporte en camión portavehículos directo a tu domicilio",
        "Gestión de ITV española y trámites de matriculación",
        "Entrega en mano con placas definitivas listo para circular"
      ],
      popular: false,
      color: "border-neutral-200 bg-white hover:border-neutral-300",
      buttonText: "Contratar Plan Domicilio",
      whatsAppText: "Hola NordImport, estoy interesado en la Importación a Domicilio (1.300€ + IVA)."
    }
  ];

  const handlePlanClick = (whatsAppText: string) => {
    const encodedText = encodeURIComponent(whatsAppText);
    window.open(`https://wa.me/34643181464?text=${encodedText}`, "_blank");
  };

  return (
    <section id="precios" className="py-20 lg:py-24 bg-neutral-50 border-t border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Tarifas Claras y Transparentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 mb-4">
            Servicios y Tarifas
          </h2>
          <div className="h-[2px] w-12 bg-accent-gold mb-4" />
          <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
            Sin comisiones ocultas ni sorpresas. Elige el nivel de servicio que mejor se adapte a tus necesidades para importar tu coche premium.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between border-2 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-red text-white font-sans text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Más Popular
                </div>
              )}

              <div>
                {/* Header Card */}
                <div className="mb-6">
                  <h3 className="font-serif text-base font-bold text-neutral-900 mb-2 leading-tight">
                    {plan.name}
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-500 leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-4 flex items-baseline">
                    <span className="font-display text-3xl font-extrabold text-neutral-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="font-sans text-xs text-neutral-400 ml-1 font-semibold">
                      {plan.ivaText}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 border-t border-neutral-100 pt-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.popular ? "bg-accent-red/10 text-accent-red" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-sans text-xs text-neutral-600 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to action */}
              <button
                onClick={() => handlePlanClick(plan.whatsAppText)}
                className={`cursor-pointer w-full py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider text-center transition-all duration-200 ${
                  plan.popular
                    ? "bg-neutral-950 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-950/15"
                    : "bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-12 bg-white border border-neutral-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Garantía y Seguridad Legal Española
              </h4>
              <p className="font-sans text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                Todas las operaciones se firman mediante contratos bajo la legislación mercantil en España.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handlePlanClick("Hola NordImport, tengo algunas dudas sobre vuestras tarifas de importación.")}
              className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Resolver Dudas</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

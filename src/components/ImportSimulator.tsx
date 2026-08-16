"use client";

import React, { useState } from "react";
import { ArrowRight, HelpCircle, Info, Sparkles } from "lucide-react";

export default function ImportSimulator() {
  const [basePrice, setBasePrice] = useState<number>(35000);
  const [co2, setCo2] = useState<number>(135);
  const [fuelType, setFuelType] = useState<string>("gasolina");
  const [isDealer, setIsDealer] = useState<boolean>(true); // Concesionario (IVA) o Particular (ITP)

  // Cálculos de tasas en España
  const transportCost = 1500; // Transporte asegurado desde Alemania
  const agencyFee = 2500; // Comisión de NordImport (ITV, homologación, ficha reducida, placas temporales, 1 año de garantía)

  // Porcentaje del Impuesto de Matriculación (IEDMT) según emisiones de CO2
  let iedmtPercent = 0;
  if (co2 <= 120) {
    iedmtPercent = 0;
  } else if (co2 > 120 && co2 <= 159) {
    iedmtPercent = 4.75;
  } else if (co2 > 159 && co2 < 200) {
    iedmtPercent = 9.75;
  } else {
    iedmtPercent = 14.75;
  }

  // Si es eléctrico 100%, IEDMT es siempre 0%
  if (fuelType === "electrico") {
    iedmtPercent = 0;
  }

  const iedmtTax = (basePrice * iedmtPercent) / 100;
  
  // Impuesto patrimonial (ITP) o gastos de transferencia (estimación aproximada si es particular)
  const transferTax = isDealer ? 0 : basePrice * 0.04;

  const totalCost = basePrice + transportCost + agencyFee + iedmtTax + transferTax;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-20 lg:py-24 bg-neutral-900 text-white relative overflow-hidden border-y border-neutral-800">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-3 block">
            Herramienta Interactiva
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Simulador de Costes de Importación
          </h2>
          <div className="h-[2px] w-16 bg-accent-gold mx-auto mb-5" />
          <p className="font-sans text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
            Calcula con transparencia absoluta el precio llave en mano en España de cualquier vehículo del mercado europeo. Sin sorpresas, con todo desglosado.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Parámetros de Entrada */}
          <div className="lg:col-span-7 bg-neutral-950/60 backdrop-blur-md border border-neutral-800 p-6 sm:p-10 rounded-2xl space-y-6">
            <h3 className="font-display text-xl font-semibold mb-4 text-accent-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> 1. Ajusta los datos del vehículo
            </h3>

            {/* Precio Base en Origen */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-sans text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  Precio del coche en Europa (origen)
                  <span title="Precio de venta anunciado en Mobile.de, Autoscout24, etc.">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-500 cursor-help" />
                  </span>
                </label>
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 focus-within:border-accent-gold transition-colors">
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    value={basePrice || ""}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="bg-transparent text-right font-sans text-sm font-bold text-accent-gold outline-none w-20 sm:w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-none p-0"
                  />
                  <span className="font-sans text-sm font-bold text-accent-gold">€</span>
                </div>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent-gold"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-sans mt-1">
                <span>1.000 €</span>
                <span>250.000 €</span>
              </div>
            </div>

            {/* Emisiones de CO2 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-sans text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  Emisiones de CO2 (g/km)
                  <span title="Determina el Impuesto de Matriculación en España.">
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-500 cursor-help" />
                  </span>
                </label>
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 focus-within:border-accent-gold transition-colors">
                  <input
                    type="number"
                    min="0"
                    max="999"
                    disabled={fuelType === "electrico"}
                    value={co2 || 0}
                    onChange={(e) => setCo2(Number(e.target.value))}
                    className="bg-transparent text-right font-sans text-sm font-bold text-accent-gold outline-none w-12 sm:w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-none p-0 disabled:text-neutral-500"
                  />
                  <span className="font-sans text-sm font-bold text-accent-gold">g/km</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="280"
                step="1"
                value={co2}
                disabled={fuelType === "electrico"}
                onChange={(e) => setCo2(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-sans mt-1">
                <span>0 g/km (Eléctrico)</span>
                <span>280+ g/km (Gran cilindrada)</span>
              </div>
            </div>

            {/* Motorización y Tipo de Vendedor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Motor */}
              <div>
                <span className="block font-sans text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Tipo de Combustible
                </span>
                <select
                  value={fuelType}
                  onChange={(e) => {
                    setFuelType(e.target.value);
                    if (e.target.value === "electrico") setCo2(0);
                  }}
                  className="w-full font-sans text-sm border border-neutral-800 bg-neutral-900 rounded-lg px-3.5 py-3 focus:outline-none focus:border-accent-gold text-white transition-colors"
                >
                  <option value="gasolina">Gasolina / Híbrido</option>
                  <option value="diesel">Diésel</option>
                  <option value="electrico">100% Eléctrico (Cero)</option>
                </select>
              </div>

              {/* Vendedor */}
              <div>
                <span className="block font-sans text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Adquirido a:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDealer(true)}
                    className={`cursor-pointer font-sans text-xs font-bold py-3 px-1 rounded-lg border transition-all ${
                      isDealer
                        ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400"
                    }`}
                  >
                    Concesionario
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDealer(false)}
                    className={`cursor-pointer font-sans text-xs font-bold py-3 px-1 rounded-lg border transition-all ${
                      !isDealer
                        ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400"
                    }`}
                  >
                    Particular
                  </button>
                </div>
              </div>
            </div>

            {/* Aviso fiscal local */}
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex gap-3 text-xs text-neutral-400 items-start leading-relaxed">
              <Info className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <p>
                {isDealer 
                  ? "Adquisiciones en concesionarios oficiales europeos suelen incluir IVA deducible de origen (19% o 21%), ideal para autónomos y empresas." 
                  : "Adquisiciones a particulares están exentas de IVA, pero sujetas al Impuesto de Transmisiones Patrimoniales (ITP) de tu Comunidad Autónoma (simulado al 4%)."}
              </p>
            </div>
          </div>

          {/* Desglose de Gastos y Total Llave en Mano */}
          <div className="lg:col-span-5 bg-neutral-950 border-2 border-accent-gold/30 p-6 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between h-full">
            <div>
              <h3 className="font-display text-xl font-bold mb-6 text-white pb-3 border-b border-neutral-800">
                2. Presupuesto Llave en Mano
              </h3>

              {/* Fila desglose */}
              <div className="space-y-4 font-sans text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Valor neto coche (origen):</span>
                  <span className="text-white font-semibold">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Transporte seguro (Alemania a España):</span>
                  <span className="text-white font-semibold">{formatCurrency(transportCost)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tasas DGT, Ficha Reducida e ITV:</span>
                  <span className="text-white font-semibold">350 €</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Impuesto Matriculación (IEDMT - {iedmtPercent}%):</span>
                  <span className="text-white font-semibold">{formatCurrency(iedmtTax)}</span>
                </div>
                {!isDealer && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Impuesto Patrimonial (ITP estimado):</span>
                    <span className="text-white font-semibold">{formatCurrency(transferTax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Gestión NordImport y 1 año de garantía:</span>
                  <span className="text-white font-semibold">{formatCurrency(agencyFee - 350)}</span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-8 pt-6 border-t border-neutral-800">
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Total Llave en Mano
                </span>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-accent-gold">
                  {formatCurrency(totalCost)}
                </span>
              </div>

              <a
                href="#quiz"
                className="cursor-pointer bg-accent-gold hover:bg-amber-500 text-neutral-950 font-sans text-xs font-bold uppercase tracking-widest py-4 px-6 rounded-xl transition-all text-center block shadow-lg hover:shadow-accent-gold/20 flex items-center justify-center gap-2"
              >
                <span>Solicitar prospección de este modelo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

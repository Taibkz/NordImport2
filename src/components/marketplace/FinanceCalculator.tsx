"use client";

import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { Car } from "@/lib/marketplace/mockData";

interface FinanceCalculatorProps {
  car: Car;
}

export default function FinanceCalculator({ car }: FinanceCalculatorProps) {
  const [months, setMonths] = useState(72);
  const [downPayment, setDownPayment] = useState(0);

  if (!car.finance_available) return null;

  // Algoritmo de cuotas (TIN 7.9%)
  const principal = car.price - downPayment;
  const estimatedInterest = principal * (0.079 * (months / 12));
  const totalToPay = principal > 0 ? principal + estimatedInterest : 0;
  const monthlyQuota = totalToPay > 0 ? Math.round(totalToPay / months) : 0;

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-6 mb-8">
      <h3 className="font-serif text-lg font-normal text-neutral-900 mb-5 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-accent-gold" />
        Simulador de Financiación
      </h3>

      <div className="space-y-6">
        {/* Entrada Inicial */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-sans text-xs font-semibold text-neutral-600">Entrada Inicial:</span>
            <span className="font-sans text-sm font-bold text-accent-gold">
              {downPayment.toLocaleString("es-ES")} €
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.floor(car.price * 0.8)}
            step="500"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-sans mt-1">
            <span>0 € (Sin entrada)</span>
            <span>MÁX: {(Math.floor(car.price * 0.8)).toLocaleString("es-ES")} €</span>
          </div>
        </div>

        {/* Plazo en meses */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-sans text-xs font-semibold text-neutral-600">Plazo de amortización:</span>
            <span className="font-sans text-sm font-bold text-accent-gold">{months} meses</span>
          </div>
          <input
            type="range"
            min="24"
            max="120"
            step="12"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-gold"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 font-sans mt-1">
            <span>24 meses (2 años)</span>
            <span>120 meses (10 años)</span>
          </div>
        </div>

        {/* Resultado Final Cuota */}
        <div className="bg-white border border-accent-gold/20 rounded-lg p-5 text-center shadow-xs">
          <span className="font-sans text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
            Cuota Mensual Estimada
          </span>
          <div className="font-sans text-3xl font-extrabold text-accent-gold mt-1">
            {monthlyQuota.toLocaleString("es-ES")} €<span className="text-sm font-normal text-neutral-500">/mes</span>
          </div>
          <p className="font-sans text-[10px] text-neutral-400 mt-3 leading-relaxed">
            * TIN estimado del 7.9% de carácter meramente informativo. Sujeto a la aprobación financiera final y condiciones particulares de la entidad bancaria.
          </p>
        </div>
      </div>
    </div>
  );
}

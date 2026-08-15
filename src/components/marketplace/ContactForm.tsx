"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Car } from "@/lib/marketplace/mockData";

interface ContactFormProps {
  car: Car;
}

export default function ContactForm({ car }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Procesando consulta...");

    const leadPayload = {
      car_id: car.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    let dbSuccess = true;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("marketplace_leads").insert([leadPayload]);
        if (error) {
          console.error("Error saving marketplace lead:", error);
          dbSuccess = false;
        }
      } catch (err) {
        console.error("Supabase insert error:", err);
        dbSuccess = false;
      }
    } else {
      console.log("Mock lead simulation (Supabase not configured):", leadPayload);
    }

    // Configurar el email del receptor (correo del vendedor o el genérico de NordImport)
    const sellerEmail = car.profiles?.email || "info@nordimport.com";
    const emailBody = `Hola, mi nombre es ${formData.name}.%0A%0AEstoy interesado en el vehículo en venta: ${car.brand} ${car.model}.%0A%0AMi teléfono es: ${formData.phone}%0AMi e-mail es: ${formData.email}%0A%0AMensaje adicional:%0A${formData.message}`;
    
    // Abrir el cliente de correo nativo
    window.location.href = `mailto:${sellerEmail}?subject=Interés de Compra: ${car.brand} ${car.model}&body=${emailBody}`;

    setLoading(false);
    if (!dbSuccess) {
      setStatus("Cliente de correo abierto. (Error al registrar en BD local)");
    } else {
      setStatus("¡Cliente de correo abierto para enviar tu mensaje!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-5 mt-6">
      <h3 className="font-serif text-base font-normal text-neutral-900 mb-4 flex items-center gap-2">
        <Mail className="w-4 h-4 text-accent-gold" />
        Escríbenos por Correo
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold bg-white transition-colors"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold bg-white transition-colors"
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Teléfono"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <textarea
            placeholder="Mensaje adicional (ej. disponibilidad, tasación de mi coche, etc.)..."
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold bg-white transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white w-full py-3 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <span>Enviar Mensaje</span>
          <Send className="w-3.5 h-3.5" />
        </button>

        {status && (
          <p
            className={`font-sans text-[11px] font-semibold text-center mt-2 ${
              status.includes("¡Cliente") ? "text-emerald-600" : "text-neutral-500"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}

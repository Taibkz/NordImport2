"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { KeyRound, ArrowRight, Info } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirigir si no hay sesión activa (para actualizar contraseña se requiere sesión activa iniciada desde el link)
  useEffect(() => {
    if (!authLoading && !user && isSupabaseConfigured) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setMessage("❌ La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setMessage("✅ Contraseña actualizada (Modo Demo).");
        setLoading(false);
        router.push("/marketplace");
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage("✅ Contraseña actualizada correctamente. Redirigiendo...");
      setTimeout(() => {
        router.push("/marketplace");
      }, 1500);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 flex items-center justify-center py-12 px-6 min-h-[85vh]">
        <div className="w-full max-w-[480px] bg-white border border-neutral-200/60 shadow-2xl rounded-2xl p-6 sm:p-10">
          
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Nueva Contraseña
            </h2>
            <p className="font-sans text-xs text-neutral-400 mt-2">
              Introduce tu nueva contraseña de acceso comercial.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Nueva Contraseña *
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type="password"
                required
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-neutral-950 hover:bg-neutral-900 text-white py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-neutral-400"
            >
              {loading ? (
                <span>Actualizando...</span>
              ) : (
                <>
                  <span>Guardar Contraseña</span>
                  <ArrowRight className="w-4 h-4 text-accent-gold" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl border text-xs font-semibold text-center flex items-center justify-center gap-2 ${
              message.includes("✅")
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <Info className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

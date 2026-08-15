"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KeyRound, ShieldCheck, Mail, ArrowRight, UserPlus, Info, Check } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) { 
      setMessage("Supabase no está configurado (Modo Demo activo)."); 
      return; 
    }
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage(err.message);
      setGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured || !supabase) {
      // Simular autenticación exitosa en modo demo
      setLoading(true);
      setTimeout(() => {
        setMessage("Validación exitosa (Modo Demostración).");
        setLoading(false);
        router.push("/marketplace");
      }, 1000);
      return;
    }
    
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage("¡Éxito! Revisa la bandeja de entrada o spam de tu correo electrónico.");
        setLoading(false);
        return;
      }

      if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden. Vuelve a introducirlas.");
        }
        if (password.length < 6) {
          throw new Error("La contraseña debe tener un mínimo de 6 caracteres.");
        }
        
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              username: username,
              phone: phone
            }
          }
        });
        
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          throw new Error("Este correo ya pertenece a un perfil registrado.");
        }
        
        setMessage("¡Bienvenido! Por favor, verifica tu correo en el email enviado para confirmar tu identidad.");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        setMessage("¡Validación Exitosa! Accediendo a la red...");
        setTimeout(() => {
          router.push("/marketplace");
        }, 1000);
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 flex items-center justify-center py-12 px-6 min-h-[85vh]">
        <div className="w-full max-w-[520px] bg-white border border-neutral-200/60 shadow-2xl rounded-2xl p-6 sm:p-10">
          
          {/* Cabecera del formulario */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              {mode === "login" 
                ? "Iniciar Sesión" 
                : mode === "register" 
                  ? "Crear Cuenta" 
                  : "Recuperar Contraseña"}
            </h2>
            <p className="font-sans text-xs text-neutral-400 mt-2">
              {mode === "login" 
                ? "Introduce tus credenciales de acceso privadas." 
                : mode === "register" 
                  ? "Únete a la red comercial de NordImport 2.0." 
                  : "Envío automático de correo para restablecer la contraseña."}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Google Login (OAuth) */}
            {mode !== "forgot" && (
              <div className="space-y-4 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 border border-neutral-300 rounded-xl font-sans text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                >
                  <svg width="16" height="16" viewBox="0 0 48 48" className="shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{googleLoading ? "Redirigiendo..." : "Continuar con Google"}</span>
                </button>
                <div className="flex items-center gap-3">
                  <hr className="flex-grow border-neutral-200" />
                  <span className="font-sans text-[9px] font-bold text-neutral-400 uppercase tracking-widest">o mediante correo</span>
                  <hr className="flex-grow border-neutral-200" />
                </div>
              </div>
            )}

            {/* Campos de Registro */}
            {mode === "register" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="Bruce"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Wayne"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Nombre de Usuario (Alias) *</label>
                  <input
                    type="text"
                    required
                    placeholder="bwayne39"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">WhatsApp de contacto comercial *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                  />
                </div>
                <hr className="border-neutral-100" />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>

            {/* Contraseña */}
            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider">Contraseña *</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setMessage(""); }}
                      className="font-sans text-[10px] text-accent-gold hover:underline font-bold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                />
              </div>
            )}

            {/* Confirmar Contraseña (Registro) */}
            {mode === "register" && (
              <div className="animate-fadeIn">
                <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Confirmar Contraseña *</label>
                <input
                  type="password"
                  required
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full font-sans text-xs border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
                />
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-neutral-950 hover:bg-neutral-900 text-white py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:bg-neutral-400"
            >
              {loading ? (
                <span>Validando...</span>
              ) : (
                <>
                  <span>
                    {mode === "login" 
                      ? "Acceder" 
                      : mode === "register" 
                        ? "Crear Cuenta" 
                        : "Recuperar Contraseña"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-accent-gold" />
                </>
              )}
            </button>
          </form>

          {/* Mensajes de error/éxito */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl border text-xs font-semibold text-center flex items-center justify-center gap-2 ${
              message.includes("xito") || message.includes("Exitosa") || message.includes("Bienvenido")
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <Info className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Alternar modos */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <span className="font-sans text-xs text-neutral-400">
              {mode === "login" ? "¿No tienes licencia comercial?" : "¿Ya tienes perfil comercial?"}
            </span>
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}
              className="font-sans text-xs font-bold text-accent-gold hover:underline ml-2"
            >
              {mode === "login" ? "Regístrate gratis" : "Inicia sesión aquí"}
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

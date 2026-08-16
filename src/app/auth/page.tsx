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
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    if (!isSupabaseConfigured || !supabase) {
      setMessage(`Autenticación con ${provider} simulada con éxito (Modo Demo).`);
      setTimeout(() => {
        router.push("/marketplace");
      }, 1000);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      const msg = err?.message || err?.error_description || (err?.toString && err.toString() !== "[object Object]" ? err.toString() : "");
      setMessage(msg === "{}" || !msg ? "Error de conexión o autenticación simulada en progreso." : msg);
      setLoading(false);
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
        
        setIsRegistered(true);
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        setMessage("¡Validación Exitosa! Accediendo a la red...");
        setTimeout(() => {
          router.push("/marketplace");
        }, 1000);
      }
    } catch (err: any) {
      const msg = err?.message || err?.error_description || (err?.toString && err.toString() !== "[object Object]" ? err.toString() : "");
      setMessage(msg === "{}" || !msg ? "Error en el servidor de correo o límite de envíos superado. Por favor, verifica tu configuración de SMTP o inténtalo más tarde." : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 flex items-center justify-center pt-[96px] lg:pt-[120px] pb-12 px-6 min-h-[85vh]">
        <div className="w-full max-w-[520px] bg-white border border-neutral-200/60 shadow-2xl rounded-2xl p-6 sm:p-10">
          
          {isRegistered ? (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-accent-gold/10 border border-accent-gold/30 rounded-full flex items-center justify-center mx-auto text-accent-gold shadow-sm">
                <Mail className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                Verifica tu Correo
              </h2>
              <p className="font-sans text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
                Hemos enviado un correo de activación a <strong className="text-neutral-900">{email}</strong>. 
                Por favor, abre el enlace del correo para validar tu cuenta comercial.
              </p>
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
                <button
                  onClick={() => setIsRegistered(false)}
                  className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all"
                >
                  Volver al Login
                </button>
              </div>
            </div>
          ) : (
            <>
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
            
            {/* Social Logins (OAuth) */}
            {mode !== "forgot" && (
              <div className="space-y-4 mb-4">
                <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">
                  Iniciar sesión con:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleOAuth("google")}
                    disabled={loading}
                    className="cursor-pointer flex items-center justify-center py-3 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                    title="Google"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => handleOAuth("apple")}
                    disabled={loading}
                    className="cursor-pointer flex items-center justify-center py-3 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                    title="Apple"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.2 3.03 9.4 6.78 5.76c1.88-1.83 4-1.84 5.37-1.16 1.42.7 2.22.68 3.56 0 1.25-.63 3.4-.78 4.96.88-3.17 1.83-2.65 6.22.42 7.5-1.3 3.32-3.06 6.37-4.04 7.3zM15.47 1.05c2.7.2 4.14 2.66 3.75 5.35-2.58.28-4.75-2.08-3.75-5.35z"/>
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleOAuth("facebook")}
                    disabled={loading}
                    className="cursor-pointer flex items-center justify-center py-3 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-colors shadow-2xs"
                    title="Facebook"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>
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
        </>
      )}

        </div>
      </main>
      <Footer />
    </>
  );
}

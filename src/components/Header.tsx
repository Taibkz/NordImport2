"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, User, Menu, X, ShieldAlert, PlusCircle } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Verificar si es administrador
  useEffect(() => {
    async function checkAdmin() {
      if (!user || !supabase) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        if (data?.is_admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user]);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-100 py-3"
          : "bg-white/50 backdrop-blur-xs py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-3 group"
        >
          {/* Logo Image */}
          <div className="relative w-40 h-12 sm:w-52 sm:h-16 lg:w-60 lg:h-18 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="NORD IMPORT Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          {["precios", "proceso", "stock", "media"].map((sec) => (
            <button
              key={sec}
              onClick={() => handleScrollTo(sec)}
              className="font-sans text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors capitalize cursor-pointer relative py-1"
            >
              {sec === "media" ? "Ecosistema" : sec === "precios" ? "Servicios y Tarifas" : sec}
            </button>
          ))}
          
          {/* Link al Marketplace */}
          <Link
            href="/marketplace"
            className="font-sans text-sm font-bold text-neutral-800 hover:text-accent-gold transition-colors"
          >
            Marketplace
          </Link>

          {/* Enlaces de usuario logueado */}
          {user && (
            <>
              <Link
                href="/marketplace/mis-anuncios"
                className="font-sans text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Mi Garaje
              </Link>
              <Link
                href="/marketplace/favoritos"
                className="font-sans text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Favoritos
              </Link>
              {isAdmin && (
                <Link
                  href="/marketplace/dashboard"
                  className="font-sans text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <ShieldAlert className="w-4 h-4" /> Moderar
                </Link>
              )}
            </>
          )}
        </nav>

        {/* RIGHT CTA / SESSION ACTIONS (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="font-sans text-xs font-semibold text-neutral-500 max-w-[120px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer text-neutral-500 hover:text-neutral-900 p-2 border border-neutral-200 rounded-lg transition-colors flex items-center justify-center"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 py-3 px-5 border border-neutral-300 rounded-lg hover:border-neutral-800 transition-all"
            >
              Iniciar Sesión
            </Link>
          )}

          <button
            onClick={() => handleScrollTo("quiz")}
            className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold tracking-wider uppercase px-6 py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            Buscar mi coche
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

       {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-100 shadow-xl absolute top-full left-0 right-0 py-6 px-6 flex flex-col space-y-4 animate-fadeIn max-h-[85vh] overflow-y-auto">
          {["precios", "proceso", "stock", "media"].map((sec) => (
            <button
              key={sec}
              onClick={() => handleScrollTo(sec)}
              className="text-left font-sans text-sm font-semibold text-neutral-700 hover:text-neutral-900 py-2 border-b border-neutral-50 capitalize"
            >
              {sec === "media" ? "Ecosistema de Contenidos" : sec === "precios" ? "Servicios y Tarifas" : sec}
            </button>
          ))}
          
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="font-sans text-sm font-bold text-neutral-700 hover:text-neutral-900 py-2 border-b border-neutral-50"
          >
            Catálogo Marketplace
          </Link>

          {user ? (
            <>
              <Link
                href="/marketplace/mis-anuncios"
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-sm font-semibold text-neutral-700 hover:text-neutral-900 py-2 border-b border-neutral-50"
              >
                Mi Garaje Privado
              </Link>
              <Link
                href="/marketplace/favoritos"
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-sm font-semibold text-neutral-700 hover:text-neutral-900 py-2 border-b border-neutral-50"
              >
                Mis Favoritos
              </Link>
              {isAdmin && (
                <Link
                  href="/marketplace/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-sm font-bold text-red-600 hover:text-red-700 py-2 border-b border-neutral-50"
                >
                  Panel Moderador (Admin)
                </Link>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="font-sans text-xs text-neutral-400 truncate max-w-[200px]">
                  Conectado como {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer font-sans text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-sm font-bold text-accent-gold hover:text-amber-500 py-2 border-b border-neutral-50"
            >
              Iniciar Sesión
            </Link>
          )}

          <button
            onClick={() => handleScrollTo("quiz")}
            className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold tracking-wider uppercase py-3 rounded-lg text-center shadow-md transition-colors"
          >
            Buscar mi coche
          </button>
        </div>
      )}
    </header>

    {/* Floating WhatsApp Button */}
    {!mobileMenuOpen && (
      <a
        href="https://wa.me/34643181464?text=Hola%20NordImport%2C%20estoy%20interesado%20en%20importar%20un%20veh%C3%ADculo."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 sm:bottom-6 z-[9999] bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-3.5 shadow-2xl hover:scale-115 active:scale-90 transition-all duration-300 flex items-center gap-2 group cursor-pointer border border-white/10"
        title="Contactar por WhatsApp"
      >
        {/* Anillo de pulso radiante (Efecto de atención) */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-45 -z-10"></span>
        
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out font-sans text-[11px] font-bold uppercase tracking-wider whitespace-nowrap px-0 group-hover:px-1">
          ¿Hablamos?
        </span>
        <img
          src="/social/whatsapp.png"
          alt="WhatsApp"
          className="w-6 h-6 object-contain shrink-0"
        />
      </a>
    )}
  </>
);
}


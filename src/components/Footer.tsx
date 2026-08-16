"use client";

import React from "react";
import Image from "next/image";
import { Send, Phone, Mail, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-neutral-800">
        
        {/* Company Identity (4 columns equivalent) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="relative w-44 h-16">
              <Image
                src="/logo_with_background.png"
                alt="NORD IMPORT Logo"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
            Especialistas en la localización, inspección y transporte de vehículos premium y superdeportivos desde Alemania y el norte de Europa hacia España.
          </p>
          <div className="flex space-x-4">
            {[
              { name: "instagram", url: "#" },
              { name: "tiktok", url: "#" },
              { name: "youtube", url: "#" },
            ].map((network) => (
              <a
                key={network.name}
                href={network.url}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-accent-gold transition-all flex items-center justify-center p-2.5 hover:scale-110 active:scale-95 group"
                title={network.name}
              >
                <img
                  src={`/social/${network.name}.png`}
                  alt={network.name}
                  className="w-full h-full object-contain filter brightness-100 group-hover:brightness-0"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Links Navigation (4 columns equivalent - split in 2) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
              Secciones
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              {[
                { label: "Servicios y Tarifas", id: "precios" },
                { label: "Nuestro proceso", id: "proceso" },
                { label: "Catálogo Stock", id: "stock" },
                { label: "Ecosistema social", id: "media" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(link.id);
                      if (el) {
                        window.scrollTo({
                          top: el.offsetTop - 80,
                          behavior: "smooth",
                        });
                      } else {
                        window.location.href = `/#${link.id}`;
                      }
                    }}
                    className="hover:text-accent-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/marketplace" className="hover:text-accent-gold transition-colors font-semibold">
                  Marketplace C2C
                </a>
              </li>
              <li>
                <a href="/marketplace/tasacion" className="hover:text-accent-gold transition-colors">
                  Tasar mi Coche (Plan Renove)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
              Legal
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-neutral-400">
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Aviso Legal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-gold transition-colors">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info (4 columns equivalent) */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
            Oficinas y Contacto
          </h4>
          <ul className="space-y-3.5 font-sans text-xs">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
              <span className="text-neutral-400 leading-relaxed">
                C. Isla de la Gomera, Norte<br />18014 Granada, España
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-accent-gold shrink-0" />
              <span className="text-neutral-400">+34 643 18 14 64</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-accent-gold shrink-0" />
              <span className="text-neutral-400">nordimport.contact@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom (Copyright and back to top) */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-sans">
        <span>
          © {new Date().getFullYear()} NORD IMPORT S.L. Todos los derechos reservados.
        </span>
        <button
          onClick={handleScrollToTop}
          className="mt-4 sm:mt-0 cursor-pointer bg-neutral-800 hover:bg-accent-gold hover:text-neutral-900 text-neutral-400 p-2.5 rounded-full transition-colors flex items-center justify-center group"
          title="Subir al inicio"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}

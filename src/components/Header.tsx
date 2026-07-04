"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-100 py-3"
          : "bg-white/50 backdrop-blur-xs py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center space-x-3 group"
        >
          {/* Logo Image */}
          <div className="relative w-12 h-12 overflow-hidden rounded-md bg-neutral-50 flex items-center justify-center border border-neutral-100 shadow-xs transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="NORD IMPORT Logo"
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          {/* Logo Text Styling */}
          <div className="flex flex-col justify-center">
            <span className="font-display text-lg tracking-[0.25em] font-bold text-neutral-900 leading-none">
              N O R D
            </span>
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-accent-gold mt-1 leading-none">
              IMPORT
            </span>
          </div>
        </a>

        {/* CENTRAL LINKS (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {["stock", "servicios", "proceso", "media"].map((sec) => (
            <button
              key={sec}
              onClick={() => handleScrollTo(sec)}
              className="font-sans text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors capitalize cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-gold after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {sec === "media" ? "Ecosistema" : sec}
            </button>
          ))}
        </nav>

        {/* RIGHT CTA BUTTON (Desktop) */}
        <div className="hidden md:block">
          <button
            onClick={() => handleScrollTo("quiz")}
            className="cursor-pointer bg-accent-red hover:bg-red-700 text-white font-sans text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Buscar mi coche
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 shadow-lg absolute top-full left-0 right-0 py-6 px-6 flex flex-col space-y-4 animate-fadeIn">
          {["stock", "servicios", "proceso", "media"].map((sec) => (
            <button
              key={sec}
              onClick={() => handleScrollTo(sec)}
              className="text-left font-sans text-base font-semibold text-neutral-700 hover:text-neutral-900 py-2 border-b border-neutral-50 capitalize"
            >
              {sec === "media" ? "Ecosistema de Contenidos" : sec}
            </button>
          ))}
          <button
            onClick={() => handleScrollTo("quiz")}
            className="w-full bg-accent-red hover:bg-red-700 text-white font-sans text-sm font-bold tracking-wider uppercase py-3 rounded-md text-center shadow-md transition-colors"
          >
            Buscar mi coche
          </button>
        </div>
      )}
    </header>
  );
}

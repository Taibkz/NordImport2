"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/marketplace/ImageCarousel";
import FinanceCalculator from "@/components/marketplace/FinanceCalculator";
import ContactForm from "@/components/marketplace/ContactForm";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { MOCK_CARS, Car } from "@/lib/marketplace/mockData";
import { Shield, Eye, Share2, Heart, CarFront, Palette, Check, Calendar, Gauge, MapPin } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CarDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ views: 0, shares: 0, favs: 0 });

  useEffect(() => {
    async function getCarDetail() {
      setLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        const found = MOCK_CARS.find((c) => c.id === id);
        setCar(found || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*, profiles(email, phone)")
          .eq("id", id)
          .single();

        if (error || !data) {
          const found = MOCK_CARS.find((c) => c.id === id);
          setCar(found || null);
        } else {
          setCar(data as Car);
          
          // Incrementar visualizaciones
          try {
            await supabase.rpc("increment_car_view", { target_id: data.id });
          } catch (e) {
            console.log("No se pudo ejecutar increment_car_view RPC, omitiendo...");
          }

          // Obtener cantidad de favoritos
          supabase
            .from("favorites")
            .select("*", { count: "exact", head: true })
            .eq("car_id", data.id)
            .then(({ count }) => {
              setStats({
                views: (data.views || 0) + 1,
                shares: data.shares || 0,
                favs: count || 0,
              });
            });
        }

        // Verificar si el usuario es admin o lo tiene en favoritos
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();
          
          if (profileData?.is_admin) setIsAdmin(true);

          if (data) {
            const { data: favData } = await supabase
              .from("favorites")
              .select("*")
              .eq("user_id", user.id)
              .eq("car_id", data.id);
            
            if (favData && favData.length > 0) setIsFav(true);
          }
        }
      } catch (err) {
        console.error("Error loading car details:", err);
        const found = MOCK_CARS.find((c) => c.id === id);
        setCar(found || null);
      } finally {
        setLoading(false);
      }
    }

    getCarDetail();
  }, [id, user]);

  const toggleFav = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar favoritos.");
      return;
    }
    if (!supabase || !car) return;

    try {
      if (isFav) {
        setIsFav(false);
        setStats((prev) => ({ ...prev, favs: prev.favs - 1 }));
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("car_id", car.id);
      } else {
        setIsFav(true);
        setStats((prev) => ({ ...prev, favs: prev.favs + 1 }));
        await supabase
          .from("favorites")
          .insert([{ user_id: user.id, car_id: car.id }]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!car || !supabase) return;
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este vehículo definitivamente?");
    if (confirmDelete) {
      try {
        const { error } = await supabase.from("cars").delete().eq("id", car.id);
        if (error) throw error;
        alert("Vehículo eliminado con éxito.");
        router.push("/marketplace");
      } catch (err) {
        alert("Error al eliminar el vehículo.");
      }
    }
  };

  const handleShare = async () => {
    if (!car) return;
    if (supabase) {
      try {
        await supabase.rpc("increment_car_share", { target_id: car.id });
      } catch (e) {
        // omitir si no existe RPC
      }
      setStats((prev) => ({ ...prev, shares: prev.shares + 1 }));
    }

    const shareData = {
      title: `NordImport | ${car.brand} ${car.model}`,
      text: `Échale un vistazo a este espectacular ${car.brand} ${car.model} en NordImport.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("¡Enlace copiado al portapapeles! Listo para enviar.");
      }
    } catch (err) {
      console.error("Error compartiendo:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center">
          <div className="space-y-4">
            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Cargando especificaciones...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center px-6">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="font-display text-2xl font-bold text-neutral-900">
              Vehículo No Encontrado
            </h2>
            <p className="font-sans text-sm text-neutral-500">
              El anuncio que buscas puede haber sido vendido, retirado o no existir.
            </p>
            <Link
              href="/marketplace"
              className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Volver al Catálogo
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Teléfono del vendedor (por defecto de NordImport si no existe)
  const contactPhone = car.profiles?.phone ? car.profiles.phone.replace(/[^0-9]/g, "") : "34643181464";
  const whatsappMsg = `Hola, estoy interesado en este vehículo publicado en NordImport:\n\n*${car.brand} ${car.model}*\nPrecio: ${car.price?.toLocaleString("es-ES")} €\n\n📌 Enlace al anuncio: ${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappUrl = `https://wa.me/${contactPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Volver a catálogo */}
          <div className="mb-6">
            <Link
              href="/marketplace"
              className="text-xs font-bold text-neutral-400 hover:text-accent-gold transition-colors font-sans uppercase tracking-widest"
            >
              ← Volver al Marketplace
            </Link>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Panel Izquierdo: Galería y Detalle */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Image Carousel */}
              <ImageCarousel images={car.images} />

              {/* Títulos y Estadísticas */}
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 sm:p-8 shadow-xs">
                {car.trust_badges && car.trust_badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.trust_badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="font-sans text-xs font-bold text-accent-gold tracking-widest uppercase">
                      {car.brand}
                    </span>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
                      {car.model}
                    </h1>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <button
                        onClick={handleDeletePost}
                        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-colors"
                      >
                        Borrar
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="cursor-pointer p-2.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors"
                      title="Compartir"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={toggleFav}
                      className={`cursor-pointer p-2.5 border rounded-lg transition-all ${
                        isFav 
                          ? "bg-red-50 border-red-200 text-red-600" 
                          : "border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                      }`}
                      title="Guardar favorito"
                    >
                      <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Estadísticas de visitas */}
                <div className="flex gap-4 border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-400 font-sans">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-neutral-300" /> {stats.views} Visitas</span>
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-neutral-300" fill="currentColor" /> {stats.favs} Favoritos</span>
                </div>
              </div>

              {/* Ficha Técnica Rejilla */}
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 sm:p-8 shadow-xs">
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-5">
                  Ficha Técnica Completa
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Año</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">{car.year}</span>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Kilometraje</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">
                      {car.kilometers ? car.kilometers.toLocaleString("es-ES") + " km" : "-"}
                    </span>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Potencia</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">{car.power ? `${car.power} CV` : "-"}</span>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Combustible</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">{car.fuel_type || "-"}</span>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Transmisión</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">{car.transmission || "-"}</span>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Carrocería</span>
                    <span className="font-sans text-base font-bold text-neutral-900 mt-1 block">{car.body_type || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {car.description && (
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <h3 className="font-display text-lg font-bold text-neutral-900 mb-4">
                    Comentarios del Vendedor
                  </h3>
                  <p className="font-sans text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Equipamiento Detallado */}
              {(car.extras || car.doors || car.color) && (
                <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 sm:p-8 shadow-xs">
                  <h3 className="font-display text-lg font-bold text-neutral-900 mb-5">
                    Equipamiento y Detalles
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {car.doors && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-50 border border-neutral-200/60 rounded-full font-sans text-xs font-semibold text-neutral-700">
                        <CarFront className="w-4 h-4 text-neutral-400" />
                        {car.doors} Puertas
                      </span>
                    )}
                    {car.color && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-50 border border-neutral-200/60 rounded-full font-sans text-xs font-semibold text-neutral-700">
                        <Palette className="w-4 h-4 text-neutral-400" />
                        Color {car.color}
                      </span>
                    )}
                    {car.extras && car.extras.split(",").filter((e) => e.trim()).map((extra, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100/70 border border-neutral-200 rounded-full font-sans text-xs font-semibold text-neutral-700"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        {extra.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel Derecho: Precios, Financiadera y Contacto (Sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Tarjeta de Precio */}
              <div className="bg-neutral-950 border border-neutral-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
                <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                  Precio de Adquisición
                </span>
                <div className="font-display text-4xl font-extrabold text-accent-gold tracking-tight mb-4">
                  {car.price.toLocaleString("es-ES")} €
                </div>

                <div className="space-y-3.5 pt-4 border-t border-neutral-800">
                  {/* WhatsApp Button */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2h-.01a10 10 0 0 0-8.6 15.11l-1.55 5.66 5.8-1.52A9.96 9.96 0 0 0 11.99 22h.01a10 10 0 0 0 0-20zm0 18.29h-.01c-1.57 0-3.1-.42-4.45-1.22l-.32-.19-3.3.87.88-3.22-.2-.33a8.3 8.3 0 0 1-1.28-4.47 8.32 8.32 0 1 1 8.68 8.56zm4.64-6.34c-.25-.13-1.51-.75-1.74-.83-.24-.09-.41-.13-.58.13-.18.25-.66.83-.81 1-.16.17-.32.19-.58.06A7.05 7.05 0 0 1 9.9 11.75c-.24-.41.13-.39.63-1.39.08-.17.04-.32-.02-.45-.06-.13-.58-1.41-.8-1.92-.21-.51-.43-.44-.58-.45H8.8c-.24 0-.64.09-.98.46-.33.37-1.28 1.25-1.28 3.05s1.31 3.54 1.5 3.79c.18.25 2.58 3.94 6.25 5.53.87.38 1.55.6 2.08.77.88.28 1.68.24 2.31.15.71-.11 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.1-.15-.35-.24-.6-.37z"/>
                    </svg>
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Finance Calculator */}
              <FinanceCalculator car={car} />

              {/* Formulario de Email */}
              <ContactForm car={car} />

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

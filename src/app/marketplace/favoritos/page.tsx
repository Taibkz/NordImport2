"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/marketplace/CarCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Car } from "@/lib/marketplace/mockData";
import { Heart, AlertCircle } from "lucide-react";

export default function FavoritosPage() {
  const { user, loading: authLoading } = useAuth();
  const [favCars, setFavCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("car_id, cars(*)")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data) {
          const list = data.map((d: any) => d.cars).filter(Boolean);
          setFavCars(list as Car[]);
        }
      } catch (err) {
        console.error("Error loading user favorites:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      fetchFavorites();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center">
          <div className="space-y-4">
            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Cargando tus favoritos...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 pt-[72px] lg:pt-[80px] pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-10 pb-6 border-b border-neutral-200">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              Vehículos Guardados
            </h1>
            <p className="font-sans text-sm text-neutral-500 mt-1">
              Conserva y compara tus unidades favoritas para tomar la mejor decisión de compra.
            </p>
          </div>

          {!user ? (
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
              <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
                Inicia Sesión
              </h2>
              <p className="font-sans text-xs text-neutral-500 mb-8">
                Debes acceder a tu cuenta para poder guardar y gestionar tu agenda de vehículos favoritos.
              </p>
              <Link
                href="/auth"
                className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-md inline-block"
              >
                Identificarse
              </Link>
            </div>
          ) : favCars.length === 0 ? (
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
              <Heart className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
                Sin Favoritos Guardados
              </h2>
              <p className="font-sans text-xs text-neutral-500 mb-8 leading-relaxed">
                Navega por nuestro marketplace y añade a esta lista los vehículos que más se adapten a tu estilo de vida.
              </p>
              <Link
                href="/marketplace"
                className="bg-accent-gold hover:bg-amber-500 text-neutral-950 font-sans text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md inline-block"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/marketplace/CarCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Car } from "@/lib/marketplace/mockData";
import { Pencil, RefreshCw, Trash2, CheckCircle, Clock, Plus, AlertCircle, Warehouse } from "lucide-react";

export default function MisAnunciosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    async function fetchMyCars() {
      if (!user) return;
      setLoading(true);

      if (!isSupabaseConfigured || !supabase) {
        setCars([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCars((data as Car[]) || []);
      } catch (err) {
        console.error("Error fetching user cars:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchMyCars();
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este anuncio?");
    if (confirmDelete) {
      try {
        const { error } = await supabase.from("cars").delete().eq("id", id);
        if (error) throw error;
        setCars((prev) => prev.filter((c) => c.id !== id));
        alert("Anuncio eliminado con éxito.");
      } catch (err) {
        alert("Error al eliminar anuncio.");
      }
    }
  };

  const handleRepublish = async (id: string) => {
    if (!supabase) return;
    const confirmRepublish = window.confirm(
      "Republicar el anuncio actualizará su fecha y lo enviará a revisión de los administradores. ¿Continuar?"
    );
    if (confirmRepublish) {
      try {
        const { error } = await supabase
          .from("cars")
          .update({
            status: "pending",
            created_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;

        alert("Anuncio de coche republicado. Su estatus vuelve a estar en revisión.");
        setCars((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, status: "pending", created_at: new Date().toISOString() }
              : c
          )
        );
      } catch (err) {
        alert("Error al republicar el anuncio.");
      }
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center">
          <div className="space-y-4">
            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Cargando tu garaje...
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
      <main className="flex-grow bg-neutral-50 py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Fila */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 pb-6 border-b border-neutral-200">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
                <Warehouse className="w-8 h-8 text-accent-gold" />
                Mi Garaje Privado
              </h1>
              <p className="font-sans text-sm text-neutral-500 mt-1">
                Administra y analiza el rendimiento de tus vehículos en venta.
              </p>
            </div>
            
            <Link
              href="/marketplace/publicar"
              className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Anuncio</span>
            </Link>
          </div>

          {cars.length === 0 ? (
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
              <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
                Garaje Vacío
              </h2>
              <p className="font-sans text-xs text-neutral-500 mb-8 leading-relaxed">
                Aún no has publicado ningún coche en la plataforma. Comienza ahora para llegar a miles de compradores interesados.
              </p>
              <Link
                href="/marketplace/publicar"
                className="bg-accent-gold hover:bg-amber-500 text-neutral-950 font-sans text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md inline-block"
              >
                Publicar mi Coche
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {cars.map((car) => (
                <div key={car.id} className="flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200/60 shadow-xs">
                  {/* Tarjeta Visual */}
                  <div className="flex-1">
                    <CarCard car={car} />
                  </div>
                  
                  {/* Panel de Control de Anuncio */}
                  <div className="p-5 bg-neutral-50 border-t border-neutral-100 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Estado del Anuncio
                      </span>
                      {car.status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          En revisión
                        </span>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200/50">
                      <Link
                        href={`/marketplace/editar/${car.id}`}
                        className="cursor-pointer font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Pencil className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Editar</span>
                      </Link>

                      <button
                        onClick={() => handleRepublish(car.id)}
                        className="cursor-pointer font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 bg-white hover:bg-neutral-100 border border-accent-gold/40 text-accent-gold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Renovar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(car.id)}
                        className="cursor-pointer col-span-2 font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Anuncio</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

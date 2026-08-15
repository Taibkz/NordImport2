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
import { CheckCircle, XCircle, ShieldAlert, Check, Clock } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }

    async function fetchAdminData() {
      if (!user || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profile?.is_admin) {
          setIsAdmin(true);
          const { data: carsData } = await supabase
            .from("cars")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: true });

          setPendingCars((carsData as Car[]) || []);
        }
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchAdminData();
    }
  }, [user, authLoading, router]);

  const handleApprove = async (carId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("cars")
        .update({ status: "approved" })
        .eq("id", carId);

      if (error) throw error;
      setPendingCars((prev) => prev.filter((c) => c.id !== carId));
      alert("El anuncio ha sido aprobado y publicado en el catálogo general.");
    } catch (err) {
      alert("Error al aprobar el anuncio.");
    }
  };

  const handleReject = async (carId: string) => {
    if (!supabase) return;
    const confirmReject = window.confirm("¿Seguro que quieres eliminar este anuncio permanentemente?");
    if (confirmReject) {
      try {
        const { error } = await supabase.from("cars").delete().eq("id", carId);
        if (error) throw error;
        setPendingCars((prev) => prev.filter((c) => c.id !== carId));
        alert("Anuncio rechazado y eliminado de la plataforma.");
      } catch (err) {
        alert("Error al rechazar el anuncio.");
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
              Verificando credenciales administrativas...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-neutral-50 py-24 flex items-center justify-center px-6">
          <div className="max-w-md mx-auto text-center space-y-6 bg-white border border-neutral-200 p-10 rounded-2xl shadow-xl">
            <ShieldAlert className="w-16 h-16 text-red-600 mx-auto animate-bounce" />
            <h1 className="font-display text-3xl font-bold tracking-tight text-red-600">
              Acceso Denegado
            </h1>
            <p className="font-sans text-sm text-neutral-500 leading-relaxed">
              Esta sección requiere una credencial administrativa verificada de NordImport. Si crees que es un error, por favor contacta al webmaster.
            </p>
            <Link
              href="/"
              className="bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-colors inline-block"
            >
              Volver al Inicio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-neutral-50 py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Fila Cabecera */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 pb-6 border-b border-neutral-200">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
                <ShieldAlert className="w-8 h-8 text-accent-gold" />
                Mandos de Moderación
              </h1>
              <p className="font-sans text-sm text-neutral-500 mt-1">
                Panel de control para revisar y autorizar nuevos anuncios en el marketplace.
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200/80 rounded-xl px-4 py-2.5 text-right self-start sm:self-auto">
              <span className="block font-sans text-xs font-bold text-red-700">Privilegios Administrador</span>
              <span className="block font-sans text-[10px] text-red-500">Moderación y depuración directa</span>
            </div>
          </div>

          {pendingCars.length === 0 ? (
            <div className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-md">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-2">
                Todo al Día
              </h2>
              <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                No hay vehículos pendientes de moderación en la base de datos de NordImport.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pendingCars.map((car) => (
                <div key={car.id} className="flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200/60 shadow-xs relative">
                  
                  {/* Tarjeta Visual */}
                  <div className="flex-grow opacity-90 scale-98 pointer-events-none">
                    <CarCard car={car} />
                  </div>

                  {/* Mandos de Aprobación */}
                  <div className="p-4 bg-neutral-100/90 backdrop-blur-xs border-t border-neutral-200 flex gap-2 justify-between">
                    <button
                      onClick={() => handleApprove(car.id)}
                      className="cursor-pointer flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(car.id)}
                      className="cursor-pointer flex-grow bg-red-600 hover:bg-red-700 text-white font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Rechazar
                    </button>
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

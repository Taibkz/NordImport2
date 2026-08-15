"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { 
  BODY_TYPES, 
  FUEL_TYPES, 
  TRANSMISSIONS, 
  PROVINCES_SPAIN, 
  EXTRAS_CATALOG,
  CAR_BRANDS
} from "@/lib/marketplace/constants";
import { PenTool, Upload, X, Shield, AlertCircle, ArrowLeft } from "lucide-react";

interface PublishFormProps {
  carId?: string;
}

export default function PublishForm({ carId }: PublishFormProps) {
  const isEditMode = !!carId;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Diccionario
  const [brandsDict, setBrandsDict] = useState<Record<string, string[]>>({});
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Estados del Formulario
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [power, setPower] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [doors, setDoors] = useState("");
  const [color, setColor] = useState("");
  const [province, setProvince] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [financeType, setFinanceType] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirigir si no está logueado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Cargar diccionario de marcas
  useEffect(() => {
    async function fetchDict() {
      if (!isSupabaseConfigured || !supabase) {
        setAvailableBrands(Object.keys(CAR_BRANDS));
        setBrandsDict(CAR_BRANDS);
        return;
      }
      try {
        const { data } = await supabase
          .from("dictionary_brands")
          .select("*")
          .order("brand", { ascending: true });

        if (data && data.length > 0) {
          const map: Record<string, string[]> = {};
          const list: string[] = [];
          data.forEach((item: any) => {
            list.push(item.brand);
            map[item.brand] = item.models;
          });
          setAvailableBrands(list);
          setBrandsDict(map);
        } else {
          setAvailableBrands(Object.keys(CAR_BRANDS));
          setBrandsDict(CAR_BRANDS);
        }
      } catch (err) {
        setAvailableBrands(Object.keys(CAR_BRANDS));
        setBrandsDict(CAR_BRANDS);
      }
    }
    fetchDict();
  }, []);

  // Cargar datos a editar
  useEffect(() => {
    async function fetchEditData() {
      if (!isEditMode || !user || !supabase) return;
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("id", carId)
          .single();

        if (data && data.seller_id === user.id) {
          setBrand(data.brand);
          setAvailableModels(brandsDict[data.brand] || CAR_BRANDS[data.brand] || []);
          setModel(data.model);
          setYear(String(data.year));
          setPrice(String(data.price));
          setKilometers(String(data.kilometers || ""));
          setPower(String(data.power || ""));
          setFuelType(data.fuel_type || "");
          setBodyType(data.body_type || "");
          setTransmission(data.transmission || "");
          setProvince(data.province || "");
          setDoors(String(data.doors || ""));
          setColor(data.color || "");
          setDescription(data.description || "");
          setSelectedExtras(
            data.extras 
              ? data.extras.split(",").map((e: string) => e.trim()).filter(Boolean) 
              : []
          );
          setFinanceType(data.finance_available);
          setExistingImages(data.images || []);
        } else {
          router.push("/marketplace/mis-anuncios");
        }
      } catch (err) {
        console.error("Error fetching car edit data:", err);
      }
    }

    if (Object.keys(brandsDict).length > 0) {
      fetchEditData();
    }
  }, [carId, isEditMode, user, brandsDict, router]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setBrand(selected);
    setModel("");
    setAvailableModels(brandsDict[selected] || CAR_BRANDS[selected] || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length + existingImages.length > 20) {
      setMessage("⚠ Límite excedido: Puedes adjuntar un máximo de 20 imágenes por coche.");
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, idx) => idx !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
  };

  const toggleExtra = (extraName: string) => {
    if (selectedExtras.includes(extraName)) {
      setSelectedExtras(selectedExtras.filter((e) => e !== extraName));
    } else {
      setSelectedExtras([...selectedExtras, extraName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 && existingImages.length === 0 && !isEditMode) {
      setMessage("⚠ El vehículo debe contar con al menos 1 fotografía adjunta.");
      return;
    }
    if (!user) {
      setMessage("⚠ Debes estar autenticado para publicar.");
      return;
    }

    setLoading(true);
    setMessage("Cargando expediente fotográfico en el servidor...");

    try {
      let finalImagesUrls = [...existingImages];

      // Cargar archivos nuevos a Supabase Storage
      if (files.length > 0) {
        if (!isSupabaseConfigured || !supabase) {
          // Simular subida en modo demo
          for (let i = 0; i < files.length; i++) {
            finalImagesUrls.push(URL.createObjectURL(files[i]));
          }
        } else {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("vehicle-images")
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage
              .from("vehicle-images")
              .getPublicUrl(filePath);

            finalImagesUrls.push(publicData.publicUrl);
          }
        }
      }

      const payloadData: any = {
        brand,
        model,
        year: Number(year),
        price: Number(price),
        kilometers: Number(kilometers),
        power: Number(power),
        fuel_type: fuelType,
        body_type: bodyType,
        doors: Number(doors),
        transmission,
        province,
        color,
        description,
        extras: selectedExtras.join(", "),
        finance_available: financeType,
        seller_id: user.id,
        status: "pending", // Vuelve a revisión al ser editado o creado
        images: finalImagesUrls,
      };

      if (!isSupabaseConfigured || !supabase) {
        console.log("Mock publish payload:", payloadData);
        alert(isEditMode ? "Modificación simulada con éxito." : "Publicación simulada con éxito (Modo Demo).");
        router.push("/marketplace/mis-anuncios");
        return;
      }

      if (isEditMode) {
        const { error } = await supabase
          .from("cars")
          .update(payloadData)
          .eq("id", carId);
        
        if (error) throw error;
        alert("¡Anuncio actualizado! Pendiente de aprobación por los moderadores.");
      } else {
        const { error } = await supabase
          .from("cars")
          .insert(payloadData);
        
        if (error) throw error;
        alert("¡Vehículo publicado! Entrará en revisión y estará visible pronto.");
      }

      router.push("/marketplace/mis-anuncios");

    } catch (err: any) {
      console.error(err);
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="py-24 text-center bg-neutral-50 flex-grow flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="font-sans text-xs font-bold text-neutral-400">Verificando credenciales...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Botón atrás */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-accent-gold transition-colors font-sans uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver
        </button>
      </div>

      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 flex items-center gap-2">
          <PenTool className="w-8 h-8 text-accent-gold" />
          {isEditMode ? "Editar Anuncio" : "Forja de Activos"}
        </h1>
        <p className="font-sans text-sm text-neutral-500 mt-2">
          {isEditMode 
            ? "Actualiza las especificaciones técnicas o precio de tu vehículo en venta." 
            : "Completa la ficha técnica para añadir tu vehículo a la red comercial de NordImport."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/60 shadow-xl rounded-2xl p-6 sm:p-10 space-y-8">
        
        {/* Sección A: Identificación */}
        <div className="border-b border-neutral-100 pb-8 space-y-5">
          <h3 className="font-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="bg-neutral-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">A</span>
            Marca y Modelo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Marca *</label>
              <select
                required
                value={brand}
                onChange={handleBrandChange}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800"
              >
                <option value="">Selecciona la marca...</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Modelo *</label>
              <select
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800 disabled:opacity-50"
              >
                <option value="">Selecciona el modelo...</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección B: Especificaciones Técnicas */}
        <div className="border-b border-neutral-100 pb-8 space-y-5">
          <h3 className="font-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="bg-neutral-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">B</span>
            Especificaciones Mecánicas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Precio de venta (€) *</label>
              <input
                type="number"
                required
                min="500"
                placeholder="Ej. 42000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Año Fabricación *</label>
              <input
                type="number"
                required
                min="1980"
                max={new Date().getFullYear()}
                placeholder="Ej. 2021"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Kilómetros *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="Ej. 45000"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Potencia (CV) *</label>
              <input
                type="number"
                required
                min="30"
                placeholder="Ej. 190"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Color Carrocería *</label>
              <input
                type="text"
                required
                placeholder="Ej. Negro Noche, Gris Nardo"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Nº Puertas *</label>
              <input
                type="number"
                required
                min="2"
                max="6"
                placeholder="Ej. 5"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-gold"
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Tipo Combustible *</label>
              <select
                required
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800"
              >
                <option value="">Selecciona combustible...</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Transmisión *</label>
              <select
                required
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800"
              >
                <option value="">Selecciona transmisión...</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Carrocería *</label>
              <select
                required
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800"
              >
                <option value="">Selecciona carrocería...</option>
                {BODY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Ubicación (Provincia) *</label>
              <select
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-2.5 bg-white outline-none focus:border-accent-gold text-neutral-800"
              >
                <option value="">Selecciona provincia...</option>
                {PROVINCES_SPAIN.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2.5 pt-6">
              <input
                type="checkbox"
                id="finance"
                checked={financeType}
                onChange={(e) => setFinanceType(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-accent-gold"
              />
              <label htmlFor="finance" className="font-sans text-xs font-bold text-neutral-700 cursor-pointer">
                Habilitar calculadora de financiación para los compradores
              </label>
            </div>
          </div>
        </div>

        {/* Sección C: Literatura & Extras */}
        <div className="border-b border-neutral-100 pb-8 space-y-6">
          <h3 className="font-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="bg-neutral-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">C</span>
            Descripción y Equipamiento
          </h3>
          <div>
            <label className="block font-sans text-[10px] font-bold text-neutral-700 uppercase tracking-wider mb-2">Texto del Anuncio *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe detalladamente el estado general del vehículo, histórico de revisiones, extras que tenga y condiciones de entrega..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full font-sans text-sm border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold"
            />
          </div>

          <div className="space-y-4">
            <span className="block font-sans text-xs font-bold text-neutral-800 uppercase tracking-wider">Equipamiento y Extras</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Object.entries(EXTRAS_CATALOG).map(([category, items]) => (
                <div key={category} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-2">
                  <span className="block font-sans text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider mb-1">
                    {category}
                  </span>
                  <div className="space-y-1.5 flex flex-col">
                    {items.map((extra) => (
                      <label key={extra} className="inline-flex items-center gap-2 font-sans text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes(extra)}
                          onChange={() => toggleExtra(extra)}
                          className="w-3.5 h-3.5 cursor-pointer accent-accent-gold"
                        />
                        {extra}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección D: Fotografía */}
        <div className="space-y-5">
          <h3 className="font-display text-lg font-bold text-neutral-900 flex items-center gap-2">
            <span className="bg-neutral-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">D</span>
            Álbum Fotográfico
          </h3>

          {/* Caja Upload */}
          <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 bg-neutral-50 hover:bg-neutral-100/50 hover:border-accent-gold transition-colors text-center cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={loading}
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="font-sans text-sm font-bold text-neutral-700">Arrastra fotos aquí o haz clic para subir</p>
            <p className="font-sans text-[10px] text-neutral-400 mt-1">Soporta formatos JPEG y PNG. Límite máximo de 20 fotos.</p>
          </div>

          {/* Mostrar fotos a editar existentes */}
          {existingImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Imágenes Publicadas:</span>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 shadow-xs">
                    <img src={img} alt="existente" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="cursor-pointer absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full border-none flex items-center justify-center shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mostrar fotos en cola */}
          {files.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Imágenes Nuevas a Subir ({files.length}):</span>
              <div className="flex flex-wrap gap-3">
                {files.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 shadow-xs">
                    <img src={URL.createObjectURL(file)} alt="nueva preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="cursor-pointer absolute top-1 right-1 bg-neutral-900/90 text-white p-1 rounded-full border-none flex items-center justify-center shadow-md hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-xl border text-xs font-semibold text-center flex items-center justify-center gap-2 ${
            message.includes("✅") 
              ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
              : message.includes("Error") || message.includes("⚠")
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-neutral-50 border-neutral-200 text-neutral-700"
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Botón Final Enviar */}
        <div className="border-t border-neutral-100 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-white font-sans text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-neutral-400"
          >
            {loading ? "Subiendo archivos..." : (isEditMode ? "Guardar Cambios" : "Publicar Activo")}
          </button>
        </div>

      </form>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Plane, Truck, Upload, FileText, Image as ImageIcon,
  Package, CheckCircle2, ArrowRight, Clock, MapPin, ChevronLeft,
  Info, Star, Shield
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AIChatWidget from "@/components/AIChatWidget";

const PORTS = [
  "Rades (Tunis)", "La Goulette", "Sfax", "Sousse", "Bizerte",
  "Marseille", "Gênes", "Barcelone", "Valence", "Le Havre",
  "Shanghai", "Hong Kong", "Singapour", "Istanbul", "Pirée",
];

type FormData = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  transportType: string;
  loadingPort: string;
  arrivalPort: string;
  containerType: string;
  description: string;
  weight: string;
  volume: string;
  value: string;
  services: string[];
};

export default function DevisPage() {
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    contact: "",
    email: "",
    phone: "",
    transportType: "Maritime",
    loadingPort: "Rades (Tunis)",
    arrivalPort: "Marseille",
    containerType: "40HC",
    description: "",
    weight: "",
    volume: "",
    value: "",
    services: ["Assurance", "Dédouanement"],
  });

  const toggleService = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Page Header */}
      <div
        className="pt-28 pb-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1a2744 50%, #0d3d62 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, #009FE3 0%, transparent 60%)`
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
          >
            Demande de devis
          </motion.h1>
          <p className="text-white/60 text-lg">
            Remplissez le formulaire et obtenez une estimation sous 2 heures
          </p>
          <div className="flex justify-center gap-6 mt-6">
            {[
              { icon: Clock, text: "Réponse en 2h" },
              { icon: Shield, text: "100% sécurisé" },
              { icon: Star, text: "Gratuit" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-white/50 text-sm">
                <Icon className="w-4 h-4 text-[#00C2FF]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Result Card */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl overflow-hidden shadow-premium border border-green-100"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <p className="text-white font-semibold">Estimation calculée avec succès !</p>
              </div>
              <div className="bg-white p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: "Route", value: `${formData.loadingPort || "Rades"} → ${formData.arrivalPort || "Marseille"}`, icon: MapPin },
                    { label: "Mode", value: formData.transportType, icon: Ship },
                    { label: "Délai estimé", value: "4 à 6 jours", icon: Clock },
                    { label: "Prix estimatif", value: "950 €", icon: Star, highlight: true },
                  ].map(({ label, value, icon: Icon, highlight }) => (
                    <div key={label} className={`rounded-xl p-4 ${highlight ? "bg-gradient-to-br from-[#009FE3]/10 to-[#00C2FF]/5 border border-[#009FE3]/20" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${highlight ? "text-[#009FE3]" : "text-gray-400"}`} />
                        <p className="text-gray-400 text-xs font-medium">{label}</p>
                      </div>
                      <p className={`font-bold text-sm ${highlight ? "text-[#009FE3] text-xl" : "text-[#0F172A]"}`}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#009FE3] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#0F172A]">
                    Un commercial GTI vous contactera dans les <strong>2 heures ouvrées</strong> pour confirmer ce devis et discuter des modalités. 
                    Référence : <strong>GTI-2026-{String(Math.floor(Math.random() * 999)).padStart(3, "0")}</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Informations client */}
          <FormSection title="Informations client" icon="👤">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nom de la société" required>
                <input
                  className="input-premium"
                  placeholder="ABC Logistics SARL"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </Field>
              <Field label="Nom du contact" required>
                <input
                  className="input-premium"
                  placeholder="Mohamed Ben Ali"
                  value={formData.contact}
                  onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </Field>
              <Field label="Email professionnel" required>
                <input
                  type="email"
                  className="input-premium"
                  placeholder="m.benali@abc-logistics.tn"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </Field>
              <Field label="Téléphone">
                <input
                  className="input-premium"
                  placeholder="+216 71 000 000"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 2: Type de transport */}
          <FormSection title="Type de transport" icon="🌍">
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: "Maritime", icon: Ship, emoji: "🚢" },
                { type: "Aérien", icon: Plane, emoji: "✈️" },
                { type: "Routier", icon: Truck, emoji: "🚛" },
              ].map(({ type, emoji }) => (
                <label
                  key={type}
                  className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.transportType === type
                      ? "border-[#009FE3] bg-[#009FE3]/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="transport"
                    value={type}
                    checked={formData.transportType === type}
                    onChange={() => setFormData({...formData, transportType: type})}
                    className="sr-only"
                  />
                  <span className="text-2xl">{emoji}</span>
                  <span className={`text-sm font-semibold ${formData.transportType === type ? "text-[#009FE3]" : "text-gray-600"}`}>
                    {type}
                  </span>
                  {formData.transportType === type && (
                    <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#009FE3]" />
                  )}
                </label>
              ))}
            </div>
          </FormSection>

          {/* Section 3: Ports */}
          <FormSection title="Ports" icon="⚓">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Port de chargement" required>
                <select
                  className="input-premium"
                  value={formData.loadingPort}
                  onChange={e => setFormData({...formData, loadingPort: e.target.value})}
                >
                  {PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Port de destination" required>
                <select
                  className="input-premium"
                  value={formData.arrivalPort}
                  onChange={e => setFormData({...formData, arrivalPort: e.target.value})}
                >
                  {PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section 4: Conteneur */}
          <AnimatePresence>
            {formData.transportType === "Maritime" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormSection title="Type de conteneur" icon="📦">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["20FT", "40FT", "40HC", "LCL"].map((c) => (
                      <label
                        key={c}
                        className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.containerType === c
                            ? "border-[#009FE3] bg-[#009FE3]/5"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="container"
                          value={c}
                          checked={formData.containerType === c}
                          onChange={() => setFormData({...formData, containerType: c})}
                          className="sr-only"
                        />
                        <Package className={`w-6 h-6 ${formData.containerType === c ? "text-[#009FE3]" : "text-gray-400"}`} />
                        <span className={`text-sm font-bold ${formData.containerType === c ? "text-[#009FE3]" : "text-gray-600"}`}>{c}</span>
                      </label>
                    ))}
                  </div>
                </FormSection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 5: Marchandise */}
          <FormSection title="Marchandise" icon="🏷️">
            <Field label="Description de la marchandise" required>
              <textarea
                className="input-premium h-24 resize-none"
                placeholder="Ex: Pièces automobiles, textiles, produits alimentaires..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Poids total (kg)">
                <input
                  type="number"
                  className="input-premium"
                  placeholder="5000"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </Field>
              <Field label="Volume (CBM)">
                <input
                  type="number"
                  className="input-premium"
                  placeholder="25"
                  value={formData.volume}
                  onChange={e => setFormData({...formData, volume: e.target.value})}
                />
              </Field>
              <Field label="Valeur marchandise (€)">
                <input
                  type="number"
                  className="input-premium"
                  placeholder="50000"
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 6: Services complémentaires */}
          <FormSection title="Services complémentaires" icon="⭐">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Assurance", "Dédouanement", "Entreposage", "Livraison domicile", "Transit douanier", "Emballage"].map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.services.includes(s)
                      ? "border-[#009FE3] bg-[#009FE3]/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(s)}
                    onChange={() => toggleService(s)}
                    className="w-4 h-4 accent-[#009FE3]"
                  />
                  <span className={`text-sm font-medium ${formData.services.includes(s) ? "text-[#009FE3]" : "text-gray-600"}`}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </FormSection>

          {/* Section 7: Documents */}
          <FormSection title="Documents (optionnel)" icon="📁">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "Facture commerciale", icon: FileText, accept: ".pdf,.xlsx" },
                { name: "Packing List", icon: FileText, accept: ".pdf,.xlsx" },
                { name: "Photos cargo", icon: ImageIcon, accept: "image/*" },
              ].map(({ name, icon: Icon }) => (
                <div
                  key={name}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[#009FE3]/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#009FE3] transition-colors" />
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#009FE3] transition-colors" />
                  <p className="text-sm text-gray-500 text-center font-medium">{name}</p>
                  <p className="text-xs text-gray-300">Glisser-déposer ou cliquer</p>
                </div>
              ))}
            </div>
          </FormSection>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 mt-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)", boxShadow: "0 8px 30px rgba(0, 159, 227, 0.35)" }}
          >
            <CheckCircle2 className="w-5 h-5" />
            Calculer mon devis
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>
      </div>

      <AIChatWidget />
    </main>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-white rounded-2xl p-6 mb-5 shadow-card border border-gray-100"
    >
      <h2 className="text-base font-bold text-[#0F172A] mb-5 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
        {label}
        {required && <span className="text-[#009FE3] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

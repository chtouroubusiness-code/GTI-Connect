"use client";
import React, { useState, useEffect } from "react";
import { User, Building, Mail, Phone, MapPin, Shield } from "lucide-react";

export default function ClientProfilPage() {
  const [session, setSession] = useState<{ email: string; name: string; company: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) setSession(JSON.parse(stored));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">Mon Profil Client</h1>
        <p className="text-xs text-slate-500">Vos informations d&apos;entreprise et coordonnées de contact.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#0A2342] flex items-center justify-center text-white font-extrabold text-xl">
            {session?.name ? session.name.split(" ").map(n => n[0]).join("") : "CL"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A2342]">{session?.company || "Société Client"}</h2>
            <p className="text-xs text-slate-500">{session?.name || "Représentant Legal"}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#00C875]">
              Compte Entreprise Vérifié
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" /> Entreprise / Raison Sociale
            </label>
            <input defaultValue={session?.company || "Atlas Fruits & Primeurs SARL"} className="input-clean" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Contact Principal
            </label>
            <input defaultValue={session?.name || "Yassine Mansouri"} className="input-clean" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Professionnel
            </label>
            <input defaultValue={session?.email || "y.mansouri@atlasfruits.ma"} className="input-clean" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Téléphone / WhatsApp
            </label>
            <input defaultValue="+212 6 61 24 55 00" className="input-clean" />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Adresse du siège social
            </label>
            <input defaultValue="Zone Industrielle Ain Sebaa, Boulevard Ahl Loghlam, Casablanca, Maroc" className="input-clean" />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button className="btn-gti text-xs py-2.5 px-5 cursor-pointer">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

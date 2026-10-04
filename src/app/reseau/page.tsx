"use client";
import React, { useState } from "react";
import {
  Ship, Plane, Truck, Search, MapPin, Globe,
  AlertTriangle, CheckCircle2, ArrowRight, Layers,
  Phone, Clock
} from "lucide-react";
import Link from "next/link";
import NavbarPublic from "@/components/NavbarPublic";
import FooterPublic from "@/components/FooterPublic";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useGTI, TransportMode } from "@/lib/store";

export default function ReseauPortsPage() {
  const { ports, formatPrice } = useGTI();
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");

  const filteredPorts = ports.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchMode = modeFilter === "ALL" || p.mode === modeFilter;
    const matchRegion = regionFilter === "ALL" || (
      regionFilter === "Maroc" ? p.country === "Maroc" :
      regionFilter === "Europe" ? ["France", "Espagne", "Pays-Bas", "Belgique"].includes(p.country) :
      regionFilter === "Asie" ? ["Chine", "Turquie"].includes(p.country) :
      p.country === "Émirats Arabes Unis"
    );

    return matchSearch && matchMode && matchRegion;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <NavbarPublic />

      {/* Header Banner */}
      <section className="bg-[#002B5B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF] bg-white/10 px-3 py-1 rounded-full">
            Connectivité Mondiale GTI
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans']">
            Réseau des Ports, Aéroports & Hubs Internationaux
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            GTI dessert directement 18 terminaux stratégiques avec départs réguliers, manutention dédiée et statut de fluidité opérationnelle mis à jour en temps réel.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        
        {/* Filters and Search */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un port (ex: Tanger Med, Shanghai, FRMRS)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009DFF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Mode Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Mode :</span>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none"
              >
                <option value="ALL">Tous les modes</option>
                <option value="maritime">Maritime (Ports)</option>
                <option value="routier">Routier (Plateformes TIR)</option>
                <option value="aerien">Aérien (Aéroports Cargo)</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Région :</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none"
              >
                <option value="ALL">Toutes les régions</option>
                <option value="Maroc">Maroc (Hubs Nationaux)</option>
                <option value="Europe">Europe (France, Espagne, Benelux)</option>
                <option value="Asie">Asie (Chine, Turquie)</option>
                <option value="Moyen-Orient">Moyen-Orient (Dubaï)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPorts.map((port) => {
            const isCongested = port.status === "congestion";
            return (
              <div
                key={port.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{port.countryCode}</span>
                      <div>
                        <h3 className="font-extrabold text-[#002B5B] text-base">{port.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Code UN/LOCODE : <strong className="text-slate-700">{port.code}</strong>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isCongested ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                      {isCongested ? "Congestion" : "Fluide (Actif)"}
                    </span>
                  </div>

                  {port.notes && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{port.notes}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-600 bg-[#F5F7FA] p-3.5 rounded-2xl border border-slate-200/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type :</span>
                      <span className="font-bold capitalize text-slate-800 flex items-center gap-1">
                        {port.mode === "maritime" && <Ship className="w-3 h-3 text-[#009DFF]" />}
                        {port.mode === "routier" && <Truck className="w-3 h-3 text-[#00D084]" />}
                        {port.mode === "aerien" && <Plane className="w-3 h-3 text-purple-500" />}
                        {port.mode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Zone Hub :</span>
                      <span className="font-bold text-slate-800">{port.transitHub}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lignes actives :</span>
                      <span className="font-bold text-slate-800">{port.activeLines} départs réguliers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frais THC / Quai :</span>
                      <span className="font-bold text-[#009DFF]">
                        {port.mode === "aerien" ? `${port.thcRate} € / dossier` : formatPrice(port.thcRate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/calculateur?origin=${port.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#009DFF] hover:underline"
                  >
                    <span>Calculer un devis depuis ce port</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterPublic />
      <MobileBottomNav />
    </div>
  );
}

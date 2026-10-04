"use client";
import React from "react";
import Link from "next/link";
import {
  Ship, Plane, Truck, MapPin, Calendar, Clock,
  CheckCircle2, ArrowRight, ShieldCheck, Check
} from "lucide-react";
import { useGTI } from "@/lib/store";

export default function ClientExpeditionsPage() {
  const { shipments } = useGTI();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
          Opérations Logistiques
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
          Mes Expéditions &amp; Conteneurs en Mer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Suivi des navires, des passages en douane et des livraisons en cours.
        </p>
      </div>

      {/* Shipments Cards List */}
      <div className="space-y-6">
        {shipments.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold text-[#002B5B]">{s.trackingNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    s.status === "EN_MER" || s.status === "EN_ROUTE" ? "bg-blue-100 text-[#002B5B]" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {s.status === "EN_MER" && "🚢 Navire en Mer"}
                    {s.status === "EN_ROUTE" && "🚛 Camion en Route"}
                    {s.status === "LIVRE" && "🏁 Livré & Dédouané"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Navire / Transporteur : <strong className="text-slate-800">{s.vesselName}</strong> • Conteneur : <strong className="text-slate-800">{s.containerNumber || "Assigné"}</strong>
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Date d&apos;arrivée prévue (ETA)</p>
                <p className="text-base font-extrabold text-[#009DFF]">{s.eta}</p>
              </div>
            </div>

            {/* Route & Cargo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium">Origine &amp; Destination :</span>
                <p className="font-extrabold text-[#002B5B] text-sm mt-0.5">{s.origin} → {s.destination}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Marchandise :</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{s.cargo}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Date de départ :</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{s.departureDate}</p>
              </div>
            </div>

            {/* Stepper Milestones */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Jalons de l&apos;Acheminement
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {s.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${
                      m.completed ? "bg-emerald-50/70 border-emerald-200" :
                      m.current ? "bg-blue-50 border-blue-200 ring-2 ring-[#009DFF]/20" :
                      "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        m.completed ? "bg-[#00D084] text-[#002B5B]" :
                        m.current ? "bg-[#009DFF] text-white" :
                        "bg-slate-200 text-slate-400"
                      }`}>
                        {m.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">{m.date}</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-900">{m.step}</p>
                    <p className="text-[10px] text-slate-500">{m.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

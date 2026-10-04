"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Ship, Plane, Truck, Search, Plus, CheckCircle2, Clock,
  ArrowRight, Download, FileText, Check, ShieldCheck
} from "lucide-react";
import { useGTI, ClientQuote } from "@/lib/store";

export default function ClientDevisPage() {
  const { quotes, formatPrice, updateQuoteStatus } = useGTI();
  const [search, setSearch] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<ClientQuote | null>(null);

  const filteredQuotes = quotes.filter(q =>
    q.id.toLowerCase().includes(search.toLowerCase()) ||
    q.originPort.name.toLowerCase().includes(search.toLowerCase()) ||
    q.destinationPort.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmBooking = (qId: string) => {
    updateQuoteStatus(qId, "ORDRE_TRANSPORT");
    alert("Votre réservation a été validée ! Nos équipes vous assignent le conteneur et le numéro de connaissement B/L.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
            Cotations &amp; Tarifs
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
            Mes Devis de Transport
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Historique de vos cotations calculées. Confirmez vos ordres d&apos;expédition en un clic.
          </p>
        </div>

        <Link
          href="/calculateur"
          className="btn-primary text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Calcul de Devis</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, port..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009DFF]"
          />
        </div>
      </div>

      {/* Devis Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuotes.map((q) => {
          const isConfirmed = q.status === "CONFIRME_ADMIN";
          const isPending = q.status === "EN_ATTENTE_CONFIRMATION";
          const isOrder = q.status === "ORDRE_TRANSPORT";

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 ${
                isConfirmed ? "border-emerald-300" : isPending ? "border-amber-300" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-extrabold text-[#002B5B]">{q.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isConfirmed ? "bg-emerald-100 text-emerald-700" :
                      isPending ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-[#002B5B]"
                    }`}>
                      {isConfirmed ? "✅ Confirmé par GTI" :
                       isPending ? "⏳ En cours de validation commerciale" :
                       "📋 Ordre de Transport Validé"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    {q.originPort.name} → {q.destinationPort.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mode : <strong className="capitalize">{q.mode}</strong> ({q.subType}) • Incoterm : <strong>{q.incoterm}</strong> • Départ souhaité : {q.departureDate}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Montant HT Devis</p>
                  <p className="text-2xl font-extrabold text-[#009DFF]">
                    {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                  </p>
                  <p className="text-[10px] text-slate-400">TTC : {formatPrice(q.totalTtcEur)}</p>
                </div>
              </div>

              {/* Breakdown details */}
              <div className="bg-[#F5F7FA] p-3.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Fret Base :</span>
                  <p className="font-extrabold text-slate-900">{formatPrice(q.baseFreightEur)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Surcharges :</span>
                  <p className="font-extrabold text-slate-900">{formatPrice(q.surchargesEur)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">THC / Manutention :</span>
                  <p className="font-extrabold text-slate-900">{formatPrice(q.thcEur)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Douane &amp; Assurance :</span>
                  <p className="font-extrabold text-slate-900">{formatPrice(q.customsEur + q.insuranceEur)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  href={`/tracking?ref=${q.id}`}
                  className="text-xs font-bold text-[#009DFF] hover:underline"
                >
                  Suivre l&apos;acheminement en direct →
                </Link>

                <div className="flex items-center gap-2">
                  {isConfirmed && (
                    <button
                      type="button"
                      onClick={() => handleConfirmBooking(q.id)}
                      className="px-4 py-2 bg-[#00D084] hover:bg-[#00b371] text-[#002B5B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Valider &amp; Réserver l&apos;Expédition</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Search, Ship, Check, Clock, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useGTI } from "@/lib/store";

export default function ClientSuiviPage() {
  const { quotes, formatPrice } = useGTI();
  const [session, setSession] = useState<{ email: string; name: string; company: string } | null>(null);
  const [searchRef, setSearchRef] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) setSession(JSON.parse(stored));
  }, []);

  const myQuotes = quotes.filter(q => {
    if (!session) return true;
    return q.clientEmail.toLowerCase() === session.email.toLowerCase() ||
           q.clientCompany.toLowerCase().includes((session.company || "").toLowerCase().split(" ")[0]);
  });

  const searchedQuote = searchRef
    ? myQuotes.find(q => q.id.toLowerCase() === searchRef.trim().toLowerCase())
    : myQuotes[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
          Suivi des Expéditions
        </h1>
        <p className="text-xs text-slate-500">
          Suivez l&apos;avancement de vos conteneurs et demandes de transport en temps réel.
        </p>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Entrez votre référence devis (ex: GTI-2026-DEV-7842)..."
            className="input-clean pl-9 text-xs"
          />
        </div>
        {myQuotes.length > 0 && (
          <select
            onChange={(e) => setSearchRef(e.target.value)}
            value={searchedQuote?.id || ""}
            className="input-clean w-auto text-xs font-semibold cursor-pointer"
          >
            <option value="">Vos devis récents...</option>
            {myQuotes.map(q => (
              <option key={q.id} value={q.id}>{q.id} — {q.originPort.code} → {q.destinationPort.code}</option>
            ))}
          </select>
        )}
      </div>

      {/* Display result */}
      {searchedQuote ? (
        <div className="space-y-6">
          {/* Top summary card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0057D9]">{searchedQuote.id}</span>
                <h2 className="text-lg font-extrabold text-[#0A2342]">
                  {searchedQuote.originPort.name} ({searchedQuote.originPort.code}) → {searchedQuote.destinationPort.name} ({searchedQuote.destinationPort.code})
                </h2>
                <p className="text-xs text-slate-400">Mode: {searchedQuote.mode.toUpperCase()} • Type: {searchedQuote.containerType || "Standard"}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Montant du devis</span>
                <span className="text-xl font-extrabold text-[#0057D9]">
                  {formatPrice(searchedQuote.adminAdjustedPriceEur || searchedQuote.totalHtEur)} HT
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Étape du dossier</h3>
              <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                
                {[
                  { title: "Demande soumise", active: true, done: true, date: searchedQuote.createdAt.split("T")[0] },
                  { title: "Validation Faiez Hentati", active: searchedQuote.status === "CONFIRME_ADMIN" || searchedQuote.status === "ORDRE_TRANSPORT", done: searchedQuote.status === "CONFIRME_ADMIN" || searchedQuote.status === "ORDRE_TRANSPORT", date: "Validation GTI" },
                  { title: "Embarquement", active: searchedQuote.status === "ORDRE_TRANSPORT", done: false, date: "Planning" },
                  { title: "Livraison", active: false, done: false, date: "Destination" },
                ].map((step, idx) => (
                  <div key={step.title} className="relative z-10 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                      step.done
                        ? "bg-[#00C875] border-[#00C875] text-white"
                        : step.active
                        ? "bg-[#0057D9] border-[#0057D9] text-white"
                        : "bg-white border-slate-300 text-slate-400"
                    }`}>
                      {step.done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className="text-[11px] font-bold text-[#0A2342] mt-2 text-center max-w-[90px]">{step.title}</span>
                    <span className="text-[10px] text-slate-400">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {searchedQuote.adminNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <p className="text-xs font-bold text-[#0057D9]">💬 Remarque de votre gestionnaire Faiez Hentati :</p>
                <p className="text-xs text-slate-700 mt-1">{searchedQuote.adminNotes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-[#0A2342]">Aucune expédition trouvée</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Veuillez entrer une référence de devis valide ou faire une nouvelle demande.
          </p>
        </div>
      )}
    </div>
  );
}

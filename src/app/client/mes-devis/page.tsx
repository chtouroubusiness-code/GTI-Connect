"use client";
import React, { useState, useEffect } from "react";
import { FileText, Clock, Check, AlertCircle, Search, Eye, ArrowUpDown } from "lucide-react";
import { useGTI, ClientQuote } from "@/lib/store";

export default function MesDevisPage() {
  const { quotes, formatPrice } = useGTI();
  const [session, setSession] = useState<{ email: string; name: string; company: string } | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<ClientQuote | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) setSession(JSON.parse(stored));
  }, []);

  const myQuotes = quotes.filter(q => {
    if (!session) return true;
    return q.clientEmail.toLowerCase() === session.email.toLowerCase() ||
           q.clientCompany.toLowerCase().includes((session.company || "").toLowerCase().split(" ")[0]);
  });

  const filtered = myQuotes.filter(q => {
    const matchesSearch = q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.originPort.name.toLowerCase().includes(search.toLowerCase()) ||
      q.destinationPort.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRME_ADMIN":
      case "ORDRE_TRANSPORT":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-[#00C875] inline-flex items-center gap-1"><Check className="w-3 h-3" /> Confirmé</span>;
      case "EN_ATTENTE_CONFIRMATION":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-[#FF9F1C] inline-flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</span>;
      case "REJETE":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-[#FF5A5F] inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Refusé</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-[#0057D9]">{status.replace(/_/g, " ")}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">Mes Devis</h1>
        <p className="text-xs text-slate-500">Retrouvez l&apos;historique complet de vos demandes de devis.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par référence ou port..."
            className="input-clean pl-9 text-xs"
          />
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-medium">
          {[
            { key: "all", label: "Tous" },
            { key: "EN_ATTENTE_CONFIRMATION", label: "En attente" },
            { key: "CONFIRME_ADMIN", label: "Confirmés" },
            { key: "REJETE", label: "Refusés" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-3 py-1 rounded-md cursor-pointer transition-all ${
                filterStatus === key ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Départ → Arrivée</th>
                <th className="py-3 px-4">Montant HT</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Détail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#0057D9]">{q.id}</td>
                  <td className="py-3.5 px-4 text-slate-500">{q.createdAt.split("T")[0]}</td>
                  <td className="py-3.5 px-4 text-slate-600 capitalize">{q.mode}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {q.originPort.code} → {q.destinationPort.code}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0A2342]">
                    {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(q.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedQuote(q)}
                      className="text-[#0057D9] hover:bg-blue-50 p-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    Aucun devis trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setSelectedQuote(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2342]">{selectedQuote.id}</h3>
                  <p className="text-xs text-slate-500">{selectedQuote.createdAt.split("T")[0]} • {selectedQuote.mode}</p>
                </div>
                {getStatusBadge(selectedQuote.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-0.5">
                  <p className="text-slate-400 font-medium">Départ</p>
                  <p className="font-bold">{selectedQuote.originPort.name} ({selectedQuote.originPort.code})</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-slate-400 font-medium">Arrivée</p>
                  <p className="font-bold">{selectedQuote.destinationPort.name} ({selectedQuote.destinationPort.code})</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Fret de base</span><span className="font-semibold">{formatPrice(selectedQuote.baseFreightEur)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Surcharges</span><span className="font-semibold">{formatPrice(selectedQuote.surchargesEur)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">THC</span><span className="font-semibold">{formatPrice(selectedQuote.thcEur)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Douane</span><span className="font-semibold">{formatPrice(selectedQuote.customsEur)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Assurance</span><span className="font-semibold">{formatPrice(selectedQuote.insuranceEur)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span>Total HT</span>
                  <span className="text-[#0057D9]">{formatPrice(selectedQuote.adminAdjustedPriceEur || selectedQuote.totalHtEur)}</span>
                </div>
              </div>

              {selectedQuote.adminNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[#0057D9] mb-1">Note de Faiez Hentati (GTI)</p>
                  <p className="text-xs text-slate-600">{selectedQuote.adminNotes}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full btn-secondary-clean py-2.5 text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

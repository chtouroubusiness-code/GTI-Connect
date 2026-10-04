"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Ship, Plane, Truck, ArrowRight, Check, X,
  Clock, DollarSign, ChevronRight, Edit3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { useGTI, ClientQuote } from "@/lib/store";

const revenueData = [
  { month: "Mai", ca: 84000 },
  { month: "Juin", ca: 98000 },
  { month: "Juil", ca: 115000 },
  { month: "Août", ca: 108000 },
  { month: "Sept", ca: 132000 },
  { month: "Oct", ca: 165000 },
];

export default function AdminDashboardPage() {
  const { quotes, shipments, formatPrice, confirmQuote, rejectQuote } = useGTI();

  const [selectedQuote, setSelectedQuote] = useState<ClientQuote | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [adjustedPrice, setAdjustedPrice] = useState<number | undefined>(undefined);

  // 3 Exact KPIs
  const pendingQuotes = quotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION");
  const confirmedQuotes = quotes.filter(q => q.status === "CONFIRME_ADMIN" || q.status === "ORDRE_TRANSPORT");
  const activeShipments = shipments.filter(s => s.status === "EN_MER" || s.status === "EN_ROUTE");

  const monthlyRevenue = confirmedQuotes.reduce((acc, q) => acc + (q.adminAdjustedPriceEur || q.totalHtEur), 0);

  const handleOpenReview = (q: ClientQuote) => {
    setSelectedQuote(q);
    setAdminNote(q.adminNotes || "Devis validé et confirmé par Faiez Hentati (GTI). Espace garanti.");
    setAdjustedPrice(q.adminAdjustedPriceEur || q.totalHtEur);
  };

  const handleConfirm = () => {
    if (selectedQuote) {
      confirmQuote(selectedQuote.id, adminNote, adjustedPrice);
      setSelectedQuote(null);
    }
  };

  const handleReject = () => {
    if (selectedQuote) {
      rejectQuote(selectedQuote.id, adminNote || "Capacité navire indisponible");
      setSelectedQuote(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
            Dashboard Commercial • Faiez Hentati
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Console de validation des cotations clients et pilotage opérationnel des ports.
          </p>
        </div>

        {pendingQuotes.length > 0 && (
          <span className="text-xs font-semibold text-[#FF5A5F] bg-[#FF5A5F]/10 px-3 py-1.5 rounded-lg">
            {pendingQuotes.length} devis en attente de votre confirmation
          </span>
        )}
      </div>

      {/* ZONE KPI (SEULEMENT 3 CARTES) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1 : Devis à traiter */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Devis à traiter</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
              {pendingQuotes.length}
            </span>
            {pendingQuotes.length > 0 && (
              <span className="text-[11px] font-semibold text-[#FF5A5F]">Priorité haute</span>
            )}
          </div>
        </div>

        {/* KPI 2 : CA du mois */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">CA du mois</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0057D9] font-['Plus_Jakarta_Sans']">
              {formatPrice(monthlyRevenue)}
            </span>
          </div>
        </div>

        {/* KPI 3 : Expéditions actives */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Expéditions actives</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00C875] font-['Plus_Jakarta_Sans']">
              {activeShipments.length}
            </span>
            <span className="text-[11px] font-medium text-slate-400">en mer / route</span>
          </div>
        </div>

      </div>

      {/* ZONE PRINCIPALE : TABLEAU DES DEVIS PRIORITAIRES (70% de l'attention) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0A2342]">
            Liste des devis prioritaires
          </h2>
          <Link
            href="/admin/devis"
            className="text-xs font-semibold text-[#0057D9] hover:underline flex items-center gap-1"
          >
            <span>Voir tous les devis ({quotes.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Réf.</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Cargaison</th>
                <th className="py-3 px-4">Montant HT</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q) => {
                const isPending = q.status === "EN_ATTENTE_CONFIRMATION";
                const isConfirmed = q.status === "CONFIRME_ADMIN" || q.status === "ORDRE_TRANSPORT";

                return (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0A2342]">
                      {q.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{q.clientCompany}</p>
                      <p className="text-[11px] text-slate-400">{q.clientName}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {q.originPort.code} → {q.destinationPort.code} ({q.subType})
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {q.containerQuantity ? `${q.containerQuantity}x ${q.containerType?.replace("_", " ")}` : q.cargoNature}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0057D9]">
                      {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        isPending
                          ? "bg-red-50 text-[#FF5A5F]"
                          : isConfirmed
                          ? "bg-emerald-50 text-[#00C875]"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {isPending ? "À traiter" : isConfirmed ? "Confirmé" : "En cours"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(q)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isPending
                            ? "bg-[#0057D9] text-white hover:bg-[#0046b3]"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isPending ? "Traiter" : "Voir"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ZONE SECONDAIRE : GRAPHIQUE DES REVENUS RÉDUIT */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Évolution des revenus (€)
          </h3>
          <span className="text-xs font-semibold text-[#00C875]">Croissance stable</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`${Number(val).toLocaleString()} €`, "CA"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="ca" stroke="#0057D9" strokeWidth={2} fill="#EFF6FF" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal Devis Confirmation */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-dropdown border border-[#E2E8F0] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#0A2342]">
                  Devis {selectedQuote.id}
                </h3>
                <p className="text-xs text-slate-500">{selectedQuote.clientCompany}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200/80 space-y-1 text-xs text-slate-600">
              <p><strong className="text-slate-800">Axe :</strong> {selectedQuote.originPort.name} → {selectedQuote.destinationPort.name}</p>
              <p><strong className="text-slate-800">Mode :</strong> {selectedQuote.mode} ({selectedQuote.subType})</p>
              <p><strong className="text-slate-800">Contact :</strong> {selectedQuote.clientName} ({selectedQuote.clientPhone})</p>
              <p><strong className="text-slate-800">Total estimé :</strong> {formatPrice(selectedQuote.totalHtEur)} HT</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ajuster le tarif HT (€)</label>
                <input
                  type="number"
                  value={adjustedPrice}
                  onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                  className="input-clean font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Notes pour le client</label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="input-clean text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReject}
                className="px-3.5 py-2 text-xs font-semibold text-[#FF5A5F] hover:bg-red-50 rounded-xl"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn-gti text-xs py-2 px-4"
              >
                <Check className="w-4 h-4" />
                <span>Confirmer le devis</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

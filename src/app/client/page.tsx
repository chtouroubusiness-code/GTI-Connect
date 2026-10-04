"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Clock, Check, Ship, ArrowRight, AlertCircle } from "lucide-react";
import { useGTI } from "@/lib/store";

export default function ClientDashboardPage() {
  const { quotes, shipments, formatPrice } = useGTI();
  const [session, setSession] = useState<{ email: string; name: string; company: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) setSession(JSON.parse(stored));
  }, []);

  // Filter quotes for this client
  const myQuotes = quotes.filter(q => {
    if (!session) return true; // show all during loading
    return q.clientEmail.toLowerCase() === session.email.toLowerCase() ||
           q.clientCompany.toLowerCase().includes((session.company || "").toLowerCase().split(" ")[0]);
  });

  const pendingQuotes = myQuotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION");
  const confirmedQuotes = myQuotes.filter(q => q.status === "CONFIRME_ADMIN" || q.status === "ORDRE_TRANSPORT");
  const totalSpent = confirmedQuotes.reduce((acc, q) => acc + (q.adminAdjustedPriceEur || q.totalHtEur), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
          Tableau de bord
        </h1>
        <p className="text-xs text-slate-500">
          Bienvenue sur votre espace client GTI. Gérez vos devis et suivez vos expéditions.
        </p>
      </div>

      {/* 3 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Devis en attente</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FF9F1C] font-['Plus_Jakarta_Sans']">
              {pendingQuotes.length}
            </span>
            {pendingQuotes.length > 0 && (
              <span className="text-[11px] font-semibold text-[#FF9F1C]">En cours de validation</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Devis confirmés</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00C875] font-['Plus_Jakarta_Sans']">
              {confirmedQuotes.length}
            </span>
            <span className="text-[11px] font-medium text-slate-400">validés par GTI</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-1">
          <p className="text-xs font-medium text-slate-500">Total devis (HT)</p>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0057D9] font-['Plus_Jakarta_Sans']">
            {formatPrice(totalSpent)}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/client/nouveau-devis"
          className="bg-[#0057D9] text-white rounded-2xl p-6 flex items-center justify-between hover:bg-[#0046b3] transition-colors group"
        >
          <div className="space-y-1">
            <p className="text-sm font-bold">Demander un nouveau devis</p>
            <p className="text-xs text-blue-200">Maritime, Routier ou Aérien</p>
          </div>
          <Plus className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
        </Link>

        <Link
          href="/client/mes-devis"
          className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group shadow-subtle"
        >
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#0A2342]">Voir tous mes devis</p>
            <p className="text-xs text-slate-400">{myQuotes.length} devis au total</p>
          </div>
          <FileText className="w-8 h-8 text-slate-300 group-hover:text-[#0057D9] transition-colors" />
        </Link>
      </div>

      {/* Recent quotes */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0A2342]">Derniers devis</h2>
          <Link href="/client/mes-devis" className="text-xs font-semibold text-[#0057D9] hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500 font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-4">Trajet</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Montant HT</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myQuotes.slice(0, 5).map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#0057D9]">{q.id}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {q.originPort.code} → {q.destinationPort.code}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 capitalize">{q.mode}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0A2342]">
                    {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                  </td>
                  <td className="py-3.5 px-4">
                    {q.status === "CONFIRME_ADMIN" || q.status === "ORDRE_TRANSPORT" ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-[#00C875] inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> Confirmé
                      </span>
                    ) : q.status === "EN_ATTENTE_CONFIRMATION" ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-[#FF9F1C] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En attente
                      </span>
                    ) : q.status === "REJETE" ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-[#FF5A5F] inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Refusé
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-[#0057D9]">
                        {q.status.replace(/_/g, " ")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {myQuotes.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Aucun devis pour le moment. <Link href="/client/nouveau-devis" className="text-[#0057D9] font-semibold hover:underline">Créer votre premier devis →</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

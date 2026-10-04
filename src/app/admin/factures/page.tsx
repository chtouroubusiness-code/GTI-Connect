"use client";
import React, { useState } from "react";
import {
  FileText, Search, Plus, DollarSign, Download,
  CheckCircle2, Clock, AlertCircle, Eye, ArrowDownToLine
} from "lucide-react";
import { useGTI } from "@/lib/store";

export default function AdminFacturesPage() {
  const { invoices, formatPrice } = useGTI();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.quoteId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amountEur, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
            Facturation &amp; Comptabilité
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
            Factures &amp; Proformas de Fret
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Total facturé ce mois : <strong>{formatPrice(totalInvoiced)}</strong> sur {invoices.length} dossiers.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par N° facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">N° Facture</th>
                <th className="py-3.5 px-4">Chargeur / Entreprise</th>
                <th className="py-3.5 px-4">Dossier Réf Devis</th>
                <th className="py-3.5 px-4">Date Émission</th>
                <th className="py-3.5 px-4">Date Échéance</th>
                <th className="py-3.5 px-4">Montant TTC</th>
                <th className="py-3.5 px-4">Statut Paiement</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-[#002B5B]">{inv.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inv.clientName}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{inv.quoteId}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#009DFF] text-sm">{formatPrice(inv.amountEur)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      inv.status === "PAYEE" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      inv.status === "EN_ATTENTE" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {inv.status === "PAYEE" ? "Payée" : inv.status === "EN_ATTENTE" ? "En attente" : "En retard"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Téléchargement de la facture ${inv.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

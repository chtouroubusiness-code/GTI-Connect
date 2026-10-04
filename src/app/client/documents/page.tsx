"use client";
import React from "react";
import {
  FileText, Download, ShieldCheck, CheckCircle2,
  FileCheck, Clock, ArrowDownToLine, Eye
} from "lucide-react";
import { useGTI } from "@/lib/store";

export default function ClientDocumentsPage() {
  const { invoices, formatPrice } = useGTI();

  const DOCUMENTS = [
    { id: "DOC-BL-84920", title: "Connaissement Maritime Original (Bill of Lading B/L)", ref: "CMAU8492019-BL", date: "04/10/2026", type: "PDF Certifié", size: "1.4 MB" },
    { id: "DOC-DOU-1029", title: "Déclaration Unique de Marchandises (DUM / BADR)", ref: "DUM-2026-CAS-948", date: "03/10/2026", type: "Douane PortNet", size: "840 KB" },
    { id: "DOC-EUR1-440", title: "Certificat de Circulation EUR.1 / Origine", ref: "EUR1-MA-2026-440", date: "02/10/2026", type: "Certificat OEA", size: "520 KB" },
    { id: "DOC-ASS-9901", title: "Police d'Assurance Cargo Ad Valorem Tous Risques", ref: "POL-GTI-2026-990", date: "01/10/2026", type: "Assurance", size: "680 KB" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
          Coffre-fort Numérique
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
          Documents de Transport &amp; Factures
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Téléchargez vos connaissements maritimes B/L, certificats d&apos;origine, déclarations douanières et factures proforma.
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
          Titres de Transport &amp; Certificats Douaniers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#F5F7FA] rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#009DFF] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{doc.title}</h4>
                  <p className="text-[11px] text-slate-500">Réf : <strong>{doc.ref}</strong> • {doc.date}</p>
                  <span className="text-[10px] font-bold text-[#00D084]">{doc.type} ({doc.size})</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Téléchargement de ${doc.title} (${doc.ref}) démarré.`)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#009DFF] hover:border-[#009DFF] transition-all shadow-xs cursor-pointer"
                title="Télécharger le document"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Factures Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
          Historique des Factures de Fret
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-500 font-bold uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">N° Facture</th>
                <th className="py-3 px-4">Dossier / Réf Devis</th>
                <th className="py-3 px-4">Date d&apos;Émission</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4">Montant TTC</th>
                <th className="py-3 px-4">Statut Paiement</th>
                <th className="py-3 px-4 text-right">Télécharger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#002B5B]">{inv.id}</td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{inv.quoteId}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3 px-4 font-extrabold text-[#009DFF]">{formatPrice(inv.amountEur)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      inv.status === "PAYEE" ? "bg-emerald-100 text-emerald-700" :
                      inv.status === "EN_ATTENTE" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {inv.status === "PAYEE" ? "Payée" : inv.status === "EN_ATTENTE" ? "En attente" : "En retard"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Téléchargement de la facture ${inv.id}`)}
                      className="text-xs font-bold text-[#009DFF] hover:underline"
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

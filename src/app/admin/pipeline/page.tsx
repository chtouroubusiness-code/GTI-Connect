"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ship, Plane, Truck, GripVertical, Plus,
  MoreHorizontal, Calendar, DollarSign, CheckCircle2, Clock
} from "lucide-react";
import { useGTI, QuoteStatus, ClientQuote } from "@/lib/store";

const STAGES: { id: QuoteStatus; title: string; color: string; dotColor: string }[] = [
  { id: "EN_ATTENTE_CONFIRMATION", title: "Nouveau Devis Client", color: "bg-red-50 text-red-700 border-red-200", dotColor: "bg-red-500" },
  { id: "CONFIRME_ADMIN", title: "Confirmé GTI", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  { id: "EN_NEGOCIATION", title: "En Négociation", color: "bg-amber-50 text-amber-700 border-amber-200", dotColor: "bg-amber-500" },
  { id: "ORDRE_TRANSPORT", title: "Ordre de Transport", color: "bg-blue-50 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  { id: "EN_TRANSIT", title: "En Mer / Transit", color: "bg-purple-50 text-purple-700 border-purple-200", dotColor: "bg-purple-500" },
  { id: "LIVRE", title: "Livré / Clôturé", color: "bg-slate-100 text-slate-700 border-slate-200", dotColor: "bg-slate-500" },
];

export default function PipelinePage() {
  const { quotes, updateQuoteStatus, formatPrice } = useGTI();
  const [draggingQuoteId, setDraggingQuoteId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (quoteId: string) => {
    setDraggingQuoteId(quoteId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDrop = (toStage: QuoteStatus) => {
    if (draggingQuoteId) {
      updateQuoteStatus(draggingQuoteId, toStage);
    }
    setDraggingQuoteId(null);
    setDragOverStage(null);
  };

  const totalValue = quotes.reduce(
    (sum, q) => sum + (q.adminAdjustedPriceEur || q.totalHtEur), 0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009FE3] bg-[#009FE3]/10 px-2.5 py-1 rounded-full">
            Pipeline Logistique & CRM
          </span>
          <h1 className="text-2xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] mt-1">
            Pipeline Commercial des Expéditions
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            {quotes.length} dossiers en cours • Valeur globale estimée : <strong>{formatPrice(totalValue)}</strong>
          </p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max pb-6">
          {STAGES.map((stage) => {
            const stageQuotes = quotes.filter(q => q.status === stage.id);
            const stageTotal = stageQuotes.reduce((acc, q) => acc + (q.adminAdjustedPriceEur || q.totalHtEur), 0);

            return (
              <div
                key={stage.id}
                className={`w-72 flex flex-col rounded-3xl transition-all border ${
                  dragOverStage === stage.id ? "bg-[#009FE3]/10 ring-2 ring-[#009FE3]" : "bg-white border-slate-200/80 shadow-xs"
                }`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Column header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`} />
                      <h3 className="text-xs font-extrabold text-slate-900">{stage.title}</h3>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${stage.color}`}>
                        {stageQuotes.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{formatPrice(stageTotal)}</p>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto min-h-[300px]">
                  {stageQuotes.map((q) => {
                    return (
                      <motion.div
                        key={q.id}
                        layout
                        layoutId={q.id}
                        draggable
                        onDragStart={() => handleDragStart(q.id)}
                        className={`bg-slate-50 hover:bg-white p-3.5 rounded-2xl border border-slate-200 transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${
                          draggingQuoteId === q.id ? "opacity-40 scale-95" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">{q.id}</span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{q.clientCompany}</h4>
                          </div>
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium mb-2">
                          {q.originPort.name} → {q.destinationPort.name}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            {q.mode === "maritime" && <Ship className="w-3 h-3 text-blue-500" />}
                            {q.mode === "routier" && <Truck className="w-3 h-3 text-emerald-500" />}
                            {q.mode === "aerien" && <Plane className="w-3 h-3 text-purple-500" />}
                            <span>{q.subType}</span>
                          </div>
                          <span className="font-extrabold text-[#006FA3] text-xs">
                            {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {stageQuotes.length === 0 && (
                    <div className="flex items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">
                      Glisser un devis ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

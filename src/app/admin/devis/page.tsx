"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Plane, Truck, Search, Filter, CheckCircle2, Clock,
  AlertCircle, ChevronRight, Eye, Edit3, Check, X, FileText,
  DollarSign, ArrowUpDown, Download, Printer, User, Building2,
  Calendar, MapPin, ShieldCheck, Sparkles, Send
} from "lucide-react";
import { useGTI, QuoteStatus, ClientQuote } from "@/lib/store";

export default function AdminDevisManagementPage() {
  const { quotes, formatPrice, confirmQuote, rejectQuote, updateQuoteStatus } = useGTI();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [modeFilter, setModeFilter] = useState<string>("ALL");
  
  const [activeModalQuote, setActiveModalQuote] = useState<ClientQuote | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [adjustedPrice, setAdjustedPrice] = useState<number | undefined>(undefined);
  const [selectedVessel, setSelectedVessel] = useState("");

  // Filtering
  const filteredQuotes = quotes.filter((q) => {
    const matchSearch =
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.originPort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.destinationPort.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "ALL" || q.status === statusFilter;
    const matchMode = modeFilter === "ALL" || q.mode === modeFilter;

    return matchSearch && matchStatus && matchMode;
  });

  const handleOpenModal = (q: ClientQuote) => {
    setActiveModalQuote(q);
    setAdminNotes(q.adminNotes || "");
    setAdjustedPrice(q.adminAdjustedPriceEur || q.totalHtEur);
    setSelectedVessel(q.vesselOrFlightRef || "CMA CGM Medway v.26W");
  };

  const handleConfirmQuote = () => {
    if (activeModalQuote) {
      confirmQuote(activeModalQuote.id, adminNotes, adjustedPrice);
      setActiveModalQuote(null);
    }
  };

  const handleTransformToOrder = () => {
    if (activeModalQuote) {
      updateQuoteStatus(activeModalQuote.id, "ORDRE_TRANSPORT");
      setActiveModalQuote(null);
    }
  };

  const handleRejectQuote = () => {
    if (activeModalQuote) {
      rejectQuote(activeModalQuote.id, adminNotes || "Rejeté");
      setActiveModalQuote(null);
    }
  };

  const countPending = quotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION").length;
  const countConfirmed = quotes.filter(q => q.status === "CONFIRME_ADMIN").length;
  const countOrders = quotes.filter(q => q.status === "ORDRE_TRANSPORT").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009FE3] bg-[#009FE3]/10 px-2.5 py-1 rounded-full">
            Espace Commercial GTI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] mt-1">
            Gestion & Confirmation des Devis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Validez les devis calculés par vos clients, ajustez les marges et transformez-les en ordres de transport.
          </p>
        </div>

        {/* Action badge */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">
              {countPending} en attente de validation
            </span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "ALL", label: `Tous les Devis (${quotes.length})` },
          { id: "EN_ATTENTE_CONFIRMATION", label: `⏳ En Attente (${countPending})`, badge: countPending > 0 },
          { id: "CONFIRME_ADMIN", label: `✅ Confirmés (${countConfirmed})` },
          { id: "ORDRE_TRANSPORT", label: `📋 Ordres de Transport (${countOrders})` },
          { id: "EN_NEGOCIATION", label: `💬 En Négociation` },
          { id: "REJETE", label: `❌ Refusés` },
        ].map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Mode Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence (ex: GTI-...), client, port..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#009FE3]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Mode :</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Tous les modes</option>
            <option value="maritime">Maritime</option>
            <option value="routier">Routier</option>
            <option value="aerien">Aérien</option>
          </select>
        </div>
      </div>

      {/* Quotes Cards / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuotes.map((q) => {
          const isPending = q.status === "EN_ATTENTE_CONFIRMATION";
          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs hover:shadow-md ${
                isPending ? "border-amber-300 bg-amber-50/20" : "border-slate-200/80"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left col */}
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-extrabold text-[#0F172A]">{q.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      q.status === "EN_ATTENTE_CONFIRMATION"
                        ? "bg-red-100 text-red-700 border border-red-200 animate-pulse"
                        : q.status === "CONFIRME_ADMIN"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : q.status === "ORDRE_TRANSPORT"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {q.status === "EN_ATTENTE_CONFIRMATION" && "⏳ En attente de confirmation"}
                      {q.status === "CONFIRME_ADMIN" && "✅ Confirmé par GTI"}
                      {q.status === "EN_NEGOCIATION" && "💬 Négociation en cours"}
                      {q.status === "ORDRE_TRANSPORT" && "📋 Ordre de Transport Émis"}
                      {q.status === "EN_TRANSIT" && "🚢 En Transit"}
                      {q.status === "LIVRE" && "🏁 Livré"}
                      {q.status === "REJETE" && "❌ Refusé"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-bold text-slate-800">{q.clientCompany}</span>
                    <span>•</span>
                    <span>Contact : {q.clientName} ({q.clientPhone})</span>
                    <span>•</span>
                    <span>{new Date(q.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>

                  {/* Route & Cargo Line */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center gap-1.5">
                      {q.mode === "maritime" && <Ship className="w-3.5 h-3.5 text-blue-500" />}
                      {q.mode === "routier" && <Truck className="w-3.5 h-3.5 text-emerald-500" />}
                      {q.mode === "aerien" && <Plane className="w-3.5 h-3.5 text-purple-500" />}
                      <span>{q.originPort.name} → {q.destinationPort.name}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#006FA3] font-semibold">
                      {q.containerQuantity ? `${q.containerQuantity}x ${q.containerType?.replace("_", " ")}` : `${q.subType}`}
                    </span>

                    <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium">
                      Incoterm : {q.incoterm}
                    </span>
                  </div>
                </div>

                {/* Right col: Pricing & Action Buttons */}
                <div className="flex flex-col sm:items-end gap-3 ml-auto">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium">Montant HT Devis</span>
                    <p className="text-2xl font-extrabold text-[#006FA3]">
                      {formatPrice(q.adminAdjustedPriceEur || q.totalHtEur)}
                    </p>
                    {q.adminAdjustedPriceEur && q.adminAdjustedPriceEur !== q.totalHtEur && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        (Prix négocié / ajusté de {formatPrice(q.totalHtEur)})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(q)}
                      className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#00C2FF]" />
                      <span>{isPending ? "⚡ Examiner & Confirmer" : "Gérer / Modifier"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin note snippet if existing */}
              {q.adminNotes && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                  <span className="font-bold text-[#009FE3]">Note Admin :</span>
                  <span>{q.adminNotes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Full Devis Action & Confirmation Center */}
      <AnimatePresence>
        {activeModalQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-6 my-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Devis Commercial {activeModalQuote.id}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#009FE3]/10 text-[#009FE3]">
                      {activeModalQuote.mode.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Soumis le {new Date(activeModalQuote.createdAt).toLocaleString("fr-FR")} par {activeModalQuote.clientCompany}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalQuote(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Grid 2 cols: Client info + Route & Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Client info */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Coordonnées Chargeur</h4>
                  <div className="space-y-1 text-slate-600">
                    <p><strong className="text-slate-800">Société :</strong> {activeModalQuote.clientCompany}</p>
                    <p><strong className="text-slate-800">Contact :</strong> {activeModalQuote.clientName}</p>
                    <p><strong className="text-slate-800">Email :</strong> {activeModalQuote.clientEmail}</p>
                    <p><strong className="text-slate-800">Téléphone :</strong> {activeModalQuote.clientPhone}</p>
                    <p><strong className="text-slate-800">Ville :</strong> {activeModalQuote.clientCity}</p>
                  </div>
                </div>

                {/* Logistics */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Détails Expédition</h4>
                  <div className="space-y-1 text-slate-600">
                    <p><strong className="text-slate-800">Axe :</strong> {activeModalQuote.originPort.name} → {activeModalQuote.destinationPort.name}</p>
                    <p><strong className="text-slate-800">Cargaison :</strong> {activeModalQuote.cargoDescription || activeModalQuote.cargoNature}</p>
                    <p><strong className="text-slate-800">Conditionnement :</strong> {activeModalQuote.containerQuantity ? `${activeModalQuote.containerQuantity}x ${activeModalQuote.containerType}` : activeModalQuote.subType}</p>
                    <p><strong className="text-slate-800">Incoterm :</strong> {activeModalQuote.incoterm} • Valeur : {formatPrice(activeModalQuote.goodsValueEur)}</p>
                    <p><strong className="text-slate-800">Date Départ :</strong> {activeModalQuote.departureDate}</p>
                  </div>
                </div>
              </div>

              {/* Itemized Price Breakdown */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
                <h4 className="font-bold text-[#006FA3] uppercase tracking-wider text-[11px]">Décomposition Tarifaire</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px]">Fret Base :</span>
                    <p className="font-bold text-slate-900">{formatPrice(activeModalQuote.baseFreightEur)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px]">Surcharges :</span>
                    <p className="font-bold text-slate-900">{formatPrice(activeModalQuote.surchargesEur)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px]">THC Portuaire :</span>
                    <p className="font-bold text-slate-900">{formatPrice(activeModalQuote.thcEur)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px]">Douane & Assur. :</span>
                    <p className="font-bold text-slate-900">{formatPrice(activeModalQuote.customsEur + activeModalQuote.insuranceEur)}</p>
                  </div>
                </div>
              </div>

              {/* Admin Validation Form Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Prix Total Confirmé HT (€) (Ajustable pour remise commerciale)
                    </label>
                    <input
                      type="number"
                      value={adjustedPrice}
                      onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                      className="input-premium font-extrabold text-base text-[#006FA3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Navire / Vol Assigné
                    </label>
                    <input
                      type="text"
                      value={selectedVessel}
                      onChange={(e) => setSelectedVessel(e.target.value)}
                      placeholder="Ex: CMA CGM TANGER EXPRESS v.2409"
                      className="input-premium text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Commentaires & Conditions pour le Client
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Ex: Devis confirmé valable 14 jours. Espace réservé sur le départ du 15 octobre."
                    className="input-premium text-xs"
                  />
                </div>
              </div>

              {/* Confirmation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleRejectQuote}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all"
                >
                  Refuser le devis
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTransformToOrder}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#006FA3] text-xs font-bold transition-all"
                  >
                    📋 Transformer en Ordre de Transport
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmQuote}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>✅ Confirmer & Valider le Devis</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

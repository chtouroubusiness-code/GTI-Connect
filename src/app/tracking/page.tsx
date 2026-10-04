"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, Ship, Plane, Truck, CheckCircle2, Clock,
  MapPin, AlertCircle, Calendar, User, FileText, ArrowRight,
  ShieldCheck, Phone, Download, Check
} from "lucide-react";
import NavbarPublic from "@/components/NavbarPublic";
import FooterPublic from "@/components/FooterPublic";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useGTI, ClientQuote, ShipmentItem } from "@/lib/store";

function TrackingContent() {
  const searchParams = useSearchParams();
  const { quotes, shipments, formatPrice } = useGTI();

  const [query, setQuery] = useState("");
  const [matchedQuote, setMatchedQuote] = useState<ClientQuote | null>(null);
  const [matchedShipment, setMatchedShipment] = useState<ShipmentItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      setQuery(refParam);
      doSearch(refParam);
    } else {
      doSearch("GTI-2026-DEV-7841");
    }
  }, [searchParams, quotes, shipments]);

  const doSearch = (term: string) => {
    setHasSearched(true);
    const clean = term.trim().toUpperCase();
    if (!clean) return;

    const q = quotes.find(x => x.id.toUpperCase() === clean || x.trackingNumber?.toUpperCase() === clean);
    setMatchedQuote(q || null);

    const s = shipments.find(x => 
      x.id.toUpperCase() === clean || 
      x.quoteId.toUpperCase() === clean || 
      x.trackingNumber.toUpperCase() === clean ||
      (x.containerNumber && x.containerNumber.toUpperCase().includes(clean))
    );
    setMatchedShipment(s || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <>
      {/* Header & Search Banner */}
      <section className="bg-[#002B5B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D084] bg-white/10 px-3 py-1 rounded-full">
            Suivi Logistique en Temps Réel
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans']">
            Suivez votre Expédition ou votre Devis GTI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Saisissez votre numéro de devis (ex: <code>GTI-2026-DEV-7841</code>), de tracking (ex: <code>GTI-TRK-784102</code>) ou de conteneur (ex: <code>CMAU-849201-9</code>).
          </p>

          <form onSubmit={handleSubmit} className="pt-2 flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: GTI-2026-DEV-7841 ou CMAU-849201-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 font-bold rounded-2xl text-xs outline-none focus:ring-2 focus:ring-[#009DFF]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#009DFF] hover:bg-[#0070c0] text-white text-xs font-extrabold rounded-2xl shadow-md cursor-pointer transition-all"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Results Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {hasSearched && (
          <>
            {matchedQuote || matchedShipment ? (
              <div className="space-y-6">
                
                {/* Main Status Hero Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Top Bar with Reference & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-extrabold text-[#002B5B]">
                          {matchedShipment ? matchedShipment.trackingNumber : matchedQuote?.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          matchedShipment?.status === "EN_MER" || matchedShipment?.status === "EN_ROUTE"
                            ? "bg-blue-100 text-[#002B5B]"
                            : matchedShipment?.status === "LIVRE"
                            ? "bg-emerald-100 text-emerald-700"
                            : matchedQuote?.status === "CONFIRME_ADMIN"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {matchedShipment?.status === "EN_MER" && "🚢 Navire en Mer"}
                          {matchedShipment?.status === "EN_ROUTE" && "🚛 Camion en Route"}
                          {matchedShipment?.status === "LIVRE" && "🏁 Livré au Destinataire"}
                          {!matchedShipment && matchedQuote?.status === "CONFIRME_ADMIN" && "✅ Devis Confirmé par GTI"}
                          {!matchedShipment && matchedQuote?.status === "EN_ATTENTE_CONFIRMATION" && "⏳ En Attente de Validation Commerciale"}
                          {!matchedShipment && matchedQuote?.status === "EN_NEGOCIATION" && "💬 En Négociation"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Chargeur : <strong>{matchedShipment ? matchedShipment.clientCompany : matchedQuote?.clientCompany}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Arrivée Estimée (ETA)</p>
                      <p className="text-base font-extrabold text-[#009DFF]">
                        {matchedShipment?.eta || "Sous 12 - 16 jours"}
                      </p>
                    </div>
                  </div>

                  {/* Route & Cargo Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 font-medium">Corridor :</span>
                      <p className="font-extrabold text-[#002B5B] text-sm">
                        {matchedShipment ? `${matchedShipment.origin} → ${matchedShipment.destination}` : `${matchedQuote?.originPort.name} → ${matchedQuote?.destinationPort.name}`}
                      </p>
                      <p className="text-slate-500">Mode : {(matchedShipment?.mode || matchedQuote?.mode || "maritime").toUpperCase()}</p>
                    </div>

                    <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 font-medium">Cargaison & Réf :</span>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {matchedShipment ? matchedShipment.cargo : matchedQuote?.cargoDescription || matchedQuote?.cargoNature}
                      </p>
                      <p className="text-slate-500">Conteneur : {matchedShipment?.containerNumber || "Assignation quai"}</p>
                    </div>

                    <div className="bg-[#F5F7FA] p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 font-medium">Navire / Transporteur :</span>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {matchedShipment?.vesselName || matchedQuote?.vesselOrFlightRef || "CMA CGM MEDWAY"}
                      </p>
                      <p className="text-slate-500">Commercial GTI : {matchedQuote?.assignedAgent || "Faiez Hentati"}</p>
                    </div>
                  </div>

                  {/* Milestone Tracking Stepper */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#002B5B]">
                      Étapes d&apos;Acheminement & Jalons Logistiques
                    </h4>

                    <div className="space-y-3">
                      {(matchedShipment?.milestones || [
                        { step: "Demande de Devis Enregistrée", date: "04 Oct, 10:30", location: "Portail Web GTI", completed: true },
                        { step: "Validation Commerciale & Espace Navire", date: "04 Oct, 11:15", location: "Siège GTI Casablanca", completed: true, current: true },
                        { step: "Prise en charge & Empotage Conteneur", date: "Prévu 07 Oct", location: matchedQuote?.originPort.name || "Port Départ", completed: false },
                        { step: "Départ Navire & Traversée Maritime", date: "Prévu 08 Oct", location: "En Mer", completed: false },
                        { step: "Dédouanement Portuaire BADR & Livraison", date: "Prévu 16 Oct", location: matchedQuote?.destinationPort.name || "Casablanca", completed: false },
                      ]).map((m, idx) => (
                        <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#F5F7FA] border border-slate-200/60">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            m.completed
                              ? "bg-[#00D084] text-[#002B5B]"
                              : m.current
                              ? "bg-[#009DFF] text-white ring-4 ring-[#009DFF]/20"
                              : "bg-slate-200 text-slate-400"
                          }`}>
                            {m.completed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <p className="font-extrabold text-slate-900 text-xs">{m.step}</p>
                              <span className="text-[11px] font-semibold text-[#009DFF]">{m.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">{m.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Help Card */}
                <div className="bg-gradient-to-r from-[#002B5B] to-[#004b99] rounded-3xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-extrabold text-sm">Besoin d&apos;informations complémentaires sur ce dossier ?</p>
                    <p className="text-xs text-slate-300">Notre service opérations est disponible 24/7 pour toute demande d&apos;escale ou de dédouanement urgent.</p>
                  </div>
                  <a
                    href="https://wa.me/212661000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#00D084] hover:bg-[#00b371] text-[#002B5B] font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    Contacter le responsable de ligne
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3 max-w-md mx-auto">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-extrabold text-base text-[#002B5B]">Aucun dossier trouvé</h3>
                <p className="text-xs text-slate-500">
                  Aucun devis ou expédition ne correspond à « {query} ». Vérifiez le numéro ou effectuez un nouveau calcul.
                </p>
                <Link href="/calculateur" className="btn-primary text-xs inline-block">
                  Calculer un Devis
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <NavbarPublic />
      <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs font-bold">Chargement du module de tracking...</div>}>
        <TrackingContent />
      </Suspense>
      <FooterPublic />
      <MobileBottomNav />
    </div>
  );
}

"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Plane, Truck, ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, ShieldCheck, Clock, MapPin, Calendar, Box,
  DollarSign, Sparkles, Send, Check, RefreshCw, User, Building2,
  Mail, Phone, Lock, ChevronRight, Info
} from "lucide-react";
import NavbarPublic from "@/components/NavbarPublic";
import FooterPublic from "@/components/FooterPublic";
import MobileBottomNav from "@/components/MobileBottomNav";
import {
  useGTI, TransportMode, ContainerType, Incoterm,
  CargoNature, QuoteServices, ClientQuote, PortItem
} from "@/lib/store";
import Link from "next/link";

export default function QuoteCalculatorPage() {
  const {
    ports,
    quotes,
    formatPrice,
    calculateQuote,
    submitQuote
  } = useGTI();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Mode & Route
  const [mode, setMode] = useState<TransportMode>("maritime");
  const [subType, setSubType] = useState<string>("FCL");

  const filteredPorts = useMemo(() => {
    return ports.filter(p => p.mode === mode);
  }, [ports, mode]);

  const defaultOrigin = filteredPorts.find(p => p.country !== "Maroc")?.id || filteredPorts[0]?.id || "port-10";
  const defaultDest = filteredPorts.find(p => p.country === "Maroc")?.id || filteredPorts[1]?.id || "port-2";

  const [originId, setOriginId] = useState<string>(defaultOrigin);
  const [destinationId, setDestinationId] = useState<string>(defaultDest);

  const handleModeChange = (newMode: TransportMode) => {
    setMode(newMode);
    if (newMode === "maritime") {
      setSubType("FCL");
      const p = ports.filter(x => x.mode === "maritime");
      setOriginId(p.find(x => x.country !== "Maroc")?.id || p[0]?.id || "port-10");
      setDestinationId(p.find(x => x.country === "Maroc")?.id || p[1]?.id || "port-2");
    } else if (newMode === "aerien") {
      setSubType("standard");
      const p = ports.filter(x => x.mode === "aerien");
      setOriginId(p.find(x => x.country !== "Maroc")?.id || p[0]?.id || "air-2");
      setDestinationId(p.find(x => x.country === "Maroc")?.id || p[1]?.id || "air-1");
    } else {
      setSubType("FTL");
      const p = ports.filter(x => x.mode === "routier");
      setOriginId(p.find(x => x.country !== "Maroc")?.id || p[0]?.id || "road-3");
      setDestinationId(p.find(x => x.country === "Maroc")?.id || p[1]?.id || "road-2");
    }
  };

  // Step 2: Cargo & Containers
  const [containerType, setContainerType] = useState<ContainerType>("40_hc");
  const [containerQuantity, setContainerQuantity] = useState<number>(1);
  const [weightKg, setWeightKg] = useState<number>(500);
  const [volumeCbm, setVolumeCbm] = useState<number>(4);
  const [palletsCount, setPalletsCount] = useState<number>(4);
  const [cargoNature, setCargoNature] = useState<CargoNature>("general");
  const [cargoDescription, setCargoDescription] = useState<string>("");
  const [goodsValueEur, setGoodsValueEur] = useState<number>(45000);
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

  // Step 3: Incoterm & Services
  const [incoterm, setIncoterm] = useState<Incoterm>("CIF");
  const [services, setServices] = useState<QuoteServices>({
    customsClearance: true,
    allRiskInsurance: true,
    doorDelivery: false,
    portHandlingTHC: true,
    tempMonitoring: false,
  });

  // Step 4: Client Coordinates
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("Casablanca");
  const [clientNotes, setClientNotes] = useState("");

  // Step 5: Submitted Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<ClientQuote | null>(null);

  // Live calculation
  const quoteCalc = useMemo(() => {
    return calculateQuote({
      mode,
      subType,
      originId,
      destinationId,
      cargoNature,
      containerType,
      containerQuantity,
      weightKg,
      volumeCbm,
      palletsCount,
      goodsValueEur,
      incoterm,
      services,
    });
  }, [
    calculateQuote,
    mode,
    subType,
    originId,
    destinationId,
    cargoNature,
    containerType,
    containerQuantity,
    weightKg,
    volumeCbm,
    palletsCount,
    goodsValueEur,
    incoterm,
    services,
  ]);

  const originPortObj = ports.find(p => p.id === originId) || ports[0];
  const destPortObj = ports.find(p => p.id === destinationId) || ports[1];

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Veuillez renseigner votre Nom, Email et Téléphone.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitQuote({
        mode,
        subType,
        originPort: originPortObj,
        destinationPort: destPortObj,
        cargoNature,
        cargoDescription: cargoDescription || "Marchandise standard",
        containerType: mode === "maritime" && subType === "FCL" ? containerType : undefined,
        containerQuantity: mode === "maritime" && subType === "FCL" ? containerQuantity : undefined,
        weightKg: (mode === "aerien" || subType === "LCL") ? weightKg : undefined,
        volumeCbm: subType === "LCL" ? volumeCbm : undefined,
        palletsCount: mode === "routier" && subType === "LTL" ? palletsCount : undefined,
        goodsValueEur,
        incoterm,
        departureDate,
        services,
        baseFreightEur: quoteCalc.baseFreight,
        surchargesEur: quoteCalc.surcharges,
        thcEur: quoteCalc.thc,
        customsEur: quoteCalc.customs,
        insuranceEur: quoteCalc.insurance,
        doorDeliveryEur: quoteCalc.doorDelivery,
        totalHtEur: quoteCalc.totalHt,
        totalTtcEur: quoteCalc.totalTtc,
        clientName,
        clientCompany: clientCompany || clientName,
        clientEmail,
        clientPhone,
        clientCity,
        clientNotes,
      });

      setSubmittedQuote(created);
      setCurrentStep(5); // Move to final result step
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEPS_LIST = [
    { num: 1, label: "Mode & Route" },
    { num: 2, label: "Marchandise" },
    { num: 3, label: "Incoterm & Services" },
    { num: 4, label: "Coordonnées" },
    { num: 5, label: "Résultat" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <NavbarPublic />

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-1 rounded-full">
              Calculateur Professionnel GTI
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
              Calculateur de Devis de Transport International
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configurez votre expédition étape par étape pour obtenir une estimation certifiée en temps réel.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {STEPS_LIST.map((step, idx) => {
              const active = currentStep === step.num;
              const completed = currentStep > step.num;
              return (
                <div key={step.num} className="flex items-center gap-1.5">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                      completed
                        ? "bg-[#00D084] text-[#002B5B]"
                        : active
                        ? "bg-[#009DFF] text-white shadow-sm ring-2 ring-[#009DFF]/20"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {completed ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  <span className={`text-[11px] font-bold hidden sm:inline ${
                    active ? "text-[#002B5B]" : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                  {idx < STEPS_LIST.length - 1 && (
                    <span className="w-3 sm:w-5 h-0.5 bg-slate-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace: Wizard Form (8 cols) + Sticky Quote Summary (4 cols) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Wizard Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              
              {/* STEP 1: MODE & ROUTE */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                      Étape 1 : Mode de Transport & Corridors
                    </h2>
                    <p className="text-xs text-slate-500">Choisissez votre mode d&apos;acheminement et vos hubs de départ et d&apos;arrivée.</p>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "maritime", label: "Maritime", icon: Ship, desc: "FCL Conteneur & LCL Groupage" },
                      { id: "routier", label: "Routier TIR", icon: Truck, desc: "Camion Complet FTL & LTL" },
                      { id: "aerien", label: "Aérien Cargo", icon: Plane, desc: "Express 24-48h & Standard" },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = mode === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleModeChange(m.id as TransportMode)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[100px] ${
                            active
                              ? "border-[#009DFF] bg-[#009DFF]/5 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            active ? "bg-[#009DFF] text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-extrabold text-sm ${active ? "text-[#002B5B]" : "text-slate-800"}`}>{m.label}</p>
                            <p className="text-[10px] text-slate-500 truncate">{m.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-type switcher */}
                  <div className="p-1 bg-slate-100 rounded-xl flex gap-1">
                    {mode === "maritime" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSubType("FCL")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "FCL" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          📦 Conteneur Complet (FCL)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubType("LCL")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "LCL" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          🧩 Groupage Maritime (LCL)
                        </button>
                      </>
                    )}
                    {mode === "routier" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSubType("FTL")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "FTL" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          🚛 Camion Complet (FTL)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubType("LTL")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "LTL" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          📦 Groupage Routier (LTL)
                        </button>
                      </>
                    )}
                    {mode === "aerien" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSubType("standard")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "standard" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          ✈️ Aérien Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubType("express")}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            subType === "express" ? "bg-white text-[#002B5B] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          ⚡ Express Prioritaire 24h
                        </button>
                      </>
                    )}
                  </div>

                  {/* Ports / Hubs Origin & Destination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#009DFF]" />
                        Port / Hub d&apos;Origine (Départ)
                      </label>
                      <select
                        value={originId}
                        onChange={(e) => setOriginId(e.target.value)}
                        className="input-premium font-bold text-xs"
                      >
                        {filteredPorts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.countryCode} {p.name} ({p.code}) - {p.country}
                          </option>
                        ))}
                      </select>
                      {originPortObj?.status === "congestion" && (
                        <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          {originPortObj.notes || "Congestion signalée sur ce terminal"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00D084]" />
                        Port / Hub de Destination (Arrivée)
                      </label>
                      <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="input-premium font-bold text-xs"
                      >
                        {filteredPorts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.countryCode} {p.name} ({p.code}) - {p.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Transit badge */}
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-[#002B5B]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#009DFF]" />
                      Transit Time : <strong>{quoteCalc.transitTime}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#009DFF]" />
                      Départs : <strong>{quoteCalc.frequency}</strong>
                    </span>
                  </div>

                  {/* Navigation CTA */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary"
                    >
                      <span>Continuer : Spécifications Marchandise</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CARGO & CONTAINER SPECIFICATIONS */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                      Étape 2 : Spécifications de la Cargaison
                    </h2>
                    <p className="text-xs text-slate-500">Précisez le conditionnement, le type de conteneur et la nature de vos biens.</p>
                  </div>

                  {/* If Maritime FCL */}
                  {mode === "maritime" && subType === "FCL" && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-700">Type de Conteneur</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: "20_dry", name: "20' Dry", desc: "33 m³ / 28 T" },
                          { id: "40_dry", name: "40' Dry", desc: "67 m³ / 28 T" },
                          { id: "40_hc", name: "40' High Cube", desc: "76 m³ / 28 T" },
                          { id: "40_reefer", name: "40' Reefer", desc: "Frigo T° dirigée" },
                        ].map((c) => {
                          const active = containerType === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setContainerType(c.id as ContainerType)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                active
                                  ? "border-[#009DFF] bg-[#009DFF]/10 text-[#002B5B] font-extrabold"
                                  : "border-slate-200 bg-slate-50 text-slate-700 font-medium"
                              }`}
                            >
                              <p className="text-xs font-bold">{c.name}</p>
                              <p className="text-[10px] text-slate-500">{c.desc}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="text-xs font-bold text-slate-700">Nombre de conteneurs :</label>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setContainerQuantity(Math.max(1, containerQuantity - 1))}
                            className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center shadow-xs"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-extrabold text-sm text-slate-800">{containerQuantity}</span>
                          <button
                            type="button"
                            onClick={() => setContainerQuantity(containerQuantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If LCL / Aérien / Routier LTL */}
                  {(subType === "LCL" || mode === "aerien" || (mode === "routier" && subType === "LTL")) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Poids Total (Kg)</label>
                        <input
                          type="number"
                          min="10"
                          value={weightKg}
                          onChange={(e) => setWeightKg(Number(e.target.value))}
                          className="input-premium font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Volume Total (m³ / CBM)</label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={volumeCbm}
                          onChange={(e) => setVolumeCbm(Number(e.target.value))}
                          className="input-premium font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nombre de Palettes / Colis</label>
                        <input
                          type="number"
                          min="1"
                          value={palletsCount}
                          onChange={(e) => setPalletsCount(Number(e.target.value))}
                          className="input-premium font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cargo Nature & Value */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nature de la Marchandise</label>
                      <select
                        value={cargoNature}
                        onChange={(e) => setCargoNature(e.target.value as CargoNature)}
                        className="input-premium font-bold text-xs"
                      >
                        <option value="general">Générale / Dry Standard</option>
                        <option value="perissable">Denrées Périssables / Agroalimentaire</option>
                        <option value="textile">Textile & Confection</option>
                        <option value="industriel">Équipements & Composants Industriels</option>
                        <option value="chimique">Produits Chimiques / Santé Pharma</option>
                        <option value="dangereux">Matières Dangereuses (IMO / ADR)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Valeur Déclarée des Biens (€)</label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={goodsValueEur}
                        onChange={(e) => setGoodsValueEur(Number(e.target.value))}
                        className="input-premium font-bold text-xs"
                      />
                    </div>
                  </div>

                  {/* Description & Departure date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Désignation des marchandises</label>
                      <input
                        type="text"
                        placeholder="Ex: Câblage électrique, fruits, tissus..."
                        value={cargoDescription}
                        onChange={(e) => setCargoDescription(e.target.value)}
                        className="input-premium text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Date de départ souhaitée</label>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="input-premium font-bold text-xs"
                      />
                    </div>
                  </div>

                  {/* Navigation CTA */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary"
                    >
                      <span>Continuer : Incoterms & Services</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: INCOTERM & SERVICES */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                      Étape 3 : Incoterm & Services Complémentaires
                    </h2>
                    <p className="text-xs text-slate-500">Personnalisez votre prise en charge douanière, assurance et livraison.</p>
                  </div>

                  {/* Incoterm */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Incoterm International Souhaité</label>
                    <select
                      value={incoterm}
                      onChange={(e) => setIncoterm(e.target.value as Incoterm)}
                      className="input-premium font-bold text-xs"
                    >
                      <option value="CIF">CIF - Coût, Assurance et Fret (Recommandé Import)</option>
                      <option value="FOB">FOB - Franco à Bord Port de Départ</option>
                      <option value="EXW">EXW - Départ Usine</option>
                      <option value="CFR">CFR - Coût et Fret</option>
                      <option value="DDP">DDP - Rendu Droits Acquittés (Door-to-Door complet)</option>
                      <option value="DAP">DAP - Rendu au Lieu de Destination</option>
                    </select>
                  </div>

                  {/* Checkboxes for Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      services.customsClearance ? "border-[#009DFF] bg-[#009DFF]/5" : "border-slate-200 bg-slate-50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={services.customsClearance}
                        onChange={(e) => setServices({ ...services, customsClearance: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#009DFF] rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dédouanement Portuaire BADR / PortNet</p>
                        <p className="text-[11px] text-slate-500">Formalités de dédouanement import/export par nos déclarants agréés.</p>
                      </div>
                    </label>

                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      services.allRiskInsurance ? "border-[#009DFF] bg-[#009DFF]/5" : "border-slate-200 bg-slate-50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={services.allRiskInsurance}
                        onChange={(e) => setServices({ ...services, allRiskInsurance: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#009DFF] rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Assurance Ad Valorem Tous Risques</p>
                        <p className="text-[11px] text-slate-500">Couverture intégrale de magasin à magasin (0.35% valeur).</p>
                      </div>
                    </label>

                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      services.portHandlingTHC ? "border-[#009DFF] bg-[#009DFF]/5" : "border-slate-200 bg-slate-50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={services.portHandlingTHC}
                        onChange={(e) => setServices({ ...services, portHandlingTHC: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#009DFF] rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Manutention Portuaire THC Inclus</p>
                        <p className="text-[11px] text-slate-500">Frais de quai et chargement aux terminaux maritimes.</p>
                      </div>
                    </label>

                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      services.doorDelivery ? "border-[#009DFF] bg-[#009DFF]/5" : "border-slate-200 bg-slate-50"
                    }`}>
                      <input
                        type="checkbox"
                        checked={services.doorDelivery}
                        onChange={(e) => setServices({ ...services, doorDelivery: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#009DFF] rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Livraison sur Site (Door-to-Door)</p>
                        <p className="text-[11px] text-slate-500">Traction par camion dédié jusqu&apos;à votre entrepôt.</p>
                      </div>
                    </label>
                  </div>

                  {/* Navigation CTA */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary"
                    >
                      <span>Continuer : Coordonnées Chargeur</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CLIENT CONTACT & SUBMIT */}
              {currentStep === 4 && (
                <form onSubmit={handleSubmitQuote} className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                      Étape 4 : Coordonnées du Chargeur & Validation
                    </h2>
                    <p className="text-xs text-slate-500">
                      Renseignez vos coordonnées professionnelles pour recevoir l&apos;offre certifiée GTI et la transmettre au pôle commercial.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Nom & Prénom du Responsable <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Yassine Mansouri"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="input-premium text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Société / Raison Sociale <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Atlas Fruits & Primeurs Maroc"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        className="input-premium text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        Email Professionnel <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="y.mansouri@atlasfruits.ma"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="input-premium text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Téléphone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+212 6 61 00 00 00"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="input-premium text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ville & Adresse de Livraison</label>
                    <input
                      type="text"
                      placeholder="Casablanca, Tanger Free Zone, Fès, Marseille..."
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="input-premium text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Instructions Spécifiques / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Empotage prévu le lundi matin, certificat phytosanitaire..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="input-premium text-xs"
                    />
                  </div>

                  {/* Navigation CTA */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Valider et Soumettre le Devis à GTI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 5: FINAL RESULT CONFIRMATION */}
              {currentStep === 5 && submittedQuote && (
                <div className="space-y-6 animate-fade-in text-center py-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#00D084] flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-1.5 max-w-md mx-auto">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#00D084] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Devis Enregistré avec Succès
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                      Référence : {submittedQuote.id}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Votre demande a été transmise à notre équipe commerciale GTI. Un agent vérifie la disponibilité de place navire et confirmera votre tarif sous 15 minutes.
                    </p>
                  </div>

                  {/* Detailed summary card */}
                  <div className="bg-[#F5F7FA] p-5 rounded-3xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chargeur :</span>
                      <span className="font-extrabold text-slate-900">{submittedQuote.clientCompany}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Corridor :</span>
                      <span className="font-extrabold text-[#002B5B]">
                        {submittedQuote.originPort.name} → {submittedQuote.destinationPort.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cargaison :</span>
                      <span className="font-semibold text-slate-800">
                        {submittedQuote.containerQuantity ? `${submittedQuote.containerQuantity}x ${submittedQuote.containerType}` : submittedQuote.subType}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Montant Estimé HT :</span>
                      <span className="text-base font-extrabold text-[#009DFF]">{formatPrice(submittedQuote.totalHtEur)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                    <Link
                      href="/admin/devis"
                      className="btn-navy text-xs flex items-center justify-center gap-2 flex-1"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#009DFF]" />
                      <span>Voir dans l&apos;Espace Admin CRM</span>
                    </Link>

                    <Link
                      href={`/tracking?ref=${submittedQuote.id}`}
                      className="btn-primary text-xs flex items-center justify-center gap-2 flex-1"
                    >
                      <span>Suivre le statut</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sticky Live Quotation Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#002B5B] text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#009DFF]">Calcul en direct</span>
                  <h3 className="text-base font-extrabold text-white">Devis Estimatif GTI</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#00D084]/20 text-[#00D084] text-[10px] font-bold">
                  Tarif Garanti
                </span>
              </div>

              {/* Route snippet */}
              <div className="space-y-1.5 text-xs border-b border-white/10 pb-3">
                <div className="flex justify-between text-slate-300">
                  <span>Ligne :</span>
                  <span className="font-extrabold text-white">{originPortObj.code} → {destPortObj.code}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Mode :</span>
                  <span className="font-bold text-[#009DFF] uppercase">{mode} ({subType})</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Transit :</span>
                  <span className="font-bold text-[#00D084]">{quoteCalc.transitTime}</span>
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-2 text-xs border-b border-white/10 pb-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Fret de base :</span>
                  <span className="font-bold text-white">{formatPrice(quoteCalc.baseFreight)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcharges maritimes (BAF/Fuel) :</span>
                  <span className="font-bold text-white">{formatPrice(quoteCalc.surcharges)}</span>
                </div>
                {quoteCalc.thc > 0 && (
                  <div className="flex justify-between">
                    <span>Manutention portuaire THC :</span>
                    <span className="font-bold text-white">{formatPrice(quoteCalc.thc)}</span>
                  </div>
                )}
                {quoteCalc.customs > 0 && (
                  <div className="flex justify-between">
                    <span>Dédouanement en douane :</span>
                    <span className="font-bold text-white">{formatPrice(quoteCalc.customs)}</span>
                  </div>
                )}
                {quoteCalc.insurance > 0 && (
                  <div className="flex justify-between">
                    <span>Assurance Ad Valorem :</span>
                    <span className="font-bold text-white">{formatPrice(quoteCalc.insurance)}</span>
                  </div>
                )}
                {quoteCalc.doorDelivery > 0 && (
                  <div className="flex justify-between">
                    <span>Livraison sur site :</span>
                    <span className="font-bold text-white">{formatPrice(quoteCalc.doorDelivery)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300 font-medium">TOTAL ESTIMÉ (HT)</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {formatPrice(quoteCalc.totalHt)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Total TTC (+20% TVA) :</span>
                  <span className="font-bold text-slate-200">{formatPrice(quoteCalc.totalTtc)}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00D084] flex-shrink-0" />
                  <span>Validation sous 15 min par nos commissionnaires de transport.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <FooterPublic />
      <MobileBottomNav />
    </div>
  );
}

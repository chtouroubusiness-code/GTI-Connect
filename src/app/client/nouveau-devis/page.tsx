"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Ship, Truck, Plane } from "lucide-react";
import { useGTI, TransportMode, ContainerType, CargoNature } from "@/lib/store";

export default function NouveauDevisPage() {
  const { ports, calculateQuote, submitQuote, formatPrice } = useGTI();
  const [session, setSession] = useState<{ email: string; name: string; company: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) setSession(JSON.parse(stored));
  }, []);

  // Form state
  const [mode, setMode] = useState<TransportMode>("maritime");
  const [originId, setOriginId] = useState("port-10");
  const [destinationId, setDestinationId] = useState("port-2");
  const [containerType, setContainerType] = useState<ContainerType>("40_hc");
  const [containerQty, setContainerQty] = useState(1);
  const [cargoNature, setCargoNature] = useState<CargoNature>("general");
  const [goodsValue, setGoodsValue] = useState(45000);
  const [weightKg, setWeightKg] = useState(500);
  const [palletsCount, setPalletsCount] = useState(2);
  const [customsClearance, setCustomsClearance] = useState(true);
  const [allRiskInsurance, setAllRiskInsurance] = useState(true);
  const [doorDelivery, setDoorDelivery] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");

  const filteredOrigins = ports.filter(p => p.mode === mode && p.country !== "Maroc");
  const filteredDests = ports.filter(p => p.mode === mode && p.country === "Maroc");

  useEffect(() => {
    if (filteredOrigins.length > 0 && !filteredOrigins.some(p => p.id === originId)) {
      setOriginId(filteredOrigins[0].id);
    }
    if (filteredDests.length > 0 && !filteredDests.some(p => p.id === destinationId)) {
      setDestinationId(filteredDests[0].id);
    }
  }, [mode, filteredOrigins, filteredDests, originId, destinationId]);

  // Live calculation
  const calc = calculateQuote({
    mode,
    subType: mode === "maritime" ? "FCL" : mode === "routier" ? "FTL" : "express",
    originId,
    destinationId,
    cargoNature,
    containerType,
    containerQuantity: containerQty,
    weightKg,
    palletsCount,
    goodsValueEur: goodsValue,
    incoterm: "CIF",
    services: { customsClearance, allRiskInsurance, doorDelivery, portHandlingTHC: true },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsSubmitting(true);

    const originPort = ports.find(p => p.id === originId) || ports[0];
    const destPort = ports.find(p => p.id === destinationId) || ports[1];

    try {
      const created = await submitQuote({
        mode,
        subType: mode === "maritime" ? "FCL" : mode === "routier" ? "FTL" : "express",
        originPort,
        destinationPort: destPort,
        cargoNature,
        containerType,
        containerQuantity: containerQty,
        goodsValueEur: goodsValue,
        weightKg,
        palletsCount,
        incoterm: "CIF",
        departureDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        services: { customsClearance, allRiskInsurance, doorDelivery, portHandlingTHC: true },
        baseFreightEur: calc.baseFreight,
        surchargesEur: calc.surcharges,
        thcEur: calc.thc,
        customsEur: calc.customs,
        insuranceEur: calc.insurance,
        doorDeliveryEur: calc.doorDelivery,
        totalHtEur: calc.totalHt,
        totalTtcEur: calc.totalTtc,
        clientCompany: session.company,
        clientName: session.name,
        clientEmail: session.email,
        clientPhone: "+212 6 00 00 00 00",
        clientCity: "Casablanca",
        clientNotes: "Devis soumis depuis l'espace client GTI Connect.",
      });

      setSubmittedRef(created.id);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-emerald-50 border-2 border-[#00C875] rounded-2xl p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#00C875] text-white flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-extrabold text-[#0A2342]">Devis soumis avec succès !</h2>
          <p className="text-sm text-slate-600">
            Votre demande <strong className="text-[#0057D9]">{submittedRef}</strong> a été transmise à <strong>Faiez Hentati</strong> (Commercial GTI).
            <br />Vous recevrez une confirmation sous 15 minutes.
          </p>
          <p className="text-2xl font-extrabold text-[#0057D9]">{formatPrice(calc.totalHt)} HT</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <a href="/client/mes-devis" className="btn-gti text-xs py-2.5 px-5">
              Voir mes devis
            </a>
            <button
              onClick={() => { setSubmitted(false); setSubmittedRef(""); }}
              className="btn-secondary-clean text-xs py-2.5 px-5 cursor-pointer"
            >
              Nouveau devis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
          Nouveau Devis de Transport
        </h1>
        <p className="text-xs text-slate-500">
          Remplissez le formulaire ci-dessous. Le montant estimé s&apos;affiche en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM — 2/3 */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          
          {/* Mode de transport */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mode de transport</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "maritime", label: "Maritime", icon: Ship, desc: "Conteneurs FCL" },
                { id: "routier", label: "Routier", icon: Truck, desc: "Camion TIR" },
                { id: "aerien", label: "Aérien", icon: Plane, desc: "Fret express" },
              ].map((item) => {
                const active = mode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as TransportMode)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      active ? "border-[#0057D9] bg-blue-50/50 shadow-xs" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${active ? "text-[#0057D9]" : "text-slate-400"}`} />
                    <p className={`text-sm font-bold ${active ? "text-[#0057D9]" : "text-slate-700"}`}>{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trajet */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trajet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Départ</label>
                <select value={originId} onChange={(e) => setOriginId(e.target.value)} className="input-clean text-xs cursor-pointer">
                  {filteredOrigins.map((p) => (
                    <option key={p.id} value={p.id}>{p.countryCode} {p.name} ({p.code})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Arrivée (Maroc)</label>
                <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} className="input-clean text-xs cursor-pointer">
                  {filteredDests.map((p) => (
                    <option key={p.id} value={p.id}>{p.countryCode} {p.name} ({p.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cargaison */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cargaison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mode === "maritime" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Conteneur</label>
                    <select value={containerType} onChange={(e) => setContainerType(e.target.value as ContainerType)} className="input-clean text-xs cursor-pointer">
                      <option value="40_hc">40&apos; High Cube</option>
                      <option value="20_dry">20&apos; Dry</option>
                      <option value="40_dry">40&apos; Dry</option>
                      <option value="40_reefer">40&apos; Reefer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Quantité</label>
                    <input type="number" min={1} max={50} value={containerQty} onChange={(e) => setContainerQty(Math.max(1, Number(e.target.value)))} className="input-clean text-xs" />
                  </div>
                </>
              )}
              {mode === "aerien" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Poids (kg)</label>
                  <input type="number" min={10} value={weightKg} onChange={(e) => setWeightKg(Math.max(10, Number(e.target.value)))} className="input-clean text-xs" />
                </div>
              )}
              {mode === "routier" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Palettes</label>
                  <input type="number" min={1} max={33} value={palletsCount} onChange={(e) => setPalletsCount(Math.max(1, Number(e.target.value)))} className="input-clean text-xs" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nature</label>
                <select value={cargoNature} onChange={(e) => setCargoNature(e.target.value as CargoNature)} className="input-clean text-xs cursor-pointer">
                  <option value="general">Général</option>
                  <option value="perissable">Périssable</option>
                  <option value="textile">Textile</option>
                  <option value="industriel">Industriel</option>
                  <option value="chimique">Chimique</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Valeur (€)</label>
                <input type="number" min={1000} step={1000} value={goodsValue} onChange={(e) => setGoodsValue(Number(e.target.value))} className="input-clean text-xs" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Dédouanement", checked: customsClearance, set: setCustomsClearance },
                { label: "Assurance Tous Risques", checked: allRiskInsurance, set: setAllRiskInsurance },
                { label: "Livraison usine", checked: doorDelivery, set: setDoorDelivery },
              ].map((s) => (
                <label key={s.label} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700">
                  <input type="checkbox" checked={s.checked} onChange={(e) => s.set(e.target.checked)} className="rounded text-[#0057D9]" />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gti w-full py-4 text-sm font-bold cursor-pointer"
          >
            {isSubmitting ? "Envoi en cours..." : "Soumettre mon devis à GTI"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* STICKY PRICE CARD — 1/3 */}
        <div className="lg:col-span-1">
          <div className="bg-[#0A2342] text-white rounded-2xl p-6 shadow-card space-y-4 lg:sticky lg:top-8">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Montant estimé</span>
              <p className="text-3xl font-extrabold text-[#00C2FF] font-['Plus_Jakarta_Sans'] mt-1">
                {formatPrice(calc.totalHt)}
              </p>
              <p className="text-[11px] text-slate-400">HT • {formatPrice(calc.totalTtc)} TTC</p>
            </div>

            <div className="border-t border-slate-700 pt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Fret de base</span><span className="font-semibold">{formatPrice(calc.baseFreight)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Surcharges BAF</span><span className="font-semibold">{formatPrice(calc.surcharges)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">THC portuaire</span><span className="font-semibold">{formatPrice(calc.thc)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Dédouanement</span><span className="font-semibold">{formatPrice(calc.customs)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Assurance</span><span className="font-semibold">{formatPrice(calc.insurance)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Livraison</span><span className="font-semibold">{formatPrice(calc.doorDelivery)}</span></div>
            </div>

            <div className="border-t border-slate-700 pt-3 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Transit estimé</span><span className="font-bold text-[#00C875]">{calc.transitTime}</span></div>
              <div className="flex justify-between mt-1"><span className="text-slate-400">Fréquence</span><span className="text-slate-300">{calc.frequency}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

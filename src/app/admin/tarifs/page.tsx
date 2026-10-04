"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Plane, Truck, Search, Plus, Edit2, DollarSign,
  Layers, ArrowRight, Check, X, Clock, Calendar, Sparkles
} from "lucide-react";
import { useGTI, RouteTariff, TransportMode } from "@/lib/store";

export default function AdminTarifsPage() {
  const { tariffs, ports, updateTariff, addTariff, formatPrice } = useGTI();

  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("ALL");

  const [editingTariff, setEditingTariff] = useState<RouteTariff | null>(null);
  const [rate20, setRate20] = useState<number>(1800);
  const [rate40, setRate40] = useState<number>(2600);
  const [rateLcl, setRateLcl] = useState<number>(90);
  const [bafRate, setBafRate] = useState<number>(150);
  const [transitMin, setTransitMin] = useState<number>(20);
  const [transitMax, setTransitMax] = useState<number>(25);
  const [frequency, setFrequency] = useState("2x / semaine");

  const handleOpenEdit = (t: RouteTariff) => {
    setEditingTariff(t);
    setRate20(t.baseRate20);
    setRate40(t.baseRate40);
    setRateLcl(t.baseRateLclPerCbm);
    setBafRate(t.bafRate);
    setTransitMin(t.transitTimeDaysMin);
    setTransitMax(t.transitTimeDaysMax);
    setFrequency(t.frequency);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTariff) return;

    updateTariff(editingTariff.id, {
      baseRate20: rate20,
      baseRate40: rate40,
      baseRateLclPerCbm: rateLcl,
      bafRate,
      transitTimeDaysMin: transitMin,
      transitTimeDaysMax: transitMax,
      frequency,
    });

    setEditingTariff(null);
  };

  const filteredTariffs = tariffs.filter((t) => {
    const origin = ports.find(p => p.id === t.originId)?.name || "";
    const dest = ports.find(p => p.id === t.destinationId)?.name || "";
    const matchSearch =
      origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = modeFilter === "ALL" || t.mode === modeFilter;
    return matchSearch && matchMode;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009FE3] bg-[#009FE3]/10 px-2.5 py-1 rounded-full">
            Matrice Tarifaire & Marges
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] mt-1">
            Grilles Tarifaires & Corridors Logistiques
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fixez vos taux de fret contractuels (20&apos;, 40&apos;, LCL, FTL) et surcharges qui alimentent le moteur de devis client en direct.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par port d'origine ou de destination..."
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
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Tous les corridors ({tariffs.length})</option>
            <option value="maritime">Maritime</option>
            <option value="routier">Routier</option>
            <option value="aerien">Aérien</option>
          </select>
        </div>
      </div>

      {/* Tariffs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Corridor Logistique</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Taux 20&apos; Dry / Base</th>
                <th className="py-3.5 px-4">Taux 40&apos; / HC</th>
                <th className="py-3.5 px-4">Groupage LCL / Kg</th>
                <th className="py-3.5 px-4">Surcharges BAF</th>
                <th className="py-3.5 px-4">Transit Time</th>
                <th className="py-3.5 px-4">Fréquence</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTariffs.map((t) => {
                const orig = ports.find(p => p.id === t.originId);
                const dest = ports.find(p => p.id === t.destinationId);

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <span>{orig?.countryCode} {orig?.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dest?.countryCode} {dest?.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-700">{t.mode}</span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[#006FA3] text-sm">
                      {t.baseRate20 > 0 ? formatPrice(t.baseRate20) : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-[#006FA3] text-sm">
                      {t.baseRate40 > 0 ? formatPrice(t.baseRate40) : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {t.baseRateLclPerCbm} € {t.mode === "aerien" ? "/ kg" : "/ m³"}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      +{t.bafRate} €
                    </td>

                    <td className="py-3.5 px-4 text-emerald-600 font-bold">
                      {t.transitTimeDaysMin} - {t.transitTimeDaysMax} jours
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {t.frequency}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                      >
                        Ajuster Taux
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tariff Modal */}
      <AnimatePresence>
        {editingTariff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Ajuster la Grille Tarifaire
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTariff(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Taux Base 20&apos; (€)</label>
                    <input
                      type="number"
                      value={rate20}
                      onChange={(e) => setRate20(Number(e.target.value))}
                      className="input-premium font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Taux Base 40&apos; / HC (€)</label>
                    <input
                      type="number"
                      value={rate40}
                      onChange={(e) => setRate40(Number(e.target.value))}
                      className="input-premium font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Taux LCL (€ / CBM ou kg)</label>
                    <input
                      type="number"
                      value={rateLcl}
                      onChange={(e) => setRateLcl(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Surcharge BAF / Fuel (€)</label>
                    <input
                      type="number"
                      value={bafRate}
                      onChange={(e) => setBafRate(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Transit Min (jours)</label>
                    <input
                      type="number"
                      value={transitMin}
                      onChange={(e) => setTransitMin(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Transit Max (jours)</label>
                    <input
                      type="number"
                      value={transitMax}
                      onChange={(e) => setTransitMax(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Fréquence des départs</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="input-premium"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTariff(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#009FE3] hover:bg-[#008bc7] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Mettre à jour les Tarifs
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

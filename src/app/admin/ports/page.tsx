"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship, Plane, Truck, Search, Plus, Edit2, Trash2,
  AlertTriangle, CheckCircle2, Globe, MapPin, DollarSign,
  Layers, ArrowUpDown, Filter, ChevronRight, Check, X,
  Anchor, Sparkles, SlidersHorizontal
} from "lucide-react";
import { useGTI, PortItem, PortStatus, TransportMode } from "@/lib/store";

export default function AdminPortsPage() {
  const { ports, addPort, updatePort, deletePort, togglePortStatus, formatPrice } = useGTI();

  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPort, setEditingPort] = useState<PortItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCountry, setFormCountry] = useState("Maroc");
  const [formCountryCode, setFormCountryCode] = useState("🇲🇦");
  const [formMode, setFormMode] = useState<TransportMode>("maritime");
  const [formStatus, setFormStatus] = useState<PortStatus>("actif");
  const [formThcRate, setFormThcRate] = useState<number>(200);
  const [formTransitHub, setFormTransitHub] = useState("Hub Régional");
  const [formActiveLines, setFormActiveLines] = useState<number>(50);
  const [formNotes, setFormNotes] = useState("");

  const handleOpenAdd = () => {
    setFormName("");
    setFormCode("");
    setFormCountry("Maroc");
    setFormCountryCode("🇲🇦");
    setFormMode("maritime");
    setFormStatus("actif");
    setFormThcRate(200);
    setFormTransitHub("Méditerranée");
    setFormActiveLines(60);
    setFormNotes("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (port: PortItem) => {
    setEditingPort(port);
    setFormName(port.name);
    setFormCode(port.code);
    setFormCountry(port.country);
    setFormCountryCode(port.countryCode);
    setFormMode(port.mode);
    setFormStatus(port.status);
    setFormThcRate(port.thcRate);
    setFormTransitHub(port.transitHub);
    setFormActiveLines(port.activeLines);
    setFormNotes(port.notes || "");
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) {
      alert("Veuillez saisir le nom du port et son code UN/LOCODE.");
      return;
    }

    addPort({
      name: formName,
      code: formCode.toUpperCase(),
      country: formCountry,
      countryCode: formCountryCode,
      mode: formMode,
      status: formStatus,
      thcRate: formThcRate,
      transitHub: formTransitHub,
      activeLines: formActiveLines,
      notes: formNotes,
    });

    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPort) return;

    updatePort(editingPort.id, {
      name: formName,
      code: formCode.toUpperCase(),
      country: formCountry,
      countryCode: formCountryCode,
      mode: formMode,
      status: formStatus,
      thcRate: formThcRate,
      transitHub: formTransitHub,
      activeLines: formActiveLines,
      notes: formNotes,
    });

    setEditingPort(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le port « ${name} » ?`)) {
      deletePort(id);
    }
  };

  // Filtered list
  const filteredPorts = ports.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchMode = modeFilter === "ALL" || p.mode === modeFilter;
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchSearch && matchMode && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009FE3] bg-[#009FE3]/10 px-2.5 py-1 rounded-full">
            Infrastructure & Réseau Mondial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] mt-1">
            Gestion des Ports, Aéroports & Hubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configurez les terminaux portuaires, les frais de manutention THC et les statuts opérationnels qui alimentent le calculateur client.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#009FE3] to-[#006FA3] hover:from-[#008bc7] hover:to-[#005f8c] text-white text-xs font-bold shadow-md shadow-[#009FE3]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Port / Terminal</span>
        </button>
      </div>

      {/* Top Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom (ex: Tanger Med), code UN/LOCODE, pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#009FE3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Type :</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">Tous ({ports.length})</option>
              <option value="maritime">Maritime ({ports.filter(p => p.mode === "maritime").length})</option>
              <option value="aerien">Aérien ({ports.filter(p => p.mode === "aerien").length})</option>
              <option value="routier">Routier ({ports.filter(p => p.mode === "routier").length})</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Statut :</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="actif">Actif (Fluide)</option>
              <option value="congestion">Congestion / Travaux</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ports Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Port / Hub</th>
                <th className="py-3.5 px-4">Code UN/LOCODE</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Pays & Zone</th>
                <th className="py-3.5 px-4">Frais THC / Manutention</th>
                <th className="py-3.5 px-4">Lignes Actives</th>
                <th className="py-3.5 px-4">Statut Opérationnel</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPorts.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{p.countryCode}</span>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                          {p.notes && (
                            <p className="text-[10px] text-amber-600 font-medium">{p.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-800">
                        {p.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        {p.mode === "maritime" && <Ship className="w-4 h-4 text-blue-500" />}
                        {p.mode === "routier" && <Truck className="w-4 h-4 text-emerald-500" />}
                        {p.mode === "aerien" && <Plane className="w-4 h-4 text-purple-500" />}
                        <span className="capitalize">{p.mode}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{p.country}</p>
                      <p className="text-[10px] text-slate-400">{p.transitHub}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {p.mode === "aerien" ? `${p.thcRate} € / expéd.` : formatPrice(p.thcRate)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {p.activeLines} lignes
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => togglePortStatus(p.id, p.status === "actif" ? "congestion" : "actif")}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                          p.status === "actif"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                        title="Cliquez pour basculer le statut"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === "actif" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span>{p.status === "actif" ? "Actif (Fluide)" : "Congestion"}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Port */}
      <AnimatePresence>
        {showAddModal && (
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
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 my-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Ajouter un Port / Hub Logistique
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAdd} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nom du Port <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Gênes Port / Genoa"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Code UN/LOCODE <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: ITGOA"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      className="input-premium font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Type de Transport</label>
                    <select
                      value={formMode}
                      onChange={(e) => setFormMode(e.target.value as TransportMode)}
                      className="input-premium"
                    >
                      <option value="maritime">Maritime</option>
                      <option value="aerien">Aérien</option>
                      <option value="routier">Routier</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Pays</label>
                    <input
                      type="text"
                      value={formCountry}
                      onChange={(e) => setFormCountry(e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Drapeau (Emoji)</label>
                    <input
                      type="text"
                      value={formCountryCode}
                      onChange={(e) => setFormCountryCode(e.target.value)}
                      className="input-premium text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Frais THC / Manutention (€)</label>
                    <input
                      type="number"
                      value={formThcRate}
                      onChange={(e) => setFormThcRate(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Lignes actives régulières</label>
                    <input
                      type="number"
                      value={formActiveLines}
                      onChange={(e) => setFormActiveLines(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Zone / Hub Géographique</label>
                  <input
                    type="text"
                    value={formTransitHub}
                    onChange={(e) => setFormTransitHub(e.target.value)}
                    placeholder="Ex: Méditerranée Nord"
                    className="input-premium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Notes & Alertes Opérationnelles</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ex: Travaux d'extension quai Est"
                    className="input-premium"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#009FE3] hover:bg-[#008bc7] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Enregistrer le Port
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Port */}
      <AnimatePresence>
        {editingPort && (
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
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 my-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Modifier le Port {editingPort.code}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPort(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nom du Port</label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Code UN/LOCODE</label>
                    <input
                      required
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      className="input-premium font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Frais THC / Manutention (€)</label>
                    <input
                      type="number"
                      value={formThcRate}
                      onChange={(e) => setFormThcRate(Number(e.target.value))}
                      className="input-premium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Statut Opérationnel</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as PortStatus)}
                      className="input-premium"
                    >
                      <option value="actif">Actif (Fluide)</option>
                      <option value="congestion">Congestionné / En Travaux</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Notes & Alertes Opérationnelles</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ex: Retard moyen +2 jours"
                    className="input-premium"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPort(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#009FE3] hover:bg-[#008bc7] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Mettre à jour
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

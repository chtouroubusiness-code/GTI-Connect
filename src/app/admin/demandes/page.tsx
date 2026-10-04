"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Eye, Ship, Plane, Truck,
  ChevronDown, Download, Plus
} from "lucide-react";
import Link from "next/link";

const ALL_REQUESTS = [
  { ref: "GTI-2026-127", client: "ABC Company", from: "Rades", to: "Marseille", mode: "Maritime", date: "04/10/2026", status: "Nouveau", container: "40HC" },
  { ref: "GTI-2026-126", client: "Tech Logistics", from: "Shanghai", to: "Rades", mode: "Maritime", date: "04/10/2026", status: "En cours", container: "40FT" },
  { ref: "GTI-2026-125", client: "Global Freight", from: "Tunis", to: "Paris CDG", mode: "Aérien", date: "03/10/2026", status: "Devis envoyé", container: "Cargo" },
  { ref: "GTI-2026-124", client: "Ocean Trade", from: "Istanbul", to: "Rades", mode: "Routier", date: "03/10/2026", status: "Gagné", container: "Groupage" },
  { ref: "GTI-2026-123", client: "Mediterranean Import", from: "Gênes", to: "Rades", mode: "Maritime", date: "02/10/2026", status: "Nouveau", container: "LCL" },
  { ref: "GTI-2026-122", client: "Euro Trans SARL", from: "Lyon", to: "Tunis", mode: "Routier", date: "02/10/2026", status: "En cours", container: "Groupage" },
  { ref: "GTI-2026-121", client: "Afrique Commerce", from: "Rades", to: "Barcelone", mode: "Maritime", date: "01/10/2026", status: "Gagné", container: "20FT" },
  { ref: "GTI-2026-120", client: "Import Direct Co.", from: "Hong Kong", to: "Tunis", mode: "Aérien", date: "01/10/2026", status: "Perdu", container: "Express" },
  { ref: "GTI-2026-119", client: "Fast Cargo TN", from: "Rades", to: "Gênes", mode: "Maritime", date: "30/09/2026", status: "Devis envoyé", container: "40HC" },
  { ref: "GTI-2026-118", client: "Nord Logistics", from: "Sfax", to: "Marseille", mode: "Maritime", date: "29/09/2026", status: "Gagné", container: "20FT" },
];

const statusStyles: Record<string, string> = {
  "Nouveau": "badge-new",
  "En cours": "badge-progress",
  "Devis envoyé": "badge-sent",
  "Gagné": "badge-won",
  "Perdu": "badge-lost",
};

const modeIcon: Record<string, React.FC<{ className?: string }>> = {
  Maritime: Ship, Aérien: Plane, Routier: Truck,
};

export default function DemandesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const filtered = ALL_REQUESTS.filter(r => {
    const matchSearch = search === "" || r.client.toLowerCase().includes(search.toLowerCase()) || r.ref.includes(search);
    const matchStatus = statusFilter === "Tous" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Demandes de transport</h1>
          <p className="text-gray-400 text-sm">{filtered.length} demande(s) trouvée(s)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Exporter
          </button>
          <button className="px-4 py-2 text-sm text-white rounded-xl flex items-center gap-2" style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}>
            <Plus className="w-4 h-4" /> Nouvelle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Rechercher par client ou référence..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Tous", "Nouveau", "En cours", "Devis envoyé", "Gagné", "Perdu"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                statusFilter === s
                  ? "text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              style={statusFilter === s ? { background: "linear-gradient(135deg, #009FE3, #006FA3)" } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Référence", "Client", "Port chargement", "Port arrivée", "Mode", "Conteneur", "Date", "Statut", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">{h}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ ref, client, from, to, mode, date, status, container }, i) => {
                const ModeIcon = modeIcon[mode] || Ship;
                return (
                  <motion.tr
                    key={ref}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-[#009FE3] font-semibold">{ref}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#0F172A]">{client}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{from}</td>
                    <td className="px-4 py-3.5 text-gray-500">{to}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <ModeIcon className="w-3.5 h-3.5 text-[#009FE3]" />
                        <span className="text-gray-600">{mode}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{container}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">{date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/demandes/${ref}`}
                        className="flex items-center gap-1 text-[#009FE3] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Affichage de {filtered.length} sur {ALL_REQUESTS.length} demandes</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === 1 ? "text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                style={p === 1 ? { background: "linear-gradient(135deg, #009FE3, #006FA3)" } : {}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

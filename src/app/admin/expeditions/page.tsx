"use client";
import React, { useState } from "react";
import {
  Ship, Plane, Truck, Search, Plus, CheckCircle2,
  Clock, MapPin, Calendar, User, Eye, Edit2, Check
} from "lucide-react";
import { useGTI, ShipmentItem } from "@/lib/store";

export default function AdminExpeditionsPage() {
  const { shipments, formatPrice } = useGTI();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = shipments.filter(s => {
    const matchSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
            Opérations Navires &amp; Flotte
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
            Expéditions &amp; Fret en Transit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Supervision en direct des navires, réservations d&apos;espace et livraisons conteneurs.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par N° tracking, client, port..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#009DFF]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tous ({shipments.length})</option>
            <option value="EN_MER">En Mer (Maritime)</option>
            <option value="EN_ROUTE">En Route (Routier)</option>
            <option value="LIVRE">Livrés</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">N° Tracking GTI</th>
                <th className="py-3.5 px-4">Chargeur / Entreprise</th>
                <th className="py-3.5 px-4">Corridor &amp; Mode</th>
                <th className="py-3.5 px-4">Navire / Transporteur</th>
                <th className="py-3.5 px-4">Conteneur N°</th>
                <th className="py-3.5 px-4">ETA Estimée</th>
                <th className="py-3.5 px-4">Statut Opérationnel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-[#002B5B]">{s.trackingNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.clientCompany}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {s.mode === "maritime" && <Ship className="w-3.5 h-3.5 text-[#009DFF]" />}
                      {s.mode === "routier" && <Truck className="w-3.5 h-3.5 text-[#00D084]" />}
                      {s.mode === "aerien" && <Plane className="w-3.5 h-3.5 text-purple-500" />}
                      <span>{s.origin} → {s.destination}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{s.vesselName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{s.containerNumber || "Assignation"}</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#00D084]">{s.eta}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      s.status === "EN_MER" || s.status === "EN_ROUTE"
                        ? "bg-blue-100 text-[#002B5B] border border-blue-200"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                      {s.status === "EN_MER" && "🚢 En Mer"}
                      {s.status === "EN_ROUTE" && "🚛 En Route"}
                      {s.status === "LIVRE" && "🏁 Livré & Dédouané"}
                    </span>
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

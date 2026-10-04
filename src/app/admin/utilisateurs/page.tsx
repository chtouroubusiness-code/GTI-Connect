"use client";
import React, { useState } from "react";
import {
  UserCheck, Plus, Mail, Phone, Shield, Check,
  Search, MoreHorizontal, User
} from "lucide-react";

export default function AdminUtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const USERS = [
    { id: 1, name: "Faiez Hentati", email: "f.hentati@gti-transport.com", phone: "+212 6 61 00 00 00", role: "Responsable Commercial (Administrateur)", department: "Console GTI — Validation Devis & Gestion Ports", status: "Actif", quotesManaged: 84 },
    { id: 2, name: "Sarah Lamrani", email: "s.lamrani@gti-logistics.com", phone: "+212 6 62 10 33 44", role: "Commerciale Senior Fret Maritime", department: "Lignes Asie & Méditerranée", status: "Actif", quotesManaged: 62 },
    { id: 3, name: "Youssef Berrada", email: "y.berrada@gti-logistics.com", phone: "+212 6 70 88 11 22", role: "Déclarant en Douane Agréé (BADR)", department: "Transit Portuaire Casablanca & Tanger", status: "Actif", quotesManaged: 110 },
    { id: 4, name: "Mehdi Tazi", email: "m.tazi@gti-logistics.com", phone: "+212 6 64 90 22 11", role: "Responsable Lignes TIR Europe", department: "Affrètement Routier", status: "Actif", quotesManaged: 45 },
    { id: 5, name: "Houda Alami", email: "h.alami@gti-logistics.com", phone: "+212 6 65 30 40 50", role: "Coordinatrice Fret Aérien & Pharma", department: "Cargo Express CMN / CDG", status: "Actif", quotesManaged: 38 },
  ];

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#009DFF] bg-[#009DFF]/10 px-2.5 py-0.5 rounded-full">
            Équipe Commerciale &amp; Transit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans'] mt-1">
            Utilisateurs &amp; Déclarants Agréés
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {USERS.length} collaborateurs avec accès aux cotations, déclarations douanières PortNet et validation des ordres.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#002B5B] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                {user.status}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#002B5B]">{user.name}</h3>
              <p className="text-xs font-bold text-[#009DFF]">{user.role}</p>
              <p className="text-[11px] text-slate-400">{user.department}</p>
            </div>

            <div className="space-y-1 text-xs text-slate-600 bg-[#F5F7FA] p-3 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Dossiers gérés :</span>
              <strong className="text-[#002B5B] font-extrabold">{user.quotesManaged} cotations</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Phone, Mail, Ship, MapPin, MoreHorizontal,
  Building2, Calendar, TrendingUp, Eye, CheckCircle2, User,
  DollarSign, FileText, ChevronRight
} from "lucide-react";
import { useGTI, ClientCompany } from "@/lib/store";

export default function ClientsPage() {
  const { clients, quotes, formatPrice } = useGTI();
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientCompany | null>(null);

  const filtered = clients.filter(c =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#009FE3] bg-[#009FE3]/10 px-2.5 py-1 rounded-full">
            CRM & Compte Chargeurs
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] mt-1">
            Répertoire des Chargeurs & Clients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {clients.length} comptes entreprises enregistrés avec historique des cotations et réservations.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Rechercher une entreprise, un contact, un email ou une ville..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#009FE3] transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Client cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client, i) => {
          const clientQuotes = quotes.filter(q => q.clientCompany.toLowerCase() === client.name.toLowerCase() || q.clientEmail.toLowerCase() === client.email.toLowerCase());
          const totalSpent = clientQuotes.reduce((acc, q) => acc + (q.adminAdjustedPriceEur || q.totalHtEur), 0);

          return (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                  {client.name.charAt(0)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  client.status === "VIP"
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : client.status === "Actif"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {client.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{client.name}</h3>
                <p className="text-slate-400 text-xs">{client.contactPerson} • {client.sector}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{client.city}, {client.country}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-slate-400 text-[10px]">Devis Soumis</p>
                  <p className="text-sm font-extrabold text-slate-900">{clientQuotes.length || client.totalQuotes}</p>
                </div>
                <div className="bg-blue-50/70 rounded-xl p-2 border border-blue-100">
                  <p className="text-slate-400 text-[10px]">CA Coté</p>
                  <p className="text-sm font-extrabold text-[#006FA3]">{formatPrice(totalSpent)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

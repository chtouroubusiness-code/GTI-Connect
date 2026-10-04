"use client";
import { motion } from "framer-motion";
import {
  Ship, ArrowLeft, MessageSquare, Mail, FileDown, Send,
  Clock, CheckCircle2, User, Package, FileText, Paperclip,
  Phone, Building2, MapPin, Calendar
} from "lucide-react";
import Link from "next/link";

const request = {
  ref: "GTI-2026-001",
  client: "ABC Company",
  contact: "Mohamed Ben Ali",
  email: "m.benali@abc-company.tn",
  phone: "+216 71 234 567",
  from: "Rades (Tunis)",
  to: "Marseille",
  mode: "Maritime",
  container: "40HC",
  weight: "18 500 kg",
  volume: "67 CBM",
  value: "85 000 €",
  description: "Pièces automobiles – Huiles lubrifiantes & filtres",
  services: ["Assurance", "Dédouanement", "Transit douanier"],
  status: "Nouveau",
  date: "04/10/2026",
  estimatedPrice: "950 €",
  estimatedTime: "4 à 6 jours",
};

const history = [
  { time: "14:32", date: "04/10/2026", action: "Demande reçue", user: "Système", type: "system" },
  { time: "14:45", date: "04/10/2026", action: "Assignée à Faiez Hentati", user: "Système", type: "system" },
  { time: "15:10", date: "04/10/2026", action: "Premier contact client effectué", user: "Faiez Hentati", type: "user" },
  { time: "15:30", date: "04/10/2026", action: "Documents reçus et vérifiés", user: "Faiez Hentati", type: "user" },
];

const comments = [
  { author: "Faiez Hentati", time: "15:10", text: "Client sérieux, déjà travaillé avec nous en 2025. Demande régulière mensuelle. Priorité haute.", avatar: "FH" },
  { author: "Sonia Mejri", time: "15:25", text: "Espace disponible sur le départ du 08/10. J'ai réservé une place provisoire.", avatar: "SM" },
];

export default function DemandeDetailPage() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/demandes" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#0F172A]">{request.ref}</h1>
              <span className="badge-new px-3 py-1 rounded-full text-xs font-semibold">{request.status}</span>
            </div>
            <p className="text-gray-400 text-sm">{request.client} · {request.date}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4" /> Email
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <FileDown className="w-4 h-4" /> PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl" style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}>
            <Send className="w-4 h-4" /> Créer devis
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Client info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#009FE3]" /> Informations client
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Société", value: request.client, icon: Building2 },
                { label: "Contact", value: request.contact, icon: User },
                { label: "Email", value: request.email, icon: Mail },
                { label: "Téléphone", value: request.phone, icon: Phone },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Icon className="w-4 h-4 text-[#009FE3] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-[#0F172A]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cargo info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#009FE3]" /> Détails du cargo
            </h2>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Mode", value: request.mode },
                { label: "Conteneur", value: request.container },
                { label: "Route", value: `${request.from} → ${request.to}` },
                { label: "Poids", value: request.weight },
                { label: "Volume", value: request.volume },
                { label: "Valeur", value: request.value },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-[#0F172A]">{value}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-400 mb-1">Description marchandise</p>
              <p className="text-sm text-[#0F172A]">{request.description}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="text-xs text-gray-400 w-full">Services demandés</p>
              {request.services.map(s => (
                <span key={s} className="px-3 py-1 bg-[#009FE3]/10 text-[#009FE3] text-xs font-semibold rounded-full border border-[#009FE3]/20">
                  ✓ {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#009FE3]" /> Documents
            </h2>
            <div className="space-y-2">
              {[
                { name: "Facture_ABC_Oct2026.pdf", size: "1.2 MB", type: "PDF" },
                { name: "PackingList_Conteneur.xlsx", size: "430 KB", type: "XLSX" },
                { name: "Photos_Cargo_001.jpg", size: "3.8 MB", type: "IMG" },
              ].map(({ name, size, type }) => (
                <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-[10px] font-bold">
                      {type}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{name}</p>
                      <p className="text-xs text-gray-400">{size}</p>
                    </div>
                  </div>
                  <button className="text-[#009FE3] text-xs font-medium hover:underline">Télécharger</button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#009FE3]" /> Commentaires commerciaux
            </h2>
            <div className="space-y-3 mb-4">
              {comments.map(({ author, time, text, avatar }) => (
                <div key={author + time} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-[#0F172A]">{author}</p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </div>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
              <div className="flex-1 flex gap-2">
                <input placeholder="Ajouter un commentaire..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#009FE3] transition-colors" />
                <button className="px-3 py-2 text-white rounded-xl text-sm" style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Estimation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F172A, #006FA3)" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Ship className="w-8 h-8 text-white/40 mb-3" />
            <p className="text-white/60 text-sm mb-1">Prix estimatif</p>
            <p className="text-4xl font-bold">{request.estimatedPrice}</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-[#00C2FF]" />
              <p className="text-white/70 text-sm">{request.estimatedTime}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">{request.from}</span>
                <Ship className="w-4 h-4 text-[#00C2FF]" />
                <span className="text-white/60 text-sm">{request.to}</span>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#009FE3]" /> Historique
            </h2>
            <div className="space-y-3">
              {history.map(({ time, action, user, type }, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    type === "user" ? "bg-gradient-to-br from-[#009FE3] to-[#006FA3]" : "bg-gray-100"
                  }`}>
                    {type === "user"
                      ? <User className="w-3 h-3 text-white" />
                      : <CheckCircle2 className="w-3 h-3 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#0F172A] font-medium">{action}</p>
                    <p className="text-xs text-gray-400">{user} · {time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-[#0F172A] mb-3 text-sm">Actions rapides</h2>
            <div className="space-y-2">
              {[
                { label: "Créer un devis", icon: FileText, primary: true },
                { label: "Envoyer sur WhatsApp", icon: MessageSquare, color: "bg-green-50 text-green-600" },
                { label: "Envoyer par email", icon: Mail, color: "bg-blue-50 text-blue-600" },
                { label: "Télécharger PDF", icon: FileDown, color: "bg-gray-50 text-gray-600" },
              ].map(({ label, icon: Icon, primary, color }) => (
                <button
                  key={label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    primary
                      ? "text-white hover:opacity-90"
                      : `${color} hover:opacity-80`
                  }`}
                  style={primary ? { background: "linear-gradient(135deg, #009FE3, #006FA3)" } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

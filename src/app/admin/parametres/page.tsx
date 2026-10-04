"use client";
import { motion } from "framer-motion";
import {
  User, Building2, Bell, Shield, Globe2, Palette,
  Mail, Phone, MapPin, Save, Camera
} from "lucide-react";

export default function ParametresPage() {
  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0F172A]">Paramètres</h1>
        <p className="text-gray-400 text-sm">Gérer les paramètres de l&apos;espace commercial</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-5"
      >
        <h2 className="font-bold text-[#0F172A] mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-[#009FE3]" /> Profil commercial
        </h2>
        <div className="flex items-start gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#0A2342] flex items-center justify-center text-white text-2xl font-bold">
              FH
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0057D9] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A]">Faiez Hentati</h3>
            <p className="text-sm text-gray-500">Responsable Commercial GTI</p>
            <p className="text-xs text-gray-400 mt-1">Administrateur Unique • Console GTI</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Nom complet", value: "Faiez Hentati", icon: User },
            { label: "Email", value: "f.hentati@gti-transport.com", icon: Mail },
            { label: "Téléphone", value: "+212 6 61 00 00 00", icon: Phone },
            { label: "Bureau", value: "Siège GTI Casablanca, Maroc", icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label}>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{label}</label>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-300" />
                <input defaultValue={value} className="input-premium" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Company */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-5"
      >
        <h2 className="font-bold text-[#0F172A] mb-5 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#009FE3]" /> Société
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Nom de la société</label>
            <input defaultValue="General Transport International" className="input-premium" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Matricule fiscal</label>
            <input defaultValue="1234567/A/M/000" className="input-premium" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Adresse</label>
            <input defaultValue="Zone Portuaire, Rades, 2040" className="input-premium" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Site web</label>
            <input defaultValue="www.gti-transport.tn" className="input-premium" />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-5"
      >
        <h2 className="font-bold text-[#0F172A] mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#009FE3]" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: "Nouvelle demande de devis", desc: "Recevoir une notification quand une nouvelle demande arrive", on: true },
            { label: "Devis accepté", desc: "Être notifié quand un client accepte un devis", on: true },
            { label: "Nouveau message client", desc: "Recevoir les messages clients en temps réel", on: true },
            { label: "Rappels de suivi", desc: "Rappels automatiques pour les leads sans réponse", on: false },
            { label: "Résumé hebdomadaire", desc: "Recevoir un rapport d'activité chaque lundi", on: true },
          ].map(({ label, desc, on }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={on} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#009FE3] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-6 py-3 text-sm text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}
        >
          <Save className="w-4 h-4" /> Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

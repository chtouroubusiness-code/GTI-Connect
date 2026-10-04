"use client";
import React, { useState } from "react";
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2,
  Building2, Globe, ShieldCheck
} from "lucide-react";
import NavbarPublic from "@/components/NavbarPublic";
import FooterPublic from "@/components/FooterPublic";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Demande de cotation grand compte");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const AGENCIES = [
    {
      city: "Casablanca (Siège Social)",
      country: "Maroc 🇲🇦",
      address: "45 Boulevard d'Anfa, Immeuble Horizon, 4ème étage",
      phone: "+212 5 22 40 50 60",
      email: "casa@gti-logistics.com",
      role: "Direction Générale & Pôle Affrètement Maritime",
    },
    {
      city: "Tanger Med Hub",
      country: "Maroc 🇲🇦",
      address: "Zone Franche Logistique Medhub, Bâtiment C1",
      phone: "+212 5 39 30 11 22",
      email: "tangermed@gti-logistics.com",
      role: "Plateforme Transbordement & Transit Routier TIR",
    },
    {
      city: "Marseille Fos",
      country: "France 🇫🇷",
      address: "12 Quai de la Joliette, 13002 Marseille",
      phone: "+33 4 91 22 33 44",
      email: "marseille@gti-logistics.com",
      role: "Bureau de Liaison Méditerranée & Douane Europe",
    },
    {
      city: "Paris Roissy CDG",
      country: "France 🇫🇷",
      address: "Zone Fret 4, Rue du Pavé, 95700 Roissy-en-France",
      phone: "+33 1 48 62 70 00",
      email: "paris@gti-logistics.com",
      role: "Hub Fret Aérien Express & Colis Pharma",
    },
    {
      city: "Shanghai Bureau",
      country: "Chine 🇨🇳",
      address: "Century Avenue, Pudong New Area, Shanghai",
      phone: "+86 21 6888 9900",
      email: "china@gti-logistics.com",
      role: "Coordination Empotage Usines & Inspection Qualité",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <NavbarPublic />

      {/* Header */}
      <section className="bg-[#002B5B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D084] bg-white/10 px-3 py-1 rounded-full">
            Assistance & Agences
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans']">
            Contactez les Équipes GTI Connect
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Une présence locale et des conseillers spécialisés dans chaque grand hub portuaire et aéroportuaire.
          </p>
        </div>
      </section>

      {/* Main Content: Agencies + Contact Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
                Envoyez-nous un Message
              </h3>
              <p className="text-xs text-slate-500">
                Nos commissionnaires de transport vous répondent sous 15 minutes pendant les heures d&apos;ouverture.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00D084] mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Message Transmis avec Succès</h4>
                <p className="text-xs text-slate-600">
                  Merci {name}, votre demande a été assignée à notre pôle commercial. Un conseiller vous contactera par email ou téléphone sous peu.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Nom & Prénom <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Tariq Benjelloun"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-premium text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Téléphone <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="tel"
                      placeholder="+212 6 61 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-premium text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Professionnel <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="email"
                    placeholder="tariq@entreprise.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Objet de votre demande</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-premium text-xs font-semibold"
                  >
                    <option value="Demande de cotation grand compte">Demande de cotation grand compte</option>
                    <option value="Contrat cadre annuel / Volume">Contrat cadre annuel / Volume</option>
                    <option value="Dédouanement spécifique & Conseil fiscal">Dédouanement spécifique & Conseil fiscal</option>
                    <option value="Suivi d'expédition en cours">Suivi d&apos;expédition en cours</option>
                    <option value="Autre demande commerciale">Autre demande commerciale</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Votre Message / Précisions</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Précisez les volumes, les axes de transport souhaités ou votre question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-premium text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full text-xs font-extrabold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma Demande</span>
                </button>
              </form>
            )}

            {/* WhatsApp Callout */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00D084] text-[#002B5B] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs text-[#002B5B]">Besoin d&apos;une réponse instantanée ?</p>
                  <p className="text-[11px] text-slate-600">Contactez directement notre desk WhatsApp commercial.</p>
                </div>
              </div>
              <a
                href="https://wa.me/212661000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#00D084] hover:bg-[#00b371] text-[#002B5B] text-[11px] font-extrabold rounded-xl"
              >
                WhatsApp Direct
              </a>
            </div>
          </div>

          {/* Right Column: Agencies Directory (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-extrabold text-[#002B5B] font-['Plus_Jakarta_Sans']">
              Nos Agences & Bureaux Internationaux
            </h3>

            <div className="space-y-3">
              {AGENCIES.map((agency, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2 hover:border-[#009DFF] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#002B5B]">{agency.city}</h4>
                    <span className="text-xs font-bold text-slate-500">{agency.country}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-[#009DFF]">{agency.role}</p>

                  <div className="space-y-1 text-xs text-slate-600 pt-1">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{agency.address}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-slate-700 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#00D084]" /> {agency.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#009DFF]" /> {agency.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <FooterPublic />
      <MobileBottomNav />
    </div>
  );
}

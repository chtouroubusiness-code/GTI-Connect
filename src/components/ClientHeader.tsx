"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ship, Calculator, Search, Globe, Phone,
  ShieldCheck, ArrowRight, Lock, Clock, Sparkles
} from "lucide-react";
import { useGTI } from "@/lib/store";

export default function ClientHeader() {
  const pathname = usePathname();
  const { quotes, currency, setCurrency } = useGTI();
  const pendingQuotes = quotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION").length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-[#0F172A] text-white text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Réseau GTI Connect : Départs réguliers depuis 18 ports & aéroports mondiaux
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-300">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00C2FF]" />
            Temps de réponse devis : &lt; 15 min
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#00C2FF]" />
            Support Commercial : +212 5 22 40 50 60
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center shadow-md shadow-[#009FE3]/25 group-hover:scale-105 transition-transform">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A] font-['Plus_Jakarta_Sans']">GTI</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#009FE3]/10 text-[#009FE3] border border-[#009FE3]/20">
                Portail Client
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">General Transport International</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              pathname === "/"
                ? "text-[#009FE3] bg-[#009FE3]/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Calculateur de Devis
          </Link>
          <Link
            href="/#suivi"
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Suivi Expédition & Devis
          </Link>
          <Link
            href="/#ports"
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            Lignes & Ports Mondiaux
          </Link>
        </nav>

        {/* Right Action Tools & Admin Switcher */}
        <div className="flex items-center gap-3">
          {/* Currency selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold border border-slate-200">
            {(["EUR", "MAD", "USD"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === curr
                    ? "bg-white text-[#006FA3] shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {curr === "EUR" ? "€ EUR" : curr === "MAD" ? "MAD" : "$ USD"}
              </button>
            ))}
          </div>

          {/* Switch to Admin Platform Button */}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all border border-slate-700 relative group"
          >
            <Lock className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>Console Admin / CRM</span>
            {pendingQuotes > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                {pendingQuotes}
              </span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
}

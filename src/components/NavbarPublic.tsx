"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, Menu, X, ArrowUpRight, Lock, User } from "lucide-react";
import { useGTI } from "@/lib/store";

export default function NavbarPublic() {
  const pathname = usePathname();
  const { quotes, currency, setCurrency } = useGTI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingQuotes = quotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION").length;

  const links = [
    { href: "/", label: "Site Client (Devis & Suivi)" },
    { href: "/reseau", label: "Ports & Hubs" },
    { href: "/contact", label: "Agences & Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0057D9] flex items-center justify-center text-white font-bold">
            <Ship className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#0A2342] font-['Plus_Jakarta_Sans'] block leading-none">
              GTI Connect
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Portail Client Unique</span>
          </div>
        </Link>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? "text-[#0057D9] bg-[#0057D9]/8 font-semibold"
                    : "text-slate-600 hover:text-[#0A2342] hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Currency */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
            {(["EUR", "MAD", "USD"] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                  currency === curr
                    ? "bg-white text-[#0A2342] font-bold shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {curr === "EUR" ? "€" : curr === "MAD" ? "MAD" : "$"}
              </button>
            ))}
          </div>

          {/* Admin CRM Link (Faiez Hentati) */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A2342] hover:bg-[#0057D9] text-white text-xs font-semibold transition-colors relative"
          >
            <Lock className="w-3 h-3 text-[#00C2FF]" />
            <span>Console Admin (Faiez Hentati)</span>
            {pendingQuotes > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF5A5F] text-white text-[9px] font-bold flex items-center justify-center">
                {pendingQuotes}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-medium ${
                pathname === link.href ? "bg-[#0057D9]/10 text-[#0057D9] font-bold" : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <Link
              href="/client"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 text-slate-700"
            >
              Portail Client
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-[#0A2342] text-white"
            >
              CRM Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

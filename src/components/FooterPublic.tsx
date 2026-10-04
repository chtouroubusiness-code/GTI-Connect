"use client";
import Link from "next/link";
import { Ship, Phone, Mail, MapPin, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";

export default function FooterPublic() {
  return (
    <footer className="bg-[#002B5B] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10 text-xs">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009DFF] to-[#00D084] flex items-center justify-center text-white shadow-md">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">GTI Connect</span>
                <p className="text-[11px] text-slate-300">General Transport International</p>
              </div>
            </div>

            <p className="text-slate-300 max-w-sm leading-relaxed">
              Commissionnaire de transport international & transitaire agréé. Spécialiste du fret maritime conteneurisé (FCL/LCL), aérien express et transport routier international TIR.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/212661000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#00D084] hover:bg-[#00b371] text-[#002B5B] font-extrabold text-xs shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Commercial (+212 6 61 00 00 00)</span>
              </a>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <p className="font-extrabold text-sm uppercase tracking-wider text-[#009DFF]">Solutions</p>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Transport Maritime (FCL / LCL)</Link></li>
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Transport Routier TIR (FTL / LTL)</Link></li>
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Fret Aérien Express & Cargo</Link></li>
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Dédouanement en Douane (PortNet / BADR)</Link></li>
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Assurance Marchandises Ad Valorem</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <p className="font-extrabold text-sm uppercase tracking-wider text-[#009DFF]">Plateforme</p>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><Link href="/calculateur" className="hover:text-white transition-colors">Calculateur de Devis Instantané</Link></li>
              <li><Link href="/tracking" className="hover:text-white transition-colors">Suivi Expédition & B/L</Link></li>
              <li><Link href="/reseau" className="hover:text-white transition-colors">Réseau des Ports & Hubs</Link></li>
              <li><Link href="/client" className="hover:text-white transition-colors">Espace Client Chargeur</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Console Commerciale Admin</Link></li>
            </ul>
          </div>

          {/* Col 4: Agences & Contact */}
          <div className="space-y-3">
            <p className="font-extrabold text-sm uppercase tracking-wider text-[#009DFF]">Siège & Agences</p>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#009DFF] flex-shrink-0 mt-0.5" />
                <span>Siège : 45 Boulevard d&apos;Anfa, Casablanca, Maroc</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#009DFF] flex-shrink-0 mt-0.5" />
                <span>Hub Portuaire : Zone Franche Logistique Tanger Med</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#009DFF] flex-shrink-0" />
                <span>+212 5 22 40 50 60</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#009DFF] flex-shrink-0" />
                <span>contact@gti-logistics.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 GTI Connect – General Transport International SA. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Agrément OEA & IATA Certifié</span>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Mentions Légales & CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

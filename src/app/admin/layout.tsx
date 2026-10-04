"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calculator, Users, Ship, Anchor,
  Tags, Receipt, UserCheck, Settings, Menu, X, Bell,
  Search, ChevronDown, ArrowUpRight, Lock
} from "lucide-react";
import { useGTI } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { quotes, currency, setCurrency } = useGTI();

  const pendingCount = quotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION").length;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Calculator, label: "Devis Clients", href: "/admin/devis", badge: pendingCount > 0 ? `${pendingCount}` : undefined },
    { icon: Anchor, label: "Gestion des Ports", href: "/admin/ports" },
    { icon: Tags, label: "Tarifs & Fret", href: "/admin/tarifs" },
    { icon: Ship, label: "Expéditions", href: "/admin/expeditions" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#0A2342]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Slim 220px Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[220px] z-50 lg:static lg:block bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-150 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0057D9] flex items-center justify-center text-white font-extrabold text-xs">
              G
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#0A2342] font-['Plus_Jakarta_Sans'] block leading-none">
                GTI Admin
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Faiez Hentati</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-nav-item ${active ? "active" : ""}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FF5A5F] text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-1 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0057D9] hover:bg-blue-50 font-medium"
          >
            <span>← Voir le Site Client</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-[#0A2342]">Console Commerciale GTI</span>
              <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">Gestion des ports &amp; confirmation des devis</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
              {(["EUR", "MAD", "USD"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-all ${
                    currency === curr ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <Link
              href="/admin/devis"
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 relative"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#FF5A5F] absolute top-1.5 right-1.5" />
              )}
            </Link>

            {/* Profile tag - Faiez Hentati */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-[#0057D9] text-white flex items-center justify-center text-xs font-bold">
                FH
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-[#0A2342] block leading-none">Faiez Hentati</span>
                <span className="text-[10px] text-slate-400">Responsable Commercial</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Ship, User, LogOut,
  Menu, X, Plus, Bell
} from "lucide-react";
import { useGTI } from "@/lib/store";

interface ClientSession {
  email: string;
  name: string;
  company: string;
  loggedIn: boolean;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<ClientSession | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { quotes, currency, setCurrency } = useGTI();

  useEffect(() => {
    const stored = localStorage.getItem("gti_client_session");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.loggedIn) {
        setSession(parsed);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("gti_client_session");
    router.push("/");
  };

  const myQuotes = quotes.filter(q => {
    if (!session) return false;
    return q.clientEmail.toLowerCase() === session.email.toLowerCase() ||
           q.clientCompany.toLowerCase().includes(session.company.toLowerCase().split(" ")[0]);
  });

  const pendingCount = myQuotes.filter(q => q.status === "EN_ATTENTE_CONFIRMATION").length;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/client" },
    { icon: Plus, label: "Nouveau Devis", href: "/client/nouveau-devis" },
    { icon: FileText, label: "Mes Devis", href: "/client/mes-devis", badge: pendingCount > 0 ? `${pendingCount}` : undefined },
    { icon: Ship, label: "Suivi Expéditions", href: "/client/suivi" },
    { icon: User, label: "Mon Profil", href: "/client/profil" },
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

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[240px] z-50 lg:static lg:block bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-150 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <Link href="/client" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0057D9] flex items-center justify-center text-white font-extrabold text-xs">
              <Ship className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#0A2342] font-['Plus_Jakarta_Sans'] block leading-none">
                GTI Connect
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Espace Client</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#0A2342] truncate">{session.company}</p>
          <p className="text-[11px] text-slate-400 truncate">{session.name}</p>
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
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF9F1C] text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#E2E8F0]">
          <button
            onClick={handleLogout}
            className="sidebar-nav-item w-full text-[#FF5A5F] hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 lg:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-[#0A2342]">
              Bienvenue, {session.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
              {(["EUR", "MAD", "USD"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                    currency === c
                      ? "bg-white text-[#0A2342] font-bold shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {c === "EUR" ? "€" : c === "MAD" ? "MAD" : "$"}
                </button>
              ))}
            </div>

            {/* New quote button */}
            <Link
              href="/client/nouveau-devis"
              className="btn-gti text-xs py-2 px-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nouveau Devis</span>
            </Link>
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

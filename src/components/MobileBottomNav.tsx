"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calculator, Search, Globe, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show on admin routes
  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/calculateur", label: "Calculateur", icon: Calculator },
    { href: "/tracking", label: "Suivi", icon: Search },
    { href: "/reseau", label: "Ports", icon: Globe },
    { href: "/client", label: "Client", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
              active
                ? "text-[#009DFF]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

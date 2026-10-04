"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, Menu, X, ChevronDown, Globe, Phone } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "À propos", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/5 border-b border-white/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-800 text-white font-bold tracking-tight">
                  GTI
                </span>
                <p className="text-[10px] text-white/60 leading-none hidden sm:block">
                  General Transport International
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="tel:+21671000000"
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+216 71 000 000</span>
              </a>
              <Link
                href="/devis"
                className="btn-primary text-sm"
              >
                Demander un devis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass-dark border-b border-white/10 md:hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/devis"
                  className="btn-primary w-full justify-center text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

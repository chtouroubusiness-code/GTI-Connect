"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Ship, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("y.mansouri@atlasfruits.ma");
  const [password, setPassword] = useState("demo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulation — pas de vrai backend
    await new Promise((r) => setTimeout(r, 800));

    if (email && password.length >= 4) {
      // Stocker le "client connecté" dans localStorage
      localStorage.setItem("gti_client_session", JSON.stringify({
        email,
        name: email.includes("mansouri") ? "Yassine Mansouri" : email.split("@")[0],
        company: email.includes("atlas") ? "Atlas Fruits & Primeurs" : "Client GTI",
        loggedIn: true,
      }));
      router.push("/client");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A2342] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0057D9]/20 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#0057D9] flex items-center justify-center">
              <Ship className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight font-['Plus_Jakarta_Sans'] block leading-none">
                GTI Connect
              </span>
              <span className="text-[11px] text-slate-400">General Transport International</span>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-6">
            Votre espace<br />transport international<br />
            <span className="text-[#00C2FF]">simplifié.</span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Calculez vos devis de fret, suivez vos expéditions et gérez vos documents
            depuis un seul portail sécurisé.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            {[
              { val: "15 000+", label: "Transports / an" },
              { val: "< 15 min", label: "Réponse garantie" },
              { val: "99.4%", label: "Conformité" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-extrabold text-[#00C2FF]">{s.val}</p>
                <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#0057D9] flex items-center justify-center">
              <Ship className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-[#0A2342] font-['Plus_Jakarta_Sans']">
              GTI Connect
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#0A2342] font-['Plus_Jakarta_Sans']">
              Connexion Client
            </h2>
            <p className="text-sm text-slate-500">
              Accédez à vos devis et au suivi de vos expéditions.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.com"
                className="input-clean text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-clean text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#FF5A5F] font-semibold bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gti w-full py-3.5 text-sm font-bold cursor-pointer"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-[#0057D9]">🔑 Comptes de démonstration</p>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Client 1 :</strong> y.mansouri@atlasfruits.ma / demo2026</p>
              <p><strong>Client 2 :</strong> s.benali@texmed.ma / demo2026</p>
            </div>
          </div>

          {/* Admin link */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400 mb-2">Vous êtes administrateur GTI ?</p>
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9] hover:underline"
            >
              <Lock className="w-3 h-3" />
              <span>Console Admin — Faiez Hentati</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

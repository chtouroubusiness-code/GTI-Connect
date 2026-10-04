"use client";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Ship, Plane, Truck,
  ArrowUpRight, Globe2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, Legend
} from "recharts";

const monthlyData = [
  { month: "Jan", maritime: 45, aerien: 12, routier: 18 },
  { month: "Fév", maritime: 52, aerien: 15, routier: 22 },
  { month: "Mar", maritime: 48, aerien: 18, routier: 25 },
  { month: "Avr", maritime: 61, aerien: 14, routier: 20 },
  { month: "Mai", maritime: 55, aerien: 20, routier: 28 },
  { month: "Jun", maritime: 67, aerien: 22, routier: 30 },
  { month: "Jul", maritime: 73, aerien: 25, routier: 35 },
  { month: "Aoû", maritime: 58, aerien: 19, routier: 27 },
  { month: "Sep", maritime: 70, aerien: 24, routier: 32 },
  { month: "Oct", maritime: 78, aerien: 28, routier: 38 },
];

const modeDistribution = [
  { name: "Maritime", value: 62, color: "#009FE3" },
  { name: "Aérien", value: 18, color: "#8B5CF6" },
  { name: "Routier", value: 20, color: "#F59E0B" },
];

const topDestinations = [
  { name: "Marseille", value: 142, pct: 92 },
  { name: "Gênes", value: 98, pct: 75 },
  { name: "Barcelone", value: 87, pct: 68 },
  { name: "Shanghai", value: 76, pct: 58 },
  { name: "Istanbul", value: 63, pct: 48 },
];

const topClients = [
  { name: "Mediterranean Import", revenue: "91 400 €", requests: 42, trend: "+15%" },
  { name: "Global Freight", revenue: "67 800 €", requests: 31, trend: "+8%" },
  { name: "Import Direct Co.", revenue: "54 700 €", requests: 27, trend: "+22%" },
  { name: "ABC Company", revenue: "42 500 €", requests: 24, trend: "+5%" },
  { name: "Tech Logistics", revenue: "35 200 €", requests: 18, trend: "+12%" },
];

const conversionData = [
  { name: "Leads", value: 127, fill: "#009FE3" },
  { name: "Qualifiés", value: 95, fill: "#006FA3" },
  { name: "Devis", value: 72, fill: "#8B5CF6" },
  { name: "Gagnés", value: 28, fill: "#10B981" },
];

const revenueData = [
  { month: "Jan", ca: 45000 },
  { month: "Fév", ca: 52000 },
  { month: "Mar", ca: 48000 },
  { month: "Avr", ca: 61000 },
  { month: "Mai", ca: 55000 },
  { month: "Jun", ca: 72000 },
  { month: "Jul", ca: 85000 },
  { month: "Aoû", ca: 63000 },
  { month: "Sep", ca: 78000 },
  { month: "Oct", ca: 92000 },
];

export default function StatistiquesPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Statistiques</h1>
        <p className="text-gray-400 text-sm">Analyse complète de l&apos;activité commerciale 2026</p>
      </div>

      {/* Revenue overview */}
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-[#0F172A] text-sm">Chiffre d&apos;affaires simulé</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-[#0F172A]">651 000 €</span>
                <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                  <TrendingUp className="w-3 h-3" /> +24%
                </span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#009FE3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#009FE3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(value: any) => [`${Number(value || 0).toLocaleString()} €`, "CA"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="ca" stroke="#009FE3" strokeWidth={2.5} fill="url(#colorCa)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mode distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Répartition par mode</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={modeDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} strokeWidth={0}>
                {modeDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {modeDistribution.map(({ name, value, color }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-gray-600">{name}</span>
                </div>
                <span className="text-xs font-bold text-[#0F172A]">{value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transport types over time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
      >
        <h2 className="font-bold text-[#0F172A] text-sm mb-5">Demandes par mode de transport</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
            <Bar dataKey="maritime" fill="#009FE3" radius={[4, 4, 0, 0]} name="Maritime" />
            <Bar dataKey="aerien" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Aérien" />
            <Bar dataKey="routier" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Routier" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-3">
          {[
            { label: "Maritime", color: "#009FE3", icon: Ship },
            { label: "Aérien", color: "#8B5CF6", icon: Plane },
            { label: "Routier", color: "#F59E0B", icon: Truck },
          ].map(({ label, color, icon: Icon }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <Icon className="w-3 h-3" style={{ color }} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Top destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <h2 className="font-bold text-[#0F172A] text-sm mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#009FE3]" /> Top destinations
          </h2>
          <div className="space-y-3">
            {topDestinations.map(({ name, value, pct }, i) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-[9px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#0F172A] font-medium">{name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{value} envois</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#009FE3] to-[#00C2FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Top clients</h2>
          <div className="space-y-3">
            {topClients.map(({ name, revenue, requests, trend }, i) => (
              <div key={name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{name}</p>
                  <p className="text-xs text-gray-400">{requests} demandes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#009FE3]">{revenue}</p>
                  <p className="text-[10px] text-green-600 font-medium">{trend}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
        >
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Taux de conversion</h2>
          <div className="space-y-4">
            {conversionData.map(({ name, value, fill }, i) => {
              const prevValue = i > 0 ? conversionData[i - 1].value : value;
              const rate = i > 0 ? Math.round((value / prevValue) * 100) : 100;
              return (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-[#0F172A]">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: fill }}>{value}</span>
                      {i > 0 && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{rate}%</span>
                      )}
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / 127) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <p className="text-xs text-green-700 font-medium">Taux de conversion global</p>
            <p className="text-2xl font-bold text-green-600">22.05%</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

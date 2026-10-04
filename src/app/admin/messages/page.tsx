"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Send, Phone, Paperclip, MoreHorizontal,
  CheckCheck, Clock, User
} from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "Mohamed Ben Ali", company: "ABC Company", lastMsg: "Merci pour le devis, nous revenons vers vous lundi.", time: "14:32", unread: 2, online: true },
  { id: 2, name: "Sami Trabelsi", company: "Tech Logistics", lastMsg: "Le conteneur est-il disponible pour la semaine prochaine ?", time: "13:15", unread: 0, online: false },
  { id: 3, name: "Leila Gharbi", company: "Global Freight", lastMsg: "Pouvez-vous me faire un prix pour 2 conteneurs ?", time: "11:40", unread: 1, online: true },
  { id: 4, name: "Karim Mansouri", company: "Ocean Trade", lastMsg: "Parfait, on signe le contrat demain.", time: "Hier", unread: 0, online: false },
  { id: 5, name: "Yasmine Ferchichi", company: "Mediterranean Import", lastMsg: "Documents envoyés par email.", time: "Hier", unread: 0, online: true },
];

const MESSAGES = [
  { id: 1, from: "client", text: "Bonjour Faiez, j'ai bien reçu le devis DEV-001.", time: "14:20" },
  { id: 2, from: "client", text: "Le prix est correct mais pouvez-vous vérifier la date de départ ?", time: "14:21" },
  { id: 3, from: "me", text: "Bonjour Mohamed ! Bien sûr, je vérifie immédiatement auprès de notre service planning.", time: "14:25", read: true },
  { id: 4, from: "me", text: "Le prochain départ est prévu le 08/10. Nous pouvons réserver une place pour votre conteneur 40HC.", time: "14:28", read: true },
  { id: 5, from: "client", text: "Merci pour le devis, nous revenons vers vous lundi.", time: "14:32" },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversations list */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-bold text-[#0F172A] mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#009FE3] transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv, i) => (
            <div
              key={conv.id}
              onClick={() => setSelected(i)}
              className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 ${
                selected === i ? "bg-blue-50/50 border-l-2 border-l-[#009FE3]" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-sm font-bold">
                  {conv.name.charAt(0)}
                </div>
                {conv.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{conv.name}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{conv.company}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && (
                <span className="self-center px-1.5 py-0.5 min-w-[20px] text-center bg-[#009FE3] text-white text-[10px] font-bold rounded-full">
                  {conv.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {/* Chat header */}
        <div className="h-16 bg-white border-b border-gray-100 px-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center text-white text-sm font-bold">
              {CONVERSATIONS[selected].name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{CONVERSATIONS[selected].name}</p>
              <p className="text-xs text-gray-400">{CONVERSATIONS[selected].company} · {CONVERSATIONS[selected].online ? "En ligne" : "Hors ligne"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><Phone className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="text-center">
            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">Aujourd&apos;hui</span>
          </div>
          {MESSAGES.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.from === "me"
                  ? "text-white rounded-br-sm"
                  : "bg-white shadow-sm text-[#0F172A] rounded-bl-sm"
              }`}
                style={msg.from === "me" ? { background: "linear-gradient(135deg, #009FE3, #006FA3)" } : {}}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${msg.from === "me" ? "justify-end" : ""}`}>
                  <span className={`text-[10px] ${msg.from === "me" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</span>
                  {msg.from === "me" && msg.read && <CheckCheck className="w-3 h-3 text-white/60" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 transition-all"
          />
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

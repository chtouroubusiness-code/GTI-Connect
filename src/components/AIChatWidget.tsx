"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Anchor } from "lucide-react";

type Message = { from: "bot" | "user"; text: string };

const demoMessages: Message[] = [
  { from: "bot", text: "Bonjour 👋 Je suis l'assistant GTI. Je peux vous aider à préparer votre demande de transport international." },
  { from: "bot", text: "Quel est votre port de départ ?" },
];

const autoReplies: Record<string, string> = {
  default: "Merci pour votre réponse ! Un expert GTI va analyser votre demande et vous contacter sous 2h. 📦",
  rades: "Parfait ! Rades est l'un de nos ports principaux. Quel est votre port de destination ?",
  marseille: "Marseille → Rades est une route que nous effectuons plusieurs fois par semaine. Souhaitez-vous un devis pour du FCL ou LCL ?",
  maritime: "Transport maritime sélectionné ✅ Quel type de conteneur souhaitez-vous ? (20FT, 40FT, 40HC, LCL)",
  aérien: "Transport aérien sélectionné ✅ Souhaitez-vous un envoi Express ou Cargo standard ?",
  routier: "Transport routier sélectionné ✅ Livraison nationale ou internationale ?",
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const lowerInput = input.toLowerCase();
    let reply = autoReplies.default;
    for (const key of Object.keys(autoReplies)) {
      if (lowerInput.includes(key)) {
        reply = autoReplies[key];
        break;
      }
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-semibold text-sm pulse-glow"
        style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)", display: open ? "none" : "flex" }}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Besoin d&apos;aide ?</span>
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0F172A, #1a2744)" }} className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center">
                  <Anchor className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Assistant GTI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white/60 text-xs">En ligne</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="bg-[#F8FAFC] h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.from === "bot"
                      ? "bg-gradient-to-br from-[#009FE3] to-[#006FA3]"
                      : "bg-[#0F172A]"
                  }`}>
                    {msg.from === "bot" ? (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "bot"
                        ? "bg-white shadow-sm text-[#0F172A] rounded-tl-sm"
                        : "text-white rounded-tr-sm"
                    }`}
                    style={msg.from === "user" ? { background: "linear-gradient(135deg, #009FE3, #006FA3)" } : {}}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#009FE3] to-[#006FA3] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#009FE3] rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 transition-all"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #009FE3, #006FA3)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

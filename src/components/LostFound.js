import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, Smartphone, Key, Backpack, MapPin, Calendar, MessageCircle } from "lucide-react";

const lost = [
  { icon: Wallet, name: "Brown Leather Wallet", date: "Today", loc: "Library 2F", status: "Lost" },
  { icon: Smartphone, name: "iPhone 14", date: "Yesterday", loc: "Cafeteria", status: "Lost" },
  { icon: Key, name: "Hostel Keys", date: "2 days ago", loc: "Block C", status: "Lost" },
];
const found = [
  { icon: CreditCard, name: "Student ID Card", date: "Today", loc: "Admin Office", status: "Found" },
  { icon: Backpack, name: "Black Backpack", date: "Today", loc: "Sports Hall", status: "Found" },
  { icon: Key, name: "Set of Keys", date: "Yesterday", loc: "Parking", status: "Found" },
];

export default function LostFound() {
  const [tab, setTab] = useState("lost");
  const data = tab === "lost" ? lost : found;
  return (
    <section id="lostfound" className="py-24 bg-gradient-to-b from-transparent via-indigo-50/40 to-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-rose-500">Lost & Found</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Recover what's <span className="text-gradient">rightfully yours</span></h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-2xl glass shadow-soft">
            {[
              { k: "lost", l: "Lost Items" },
              { k: "found", l: "Found Items" },
            ].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition ${tab === t.k ? "bg-grad-primary text-white shadow-glow" : "text-slate-600"}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-3 gap-6">
            {data.map((item, i) => {
              const Icon = item.icon;
              const lostBadge = item.status === "Lost";
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 grid place-items-center">
                      <Icon className="text-slate-700" size={26} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lostBadge ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>{item.status}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg">{item.name}</h3>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Calendar size={14} /> {item.date}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> {item.loc}</div>
                  </div>
                  <button className="mt-5 w-full py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition">
                    <MessageCircle size={16} /> Contact
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Compass, AlertCircle, Wallet, IdCard, Laptop, BookOpen, Calculator, Bike } from "lucide-react";

const floatingCards = [
  { icon: Wallet, label: "Lost Wallet", tag: "Lost", color: "from-rose-500 to-orange-500", x: "5%", y: "8%", delay: 0 },
  { icon: IdCard, label: "Found Student ID", tag: "Found", color: "from-emerald-500 to-teal-500", x: "60%", y: "0%", delay: 0.4 },
  { icon: Laptop, label: "Used Laptop", tag: "$420", color: "from-blue-500 to-indigo-500", x: "70%", y: "55%", delay: 0.8 },
  { icon: BookOpen, label: "Engineering Books", tag: "$25", color: "from-purple-500 to-fuchsia-500", x: "2%", y: "60%", delay: 1.2 },
  { icon: Calculator, label: "Calculator", tag: "$15", color: "from-cyan-500 to-blue-500", x: "38%", y: "78%", delay: 1.6 },
  { icon: Bike, label: "Bicycle", tag: "$120", color: "from-amber-500 to-pink-500", x: "42%", y: "20%", delay: 2.0 },
];

const tabs = ["Products", "Lost Items", "Wanted Requests"];

export default function Hero() {
  const [tab, setTab] = useState(0);

  return (
    <section id="home" className="relative pt-32 pb-24 overflow-hidden">
      {/* gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-slate-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Trusted by 5,000+ university students
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-slate-900">
            Buy, Sell & <span className="text-gradient">Recover</span> Lost Items on Campus
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
            The smartest student marketplace and lost & found platform designed exclusively for university communities.
          </p>

          {/* Search */}
          <div className="mt-8 glass rounded-2xl p-2 shadow-soft">
            <div className="flex gap-1 mb-2 px-1">
              {tabs.map((t, i) => (
                <button key={t} onClick={() => setTab(i)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${tab === i ? "bg-grad-primary text-white shadow" : "text-slate-600 hover:bg-white/60"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-slate-200">
              <Search size={18} className="text-slate-400" />
              <input className="flex-1 outline-none text-sm placeholder:text-slate-400" placeholder={`Search ${tabs[tab].toLowerCase()}...`} />
              <button className="px-4 py-1.5 bg-grad-primary text-white text-xs font-semibold rounded-lg hover:scale-105 transition">Search</button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-grad-primary text-white font-semibold shadow-glow hover:scale-105 transition-all">
              <Compass size={18} /> Explore Marketplace
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 hover:border-primary hover:text-primary transition">
              <AlertCircle size={18} /> Report Lost Item
            </button>
          </div>
        </motion.div>

        {/* Right — floating cards canvas */}
        <div className="relative h-[520px] hidden lg:block">
          <motion.div animate={{ rotate: [0, 4, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute inset-6 rounded-[2.5rem] bg-grad-primary opacity-10 blur-2xl" />
          <div className="absolute inset-0 rounded-[2.5rem] glass shadow-soft" />

          {floatingCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -14, 0] }}
                transition={{ delay: c.delay * 0.2, duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.08, zIndex: 30 }}
                style={{ left: c.x, top: c.y }}
                className="absolute"
              >
                <div className="glass rounded-2xl px-4 py-3 shadow-soft flex items-center gap-3 min-w-[170px]">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center shadow-lg`}>
                    <Icon className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">{c.tag}</div>
                    <div className="text-sm font-semibold text-slate-800">{c.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* particles */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Wallet, CreditCard, Smartphone, Key, Backpack, MapPin, Calendar, MessageCircle, Laptop, BookOpen, HelpCircle } from "lucide-react";

const getItemIcon = (catName) => {
  const name = (catName || "").toLowerCase();
  if (name.includes("wallet") || name.includes("purse")) return Wallet;
  if (name.includes("card") || name.includes("id")) return CreditCard;
  if (name.includes("phone") || name.includes("mobile")) return Smartphone;
  if (name.includes("key")) return Key;
  if (name.includes("bag") || name.includes("backpack")) return Backpack;
  if (name.includes("laptop") || name.includes("computer")) return Laptop;
  if (name.includes("book")) return BookOpen;
  return HelpCircle;
};

export default function LostFound() {
  const [tab, setTab] = useState("lost");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const { student } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch lost items
    axios.get("/lost-items/public")
      .then(res => {
        if (Array.isArray(res.data)) {
          setLostItems(res.data.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to fetch public lost items", err));

    // Fetch found items
    axios.get("/found-items/public")
      .then(res => {
        if (Array.isArray(res.data)) {
          setFoundItems(res.data.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to fetch public found items", err));
  }, []);

  const handleAction = () => {
    if (student) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const data = tab === "lost" ? lostItems : foundItems;

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
            {data.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500 font-medium">
                No items reported as {tab} yet.
              </div>
            ) : (
              data.map((item, i) => {
                const Icon = getItemIcon(item.category?.name);
                const lostBadge = tab === "lost";
                return (
                  <div key={item.id || i} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-glow transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 grid place-items-center overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Icon className="text-slate-700" size={26} />
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${lostBadge ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>{tab}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg">{item.name}</h3>
                      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <div className="flex items-center gap-2"><Calendar size={14} /> {item.date}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} /> {item.location || "On Campus"}</div>
                      </div>
                    </div>
                    <button onClick={handleAction} className="mt-5 w-full py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition">
                      <MessageCircle size={16} /> Contact
                    </button>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Flame, Clock, User } from "lucide-react";

const urgencyColor = {
  High: "bg-rose-100 text-rose-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-emerald-100 text-emerald-600",
  open: "bg-blue-100 text-blue-600"
};

export default function Wanted() {
  const [requests, setRequests] = useState([]);
  const { student } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/wanted-posts/browse")
      .then(res => {
        if (Array.isArray(res.data)) {
          setRequests(res.data.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to load wanted requests", err));
  }, []);

  const handleAction = () => {
    if (student) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="wanted" className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-secondary">Wanted Items</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Students <span className="text-gradient">looking right now</span></h2>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            No active wanted requests posted yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {requests.map((r, i) => {
              const urgency = r.condition || "Medium";
              const badgeClass = urgencyColor[urgency] || urgencyColor["open"];
              return (
                <motion.div key={r.id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="gradient-border p-6 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${badgeClass}`}>
                        <Flame size={11} /> {urgency}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-grad-primary text-white text-xs font-bold">${r.budget || "N/A"}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg mb-3">{r.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{r.description}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-grad-primary grid place-items-center text-white"><User size={14} /></div>
                      {r.user?.name || "Student"}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> Posted recently</span>
                      <button onClick={handleAction} className="text-xs font-bold text-primary hover:underline">Make Offer →</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Flame, Clock, User } from "lucide-react";

const requests = [
  { title: "Looking for Data Structures Book", budget: "$20", urgency: "High", student: "Sarah K. · CS Year 2" },
  { title: "Need Scientific Calculator", budget: "$15", urgency: "Medium", student: "Ali R. · Engg Year 1" },
  { title: "Need Hostel Chair", budget: "$30", urgency: "Low", student: "Maya T. · BBA Year 3" },
];
const urgencyColor = { High: "bg-rose-100 text-rose-600", Medium: "bg-amber-100 text-amber-600", Low: "bg-emerald-100 text-emerald-600" };

export default function Wanted() {
  return (
    <section id="wanted" className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-secondary">Wanted Items</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Students <span className="text-gradient">looking right now</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {requests.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="gradient-border p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${urgencyColor[r.urgency]}`}>
                  <Flame size={11} /> {r.urgency}
                </span>
                <span className="px-3 py-1 rounded-full bg-grad-primary text-white text-xs font-bold">{r.budget}</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-3">{r.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-grad-primary grid place-items-center text-white"><User size={14} /></div>
                {r.student}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> Posted 3h ago</span>
                <button className="text-xs font-bold text-primary hover:underline">Make Offer →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

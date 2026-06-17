import React from "react";
import { motion } from "framer-motion";
import { MapPin, BookOpen, Coffee, Home, School, Car } from "lucide-react";

const pins = [
  { icon: BookOpen, label: "Library", x: "20%", y: "30%", color: "bg-blue-500" },
  { icon: Coffee, label: "Cafeteria", x: "55%", y: "20%", color: "bg-amber-500" },
  { icon: Home, label: "Hostel", x: "75%", y: "55%", color: "bg-purple-500" },
  { icon: School, label: "Classroom Block", x: "35%", y: "65%", color: "bg-emerald-500" },
  { icon: Car, label: "Parking Area", x: "82%", y: "80%", color: "bg-rose-500" },
];

export default function CampusMap() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-accent">Campus Map</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">See where items were <span className="text-gradient">lost or found</span></h2>
        </div>

        <div className="relative rounded-3xl overflow-hidden glass shadow-soft p-2">
          <div className="relative aspect-[16/9] rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 overflow-hidden">
            {/* grid pattern */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(37,99,235,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* roads */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/70 -translate-y-1/2" />
            <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-white/70 -translate-x-1/2" />

            {pins.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} className="absolute" style={{ left: p.x, top: p.y }} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15, type: "spring" }}>
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <span className={`absolute inset-0 ${p.color} rounded-full animate-ping opacity-40`} />
                    <div className={`relative w-12 h-12 ${p.color} rounded-full grid place-items-center shadow-glow ring-4 ring-white`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-white shadow-soft text-xs font-bold text-slate-700 whitespace-nowrap">{p.label}</div>
                  </div>
                </motion.div>
              );
            })}

            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 shadow-soft">
              <MapPin size={14} className="text-primary" /> Campus Live View
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

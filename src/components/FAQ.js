import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How does CampusConnect work?", a: "Sign up with your university email, then browse the marketplace, report a lost item, or post a wanted request. Connect with verified students and complete safely on campus." },
  { q: "Is it only for students?", a: "Yes — every account is verified via official university email so the community remains exclusively for students." },
  { q: "How can I report a lost item?", a: "Tap 'Report Lost Item', describe your belonging, add a photo and location. Our system instantly matches it against found posts and notifies you." },
  { q: "Is buying and selling secure?", a: "Absolutely. Verified profiles, in-app messaging, ratings, and on-campus meetups keep transactions safe and trusted." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-secondary">FAQ</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Questions, <span className="text-gradient">answered</span></h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden border border-slate-200/60">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-display font-bold text-base md:text-lg">{f.q}</span>
                <div className="w-8 h-8 rounded-full bg-grad-primary grid place-items-center text-white shrink-0">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

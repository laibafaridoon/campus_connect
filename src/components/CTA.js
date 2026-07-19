import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-center shadow-glow">
          <div className="absolute inset-0 bg-grad-primary" />
          <motion.div className="absolute -top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" animate={{ x: [0, 80, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity }} />
          <motion.div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/40 rounded-full blur-3xl" animate={{ x: [0, -80, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity }} />

          <div className="relative">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Join Thousands of Students<br className="hidden md:block" /> Using CampusConnect
            </motion.h2>
            <p className="mt-5 text-white/90 max-w-2xl mx-auto text-lg">Buy smarter, sell faster, and recover lost items with ease.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-primary font-bold shadow-soft hover:scale-105 transition" onClick={() => navigate("/register")}>
                Get Started <ArrowRight size={18} />
              </button>
              <button className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/10 border border-white/40 text-white font-bold backdrop-blur hover:bg-white/20 transition" onClick={() => navigate("/login")}>
                <Compass size={18} /> Explore Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

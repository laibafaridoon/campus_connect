import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, MessageSquare, Shield, Filter, Bell, LayoutDashboard, Users } from "lucide-react";

const features = [
  { icon: ShoppingBag, title: "Student Marketplace", desc: "Buy and sell books, gadgets, and essentials directly between verified students." },
  { icon: Search, title: "Lost & Found Tracking", desc: "Report lost items and instantly match with found posts across your campus." },
  { icon: MessageSquare, title: "Wanted Item Requests", desc: "Post what you need — let the campus community come to you with offers." },
  { icon: Shield, title: "Secure Student Authentication", desc: "University-email verification keeps the platform safe and student-only." },
  { icon: Filter, title: "Smart Search & Filters", desc: "Find exactly what you need with category, price, and location filters." },
  { icon: Bell, title: "Real-Time Notifications", desc: "Get alerted the moment someone matches your lost item or wanted request." },
  { icon: LayoutDashboard, title: "Personal Dashboard", desc: "Manage your listings, requests, and conversations in one elegant place." },
  { icon: Users, title: "Campus Community Network", desc: "Connect with peers, build trust, and grow your campus network." },
];

export default function Features() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Features</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Everything your campus needs, <span className="text-gradient">beautifully unified</span></h2>
          <p className="mt-4 text-slate-600">A single platform for trading, recovering, and connecting — built for university life.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="group gradient-border p-6 shadow-soft relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-grad-primary opacity-0 group-hover:opacity-20 blur-2xl transition" />
                <div className="w-12 h-12 rounded-xl bg-grad-primary grid place-items-center shadow-glow mb-4 group-hover:scale-110 transition">
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="font-display font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

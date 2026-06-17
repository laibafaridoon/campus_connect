import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Laptop, Bike, Armchair, Headphones, BadgeCheck } from "lucide-react";

const products = [
  { icon: BookOpen, name: "Programming Books", price: "$30", cat: "Books", color: "from-blue-500 to-indigo-500" },
  { icon: Calculator, name: "Scientific Calculator", price: "$15", cat: "Electronics", color: "from-purple-500 to-fuchsia-500" },
  { icon: Laptop, name: "Gaming Laptop", price: "$650", cat: "Electronics", color: "from-cyan-500 to-blue-500" },
  { icon: Bike, name: "Mountain Bicycle", price: "$120", cat: "Transport", color: "from-emerald-500 to-teal-500" },
  { icon: Armchair, name: "Study Table", price: "$45", cat: "Furniture", color: "from-amber-500 to-orange-500" },
  { icon: Headphones, name: "Wireless Headphones", price: "$80", cat: "Audio", color: "from-pink-500 to-rose-500" },
];

export default function Marketplace() {
  return (
    <section id="marketplace" className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-accent">Marketplace</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Discover what fellow <span className="text-gradient">students are selling</span></h2>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-sm hover:border-primary hover:text-primary transition">View All →</button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 hover:shadow-glow transition-all">
                <div className={`relative aspect-[4/3] bg-gradient-to-br ${p.color} grid place-items-center overflow-hidden`}>
                  <Icon className="text-white/90 group-hover:scale-110 transition-transform duration-500" size={72} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-slate-700 uppercase tracking-wider">{p.cat}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg">{p.name}</h3>
                    <span className="text-lg font-extrabold text-gradient">{p.price}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <BadgeCheck size={14} /> Verified Seller
                    </span>
                    <button className="text-xs font-semibold text-primary hover:underline">Contact →</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

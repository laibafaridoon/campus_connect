import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BookOpen, Calculator, Laptop, Bike, Armchair, Headphones, BadgeCheck, ShoppingBag } from "lucide-react";

const getCategoryIcon = (catName) => {
  const name = (catName || "").toLowerCase();
  if (name.includes("book")) return BookOpen;
  if (name.includes("calc")) return Calculator;
  if (name.includes("laptop") || name.includes("computer")) return Laptop;
  if (name.includes("bike") || name.includes("bicycle") || name.includes("transport")) return Bike;
  if (name.includes("furniture") || name.includes("table") || name.includes("chair")) return Armchair;
  if (name.includes("audio") || name.includes("headphone") || name.includes("music")) return Headphones;
  return ShoppingBag;
};

const colors = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500"
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const { student } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/products/public")
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data.slice(0, 6));
        }
      })
      .catch(err => console.error("Failed to fetch public products", err));
  }, []);

  const handleAction = () => {
    if (student) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="marketplace" className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-accent">Marketplace</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Discover what fellow <span className="text-gradient">students are selling</span></h2>
          </div>
          <button onClick={handleAction} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-sm hover:border-primary hover:text-primary transition">View All →</button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            No products listed in the marketplace yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => {
              const Icon = getCategoryIcon(p.category?.name);
              const color = colors[i % colors.length];
              return (
                <motion.div key={p.id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }} className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 hover:shadow-glow transition-all">
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${color} grid place-items-center overflow-hidden`}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Icon className="text-white/90 group-hover:scale-110 transition-transform duration-500" size={72} />
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-slate-700 uppercase tracking-wider">{p.category?.name || "General"}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg">{p.name}</h3>
                      <span className="text-lg font-extrabold text-gradient">${p.price}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                        <BadgeCheck size={14} /> Verified Seller
                      </span>
                      <button onClick={handleAction} className="text-xs font-semibold text-primary hover:underline">Contact →</button>
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

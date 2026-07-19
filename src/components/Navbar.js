import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const links = [
  { label: "Home", href: "#home" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Lost & Found", href: "#lostfound" },
  { label: "Wanted Items", href: "#wanted" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 shadow-soft backdrop-blur-xl border-b border-slate-200/60" : "bg-white/30 backdrop-blur-md"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-grad-primary grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
            <GraduationCap className="text-white" size={20} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Campus<span className="text-gradient">Connect</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="text-sm font-medium text-slate-700 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-grad-primary after:transition-all hover:after:w-full">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition" onClick={() => navigate("/login")}>Login</button>
          <button className="px-5 py-2.5 text-sm font-semibold text-white bg-grad-primary rounded-xl shadow-glow hover:scale-105 hover:shadow-xl transition-all" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        <button className="lg:hidden p-2 rounded-lg bg-white/70" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="lg:hidden glass border-t border-slate-200/60">
          <div className="px-6 py-5 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-slate-700 font-medium">{l.label}</a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-slate-200">
              <button className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold" onClick={() => { setOpen(false); navigate("/login"); }}>Login</button>
              <button className="flex-1 py-2.5 rounded-xl bg-grad-primary text-white font-semibold" onClick={() => { setOpen(false); navigate("/register"); }}>Register</button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

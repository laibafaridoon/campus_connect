import React from "react";
import { GraduationCap, Mail, Phone, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

const cols = [
  { title: "Platform", links: ["Marketplace", "Lost & Found", "Wanted Items", "About", "Contact"] },
  { title: "Company", links: ["Careers", "Press", "Partners", "Blog", "Help Center"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Security", "Guidelines"] },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-grad-primary grid place-items-center shadow-glow">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="font-display font-bold text-xl text-white">Campus<span className="text-gradient">Connect</span></span>
          </a>
          <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">The smartest student marketplace and lost & found platform designed exclusively for university communities.</p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center gap-2"><Mail size={14} className="text-primary" /> hello@campusconnect.app</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +1 (555) 010-2025</div>
          </div>
          <div className="mt-5 flex gap-3">
            {[Twitter, Instagram, Facebook, Linkedin].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 grid place-items-center hover:bg-grad-primary hover:border-transparent transition">
                <I size={16} />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-display font-bold text-white mb-4">{c.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-slate-400 hover:text-white transition">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} CampusConnect. All rights reserved.</div>
        <div>Made with ♥ for students.</div>
      </div>
    </footer>
  );
}

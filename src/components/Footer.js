import React from "react";
import {
  GraduationCap,
  Mail,
  Phone,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

const cols = [
  {
    title: "Platform",
    links: ["Marketplace", "Lost & Found", "Wanted Items", "About", "Contact"],
  },
  {
    title: "Company",
    links: ["Careers", "Press", "Partners", "Blog", "Help Center"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Security", "Guidelines"],
  },
];

const socialLinks = [
  {
    icon: Twitter,
    url: "https://twitter.com",
  },
  {
    icon: Instagram,
    url: "https://instagram.com",
  },
  {
    icon: Facebook,
    url: "https://facebook.com",
  },
  {
    icon: Linkedin,
    url: "https://linkedin.com",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-5 gap-10">
        {/* Logo Section */}
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-grad-primary grid place-items-center shadow-glow">
              <GraduationCap className="text-white" size={22} />
            </div>

            <span className="font-display font-bold text-xl text-white">
              Campus
              <span className="text-gradient">Connect</span>
            </span>
          </a>

          <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
            The smartest student marketplace and lost & found platform designed
            exclusively for university communities.
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary" />
              hello@campusconnect.app
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary" />
              +1 (555) 010-2025
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-5 flex gap-3">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 grid place-items-center hover:bg-blue-600 hover:border-transparent transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer Columns */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-bold text-white mb-4">
              {col.title}
            </h4>

            <ul className="space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="/"
                    className="text-slate-400 hover:text-white transition duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} CampusConnect. All rights reserved.
        </div>

        <div>Made with ♥ for students.</div>
      </div>
    </footer>
  );
}
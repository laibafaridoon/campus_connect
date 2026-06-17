import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Upload, MessagesSquare, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up with your university email to join your campus community." },
  { icon: Upload, title: "Post Product or Lost Item", desc: "List items for sale, report a lost belonging, or share a found item." },
  { icon: MessagesSquare, title: "Connect with Students", desc: "Chat securely and arrange meetups with verified students nearby." },
  { icon: CheckCircle2, title: "Recover Item or Complete Sale", desc: "Get your item back or finalize your sale — fast, safe, simple." },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-secondary">How it works</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Four steps from <span className="text-gradient">signup to success</span></h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5">
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full bg-grad-primary origin-left" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
                  <div className="relative inline-grid place-items-center w-24 h-24 rounded-3xl bg-white shadow-soft mb-5 z-10">
                    <div className="absolute inset-0 rounded-3xl bg-grad-primary opacity-10" />
                    <Icon className="text-primary" size={32} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-grad-primary text-white text-sm font-bold grid place-items-center shadow-glow">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

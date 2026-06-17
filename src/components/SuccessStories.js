import React from "react";
import { motion } from "framer-motion";
import { Trophy, Laptop, Wallet, BookOpen } from "lucide-react";

const stories = [
  {
    icon: Laptop,
    title: "Lost laptop recovered in 24 hours",
    desc: "A CS student found their MacBook within a single day thanks to instant match alerts.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Wallet,
    title: "Wallet returned successfully",
    desc: "Cash, cards, ID — all returned by a fellow student within hours of being reported lost.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BookOpen,
    title: "Student sold books quickly",
    desc: "A semester's worth of textbooks sold to juniors in less than 48 hours.",
    color: "from-purple-500 to-fuchsia-500",
  },
];

export default function SuccessStories() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-success inline-flex items-center justify-center gap-2">
            <Trophy size={14} />
            Success Stories
          </p>

          <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Real wins, <span className="text-gradient">real students</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="relative bg-white rounded-3xl p-7 shadow-soft border border-slate-100 overflow-hidden"
              >
                <div
                  className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`}
                />

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center shadow-glow mb-5`}
                >
                  <Icon className="text-white" size={24} />
                </div>

                <h3 className="font-display font-bold text-xl leading-tight">
                  {s.title}
                </h3>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>

                <a
                  href="/"
                  className="mt-5 inline-block text-sm font-bold text-primary hover:underline"
                >
                  Read full story →
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
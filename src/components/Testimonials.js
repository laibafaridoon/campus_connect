import React from "react";
import { Star } from "lucide-react";

const reviews = [
  { name: "Aisha Khan", dept: "Computer Science", review: "Found my lost ID within hours. CampusConnect is honestly a lifesaver — every campus needs this." },
  { name: "Daniel Park", dept: "Mechanical Engg", review: "Sold my old textbooks in a single afternoon. The interface feels like Airbnb for students." },
  { name: "Sara Iqbal", dept: "Business", review: "I love how safe it feels — only verified students. Bought a calculator at half the price." },
  { name: "Ravi Mehta", dept: "Electrical Engg", review: "Recovered my wallet from another student the same day. Restored my faith in community." },
  { name: "Emma Wilson", dept: "Architecture", review: "Beautiful design and so easy to use. Wanted requests helped me find a study table fast." },
  { name: "Yusuf Ali", dept: "Mathematics", review: "The notifications are instant. Connected me with someone who found my keys in minutes." },
];

function Card({ r }) {
  return (
    <div className="min-w-[340px] max-w-[340px] glass rounded-2xl p-6 shadow-soft mx-3">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed mb-5">"{r.review}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60">
        <div className="w-11 h-11 rounded-full bg-grad-primary grid place-items-center text-white font-bold">{r.name[0]}</div>
        <div>
          <div className="font-display font-bold text-sm">{r.name}</div>
          <div className="text-xs text-slate-500">{r.dept}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const list = [...reviews, ...reviews];
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center mb-12">
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary">Testimonials</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight">Loved by <span className="text-gradient">students everywhere</span></h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex animate-marquee w-max">
          {list.map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}

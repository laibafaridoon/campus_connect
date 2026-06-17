import React from "react";

const universities = ["Harvard University", "MIT", "Stanford", "Oxford", "Cambridge", "Yale", "Princeton"];

export default function TrustedBy() {
  const list = [...universities, ...universities];
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-slate-500">Trusted by students at</p>
        <div className="relative mt-6 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-12 animate-marquee w-max">
            {list.map((u, i) => (
              <div key={i} className="text-xl md:text-2xl font-display font-bold text-slate-400 grayscale hover:text-gradient hover:grayscale-0 transition whitespace-nowrap">
                {u}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

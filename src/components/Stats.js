import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import axios from "axios";

function Counter({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800; const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  const [data, setData] = useState({
    students: 0,
    products: 0,
    lost_recovered: 0,
    claims: 0
  });

  useEffect(() => {
    axios.get("/public/stats")
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(err => console.error("Failed to load public stats", err));
  }, []);

  const stats = [
    { value: data.students, suffix: "+", label: "Students Registered" },
    { value: data.products, suffix: "+", label: "Products Listed" },
    { value: data.lost_recovered, suffix: "+", label: "Lost Items Recovered" },
    { value: data.claims, suffix: "+", label: "Successful Exchange Claims" },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="glass rounded-3xl p-10 shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-extrabold text-gradient">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm font-medium text-slate-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

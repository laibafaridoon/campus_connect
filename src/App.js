import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import TrustedBy from "./components/TrustedBy";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Marketplace from "./components/Marketplace";
import LostFound from "./components/LostFound";
import Wanted from "./components/Wanted";
import CampusMap from "./components/CampusMap";
import Testimonials from "./components/Testimonials";
import SuccessStories from "./components/SuccessStories";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Portfolio from "./portfolio/Portfolio";
function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-grad-soft">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Marketplace />
        <LostFound />
        <Wanted />
        <CampusMap />
        <Testimonials />
        <SuccessStories />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/laiba" element={<Portfolio />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
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

export default function App() {
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

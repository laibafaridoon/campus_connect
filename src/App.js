import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Existing Landing Page components
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

// Newly Created Pages
import StudentLogin from "./pages/auth/StudentLogin";
import StudentSignup from "./pages/auth/StudentSignup";
import AdminLogin from "./pages/auth/AdminLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Protected Route Component for Students
function StudentProtectedRoute({ children }) {
  const { student, loading } = useAuth();
  if (loading) return <div style={{ padding: "2rem" }}>Verifying session...</div>;
  return student ? children : <Navigate to="/login" replace />;
}

// Protected Route Component for Admins
function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{ padding: "2rem" }}>Verifying admin authorization...</div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />
          <Route path="/laiba" element={<Portfolio />} />
          <Route path="/portfolio" element={<Portfolio />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/register" element={<StudentSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Dashboards */}
          <Route
            path="/dashboard"
            element={
              <StudentProtectedRoute>
                <StudentDashboard />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function StudentLogin() {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { studentLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!regNo.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await studentLogin(regNo, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCap size={22} />
            </div>
            <span>
              Campus<span className="text-gradient">Connect</span>
            </span>
          </Link>
          <h2 className="auth-title">Student Login</h2>
          <p className="auth-subtitle">
            Enter your registration number and password to access dashboard
          </p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="regNo">
              Registration Number
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  display: "flex",
                }}
              >
                <User size={18} />
              </span>
              <input
                id="regNo"
                type="text"
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
                placeholder="e.g. FA20-BCS-000"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  display: "flex",
                }}
              >
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" style={{ marginTop: "1rem" }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/admin/login" className="auth-link" style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Admin Portal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    const result = await adminLogin(username, password);
    setLoading(false);

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon" style={{ background: "linear-gradient(135deg, #0f172a, #334155)" }}>
              <Shield size={20} className="text-white" />
            </div>
            <span>
              Admin<span className="text-gradient">Portal</span>
            </span>
          </Link>
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">
            Enter administrative credentials to access moderation tools
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
            <label className="form-label" htmlFor="username">
              Username
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
                <Shield size={18} />
              </span>
              <input
                id="username"
                type="text"
                className="form-input"
                style={{ paddingLeft: "2.75rem" }}
                placeholder="admin_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            {loading ? "Authorizing..." : "Admin Access"}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link" style={{ fontSize: "0.85rem" }}>
            Return to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}

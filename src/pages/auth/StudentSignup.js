import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

const CAMPUSES = ["Islamabad", "Lahore", "Abbottabad", "Wah", "Attock", "Sahiwal", "Vehari"];
const DEPARTMENTS = ["Computer Science", "Software Engineering", "Electrical Engineering", "Business Administration", "Mathematics", "Physics", "Humanities"];
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    registration_number: "",
    name: "",
    email: "",
    campus: "",
    department: "",
    semester: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { studentRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.registration_number.trim()) errs.registration_number = "Registration number is required.";
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Email is invalid.";
    }
    if (!formData.campus) errs.campus = "Campus is required.";
    if (!formData.department) errs.department = "Department is required.";
    if (!formData.semester) errs.semester = "Semester is required.";
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.password_confirmation) {
      errs.password_confirmation = "Passwords do not match.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccessMsg("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    const result = await studentRegister(formData);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
      setFormData({
        registration_number: "",
        name: "",
        email: "",
        campus: "",
        department: "",
        semester: "",
        password: "",
        password_confirmation: "",
      });
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } else {
      setError(result.message);
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container signup-wide">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon">
              <GraduationCap size={22} />
            </div>
            <span>
              Campus<span className="text-gradient">Connect</span>
            </span>
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Sign up to report lost/found items and access the student marketplace
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

        {successMsg && (
          <div className="auth-success-alert">
            {successMsg} Redirecting to login page...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="registration_number">
                Registration Number
              </label>
              <input
                id="registration_number"
                name="registration_number"
                type="text"
                className="form-input"
                placeholder="e.g. FA20-BCS-000"
                value={formData.registration_number}
                onChange={handleChange}
              />
              {fieldErrors.registration_number && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.registration_number) ? fieldErrors.registration_number[0] : fieldErrors.registration_number}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {fieldErrors.name && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.name) ? fieldErrors.name[0] : fieldErrors.name}
                </span>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="john.doe@student.comsats.edu.pk"
                value={formData.email}
                onChange={handleChange}
              />
              {fieldErrors.email && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.email) ? fieldErrors.email[0] : fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="campus">
                Campus
              </label>
              <select
                id="campus"
                name="campus"
                className="form-input campus-select"
                value={formData.campus}
                onChange={handleChange}
              >
                <option value="">Select Campus</option>
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrors.campus && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.campus) ? fieldErrors.campus[0] : fieldErrors.campus}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="form-input campus-select"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {fieldErrors.department && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.department) ? fieldErrors.department[0] : fieldErrors.department}
                </span>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="semester">
                Semester
              </label>
              <select
                id="semester"
                name="semester"
                className="form-input campus-select"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {fieldErrors.semester && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.semester) ? fieldErrors.semester[0] : fieldErrors.semester}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {fieldErrors.password && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {Array.isArray(fieldErrors.password) ? fieldErrors.password[0] : fieldErrors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password_confirmation">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {fieldErrors.password_confirmation && (
                <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>
                  {fieldErrors.password_confirmation}
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="auth-btn" style={{ marginTop: "1.5rem" }} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

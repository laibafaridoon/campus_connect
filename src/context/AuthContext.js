import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Configure backend API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
axios.defaults.baseURL = API_BASE_URL;

// Add authorization header if token exists
axios.interceptors.request.use(
  (config) => {
    const studentToken = localStorage.getItem("student_token");
    const adminToken = localStorage.getItem("admin_token");
    
    // Choose appropriate token based on route
    if (config.url.startsWith("/admin")) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      if (studentToken) {
        config.headers.Authorization = `Bearer ${studentToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const studentToken = localStorage.getItem("student_token");
      const adminToken = localStorage.getItem("admin_token");

      if (studentToken) {
        try {
          const response = await axios.get("/student/me", {
            headers: { Authorization: `Bearer ${studentToken}` }
          });
          setStudent(response.data.data || response.data);
        } catch (error) {
          console.error("Failed to load student profile:", error);
          localStorage.removeItem("student_token");
          setStudent(null);
        }
      }

      if (adminToken) {
        try {
          const response = await axios.get("/admin/me", {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          setAdmin(response.data.data || response.data);
        } catch (error) {
          console.error("Failed to load admin profile:", error);
          localStorage.removeItem("admin_token");
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Student Authentication Actions
  const studentLogin = async (registration_number, password) => {
    try {
      const response = await axios.post("/student/login", {
        registration_number,
        password,
      });
      const data = response.data;
      localStorage.setItem("student_token", data.token);
      setStudent(data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials or account status.";
      return { success: false, message };
    }
  };

  const studentRegister = async (formData) => {
    try {
      const response = await axios.post("/student/register", formData);
      return { success: true, message: response.data.message || "Registration request submitted. Pending admin approval." };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Check details and try again.";
      const errors = error.response?.data?.errors || null;
      return { success: false, message, errors };
    }
  };

  const studentLogout = () => {
    localStorage.removeItem("student_token");
    setStudent(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Admin Authentication Actions
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post("/admin/login", {
        email: username,
        password,
      });
      const data = response.data;
      localStorage.setItem("admin_token", data.token);
      setAdmin(data.admin);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid Admin credentials.";
      return { success: false, message };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        admin,
        loading,
        studentLogin,
        studentRegister,
        studentLogout,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

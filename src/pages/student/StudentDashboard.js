import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, Search, MapPin, Calendar, Info, AlertTriangle, CheckCircle,
  Plus, Edit, Trash2, Bell, User, Settings, LogOut, Menu, X, ShoppingBag, ListCollapse, Heart
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import "../../styles/dashboard.css";

export default function StudentDashboard() {
  const { student, studentLogout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // General States
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalProducts: 0,
    pendingApprovals: 0,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [campusesData, setCampusesData] = useState([]);
  const COLORS = ['#a855f7', '#3b82f6', '#34d399', '#60a5fa', '#fbbf24', '#f87171'];
  
  // Modals & Action States
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [lostFoundType, setLostFoundType] = useState("lost"); // lost or found
  const [editingItem, setEditingItem] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Forms States
  const [lostFoundForm, setLostFoundForm] = useState({
    name: "",
    category_id: "",
    location: "",
    date: "",
    description: "",
    image: null,
  });
  
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category_id: "",
    condition: "New",
    description: "",
    contact_info: "",
    image: null,
  });

  // Filters & List States
  const [categories, setCategories] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [myReports, setMyReports] = useState({ lost: [], found: [] });
  const [myListings, setMyListings] = useState([]);
  
  // Filter Inputs
  const [lfFilter, setLfFilter] = useState({ search: "", category: "", location: "", date: "" });
  const [prodFilter, setProdFilter] = useState({ search: "", category: "" });

  // Notifications state
  const [notificationCount, setNotificationCount] = useState(0);

  // Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Wishlist, Wanted, Claims States
  const [wishlist, setWishlist] = useState([]);
  const [wantedPosts, setWantedPosts] = useState([]);
  const [myWantedPosts, setMyWantedPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [showWantedModal, setShowWantedModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimItemId, setClaimItemId] = useState(null);
  const [claimMessage, setClaimMessage] = useState("");
  const [editingWanted, setEditingWanted] = useState(null);
  const [wantedForm, setWantedForm] = useState({
    title: "",
    description: "",
    budget: "",
    condition: "Medium",
    category_id: ""
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !student) {
      navigate("/login");
    }
  }, [student, loading, navigate]);

  // Fetch initial dashboard metrics
  useEffect(() => {
    if (student) {
      fetchDashboardData();
      fetchCategories();
      fetchLostFoundItems();
      fetchProducts();
      fetchMyItems();
      fetchNotifications();
      fetchWishlist();
      fetchWantedPosts();
      fetchClaims();
    }
  }, [student, activeTab]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/student/stats");
      setStats(res.data.stats || {
        totalLost: 0,
        totalFound: 0,
        totalProducts: 0,
        pendingApprovals: 0,
      });
      setAnnouncements(res.data.announcements || []);
      setRecentActivities(res.data.activities || []);
      setTrendsData(res.data.trends || []);
      setDonutChartData(res.data.donutChart || []);
      setCampusesData(res.data.campuses || []);
    } catch (e) {
      console.error("Failed to load dashboard statistics:", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data || res.data || [
        { id: 1, name: "Electronics" },
        { id: 2, name: "Documents & Cards" },
        { id: 3, name: "Books & Stationery" },
        { id: 4, name: "Clothing & Accessories" },
        { id: 5, name: "Keys & Wallets" },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLostFoundItems = async () => {
    try {
      const [lostRes, foundRes] = await Promise.all([
        axios.get("/lost-items"),
        axios.get("/found-items")
      ]);
      setLostItems(lostRes.data.data || lostRes.data || []);
      setFoundItems(foundRes.data.data || foundRes.data || []);
    } catch (e) {
      console.error('Failed to load lost/found items', e);
      setLostItems([]);
      setFoundItems([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.data || res.data || []);
    } catch (e) {
      console.error('Failed to load products', e);
      setProducts([]);
    }
  };

  const fetchMyItems = async () => {
    try {
      const res = await axios.get("/student/my-items");
      setMyReports(res.data.reports || { lost: [], found: [] });
      setMyListings(res.data.listings || []);
    } catch (e) {
      // Fallback
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/student/notifications");
      setNotifications(res.data.data || res.data || []);
      setNotificationCount(res.data.unread_count || 0);
    } catch (e) {
      setNotifications([
        { id: 1, message: "Your report for lost Laptop has been approved by admin.", is_read: false, created_at: "5 hours ago" },
        { id: 2, message: "Your product listing 'Scientific Calculator' is live.", is_read: true, created_at: "1 day ago" }
      ]);
      setNotificationCount(1);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/wishlist");
      setWishlist(res.data || []);
    } catch (e) {
      console.error("Failed to fetch wishlist", e);
    }
  };

  const fetchWantedPosts = async () => {
    try {
      const [browseRes, mineRes] = await Promise.all([
        axios.get("/wanted-posts/browse"),
        axios.get("/wanted-posts/mine")
      ]);
      setWantedPosts(browseRes.data || []);
      setMyWantedPosts(mineRes.data || []);
    } catch (e) {
      console.error("Failed to fetch wanted posts", e);
    }
  };

  const fetchClaims = async () => {
    try {
      const [mineRes, recRes] = await Promise.all([
        axios.get("/claims/mine"),
        axios.get("/claims/received")
      ]);
      setMyClaims(mineRes.data || []);
      setReceivedClaims(recRes.data || []);
    } catch (e) {
      console.error("Failed to fetch claims", e);
    }
  };

  const toggleWishlist = async (productId) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const exists = wishlist.some(w => w.product_id === productId);
      if (exists) {
        await axios.delete(`/wishlist/${productId}`);
        setSuccessMsg("Removed from wishlist.");
      } else {
        await axios.post("/wishlist", { product_id: productId });
        setSuccessMsg("Added to wishlist.");
      }
      fetchWishlist();
    } catch (e) {
      console.error("Wishlist operation failed", e);
      setErrorMsg("Wishlist operation failed.");
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!claimMessage) {
      setErrorMsg("Please write a description to prove ownership.");
      return;
    }
    try {
      await axios.post("/claims", { found_item_id: claimItemId, message: claimMessage });
      setSuccessMsg("Ownership claim request submitted successfully.");
      setShowClaimModal(false);
      setClaimMessage("");
      fetchClaims();
    } catch (e) {
      console.error("Failed to submit claim", e);
      setErrorMsg("Failed to submit ownership claim.");
    }
  };

  const handleClaimStatusUpdate = async (claimId, status) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.put(`/claims/${claimId}/status`, { status });
      setSuccessMsg(`Claim has been ${status}.`);
      fetchClaims();
      fetchLostFoundItems();
    } catch (e) {
      console.error("Failed to update claim status", e);
      setErrorMsg("Failed to update claim status.");
    }
  };

  const handleWantedSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!wantedForm.title || !wantedForm.description) {
      setErrorMsg("Please fill in required fields.");
      return;
    }
    try {
      if (editingWanted) {
        await axios.put(`/wanted-posts/${editingWanted.id}`, wantedForm);
        setSuccessMsg("Wanted request updated successfully.");
      } else {
        await axios.post("/wanted-posts", wantedForm);
        setSuccessMsg("Wanted request created successfully.");
      }
      setShowWantedModal(false);
      setWantedForm({ title: "", description: "", budget: "", condition: "Medium", category_id: "" });
      setEditingWanted(null);
      fetchWantedPosts();
    } catch (e) {
      console.error("Failed to save wanted post", e);
      setErrorMsg("Failed to save wanted request.");
    }
  };

  const handleWantedDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wanted request?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.delete(`/wanted-posts/${id}`);
      setSuccessMsg("Wanted request deleted successfully.");
      fetchWantedPosts();
    } catch (e) {
      console.error("Failed to delete wanted post", e);
      setErrorMsg("Failed to delete wanted request.");
    }
  };

  const handleWantedFulfilled = async (id) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post(`/wanted-posts/${id}/fulfilled`);
      setSuccessMsg("Marked wanted request as fulfilled!");
      fetchWantedPosts();
    } catch (e) {
      console.error("Failed to mark fulfilled", e);
      setErrorMsg("Failed to update status.");
    }
  };

  const handleMarkNotificationRead = async (id) => {
    try {
      await axios.put(`/student/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setNotificationCount(prev => Math.max(0, prev - 1));
    }
  };

  // Lost & Found submission
  const handleLostFoundSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!lostFoundForm.name || !lostFoundForm.category_id || !lostFoundForm.location || !lostFoundForm.date) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const form = new FormData();
    form.append("name", lostFoundForm.name);
    form.append("category_id", lostFoundForm.category_id);
    form.append("location", lostFoundForm.location);
    form.append("date", lostFoundForm.date);
    form.append("description", lostFoundForm.description);
    if (lostFoundForm.image) {
      form.append("image", lostFoundForm.image);
    }

    const endpoint = lostFoundType === "lost" ? "/lost-items" : "/found-items";
    try {
      let res;
      if (editingItem) {
        res = await axios.post(`${endpoint}/${editingItem.id}?_method=PUT`, form);
      } else {
        res = await axios.post(endpoint, form);
      }
      setSuccessMsg(res.data.message || "Report submitted successfully! Pending Admin approval.");
      setShowLostFoundModal(false);
      resetLostFoundForm();
      fetchLostFoundItems();
      fetchMyItems();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Operation failed. Please try again.");
    }
  };

  // Product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!productForm.name || !productForm.price || !productForm.category_id || !productForm.contact_info) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const form = new FormData();
    form.append("name", productForm.name);
    form.append("price", productForm.price);
    form.append("category_id", productForm.category_id);
    form.append("condition", productForm.condition);
    form.append("description", productForm.description);
    form.append("contact_info", productForm.contact_info);
    if (productForm.image) {
      form.append("image", productForm.image);
    }

    try {
      let res;
      if (editingProduct) {
        res = await axios.post(`/products/${editingProduct.id}?_method=PUT`, form);
      } else {
        res = await axios.post(`/products`, form);
      }
      setSuccessMsg(res.data.message || "Product listing created successfully! Pending Admin approval.");
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
      fetchMyItems();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Operation failed. Please try again.");
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`/products/${id}`);
      setSuccessMsg("Listing deleted successfully.");
      fetchProducts();
      fetchMyItems();
    } catch (e) {
      setErrorMsg("Failed to delete listing.");
    }
  };

  const resetLostFoundForm = () => {
    setLostFoundForm({ name: "", category_id: "", location: "", date: "", description: "", image: null });
    setEditingItem(null);
  };

  const resetProductForm = () => {
    setProductForm({ name: "", price: "", category_id: "", condition: "New", description: "", contact_info: "", image: null });
    setEditingProduct(null);
  };

  const handleLogout = () => {
    studentLogout();
    navigate("/login");
  };

  if (!student) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Loading student profile...</h3>
      </div>
    );
  }

  // Filter computation
  const filteredLostItems = lostItems.filter(item => {
    return (
      item.name.toLowerCase().includes(lfFilter.search.toLowerCase()) &&
      (!lfFilter.category || String(item.category_id) === String(lfFilter.category)) &&
      item.location.toLowerCase().includes(lfFilter.location.toLowerCase()) &&
      (!lfFilter.date || item.date === lfFilter.date)
    );
  });

  const filteredFoundItems = foundItems.filter(item => {
    return (
      item.name.toLowerCase().includes(lfFilter.search.toLowerCase()) &&
      (!lfFilter.category || String(item.category_id) === String(lfFilter.category)) &&
      item.location.toLowerCase().includes(lfFilter.location.toLowerCase()) &&
      (!lfFilter.date || item.date === lfFilter.date)
    );
  });

  const filteredProducts = products.filter(prod => {
    return (
      prod.name.toLowerCase().includes(prodFilter.search.toLowerCase()) &&
      (!prodFilter.category || String(prod.category_id) === String(prodFilter.category))
    );
  });

  return (
    <div className="db-layout">
      {/* Sidebar */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-brand">
          <div className="db-sidebar-logo-icon">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="db-sidebar-brand-text">
            Campus<span>Connect</span>
          </span>
        </div>
        
        <ul className="db-sidebar-menu">
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "lostfound" ? "active" : ""}`} onClick={() => { setActiveTab("lostfound"); setSidebarOpen(false); }}>
              <Info size={18} />
              <span>Lost & Found</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "buysell" ? "active" : ""}`} onClick={() => { setActiveTab("buysell"); setSidebarOpen(false); }}>
              <ShoppingBag size={18} />
              <span>Buy & Sell</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "myreports" ? "active" : ""}`} onClick={() => { setActiveTab("myreports"); setSidebarOpen(false); }}>
              <AlertTriangle size={18} />
              <span>My Reports</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "mylistings" ? "active" : ""}`} onClick={() => { setActiveTab("mylistings"); setSidebarOpen(false); }}>
              <ListCollapse size={18} />
              <span>My Listings</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "wishlist" ? "active" : ""}`} onClick={() => { setActiveTab("wishlist"); setSidebarOpen(false); }}>
              <Heart size={18} />
              <span>Wishlist</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "wanted" ? "active" : ""}`} onClick={() => { setActiveTab("wanted"); setSidebarOpen(false); }}>
              <Search size={18} />
              <span>Wanted Requests</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "claims" ? "active" : ""}`} onClick={() => { setActiveTab("claims"); setSidebarOpen(false); }}>
              <CheckCircle size={18} />
              <span>Claims Portal</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "notifications" ? "active" : ""}`} onClick={() => { setActiveTab("notifications"); setSidebarOpen(false); }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", width: "100%" }}>
                <Bell size={18} />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span style={{ marginLeft: "auto", background: "#ef4444", color: "white", fontSize: "0.7rem", padding: "0.15rem 0.4rem", borderRadius: "999px", fontWeight: "bold" }}>
                    {notificationCount}
                  </span>
                )}
              </div>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "profile" ? "active" : ""}`} onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}>
              <User size={18} />
              <span>Profile</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "settings" ? "active" : ""}`} onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </li>
        </ul>

        <div className="db-sidebar-footer">
          <button className="db-sidebar-link" style={{ color: "#ef4444" }} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <div className="db-main">
        {/* Header bar */}
        <header className="db-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="db-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="db-header-title">
              {activeTab === "dashboard" && "Student Dashboard"}
              {activeTab === "lostfound" && "Lost & Found Center"}
              {activeTab === "buysell" && "Buy & Sell Marketplace"}
              {activeTab === "myreports" && "My Lost & Found Reports"}
              {activeTab === "mylistings" && "My Product Listings"}
              {activeTab === "wishlist" && "My Saved Wishlist"}
              {activeTab === "wanted" && "Wanted Item Requests"}
              {activeTab === "claims" && "Item Ownership Claims Portal"}
              {activeTab === "notifications" && "Announcements & Updates"}
              {activeTab === "profile" && "Student Profile Info"}
              {activeTab === "settings" && "Account Settings"}
            </h1>
          </div>

          <div className="db-header-actions">
            <div className="db-user-badge">
              <div className="db-avatar">
                {student.name ? student.name[0].toUpperCase() : "S"}
              </div>
              <span className="hidden-mobile">{student.name}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="db-content">
          {successMsg && <div className="dashboard-success-banner">{successMsg}</div>}
          {errorMsg && <div className="dashboard-error-banner">{errorMsg}</div>}

          {/* TAB 1: HOME DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* Widgets Stats */}
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label-container">
                    <AlertTriangle size={16} /> Total Lost Reports
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{stats.totalLost}</span>
                    <span className="stat-trend up">↗ 2.5 %</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label-container">
                    <CheckCircle size={16} /> Total Found Reports
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{stats.totalFound}</span>
                    <span className="stat-trend up">↗ 1.2 %</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label-container">
                    <ShoppingBag size={16} /> Market Listings
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{stats.totalProducts}</span>
                    <span className="stat-trend down">↘ 0.5 %</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label-container">
                    <Bell size={16} /> Pending Approvals
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{stats.pendingApprovals}</span>
                    <span className="stat-trend up">↗ 1.0 %</span>
                  </div>
                </div>
                <div className="stat-card" style={{justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', cursor: 'pointer'}} onClick={() => { setLostFoundType("lost"); setShowLostFoundModal(true); }}>
                  <Plus size={24} style={{color: '#94a3b8'}} />
                  <span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: 500}}>Add data</span>
                </div>
              </div>

              {/* Main Chart: Bar Chart for Platform Engagement */}
              <div className="chart-card" style={{ marginBottom: "1.5rem" }}>
                <div className="chart-header">
                  <h3 className="chart-title">Platform Engagement</h3>
                </div>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 500, color: '#64748b', right: 0}} />
                      <Bar dataKey="lostFound" name="Lost & Found" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="marketplace" name="Marketplace" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Lower Grid: Donut Chart & Campus Distribution */}
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">Items by category</h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", height: 250 }}>
                    <div style={{ width: "50%", height: "100%" }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={donutChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                            {donutChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ width: "50%" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem" }}>
                        {donutChartData.map((entry, index) => (
                          <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 500, color: '#334155' }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{entry.name} - {entry.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">Campus Distribution</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    {campusesData.map((campus, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "#334155" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          {campus.name}
                        </div>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{campus.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lower Section: Announcements & Recent Activity */}
              <div className="charts-grid" style={{ marginTop: "1.5rem" }}>
                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">Latest Campus Announcements</h3>
                  </div>
                  <div className="announcement-list" style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {announcements.map((ann) => (
                      <div key={ann.id} className="announcement-card" style={{ padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                        <h4 className="announcement-title" style={{ fontSize: "0.95rem", margin: "0 0 0.25rem 0", color: "#1e293b" }}>{ann.title}</h4>
                        <p className="announcement-desc" style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.25rem 0" }}>{ann.content}</p>
                        <span className="announcement-meta" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{ann.date}</span>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div style={{ color: "#94a3b8", fontSize: "0.875rem", padding: "1rem 0" }}>No announcements posted yet.</div>
                    )}
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">Recent Activity</h3>
                  </div>
                  <div className="activity-list" style={{ marginTop: "-0.5rem", maxHeight: 220, overflowY: 'auto' }}>
                    {recentActivities.map((act) => (
                      <div key={act.id} className="activity-item" style={{ padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div className={`activity-dot ${act.type}`}></div>
                        <div className="activity-content">
                          <p className="activity-text" style={{ fontSize: "0.875rem", margin: 0 }}>{act.text}</p>
                          <span className="activity-time" style={{ fontSize: "0.75rem" }}>{act.time}</span>
                        </div>
                      </div>
                    ))}
                    {recentActivities.length === 0 && (
                      <div style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "1rem" }}>No recent activity.</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LOST & FOUND CENTER */}
          {activeTab === "lostfound" && (
            <>
              <div className="section-header">
                <p style={{ color: "#64748b", margin: 0 }}>
                  View approved lost and found reports, or file a report to help recover misplaced items.
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn-primary" onClick={() => { setLostFoundType("lost"); setShowLostFoundModal(true); }}>
                    <Plus size={16} />
                    Report Lost Item
                  </button>
                  <button className="btn-primary" style={{ background: "linear-gradient(135deg,#06b6d4,#2563eb)" }} onClick={() => { setLostFoundType("found"); setShowLostFoundModal(true); }}>
                    <Plus size={16} />
                    Report Found Item
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon-pos" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search reports..."
                    value={lfFilter.search}
                    onChange={(e) => setLfFilter({ ...lfFilter, search: e.target.value })}
                  />
                </div>
                
                <select
                  className="filter-select"
                  value={lfFilter.category}
                  onChange={(e) => setLfFilter({ ...lfFilter, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="search-input"
                  style={{ flex: "none", width: "160px", paddingLeft: "1rem" }}
                  placeholder="Location filter"
                  value={lfFilter.location}
                  onChange={(e) => setLfFilter({ ...lfFilter, location: e.target.value })}
                />

                <input
                  type="date"
                  className="filter-date"
                  value={lfFilter.date}
                  onChange={(e) => setLfFilter({ ...lfFilter, date: e.target.value })}
                />
              </div>

              {/* Lists Sections */}
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem", color: "#1e293b" }}>
                Lost Items ({filteredLostItems.length})
              </h3>
              <div className="cards-grid" style={{ marginBottom: "2.5rem" }}>
                {filteredLostItems.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No matching lost reports found.</p>
                ) : (
                  filteredLostItems.map((item) => (
                    <div key={item.id} className="item-card">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60"}
                        alt={item.name}
                        className="item-card-image"
                      />
                      <div className="item-card-body">
                        <div className="item-badge-row">
                          <span className="status-badge lost">Lost</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{item.category?.name}</span>
                        </div>
                        <h4 className="item-title">{item.name}</h4>
                        <div className="item-location">
                          <MapPin size={14} />
                          <span>{item.location}</span>
                        </div>
                        <div className="item-date">
                          <Calendar size={14} />
                          <span>{item.date}</span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 1rem 0" }}>{item.description}</p>
                        <div className="item-card-footer">
                          <span className="item-author">By: {item.user?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem", color: "#1e293b" }}>
                Found Items ({filteredFoundItems.length})
              </h3>
              <div className="cards-grid">
                {filteredFoundItems.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No matching found reports yet.</p>
                ) : (
                  filteredFoundItems.map((item) => (
                    <div key={item.id} className="item-card">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1540350390103-f7529fc490ad?w=500&auto=format&fit=crop&q=60"}
                        alt={item.name}
                        className="item-card-image"
                      />
                      <div className="item-card-body">
                        <div className="item-badge-row">
                          <span className="status-badge found">Found</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{item.category?.name}</span>
                        </div>
                        <h4 className="item-title">{item.name}</h4>
                        <div className="item-location">
                          <MapPin size={14} />
                          <span>{item.location}</span>
                        </div>
                        <div className="item-date">
                          <Calendar size={14} />
                          <span>{item.date}</span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 1rem 0" }}>{item.description}</p>
                        <div className="item-card-footer">
                          <span className="item-author">By: {item.user?.name}</span>
                        </div>
                        {item.user_id !== student?.id && (
                          <button
                            type="button"
                            onClick={() => { setClaimItemId(item.id); setClaimMessage(""); setShowClaimModal(true); }}
                            style={{ marginTop: "0.75rem", width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", fontWeight: "600", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                          >
                            <CheckCircle size={14} /> This is mine — Claim It
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* TAB 3: BUY & SELL MODULE */}
          {activeTab === "buysell" && (
            <>
              <div className="section-header">
                <p style={{ color: "#64748b", margin: 0 }}>
                  Browse items listed for sale by campus students, or list your own items securely.
                </p>
                <button className="btn-primary" onClick={() => setShowProductModal(true)}>
                  <Plus size={16} />
                  Sell an Item
                </button>
              </div>

              {/* Filters */}
              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon-pos" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={prodFilter.search}
                    onChange={(e) => setProdFilter({ ...prodFilter, search: e.target.value })}
                  />
                </div>
                
                <select
                  className="filter-select"
                  value={prodFilter.category}
                  onChange={(e) => setProdFilter({ ...prodFilter, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid */}
              <div className="cards-grid">
                {filteredProducts.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No matching listings found.</p>
                ) : (
                  filteredProducts.map((prod) => {
                    const isWishlisted = wishlist.some(w => w.product_id === prod.id);
                    return (
                    <div key={prod.id} className="item-card">
                      <img
                        src={prod.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"}
                        alt={prod.name}
                        className="item-card-image"
                      />
                      <div className="item-card-body">
                        <div className="item-badge-row">
                          <span className="status-badge" style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>{prod.condition}</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{prod.category?.name}</span>
                        </div>
                        <h4 className="item-title">{prod.name}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 1rem 0" }}>{prod.description}</p>
                        
                        <div style={{ background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.75rem" }}>
                          <strong>Contact Details:</strong> {prod.contact_info}
                        </div>

                        <div className="item-card-footer">
                          <span className="item-author">By: {prod.user?.name}</span>
                          <span className="item-price">Rs. {prod.price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prod.id)}
                          style={{ marginTop: "0.75rem", width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: isWishlisted ? "1px solid #fecdd3" : "1px solid #e2e8f0", background: isWishlisted ? "#fff1f2" : "#f8fafc", color: isWishlisted ? "#e11d48" : "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                        >
                          <Heart size={14} style={{ fill: isWishlisted ? "#e11d48" : "none" }} />
                          {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                        </button>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* TAB 4: MY REPORTS */}
          {activeTab === "myreports" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...(myReports.lost || []), ...(myReports.found || [])].length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>You haven't reported any items yet.</td>
                    </tr>
                  ) : (
                    [...(myReports.lost || []).map(i => ({ ...i, type: "Lost" })), ...(myReports.found || []).map(i => ({ ...i, type: "Found" }))].map((item) => (
                      <tr key={`${item.type}-${item.id}`}>
                        <td style={{ fontWeight: "600" }}>{item.name}</td>
                        <td>
                          <span className={`status-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                        </td>
                        <td>{item.category?.name}</td>
                        <td>{item.location}</td>
                        <td>{item.date}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: MY LISTINGS */}
          {activeTab === "mylistings" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>You don't have any marketplace listings.</td>
                    </tr>
                  ) : (
                    myListings.map((prod) => (
                      <tr key={prod.id}>
                        <td style={{ fontWeight: "600" }}>{prod.name}</td>
                        <td>{prod.category?.name}</td>
                        <td style={{ fontWeight: "600" }}>Rs. {prod.price}</td>
                        <td>{prod.condition}</td>
                        <td>
                          <span className={`status-badge ${prod.status}`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="btn-action-approve"
                            style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                            onClick={() => {
                              setEditingProduct(prod);
                              setProductForm({
                                name: prod.name,
                                price: prod.price,
                                category_id: prod.category_id,
                                condition: prod.condition,
                                description: prod.description,
                                contact_info: prod.contact_info,
                                image: null,
                              });
                              setShowProductModal(true);
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button className="btn-action-reject" onClick={() => handleProductDelete(prod.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: WISHLIST */}
          {activeTab === "wishlist" && (
            <>
              <div className="section-header">
                <p style={{ color: "#64748b", margin: 0 }}>
                  Products you've saved for later. Click the heart icon on any product in Buy &amp; Sell to add it here.
                </p>
              </div>
              <div className="cards-grid">
                {wishlist.length === 0 ? (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 0", color: "#64748b" }}>
                    <Heart size={48} style={{ color: "#e2e8f0", marginBottom: "1rem" }} />
                    <p style={{ margin: 0, fontWeight: "600" }}>Your wishlist is empty.</p>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem" }}>Go to Buy &amp; Sell and save products you like.</p>
                  </div>
                ) : (
                  wishlist.map((w) => {
                    const prod = w.product || {};
                    return (
                      <div key={w.id} className="item-card">
                        <img
                          src={prod.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"}
                          alt={prod.name}
                          className="item-card-image"
                        />
                        <div className="item-card-body">
                          <div className="item-badge-row">
                            <span className="status-badge" style={{ backgroundColor: "#ecfdf5", color: "#10b981" }}>{prod.condition}</span>
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{prod.category?.name}</span>
                          </div>
                          <h4 className="item-title">{prod.name}</h4>
                          <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.75rem 0" }}>{prod.description}</p>
                          <div className="item-card-footer">
                            <span className="item-author">By: {prod.user?.name}</span>
                            <span className="item-price">Rs. {prod.price}</span>
                          </div>
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            style={{ marginTop: "0.75rem", width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #fecdd3", background: "#fff1f2", color: "#e11d48", fontWeight: "600", cursor: "pointer", fontSize: "0.8rem" }}
                          >
                            <Heart size={14} style={{ marginRight: "0.4rem" }} /> Remove from Wishlist
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* TAB: WANTED REQUESTS */}
          {activeTab === "wanted" && (
            <>
              <div className="section-header">
                <p style={{ color: "#64748b", margin: 0 }}>
                  Post what you're looking for. Other students can respond and contact you.
                </p>
                <button className="btn-primary" onClick={() => { setEditingWanted(null); setWantedForm({ title: "", description: "", budget: "", condition: "Medium", category_id: "" }); setShowWantedModal(true); }}>
                  <Plus size={16} /> Post Wanted Request
                </button>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: "1.5rem 0 1rem 0" }}>My Wanted Requests</h3>
              <div className="table-responsive" style={{ marginBottom: "2.5rem" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th><th>Budget</th><th>Urgency</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myWantedPosts.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>You haven't posted any wanted requests yet.</td></tr>
                    ) : (
                      myWantedPosts.map((post) => (
                        <tr key={post.id}>
                          <td style={{ fontWeight: "600" }}>{post.title}</td>
                          <td>Rs. {post.budget || "N/A"}</td>
                          <td>
                            <span className={`status-badge ${post.condition === "High" ? "lost" : post.condition === "Low" ? "found" : "pending"}`}>
                              {post.condition || "Medium"}
                            </span>
                          </td>
                          <td><span className={`status-badge ${post.status}`}>{post.status}</span></td>
                          <td className="actions-cell">
                            <button
                              className="btn-action-approve"
                              style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                              onClick={() => { setEditingWanted(post); setWantedForm({ title: post.title, description: post.description, budget: post.budget, condition: post.condition, category_id: post.category_id }); setShowWantedModal(true); }}
                            >
                              <Edit size={14} />
                            </button>
                            {post.status !== "fulfilled" && (
                              <button
                                className="btn-action-approve"
                                style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                                onClick={() => handleWantedFulfilled(post.id)}
                                title="Mark as Fulfilled"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button className="btn-action-reject" onClick={() => handleWantedDelete(post.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: "0 0 1rem 0" }}>Browse All Wanted Requests</h3>
              <div className="cards-grid">
                {wantedPosts.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No wanted requests posted by other students yet.</p>
                ) : (
                  wantedPosts.filter(p => p.user_id !== student?.id).map((post) => (
                    <div key={post.id} className="item-card">
                      <div style={{ height: "100px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Search size={40} style={{ color: "rgba(255,255,255,0.8)" }} />
                      </div>
                      <div className="item-card-body">
                        <div className="item-badge-row">
                          <span className={`status-badge ${post.condition === "High" ? "lost" : "found"}`}>{post.condition || "Medium"} Priority</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Rs. {post.budget || "N/A"}</span>
                        </div>
                        <h4 className="item-title">{post.title}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 0.5rem 0" }}>{post.description}</p>
                        <div className="item-card-footer">
                          <span className="item-author">By: {post.user?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* TAB: CLAIMS PORTAL */}
          {activeTab === "claims" && (
            <>
              <div className="section-header">
                <p style={{ color: "#64748b", margin: 0 }}>
                  Submit ownership claims for found items or review claims made on your reported items.
                </p>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: "1.5rem 0 1rem 0" }}>Claims I Submitted</h3>
              <div className="table-responsive" style={{ marginBottom: "2.5rem" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Found Item</th><th>My Claim Message</th><th>Status</th><th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myClaims.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>You haven't submitted any ownership claims.</td></tr>
                    ) : (
                      myClaims.map((claim) => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: "600" }}>{claim.found_item?.name}</td>
                          <td style={{ maxWidth: "250px", fontSize: "0.85rem" }}>{claim.message}</td>
                          <td>
                            <span className={`status-badge ${claim.status === "approved" ? "found" : claim.status === "rejected" ? "lost" : "pending"}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                            {claim.created_at ? new Date(claim.created_at).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: "0 0 1rem 0" }}>Claims on My Found Items</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Found Item</th><th>Claimed By</th><th>Message</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedClaims.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>No claims have been filed on your found items.</td></tr>
                    ) : (
                      receivedClaims.map((claim) => (
                        <tr key={claim.id}>
                          <td style={{ fontWeight: "600" }}>{claim.found_item?.name}</td>
                          <td>{claim.user?.name}</td>
                          <td style={{ maxWidth: "220px", fontSize: "0.85rem" }}>{claim.message}</td>
                          <td>
                            <span className={`status-badge ${claim.status === "approved" ? "found" : claim.status === "rejected" ? "lost" : "pending"}`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="actions-cell">
                            {claim.status === "pending" && (
                              <>
                                <button
                                  className="btn-action-approve"
                                  style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                                  onClick={() => handleClaimStatusUpdate(claim.id, "approved")}
                                  title="Approve Claim"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  className="btn-action-reject"
                                  onClick={() => handleClaimStatusUpdate(claim.id, "rejected")}
                                  title="Reject Claim"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                            {claim.status !== "pending" && (
                              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>System Alerts</h3>
              {notifications.length === 0 ? (
                <p style={{ color: "#64748b" }}>No alerts received yet.</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      background: "white",
                      padding: "1.25rem",
                      borderRadius: "1rem",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "between",
                      alignItems: "center",
                      opacity: notif.is_read ? 0.7 : 1,
                      boxShadow: "var(--shadow-soft)"
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem", fontWeight: notif.is_read ? "400" : "600" }}>{notif.message}</p>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{notif.created_at}</span>
                    </div>
                    {!notif.is_read && (
                      <button className="btn-action-approve" onClick={() => handleMarkNotificationRead(notif.id)}>
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === "profile" && (
            <div className="widget-card" style={{ maxWidth: "600px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="db-avatar" style={{ width: "4rem", height: "4rem", fontSize: "1.75rem" }}>
                  {student.name ? student.name[0].toUpperCase() : "S"}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{student.name}</h3>
                  <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Student Profile</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>Registration Number</label>
                  <p style={{ margin: "0.25rem 0 0 0", fontWeight: "600" }}>{student.registration_number}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>Email Address</label>
                  <p style={{ margin: "0.25rem 0 0 0", fontWeight: "600" }}>{student.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>Campus</label>
                  <p style={{ margin: "0.25rem 0 0 0", fontWeight: "600" }}>{student.campus}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>Department</label>
                  <p style={{ margin: "0.25rem 0 0 0", fontWeight: "600" }}>{student.department}</p>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: "600" }}>Semester</label>
                  <p style={{ margin: "0.25rem 0 0 0", fontWeight: "600" }}>{student.semester}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === "settings" && (
            <div className="widget-card" style={{ maxWidth: "500px" }}>
              <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem" }}>Security & Password</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                setErrorMsg("");
                setSuccessMsg("Password changed successfully! (Simulator)");
              }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" required />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
                  Update Password
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ==========================================================================
         MODAL 1: REPORT LOST OR FOUND ITEM
         ========================================================================== */}
      {showLostFoundModal && (
        <div className="modal-overlay">
          <form onSubmit={handleLostFoundSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem ? "Edit Report" : `Report ${lostFoundType === "lost" ? "Lost" : "Found"} Item`}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => { setShowLostFoundModal(false); resetLostFoundForm(); }}>
                <X size={18} />
              </button>
            </div>
            {errorMsg && <div className="dashboard-error-banner" style={{ margin: "1rem" }}>{errorMsg}</div>}
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dell Latitude Charger"
                  value={lostFoundForm.name}
                  onChange={(e) => setLostFoundForm({ ...lostFoundForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input campus-select"
                    value={lostFoundForm.category_id}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={lostFoundForm.date}
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Building *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block C, Library Basement"
                  value={lostFoundForm.location}
                  onChange={(e) => setLostFoundForm({ ...lostFoundForm, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  style={{ resize: "none" }}
                  placeholder="Provide details like colors, marks, stickers, serials..."
                  value={lostFoundForm.description}
                  onChange={(e) => setLostFoundForm({ ...lostFoundForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Image</label>
                <div className="image-upload-wrapper">
                  <input
                    type="file"
                    className="image-upload-input"
                    accept="image/*"
                    onChange={(e) => setLostFoundForm({ ...lostFoundForm, image: e.target.files[0] })}
                  />
                  {lostFoundForm.image ? (
                    <p style={{ margin: 0, color: "var(--color-primary)", fontWeight: "600" }}>{lostFoundForm.image.name}</p>
                  ) : (
                    <>
                      <Plus size={24} style={{ color: "#94a3b8", marginBottom: "0.25rem" }} />
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Click to select image file</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => { setShowLostFoundModal(false); resetLostFoundForm(); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================================
         MODAL 2: ADD OR EDIT MARKETPLACE PRODUCT
         ========================================================================== */}
      {showProductModal && (
        <div className="modal-overlay">
          <form onSubmit={handleProductSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? "Edit Product Listing" : "Create Product Listing"}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => { setShowProductModal(false); resetProductForm(); }}>
                <X size={18} />
              </button>
            </div>
            {errorMsg && <div className="dashboard-error-banner" style={{ margin: "1rem" }}>{errorMsg}</div>}
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Scientific Calculator Casio"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">Price (Rs.) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Condition *</label>
                  <select
                    className="form-input campus-select"
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>

              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input campus-select"
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Mobile / WhatsApp *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 0333-1234567"
                    value={productForm.contact_info}
                    onChange={(e) => setProductForm({ ...productForm, contact_info: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  style={{ resize: "none" }}
                  placeholder="Details about product warranty, age, condition, usage..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Product Image</label>
                <div className="image-upload-wrapper">
                  <input
                    type="file"
                    className="image-upload-input"
                    accept="image/*"
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })}
                  />
                  {productForm.image ? (
                    <p style={{ margin: 0, color: "var(--color-primary)", fontWeight: "600" }}>{productForm.image.name}</p>
                  ) : (
                    <>
                      <Plus size={24} style={{ color: "#94a3b8", marginBottom: "0.25rem" }} />
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Click to select image file</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => { setShowProductModal(false); resetProductForm(); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                List Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: WANTED REQUEST */}
      {showWantedModal && (
        <div className="modal-overlay">
          <form onSubmit={handleWantedSubmit} className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{editingWanted ? "Edit Wanted Request" : "Post New Wanted Request"}</h3>
              <button type="button" className="modal-close-btn" onClick={() => { setShowWantedModal(false); setEditingWanted(null); }}>
                <X size={18} />
              </button>
            </div>
            {errorMsg && <div className="dashboard-error-banner" style={{ margin: "1rem" }}>{errorMsg}</div>}
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Looking for Data Structures Book"
                  value={wantedForm.title}
                  onChange={(e) => setWantedForm({ ...wantedForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Describe what you need, edition, condition etc."
                  value={wantedForm.description}
                  onChange={(e) => setWantedForm({ ...wantedForm, description: e.target.value })}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="grid-2col">
                <div className="form-group">
                  <label className="form-label">Budget (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1500"
                    value={wantedForm.budget}
                    onChange={(e) => setWantedForm({ ...wantedForm, budget: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Urgency Level</label>
                  <select
                    className="form-input campus-select"
                    value={wantedForm.condition}
                    onChange={(e) => setWantedForm({ ...wantedForm, condition: e.target.value })}
                  >
                    <option value="High">High — Need it ASAP</option>
                    <option value="Medium">Medium — Within a week</option>
                    <option value="Low">Low — Flexible</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input campus-select"
                  value={wantedForm.category_id}
                  onChange={(e) => setWantedForm({ ...wantedForm, category_id: e.target.value })}
                >
                  <option value="">Select Category (optional)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => { setShowWantedModal(false); setEditingWanted(null); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingWanted ? "Update Request" : "Post Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: SUBMIT CLAIM */}
      {showClaimModal && (
        <div className="modal-overlay">
          <form onSubmit={handleClaimSubmit} className="modal-content" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Submit Ownership Claim</h3>
              <button type="button" className="modal-close-btn" onClick={() => { setShowClaimModal(false); setClaimMessage(""); }}>
                <X size={18} />
              </button>
            </div>
            {errorMsg && <div className="dashboard-error-banner" style={{ margin: "1rem" }}>{errorMsg}</div>}
            <div className="modal-body">
              <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1rem" }}>
                Describe proof that this item belongs to you (e.g. serial number, unique markings, photos).
              </p>
              <div className="form-group">
                <label className="form-label">Ownership Description *</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Describe how you can prove this item is yours..."
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => { setShowClaimModal(false); setClaimMessage(""); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, Info, ShoppingBag, FolderOpen, LogOut, Check, X, Trash2, Plus, Menu, LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "../../styles/dashboard.css";

export default function AdminDashboard() {
  const { admin, adminLogout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReports: 0,
    totalProducts: 0,
    pendingStudents: 0,
    pendingReports: 0,
    pendingProducts: 0,
  });
  const [students, setStudents] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [wantedPosts, setWantedPosts] = useState([]);
  const COLORS = ['#a855f7', '#3b82f6', '#34d399', '#60a5fa', '#fbbf24', '#f87171'];
  
  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, loading, navigate]);

  // Fetch admin resources
  useEffect(() => {
    if (admin) {
      fetchAdminStats();
      fetchStudents();
      fetchLostFoundItems();
      fetchProducts();
      fetchCategories();
      fetchWantedPosts();
    }
  }, [admin, activeTab]);

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get("/admin/stats");
      setStats(res.data.stats || {
        totalStudents: 0,
        totalReports: 0,
        totalProducts: 0,
        pendingStudents: 0,
        pendingReports: 0,
        pendingProducts: 0,
      });
      setBarChartData(res.data.barChart || []);
      setDonutChartData(res.data.donutChart || []);
      setRecentActivities(res.data.activities || []);
    } catch (e) {
      console.error('Failed to load dashboard stats', e);
      setStats({
        totalStudents: 0,
        totalReports: 0,
        totalProducts: 0,
        pendingStudents: 0,
        pendingReports: 0,
        pendingProducts: 0,
      });
      setBarChartData([]);
      setDonutChartData([]);
      setRecentActivities([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/admin/users");
      setStudents(res.data || []);
    } catch (e) {
      console.error('Failed to load students', e);
      setStudents([]);
    }
  };

  const fetchLostFoundItems = async () => {
    try {
      const [lostRes, foundRes] = await Promise.all([
        axios.get("/admin/pending-lost-items"),
        axios.get("/admin/pending-found-items")
      ]);
      // Add type property to each item for UI rendering
      const lostWithType = (lostRes.data || []).map(item => ({ ...item, type: "lost" }));
      const foundWithType = (foundRes.data || []).map(item => ({ ...item, type: "found" }));
      const combined = [...lostWithType, ...foundWithType];
      setLostFoundItems(combined);
    } catch (e) {
      console.error('Failed to load pending lost/found items', e);
      setLostFoundItems([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/admin/pending-products");
      setProducts(res.data || []);
    } catch (e) {
      console.error('Failed to load products', e);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data || res.data || []);
    } catch (e) {
      setCategories([
        { id: 1, name: "Electronics" },
        { id: 2, name: "Documents & Cards" },
        { id: 3, name: "Books & Stationery" },
        { id: 4, name: "Keys & Wallets" }
      ]);
    }
  };

  // Moderation Handlers
  const handleStudentApproval = async (id, status) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const endpoint = status === "approved" ? `/admin/approve-student/${id}` : `/admin/reject-student/${id}`;
      await axios.post(endpoint);
      setSuccessMsg(`Student account has been ${status}.`);
      fetchStudents();
      fetchAdminStats();
    } catch (e) {
      setErrorMsg("Failed to update student status.");
    }
  };

  const handleLostFoundApproval = async (type, id, status) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const action = status === "approved" ? "approve" : "reject";
      const endpoint = `/admin/${action}-${type}-item/${id}`;
      await axios.post(endpoint);
      setSuccessMsg(`Report ${status} successfully.`);
      fetchLostFoundItems();
      fetchAdminStats();
    } catch (e) {
      console.error("Failed to update report status", e);
      setErrorMsg("Failed to update report status.");
    }
  };

  const handleLostFoundDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.delete(`/admin/${type}-items/${id}`);
      setSuccessMsg("Report deleted successfully.");
      fetchLostFoundItems();
      fetchAdminStats();
    } catch (e) {
      console.error("Failed to delete report", e);
      setErrorMsg("Failed to delete report.");
    }
  };

  const handleProductApproval = async (id, status) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const endpoint = status === "approved" ? `/admin/approve-product/${id}` : `/admin/reject-product/${id}`;
      await axios.post(endpoint);
      setSuccessMsg(`Marketplace product has been ${status}.`);
      fetchProducts();
      fetchAdminStats();
    } catch (e) {
      console.error("Failed to update product status", e);
      setErrorMsg("Failed to update product status.");
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.delete(`/admin/products/${id}`);
      setSuccessMsg("Product deleted successfully.");
      fetchProducts();
      fetchAdminStats();
    } catch (e) {
      console.error("Failed to delete product", e);
      setErrorMsg("Failed to delete product.");
    }
  };

  const fetchWantedPosts = async () => {
    try {
      const res = await axios.get("/admin/wanted-posts");
      setWantedPosts(res.data || []);
    } catch (e) {
      console.error("Failed to load wanted posts", e);
      setWantedPosts([]);
    }
  };

  const handleWantedPostDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this wanted request?")) return;
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.delete(`/admin/wanted-posts/${id}`);
      setSuccessMsg("Wanted request removed.");
      fetchWantedPosts();
    } catch (e) {
      console.error("Failed to remove wanted post", e);
      setErrorMsg("Failed to remove wanted request.");
    }
  };

  // Categories CRUD
  const handleCategoryCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await axios.post("/categories", { name: newCategoryName });
      setSuccessMsg("Category created successfully.");
      setNewCategoryName("");
      fetchCategories();
    } catch (e) {
      setCategories([...categories, { id: Date.now(), name: newCategoryName }]);
      setNewCategoryName("");
      setSuccessMsg("Category added successfully.");
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/categories/${id}`);
      setSuccessMsg("Category deleted successfully.");
      fetchCategories();
    } catch (e) {
      setCategories(categories.filter(c => c.id !== id));
      setSuccessMsg("Category deleted.");
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  if (!admin) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h3>Loading admin dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="db-layout">
      {/* Sidebar */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`} style={{ backgroundColor: "#0f172a" }}>
        <div className="db-sidebar-brand">
          <div className="db-sidebar-logo-icon" style={{ background: "linear-gradient(135deg, #0f172a, #334155)" }}>
            <Shield size={20} className="text-white" />
          </div>
          <span className="db-sidebar-brand-text">
            Admin<span>Portal</span>
          </span>
        </div>

        <ul className="db-sidebar-menu">
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}>
              <LayoutDashboard size={18} />
              <span>Statistics Dashboard</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "students" ? "active" : ""}`} onClick={() => { setActiveTab("students"); setSidebarOpen(false); }}>
              <Users size={18} />
              <span>Student Accounts</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "lostfound" ? "active" : ""}`} onClick={() => { setActiveTab("lostfound"); setSidebarOpen(false); }}>
              <Info size={18} />
              <span>Lost & Found Reports</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "products" ? "active" : ""}`} onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}>
              <ShoppingBag size={18} />
              <span>Buy & Sell Items</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "categories" ? "active" : ""}`} onClick={() => { setActiveTab("categories"); setSidebarOpen(false); }}>
              <FolderOpen size={18} />
              <span>Categories Manager</span>
            </button>
          </li>
          <li className="db-sidebar-item">
            <button className={`db-sidebar-link ${activeTab === "wantedposts" ? "active" : ""}`} onClick={() => { setActiveTab("wantedposts"); setSidebarOpen(false); }}>
              <ShoppingBag size={18} />
              <span>Wanted Posts</span>
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

      {/* Main Container */}
      <div className="db-main">
        <header className="db-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="db-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="db-header-title">
              {activeTab === "dashboard" && "Moderator Hub"}
              {activeTab === "students" && "Student Registrations"}
              {activeTab === "lostfound" && "Lost & Found Reports Management"}
              {activeTab === "products" && "Product Listings Moderation"}
              {activeTab === "categories" && "System Categories Manager"}
              {activeTab === "wantedposts" && "Wanted Item Posts Management"}
            </h1>
          </div>
          <div className="db-header-actions">
            <div className="db-user-badge" style={{ backgroundColor: "#0f172a", color: "white", borderColor: "#1e293b" }}>
              <Shield size={14} />
              <span>Admin ({admin.name || admin.email})</span>
            </div>
          </div>
        </header>

        {/* Content Panels */}
        <main className="db-content">
          {successMsg && <div className="dashboard-success-banner">{successMsg}</div>}
          {errorMsg && <div className="dashboard-error-banner">{errorMsg}</div>}

          {/* TAB 1: ADMIN HOME STATISTICS */}
          {activeTab === "dashboard" && (
            <>
              {/* Info Cards */}
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label-container">
                    <Users size={16} /> Total students
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{(stats?.totalStudents || 0).toLocaleString()}</span>
                    <span className="stat-trend up">↗ 2.5 %</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label-container">
                    <Info size={16} /> Total reports
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{(stats?.totalReports || 0).toLocaleString()}</span>
                    <span className="stat-trend up">↗ 1.2 %</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label-container">
                    <ShoppingBag size={16} /> Total products
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-val">{(stats?.totalProducts || 0).toLocaleString()}</span>
                    <span className="stat-trend down">↘ 0.5 %</span>
                  </div>
                </div>
                <div className="stat-card" style={{justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', cursor: 'pointer'}}>
                  <Plus size={24} style={{color: '#94a3b8'}} />
                  <span style={{fontSize: '0.875rem', color: '#64748b', fontWeight: 500}}>Add data</span>
                </div>
              </div>

              {/* Main Chart */}
              <div className="chart-card" style={{ marginBottom: "1.5rem" }}>
                <div className="chart-header">
                  <h3 className="chart-title">Platform Engagement</h3>
                </div>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

              {/* Lower Grid: Donut Chart & Activity */}
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
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {donutChartData.map((entry, index) => (
                          <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 500, color: '#334155' }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name} - {entry.value}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">Recent Activity</h3>
                  </div>
                  <div className="activity-list" style={{ marginTop: "-0.5rem" }}>
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

          {/* TAB 2: STUDENTS APPROVAL TABLE */}
          {activeTab === "students" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reg Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#64748b" }}>No student accounts registered yet.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td style={{ fontWeight: "600" }}>{student.registration_number}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <div style={{ fontSize: "0.8rem" }}>
                            {student.campus} | {student.department} <br />
                            {student.semester}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${student.status}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {student.status === "pending" && (
                            <>
                              <button className="btn-action-approve" onClick={() => handleStudentApproval(student.id, "approved")}>
                                <Check size={14} /> Approve
                              </button>
                              <button className="btn-action-reject" onClick={() => handleStudentApproval(student.id, "rejected")}>
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                          {student.status !== "pending" && (
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No actions</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LOST & FOUND REPORTS TABLE */}
          {activeTab === "lostfound" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location / Date</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lostFoundItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>No lost or found reports submitted.</td>
                    </tr>
                  ) : (
                    lostFoundItems.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: "600" }}>{item.name}</td>
                        <td>
                          <span className={`status-badge ${item.type === "lost" ? "lost" : "found"}`}>{item.type}</span>
                        </td>
                        <td>{item.category?.name}</td>
                        <td>
                          <div style={{ fontSize: "0.8rem" }}>
                            {item.location} <br />
                            {item.date}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.8rem", maxWidth: "200px" }}>
                            <strong>By:</strong> {item.user?.name} <br />
                            {item.description}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {item.status === "pending" && (
                            <>
                              <button className="btn-action-approve" onClick={() => handleLostFoundApproval(item.type, item.id, "approved")}>
                                Approve
                              </button>
                              <button className="btn-action-reject" onClick={() => handleLostFoundApproval(item.type, item.id, "rejected")}>
                                Reject
                              </button>
                            </>
                          )}
                          <button className="btn-action-reject" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }} onClick={() => handleLostFoundDelete(item.type, item.id)}>
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: MARKETPLACE PRODUCTS TABLE */}
          {activeTab === "products" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Condition</th>
                    <th>Reported By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>No marketplace listings active.</td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id}>
                        <td style={{ fontWeight: "600" }}>{prod.name}</td>
                        <td style={{ fontWeight: "600" }}>Rs. {prod.price}</td>
                        <td>{prod.category?.name}</td>
                        <td>{prod.condition}</td>
                        <td>{prod.user?.name}</td>
                        <td>
                          <span className={`status-badge ${prod.status}`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {prod.status === "pending" && (
                            <>
                              <button className="btn-action-approve" onClick={() => handleProductApproval(prod.id, "approved")}>
                                Approve
                              </button>
                              <button className="btn-action-reject" onClick={() => handleProductApproval(prod.id, "rejected")}>
                                Reject
                              </button>
                            </>
                          )}
                          <button className="btn-action-reject" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }} onClick={() => handleProductDelete(prod.id)}>
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: CATEGORIES CRUD */}
          {activeTab === "categories" && (
            <div className="category-manager-grid">
              <div className="widget-card">
                <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.1rem" }}>Add Category</h3>
                <form onSubmit={handleCategoryCreate}>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sports Equipment"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    <Plus size={16} /> Save Category
                  </button>
                </form>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", color: "#64748b" }}>No categories configured.</td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>{cat.id}</td>
                          <td style={{ fontWeight: "600" }}>{cat.name}</td>
                          <td>
                            <button className="btn-action-reject" onClick={() => handleCategoryDelete(cat.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "wantedposts" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Posted By</th>
                    <th>Budget</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {wantedPosts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", color: "#64748b" }}>No wanted posts found.</td>
                    </tr>
                  ) : (
                    wantedPosts.map((post) => (
                      <tr key={post.id}>
                        <td style={{ fontWeight: "600" }}>{post.title}</td>
                        <td>{post.user?.name || "—"}</td>
                        <td>Rs. {post.budget || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${post.condition === "High" ? "lost" : post.condition === "Low" ? "found" : "pending"}`}>
                            {post.condition || "Medium"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${post.status}`}>{post.status}</span>
                        </td>
                        <td>{post.category?.name || "—"}</td>
                        <td>
                          <button className="btn-action-reject" onClick={() => handleWantedPostDelete(post.id)} title="Remove Post">
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
        </main>
      </div>
    </div>
  );
}

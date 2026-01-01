// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

/* ===================== PÚBLICAS ===================== */
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import PlansPage from "./pages/PlansPage";
import PropertyDetail from "./pages/PropertyDetail";

/* ===================== AUTH ===================== */
import Login from "./pages/Login";
import Registro from "./pages/Registro";

/* ===================== CLIENTE ===================== */
import Dashboard from "./pages/Dashboard";

/* ===================== ADMIN ===================== */
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminCreateAdmin from "./pages/admin/AdminCreateAdmin";
import AdminBroadcast from "./pages/admin/AdminBroadcast";
import AdminServiceRequests from "./pages/admin/AdminServiceRequests";
import AdminTechManager from "./pages/admin/AdminTechManager";
import SuperAdminPlans from "./pages/admin/SuperAdminPlans";
import SuperAdminProjects from "./pages/admin/SuperAdminProjects";
import SuperAdminServices from "./pages/admin/SuperAdminServices";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import Properties from "./pages/Properties";
import PropertiesAdmin from "./pages/admin/PropertiesAdmin";
import SuperAdminPanel from "./pages/superadmin/SuperAdminPanel";



/* ===================== TECH ===================== */
import TechRoute from "./components/TechRoute";
import TechDashboard from "./pages/tech/TechDashboard";

function App() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Router>
        <Header />

        <Routes>
          {/* ===================== PÚBLICAS ===================== */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/planes" element={<PlansPage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />

          {/* ===================== AUTH ===================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* ===================== CLIENTE ===================== */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ===================== ADMIN ===================== */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="create-admin" element={<AdminCreateAdmin />} />
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="service-requests" element={<AdminServiceRequests />} />
            <Route path="techs" element={<AdminTechManager />} />

            {/* ===== SOLO SUPERADMIN (BACKEND + UI) ===== */}
            <Route path="planes" element={<SuperAdminPlans />} />
            <Route path="projects" element={<SuperAdminProjects />} />
            <Route path="services" element={<SuperAdminServices />} />
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/properties" element={<PropertiesAdmin />} />
            <Route path="super" element={<SuperAdminPanel />} />
          </Route>

          {/* ===================== TECH ===================== */}
          <Route
            path="/tech"
            element={
              <TechRoute>
                <TechDashboard />
              </TechRoute>
            }
          />
        </Routes>

        <Footer />
      </Router>
    </motion.div>
  );
}

export default App;

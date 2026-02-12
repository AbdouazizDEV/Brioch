import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { AdminSidebar } from "./layout/Sidebar";
import { AdminHeader } from "./layout/Header";

// Pages
import AdminDashboard from "./pages/Dashboard";
import AdminOrders from "./pages/Orders";
import AdminDeliveries from "./pages/Deliveries";
import AdminStores from "./pages/Stores";
import AdminTeam from "./pages/Team";
import AdminCatalog from "./pages/Catalog";
import AdminReports from "./pages/Reports";
import AdminSettings from "./pages/Settings";
import AdminProfile from "./pages/Profile";

export default function AdminApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<><AdminHeader title="Tableau de bord" onMenuClick={() => setSidebarOpen(true)} /><AdminDashboard /></>} />
          <Route path="orders" element={<><AdminHeader title="Gestion des commandes" onMenuClick={() => setSidebarOpen(true)} /><AdminOrders /></>} />
          <Route path="deliveries" element={<><AdminHeader title="Suivi des livraisons" onMenuClick={() => setSidebarOpen(true)} /><AdminDeliveries /></>} />
          <Route path="stores" element={<><AdminHeader title="Gestion des boutiques" onMenuClick={() => setSidebarOpen(true)} /><AdminStores /></>} />
          <Route path="team" element={<><AdminHeader title="Gestion de l'équipe" onMenuClick={() => setSidebarOpen(true)} /><AdminTeam /></>} />
          <Route path="drivers" element={<Navigate to="team" replace />} />
          <Route path="catalog" element={<><AdminHeader title="Catalogue Produits" onMenuClick={() => setSidebarOpen(true)} /><AdminCatalog /></>} />
          <Route path="reports" element={<><AdminHeader title="Rapports & Analytics" onMenuClick={() => setSidebarOpen(true)} /><AdminReports /></>} />
          <Route path="settings" element={<><AdminHeader title="Paramètres" onMenuClick={() => setSidebarOpen(true)} /><AdminSettings /></>} />
          <Route path="profile" element={<><AdminHeader title="Mon Profil" onMenuClick={() => setSidebarOpen(true)} /><AdminProfile /></>} />
        </Routes>
      </div>
    </div>
  );
}

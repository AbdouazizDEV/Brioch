import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { StoreManagerSidebar } from "./layout/Sidebar";
import { StoreManagerHeader } from "./layout/Header";

// Pages
import StoreManagerDashboard from "./pages/Dashboard";
import StoreManagerOrders from "./pages/Orders";
import StoreManagerDeliveries from "./pages/Deliveries";
import StoreManagerTeam from "./pages/Team";
import StoreManagerCatalog from "./pages/Catalog";
import StoreManagerReports from "./pages/Reports";
import StoreManagerSettings from "./pages/Settings";
import StoreManagerProfile from "./pages/Profile";

export default function StoreManagerApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock: Store assigned to this manager
  const currentStore = {
    id: "1",
    name: "Brioche Dorée Almadies",
    address: "Route de l'Aéroport, Almadies",
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <StoreManagerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} storeName={currentStore.name} />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<><StoreManagerHeader title="Tableau de bord" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerDashboard storeId={currentStore.id} /></>} />
          <Route path="orders" element={<><StoreManagerHeader title="Gestion des commandes" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerOrders storeId={currentStore.id} /></>} />
          <Route path="deliveries" element={<><StoreManagerHeader title="Suivi des livraisons" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerDeliveries storeId={currentStore.id} /></>} />
          <Route path="team" element={<><StoreManagerHeader title="Gestion de l'équipe" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerTeam storeId={currentStore.id} /></>} />
          <Route path="catalog" element={<><StoreManagerHeader title="Catalogue Produits" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerCatalog storeId={currentStore.id} /></>} />
          <Route path="reports" element={<><StoreManagerHeader title="Rapports & Analytics" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerReports storeId={currentStore.id} /></>} />
          <Route path="settings" element={<><StoreManagerHeader title="Paramètres Boutique" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerSettings storeId={currentStore.id} /></>} />
          <Route path="profile" element={<><StoreManagerHeader title="Mon Profil" onMenuClick={() => setSidebarOpen(true)} storeName={currentStore.name} /><StoreManagerProfile /></>} />
        </Routes>
      </div>
    </div>
  );
}

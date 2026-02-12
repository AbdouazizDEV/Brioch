import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import AuthPage from "@/app/auth/Auth";
import ClientApp from "@/app/components/client/ClientApp";
import AdminApp from "@/app/components/admin/AdminApp";
import StoreManagerApp from "@/app/components/store-manager/StoreManagerApp";
import DeliveryApp from "@/app/components/delivery/DeliveryApp";
import KitchenApp from "@/app/components/kitchen/KitchenApp";
import VisitorApp from "@/app/components/visitor/VisitorApp";
import VisitorTracking from "@/app/components/visitor/VisitorTracking";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-white min-h-screen">
        <Routes>
          {/* Visitor Flow (Default) */}
          <Route path="/*" element={<VisitorApp />} />
          <Route path="/track/:orderId" element={<VisitorTracking />} />
          
          {/* Auth */}
          <Route path="/auth/*" element={<AuthPage />} />
          
          {/* Role Based Apps */}
          <Route path="/client/*" element={<ClientApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/store-manager/*" element={<StoreManagerApp />} />
          <Route path="/livreur/*" element={<DeliveryApp />} />
          <Route path="/cuisine/*" element={<KitchenApp />} />
        </Routes>
        <Toaster position="top-center" richColors closeButton />
      </div>
    </BrowserRouter>
  );
}
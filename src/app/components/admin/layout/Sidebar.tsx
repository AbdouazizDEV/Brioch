import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, ShoppingBag, Truck, Store, Users, Settings, 
  FileText, ClipboardList, X
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  const items = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/admin/dashboard" },
    { icon: ShoppingBag, label: "Commandes", path: "/admin/orders" },
    { icon: Truck, label: "Livraisons", path: "/admin/deliveries" },
    { icon: Store, label: "Boutiques", path: "/admin/stores" },
    { icon: Users, label: "Équipe", path: "/admin/team" },
    { icon: ClipboardList, label: "Catalogue", path: "/admin/catalog" },
    { icon: FileText, label: "Rapports", path: "/admin/reports" },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose} />}
      
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-30 w-64 bg-[#1A1A1A] text-white border-r border-gray-800 flex flex-col shadow-xl transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-[34px] border-b border-gray-800 py-[10px]">
          <img 
            src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" 
            alt="Brioche Dorée" 
            className="h-14 w-auto object-contain rounded-xl p-[0px] mx-[18px] my-[0px]"
          />
          <button onClick={onClose} className="md:hidden text-gray-400"><X size={24}/></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive(item.path) 
                  ? "bg-bds-red text-white border-l-4 border-bds-gold shadow-md" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
             <p className="text-xs text-gray-400 mb-2">Besoin d'aide ?</p>
             <button className="text-xs font-bold text-bds-gold border border-bds-gold px-3 py-1 rounded-full hover:bg-bds-gold hover:text-black transition-colors">Contacter Support</button>
          </div>
        </div>
      </aside>
    </>
  );
}

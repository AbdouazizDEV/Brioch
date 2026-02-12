import { useState } from "react";
import { Menu as MenuIcon, Bell, ChevronDown, Users, Settings, LogOut, Moon, Sun, Store } from "lucide-react";
import { NOTIFICATIONS, Notification } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { toast } from "sonner";

export function AdminHeader({ title, onMenuClick }: { title: string, onMenuClick: () => void }) {
  const [selectedStore, setSelectedStore] = useState("all");
  const STORES = [
    { id: "all", name: "Toutes les boutiques" },
    { id: "1", name: "Brioche Dorée Almadies" },
    { id: "2", name: "Brioche Dorée Mermoz" },
    { id: "3", name: "Brioche Dorée Plateau" },
  ];
  
  return (
    <header className="h-20 bg-[rgb(254,255,233)] border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
         <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-gray-600"><MenuIcon size={24}/></button>
         <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-800 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        {/* Store Selector */}
        <div className="hidden md:block relative">
          <select 
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2 rounded-lg text-sm font-medium outline-none focus:border-bds-red shadow-sm cursor-pointer min-w-[200px]"
          >
            {STORES.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
        </div>
        <NotificationsDropdown />
        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
        <ProfileDropdown />
      </div>
    </header>
  );
}

function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
      >
        <Bell size={24} className="text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-bds-red rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-xl shadow-bds-modal border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800">Notifications ({unreadCount})</h3>
                <button className="text-xs text-bds-red font-bold hover:underline">Tout marquer comme lu</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {NOTIFICATIONS.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => { setSelectedNotif(notif); setIsOpen(false); }}
                    className={cn("p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer", !notif.read && "bg-red-50/30")}
                  >
                    <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", notif.type === 'alert' ? "bg-red-500" : "bg-bds-gold")}></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-sm font-medium text-gray-600 hover:text-bds-red transition-colors">Voir tout l'historique</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {selectedNotif && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className={cn("h-32 flex items-center justify-center", selectedNotif.type === 'alert' ? "bg-red-100" : "bg-blue-50")}>
               <Bell size={48} className={selectedNotif.type === 'alert' ? "text-red-500" : "text-blue-500"} />
            </div>
            <div className="p-6">
               <h3 className="text-xl font-bold mb-2">{selectedNotif.title}</h3>
               <p className="text-gray-600 mb-4 leading-relaxed">{selectedNotif.message}</p>
               <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-4">
                 <span>{selectedNotif.time}</span>
                 <span className="uppercase font-bold tracking-wider">{selectedNotif.type}</span>
               </div>
               <BDSButton onClick={() => setSelectedNotif(null)} className="w-full mt-6">Fermer</BDSButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      toast.success("Déconnexion réussie");
      navigate('/');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(darkMode ? "Mode clair activé" : "Mode sombre activé");
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors border border-gray-200 bg-[rgba(223,49,49,0)]"
      >
        <div className="w-8 h-8 rounded-full bg-bds-red text-white flex items-center justify-center font-bold">A</div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-bold text-gray-900">Admin BDS</p>
          <p className="text-[10px] text-gray-500">Superviseur</p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-bds-modal border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                 <div className="w-10 h-10 rounded-full bg-bds-red text-white flex items-center justify-center font-bold text-lg">A</div>
                 <div>
                   <p className="font-bold text-gray-900">Admin BDS</p>
                   <p className="text-xs text-gray-500">Superviseur</p>
                   <p className="text-xs text-gray-400">admin@briochedoree.sn</p>
                 </div>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={() => { navigate('/admin/profile'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Users size={18} /> Mon profil
                </button>
                <button onClick={() => { navigate('/admin/reports'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings size={18} /> Mes statistiques
                </button>
                <button onClick={() => { navigate('/admin/settings'); setIsOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings size={18} /> Paramètres
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button 
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    <span>Mode sombre</span>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    darkMode ? "bg-bds-red" : "bg-gray-300"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                      darkMode ? "right-0.5" : "left-0.5"
                    )}></div>
                  </div>
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold">
                  <LogOut size={18} /> Se déconnecter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

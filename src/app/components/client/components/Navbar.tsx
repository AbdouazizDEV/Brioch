import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, LogOut, Package, MapPin, ChevronDown, Bell, Check, X, Store, LayoutGrid, Filter } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export function Navbar({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
      { id: 1, title: "Commande livrée", message: "Votre commande #CMD-2849 a été livrée avec succès.", time: "Il y a 2h", read: false },
      { id: 2, title: "Promo Flash", message: "-50% sur les croissants aujourd'hui seulement !", time: "Il y a 5h", read: false },
      { id: 3, title: "Points Fidélité", message: "Vous avez gagné 50 points suite à votre dernière commande.", time: "Hier", read: true }
  ];

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate('/');
  };

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-4 flex justify-between items-center",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50 py-3" : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/client')}>
        <ImageWithFallback 
          src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" 
          className="h-14 w-auto object-contain rounded-[20px]"
          alt="Brioche Dorée"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Loyalty Points Badge */}
        <div className={cn("hidden md:flex flex-col items-end mr-2", isScrolled ? "text-gray-900" : "text-white")}>
            <span className="text-xs font-medium opacity-80">Solde Points</span>
            <span className="font-serif font-bold text-lg leading-none text-bds-gold">247 pts</span>
        </div>

        {/* Search Modal Trigger */}
        <div className="relative">
            <button 
                onClick={() => setIsSearchOpen(true)}
                className={cn("p-2 rounded-full transition-colors relative group", isScrolled ? "hover:bg-gray-100 text-gray-700" : "bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white")}
            >
              <Search size={22} />
            </button>

            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsSearchOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl rounded-b-3xl overflow-hidden"
                        >
                            <div className="max-w-4xl mx-auto p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-serif font-bold text-gray-900">Recherche</h2>
                                    <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X size={24} className="text-gray-500"/>
                                    </button>
                                </div>

                                {/* Main Search Bar */}
                                <div className="relative mb-8">
                                    <input 
                                        type="text" 
                                        placeholder="Rechercher un produit (ex: Croissant, Sandwich...)" 
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-bds-gold/50 focus:bg-white rounded-2xl py-4 pl-14 pr-4 text-lg outline-none transition-all placeholder:text-gray-400"
                                        autoFocus
                                    />
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24}/>
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-bds-red text-white p-2 rounded-xl hover:bg-red-700 transition-colors">
                                        <Search size={20}/>
                                    </button>
                                </div>

                                {/* Search Types Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button className="group p-4 border border-gray-100 rounded-2xl hover:border-bds-gold/30 hover:shadow-lg transition-all text-left bg-white hover:bg-amber-50/30 flex items-center gap-4">
                                        <div className="p-3 bg-amber-100 text-amber-700 rounded-xl group-hover:bg-bds-gold group-hover:text-white transition-colors">
                                            <Store size={24}/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Par Boutique</h3>
                                            <p className="text-xs text-gray-500">Trouvez votre Brioche Dorée</p>
                                        </div>
                                    </button>

                                    <button className="group p-4 border border-gray-100 rounded-2xl hover:border-bds-gold/30 hover:shadow-lg transition-all text-left bg-white hover:bg-amber-50/30 flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <LayoutGrid size={24}/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Par Catégorie</h3>
                                            <p className="text-xs text-gray-500">Viennoiseries, Pains...</p>
                                        </div>
                                    </button>

                                    <button className="group p-4 border border-gray-100 rounded-2xl hover:border-bds-gold/30 hover:shadow-lg transition-all text-left bg-white hover:bg-amber-50/30 flex items-center gap-4">
                                        <div className="p-3 bg-red-100 text-red-700 rounded-xl group-hover:bg-bds-red group-hover:text-white transition-colors">
                                            <MapPin size={24}/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Par Localisation</h3>
                                            <p className="text-xs text-gray-500">Autour de vous</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Recent Searches (Optional placeholder) */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Recherches populaires</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Croissant au beurre", "Pizza Reine", "Jus d'orange", "Formule Déjeuner"].map((tag) => (
                                            <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-sm font-medium transition-colors">
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <div className="relative">
            <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn("p-2 rounded-full transition-colors relative group", isScrolled ? "hover:bg-gray-100 text-gray-700" : "bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white")}
            >
               <div className="absolute top-2 right-2.5 w-2 h-2 bg-bds-red rounded-full border border-white z-10 animate-pulse"></div>
               <Bell size={22} />
            </button>

            <AnimatePresence>
                {isNotificationsOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-12 md:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={18}/></button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={cn("p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3", !notif.read && "bg-blue-50/30")}>
                                        <div className={cn("w-2 h-2 mt-2 rounded-full flex-shrink-0", notif.read ? "bg-gray-300" : "bg-bds-red")}></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">{notif.title}</h4>
                                            <p className="text-xs text-gray-500 mb-2 leading-relaxed">{notif.message}</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                <button className="text-xs font-bold text-bds-red hover:underline">Tout marquer comme lu</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

        <button 
          onClick={onOpenCart}
          className={cn("p-2 rounded-full transition-colors relative group", isScrolled ? "hover:bg-gray-100 text-gray-700" : "bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white")}
        >
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-bds-gold text-black font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
        
        <div className="w-px h-6 bg-gray-300/30"></div>
        
        {/* Profile Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={cn("w-10 h-10 rounded-full border-2 overflow-hidden cursor-pointer hover:scale-105 transition-transform", isScrolled ? "border-gray-200" : "border-white/50")}
            >
                <ImageWithFallback src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
            </button>

            <AnimatePresence>
                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <p className="font-bold text-gray-900">Fatou Diop</p>
                                <p className="text-xs text-gray-500">fatou.diop@example.com</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button onClick={() => { navigate('/client/profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <User size={18} /> Mon Profil
                                </button>
                                <button onClick={() => { navigate('/client/profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Package size={18} /> Mes Commandes
                                </button>
                                <button onClick={() => { navigate('/client/tracking'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <MapPin size={18} /> Suivi en cours
                                </button>
                            </div>
                            <div className="p-2 border-t border-gray-100">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold">
                                    <LogOut size={18} /> Déconnexion
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

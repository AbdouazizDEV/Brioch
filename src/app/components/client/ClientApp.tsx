import { Routes, Route, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { 
  MapPin, Search, ShoppingBag, Star, Clock, Menu, Globe, User, 
  ChevronDown, Filter, Plus, Minus, CreditCard, ArrowRight, 
  MessageCircle, Phone, X, CheckCircle, Home, Heart, History,
  Navigation, Map as MapIcon, ChevronRight, ShoppingCart, 
  FileText, Download, RefreshCw, Shield, Bell, Gift, Users,
  BarChart2, Lock, Smartphone, LogOut, Trash2, Edit2, Zap,
  Info, AlertCircle, Crosshair, ChevronLeft, LogIn, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// --- Types & Mock Data ---

const STORES = [
  { id: 1, name: "Brioche Dorée Almadies", distance: "2.3 km", status: "Ouverte", stock: "Dispo", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" },
  { id: 2, name: "Brioche Dorée Fann", distance: "4.1 km", status: "Ouverte", stock: "Limit", image: "https://images.unsplash.com/photo-1507914372817-54992bb94cee?auto=format&fit=crop&q=80" },
  { id: 3, name: "Brioche Dorée Plateau", distance: "8.5 km", status: "Fermée", stock: "-", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80" },
  { id: 4, name: "Brioche Dorée Mermoz", distance: "1.2 km", status: "Ouverte", stock: "Dispo", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" },
];

const CATEGORIES = [
  { id: "viennoiserie", name: "Viennoiseries", icon: "🥐" },
  { id: "pain", name: "Pains", icon: "🥖" },
  { id: "patisserie", name: "Pâtisseries", icon: "🧁" },
  { id: "sandwich", name: "Sandwichs", icon: "🥪" },
  { id: "boisson", name: "Boissons", icon: "☕" },
];

const HABITS = [
  { id: 101, name: "Croissant Beurre", price: 1500, desc: "Pur beurre AOP, croustillant et fondant.", image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80", cat: "viennoiserie", cal: "280 kcal" },
  { id: 102, name: "Pain Chocolat", price: 1800, desc: "Deux barres de chocolat noir intense.", image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&q=80", cat: "viennoiserie", cal: "310 kcal" },
  { id: 103, name: "Sandwich Poulet", price: 3500, desc: "Poulet rôti, mayonnaise maison, crudités.", image: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80", cat: "sandwich", cal: "450 kcal" },
  { id: 104, name: "Café Allongé", price: 1200, desc: "100% Arabica, torréfaction artisanale.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80", cat: "boisson", cal: "5 kcal" },
];

const FULL_CATALOG = [
  ...HABITS,
  { id: 201, name: "Tarte Citron", price: 2200, desc: "Crème citron acidulée sur fond sablé.", image: "https://images.unsplash.com/photo-1519915093129-c5c63d50ef7b?auto=format&fit=crop&q=80", cat: "patisserie", cal: "320 kcal" },
  { id: 202, name: "Baguette Trad.", price: 500, desc: "Farine de blé française, levain liquide.", image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80", cat: "pain", cal: "210 kcal" },
  { id: 203, name: "Jus d'Orange", price: 2000, desc: "Pressé minute, oranges locales.", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80", cat: "boisson", cal: "120 kcal" },
  { id: 204, name: "Éclair Chocolat", price: 1500, desc: "Pâte à choux garnie de crème pâtissière chocolat.", image: "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80", cat: "patisserie", cal: "290 kcal" },
  { id: 205, name: "Wrap Thon", price: 3000, desc: "Galette de blé, thon, œuf, tomate.", image: "https://images.unsplash.com/photo-1626078436812-780c10e05e55?auto=format&fit=crop&q=80", cat: "sandwich", cal: "380 kcal" },
];

const ORDERS_HISTORY = [
  { id: "BDS-091", date: "11 Fév • 14:30", total: 12450, status: "En cours", items: ["Croissant x2", "Pain Choco x1"], rating: 0 },
  { id: "BDS-088", date: "09 Fév • 12:15", total: 8500, status: "Livrée", items: ["Sandwich Poulet x2", "Coca x2"], rating: 5 },
  { id: "BDS-045", date: "01 Fév • 09:00", total: 4200, status: "Annulée", items: ["Café x2", "Tarte x1"], rating: 0 },
  { id: "BDS-012", date: "28 Jan • 18:45", total: 15000, status: "Livrée", items: ["Gâteau Anniv x1"], rating: 4 },
];

const NOTIFICATIONS = [
  { id: 1, type: "order", title: "Commande prête", msg: "Votre commande #BDS-091 est en route.", time: "2 min", read: false },
  { id: 2, type: "promo", title: "Promo -50%", msg: "Sur tous les sandwichs aujourd'hui !", time: "2h", read: false },
  { id: 3, type: "alert", title: "Sécurité", msg: "Nouvelle connexion détectée.", time: "1j", read: true },
];

const SPENDING_DATA = [
  { name: 'Lun', amount: 4500 }, { name: 'Mar', amount: 1200 }, { name: 'Mer', amount: 8500 },
  { name: 'Jeu', amount: 3200 }, { name: 'Ven', amount: 6000 }, { name: 'Sam', amount: 12000 }, { name: 'Dim', amount: 2000 },
];

// --- Shared Components ---

const ProductCard = ({ product, onClick, onAdd, isFavorite, onToggleFavorite, compact = false }: { product: any, onClick: () => void, onAdd: () => void, isFavorite: boolean, onToggleFavorite: () => void, compact?: boolean }) => {
  const isNew = product.isNew || Math.random() > 0.7; // Simuler nouveau
  const isPromo = Math.random() > 0.8; // Simuler promo
  const isPreferred = isFavorite || Math.random() > 0.85; // Simuler préféré
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all hover:shadow-md group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden w-full h-36 md:h-48 shrink-0">
        <ImageWithFallback src={product.image} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isPromo && (
            <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
              PROMO
            </span>
          )}
          {isNew && (
            <span className="bg-[#FFD700] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
              NOUVEAU
            </span>
          )}
          {isPreferred && !isFavorite && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
              PRÉFÉRÉ
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
        >
          <Heart size={16} className={cn("transition-colors", isFavorite ? "fill-[#D32F2F] text-[#D32F2F]" : "text-gray-500")} />
        </button>

        {/* Add Button */}
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="absolute bottom-3 right-3 w-10 h-10 bg-white text-[#D32F2F] rounded-full flex items-center justify-center shadow-lg hover:bg-[#D32F2F] hover:text-white transition-colors z-10"><Plus size={20} /></button>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-bold text-gray-900 leading-tight text-sm md:text-base line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isPromo ? (
              <>
                <span className="text-gray-400 line-through text-xs">{product.price} F</span>
                <span className="text-[#D32F2F] font-bold text-sm md:text-base">{Math.floor(product.price * 0.8)} F</span>
              </>
            ) : (
              <span className="text-[#D32F2F] font-bold text-sm md:text-base">{product.price} F</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ store, onStoreClick, cartCount, onCartClick, onNotifClick, onNavigate, onLogout, isLoggedIn, unreadNotifCount = 0 }: any) => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto max-w-7xl px-4 md:px-6">
      <div className="md:hidden flex justify-between items-center py-3 border-b border-gray-100">
        <button className="p-2 -ml-2 text-gray-700"><Menu size={24} /></button>
        <span className="font-serif font-bold text-xl text-[#D32F2F] tracking-tight">Brioche Dorée</span>
        <div className="flex items-center gap-3">
          <button onClick={onNotifClick} className="relative text-gray-700">
            <Bell size={24}/>
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D32F2F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            )}
          </button>
          <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" alt="Profile" /></div>
        </div>
      </div>
      <div className="md:hidden py-3 bg-[#FFF8E7] -mx-4 px-4 flex justify-between items-center cursor-pointer border-b border-[#D32F2F]/10" onClick={onStoreClick}>
        <div className="flex items-center gap-2 overflow-hidden"><MapPin size={18} className="text-[#D32F2F] shrink-0" /><div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Votre boutique</span><span className="text-sm font-bold text-gray-900 truncate flex items-center gap-1">{store ? store.name : "Sélectionner une boutique"} <ChevronDown size={14} /></span></div></div><button className="p-2 bg-white rounded-full shadow-sm text-gray-600"><Filter size={16} /></button>
      </div>
      <div className="hidden md:flex h-20 items-center justify-between gap-8">
         <div className="flex items-center gap-8">
            <img src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497439/brioche4_ijsecr.webp" alt="Brioche Dorée" className="h-10 w-auto object-contain" />
            <div onClick={onStoreClick} className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl cursor-pointer transition-colors border border-gray-200"><div className="w-10 h-10 bg-[#FFF8E7] rounded-full flex items-center justify-center text-[#D32F2F]"><MapPin size={20}/></div><div><div className="text-[10px] font-bold text-gray-500 uppercase">Boutique actuelle</div><div className="font-bold text-gray-900 text-sm flex items-center gap-1">{store?.name} <ChevronDown size={14}/></div></div></div>
            <div className="relative w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input placeholder="Rechercher des produits..." className="w-full h-12 bg-gray-50 rounded-full pl-12 pr-4 border border-transparent focus:bg-white focus:border-[#D32F2F] focus:ring-4 focus:ring-[#D32F2F]/10 outline-none transition-all"/></div>
         </div>
         <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"><Globe size={18}/> Français</button>
             <button onClick={onNotifClick} className="relative p-3 hover:bg-red-50 text-gray-600 hover:text-[#D32F2F] rounded-full transition-colors">
               <Bell size={24} />
               {unreadNotifCount > 0 && (
                 <span className="absolute top-1 right-2 w-5 h-5 bg-[#D32F2F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                   {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                 </span>
               )}
             </button>
             <button onClick={onCartClick} className="relative p-3 hover:bg-red-50 text-gray-600 hover:text-[#D32F2F] rounded-full transition-colors"><ShoppingCart size={24} />{cartCount > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-[#D32F2F] text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}</button>
             
             {/* Dropdown Profile Menu */}
             {isLoggedIn ? (
               <div className="relative group outline-none" tabIndex={0}>
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
                     <div className="text-right hidden lg:block">
                        <div className="font-bold text-gray-900">Mamadou</div>
                        <div className="text-xs text-gray-500">Client Fidèle</div>
                     </div>
                     <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-[#D32F2F] transition-all">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" alt="Profile" />
                     </div>
                  </div>

                  <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-focus:opacity-100 group-focus:visible transition-all duration-300 transform origin-top-right z-[100] scale-95 group-focus:scale-100">
                     <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-bold text-gray-900">Mamadou Diop</p>
                        <p className="text-xs text-gray-500 font-medium">mamadou.diop@orange.sn</p>
                     </div>
                     <div className="p-2 space-y-1">
                        <button onClick={() => onNavigate('favorites')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#D32F2F] rounded-xl transition-colors">
                           <Heart size={18} /> Mes Favoris
                        </button>
                        <button onClick={() => onNavigate('orders')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#D32F2F] rounded-xl transition-colors">
                           <History size={18} /> Commandes
                        </button>
                        <button onClick={() => onNavigate('loyalty')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#D32F2F] rounded-xl transition-colors">
                           <Users size={18} /> Parrainage
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#D32F2F] hover:bg-red-50 rounded-xl transition-colors">
                           <LogOut size={18} /> Se déconnecter
                        </button>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="pl-4 border-l border-gray-200">
                  <button onClick={() => onNavigate('login')} className="flex items-center gap-2 bg-[#D32F2F] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#B71C1C] transition-colors shadow-sm">
                     <LogIn size={18} /> Se connecter
                  </button>
               </div>
             )}

         </div>
      </div>
    </div>
  </header>
);

const BottomNav = ({ active, onChange, cartCount }: { active: string, onChange: (v: string) => void, cartCount: number }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-40 md:hidden">
    {[
      { id: "home", icon: Home, label: "Accueil" },
      { id: "orders", icon: History, label: "Commandes" },
      { id: "loyalty", icon: Gift, label: "Fidélité" },
      { id: "profile", icon: User, label: "Profil" },
    ].map(item => (
      <button 
        key={item.id} 
        onClick={() => onChange(item.id)}
        className={cn("flex flex-col items-center gap-1 w-16 py-1 transition-colors relative", active === item.id ? "text-[#D32F2F]" : "text-gray-400")}
      >
        <item.icon size={24} strokeWidth={active === item.id ? 2.5 : 2} />
        <span className="text-[10px] font-bold">{item.label}</span>
      </button>
    ))}
  </nav>
);

const DesktopSidebar = ({ active, onChange }: { active: string, onChange: (v: string) => void }) => (
   <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-[calc(100vh-80px)] sticky top-20 p-4">
      <div className="space-y-2">
         {[
           { id: "home", icon: Home, label: "Accueil" },
           { id: "orders", icon: History, label: "Mes Commandes" },
           { id: "favorites", icon: Heart, label: "Favoris" },
           { id: "loyalty", icon: Gift, label: "Fidélité & Parrainage" },
           { id: "profile", icon: User, label: "Mon Profil" },
         ].map(item => (
           <button 
             key={item.id} 
             onClick={() => onChange(item.id)}
             className={cn(
                "flex items-center gap-3 w-full p-3 rounded-xl transition-all font-bold", 
                active === item.id ? "bg-red-50 text-[#D32F2F]" : "text-gray-600 hover:bg-gray-50"
             )}
           >
             <item.icon size={20} />
             <span>{item.label}</span>
           </button>
         ))}
      </div>
      
      <div className="mt-auto pt-6 border-t border-gray-100">
         <div className="bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start mb-2">
               <Star className="text-[#FFD700] fill-current" size={20} />
               <span className="text-xs font-mono opacity-80">Niveau OR</span>
            </div>
            <div className="text-2xl font-bold mb-1">1,250 pts</div>
            <div className="text-xs opacity-80 mb-3">Plus que 250 pts pour Platine</div>
            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
               <div className="h-full bg-[#FFD700] w-[80%]"></div>
            </div>
         </div>
      </div>
   </div>
);

// --- Views & Modals ---

const FavoritesView = ({ favorites, onAdd, onToggleFavorite, onExplore }: { favorites: number[], onAdd: (item: any) => void, onToggleFavorite: (id: number) => void, onExplore: () => void }) => {
    const favProducts = FULL_CATALOG.filter(p => favorites.includes(p.id));
    
    if (favProducts.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Heart size={48} className="text-[#D32F2F]/30" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun favori pour le moment</h2>
            <p className="text-gray-500 max-w-sm mb-8">Marquez vos produits préférés avec un cœur pour les retrouver rapidement ici.</p>
            <button onClick={onExplore} className="px-8 py-3 bg-[#D32F2F] text-white rounded-xl font-bold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-red-200">
                Explorer le menu
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="text-[#D32F2F] fill-current"/> Mes Favoris ({favProducts.length})
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {favProducts.map(p => (
                   <ProductCard 
                      key={p.id} 
                      product={p} 
                      onAdd={() => onAdd(p)} 
                      onClick={() => {}} 
                      isFavorite={true}
                      onToggleFavorite={() => onToggleFavorite(p.id)}
                   />
                ))}
             </div>
        </div>
    );
};

const ProductDetailModal = ({ product, onClose, onAdd }: { product: any, onClose: () => void, onAdd: (qty: number) => void }) => {
   const [quantity, setQuantity] = useState(1);
   
   if (!product) return null;

   return (
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
         onClick={onClose}
      >
         <motion.div 
            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:h-auto"
            onClick={e => e.stopPropagation()}
         >
            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
               <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
               <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-black hover:bg-white transition-colors">
                  <X size={20}/>
               </button>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
               <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                     <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                     <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-sm bg-[#FFF8E7] px-2 py-1 rounded-full">
                        <Star size={14} fill="currentColor"/> 4.8
                     </div>
                  </div>
                  <div className="text-xl font-bold text-[#D32F2F] mb-4">{product.price} FCFA</div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                     {product.desc || "Une délicieuse spécialité préparée avec soin par nos artisans boulangers. Ingrédients frais et de qualité garantis."}
                  </p>

                  <div className="flex gap-4 mb-6">
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <Zap size={14} className="text-orange-500"/> {product.cal || "250 kcal"}
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <Clock size={14} className="text-blue-500"/> 15 min
                     </div>
                  </div>

                  {/* Options Mock */}
                  <div className="space-y-3 mb-6">
                     <h4 className="font-bold text-sm text-gray-900">Suppléments</h4>
                     <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 rounded text-[#D32F2F] focus:ring-[#D32F2F]" />
                        <span className="text-sm font-medium flex-1">Fromage Extra</span>
                        <span className="text-sm font-bold text-gray-500">+300 F</span>
                     </label>
                  </div>
               </div>

               <div className="border-t border-gray-100 pt-6 mt-auto">
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-[#D32F2F] disabled:opacity-50"><Minus size={18}/></button>
                        <span className="font-bold text-lg min-w-[20px] text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-[#D32F2F]"><Plus size={18}/></button>
                     </div>
                     <button 
                        onClick={() => onAdd(quantity)}
                        className="flex-1 bg-[#D32F2F] text-white h-12 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-[#B71C1C] active:scale-95 transition-all flex items-center justify-center gap-2"
                     >
                        Ajouter {(product.price * quantity).toLocaleString()} F
                     </button>
                  </div>
               </div>
            </div>
         </motion.div>
      </motion.div>
   );
};

const OrdersView = ({ onReorder }: { onReorder: () => void }) => {
   const [filter, setFilter] = useState("all");
   const [selectedOrder, setSelectedOrder] = useState<any>(null);
   
   // Générer plus de commandes pour le suivi multi-commandes
   const allOrders = [
      ...ORDERS_HISTORY,
      { id: "BDS-090", date: "10 Fév • 16:20", total: 6800, status: "En cours", items: ["Croissant x3", "Café x1"], rating: 0 },
      { id: "BDS-089", date: "09 Fév • 18:45", total: 15200, status: "Livrée", items: ["Sandwich Poulet x2", "Jus x2"], rating: 5 },
      { id: "BDS-087", date: "08 Fév • 12:30", total: 5400, status: "Livrée", items: ["Pain Choco x2"], rating: 4 },
      { id: "BDS-086", date: "07 Fév • 09:15", total: 9200, status: "Livrée", items: ["Tarte x1", "Café x2"], rating: 5 },
      { id: "BDS-085", date: "06 Fév • 14:00", total: 11000, status: "Livrée", items: ["Wrap x2"], rating: 4 },
   ];
   
   const filtered = allOrders.filter(o => {
      if (filter === "all") return true;
      if (filter === "En cours") return o.status === "En cours" || o.status === "En préparation" || o.status === "En livraison";
      return o.status === filter;
   });
   
   const handleDownloadPDF = (orderId: string) => {
      toast.success(`Téléchargement du reçu ${orderId}...`);
      // Simuler téléchargement PDF
      setTimeout(() => {
         toast.success("Reçu téléchargé avec succès !");
      }, 1000);
   };
   
   const handleReorder = (order: any) => {
      toast.success(`Commande ${order.id} ajoutée au panier !`);
      onReorder();
   };

   return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
               <p className="text-sm text-gray-500 mt-1">{filtered.length} commande{filtered.length > 1 ? 's' : ''} {filter !== "all" && `(${filter})`}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {["all", "En cours", "Livrée", "Annulée"].map(f => (
                  <button 
                     key={f} 
                     onClick={() => setFilter(f)} 
                     className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0",
                        filter === f ? "bg-[#D32F2F] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                     )}
                  >
                     {f === "all" ? "Tout" : f}
                  </button>
               ))}
            </div>
         </div>
         <div className="space-y-4">
            {filtered.map(order => (
               <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                     <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm shrink-0", order.status === "Livrée" ? "bg-green-500" : order.status === "Annulée" ? "bg-red-500" : "bg-orange-500")}>
                        {order.status === "Livrée" ? <CheckCircle size={20}/> : order.status === "Annulée" ? <X size={20}/> : <Clock size={20}/>}
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-gray-900 text-lg">{order.total} FCFA</span>
                           <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold uppercase", order.status === "Livrée" ? "bg-green-100 text-green-700" : order.status === "Annulée" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700")}>{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">{order.date} • {order.items.join(", ")}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                     {order.status === "Livrée" && (
                        <button 
                           onClick={() => handleReorder(order)} 
                           className="flex-1 md:flex-none px-4 py-2 bg-[#D32F2F] text-white rounded-xl text-sm font-bold shadow-md shadow-red-100 hover:bg-[#B71C1C] transition-colors flex items-center justify-center gap-2 active:scale-95"
                        >
                           <RefreshCw size={16}/> RECOMMANDER
                        </button>
                     )}
                     <button 
                        onClick={() => handleDownloadPDF(order.id)} 
                        className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                        title="Télécharger le reçu PDF"
                     >
                        <Download size={18}/>
                     </button>
                     <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                        title="Voir les détails"
                     >
                        <ChevronRight size={18}/>
                     </button>
                  </div>
               </div>
            ))}
         </div>
         <AnimatePresence>
            {selectedOrder && (
               <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-lg">Détails {selectedOrder.id}</h3><button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full"><X size={20}/></button></div>
                     <div className="p-6">
                        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                           {["Commande reçue", "Préparation cuisine", "En livraison", "Livrée"].map((step, i) => (
                              <div key={i} className="relative">
                                 <div className={cn("absolute -left-[29px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center", i <= 2 ? "bg-green-500" : "bg-gray-300")}>{i <= 2 && <CheckCircle size={12} className="text-white"/>}</div>
                                 <p className={cn("font-bold text-sm", i <= 2 ? "text-gray-900" : "text-gray-400")}>{step}</p>
                                 <p className="text-xs text-gray-400">{i <= 2 ? "14:35" : "--:--"}</p>
                              </div>
                           ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                           <div className="flex justify-between font-bold text-lg mb-4"><span>Total payé</span><span className="text-[#D32F2F]">{selectedOrder.total} F</span></div>
                           <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-50"><FileText size={20}/> Télécharger Facture PDF</button>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

const LoyaltyView = () => {
   const pointsHistory = [
      { date: "11 Fév 2025", action: "Commande BDS-091", points: "+25", type: "earned" },
      { date: "09 Fév 2025", action: "Parrainage ami", points: "+50", type: "earned" },
      { date: "08 Fév 2025", action: "Commande BDS-089", points: "+15", type: "earned" },
      { date: "05 Fév 2025", action: "Code promo utilisé", points: "-100", type: "spent" },
      { date: "01 Fév 2025", action: "Commande BDS-087", points: "+12", type: "earned" }
   ];
   
   const activePromoCodes = [
      { code: "SILVER20", discount: "20%", validUntil: "28 Fév 2025", used: false },
      { code: "FIDELITE50", discount: "500 pts", validUntil: "15 Mar 2025", used: false },
      { code: "WELCOME10", discount: "10%", validUntil: "20 Fév 2025", used: true }
   ];
   
   const tierBenefits = {
      Bronze: ["1 point / 100 FCFA", "Accès aux offres de base"],
      Silver: ["1.5 points / 100 FCFA", "Offres exclusives", "Livraison gratuite > 10k F"],
      Gold: ["2 points / 100 FCFA", "Offres premium", "Livraison gratuite > 5k F", "Support prioritaire"],
      Platinum: ["2.5 points / 100 FCFA", "Toutes les offres", "Livraison toujours gratuite", "Concierge dédié"]
   };
   
   return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 space-y-6">
         <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
               <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold mb-2 border border-[#FFD700]/30">
                     <Star size={14} fill="currentColor"/> NIVEAU SILVER 🥈
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">247 <span className="text-lg opacity-60 font-normal">pts</span></h1>
                  <p className="text-gray-400">Plus que 53 points pour Gold 🥇</p>
               </div>
               <div className="w-32 h-32 relative">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
                     <circle cx="64" cy="64" r="56" stroke="#FFD700" strokeWidth="8" fill="none" strokeDasharray="351" strokeDashoffset="63" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">82%</div>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-8 pt-8 border-t border-white/10">
               {["Bronze", "Silver", "Gold", "Platinum"].map((tier, i) => (
                  <div key={tier} className="flex flex-col items-center gap-2">
                     <div className={cn("w-3 h-3 rounded-full", i <= 1 ? "bg-[#FFD700]" : "bg-gray-600")}></div>
                     <span className={cn("text-xs font-bold uppercase", i <= 1 ? "text-white" : "text-gray-600")}>{tier}</span>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Récompenses */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Gift className="text-[#D32F2F]"/> Mes Récompenses
               </h3>
               <div className="space-y-4">
                  {[
                     { pts: 500, label: "Café offert", unlocked: true },
                     { pts: 1000, label: "-20% sur la commande", unlocked: true },
                     { pts: 2000, label: "Menu complet offert", unlocked: false }
                  ].map((reward, i) => (
                     <div key={i} className={cn(
                        "flex justify-between items-center p-4 rounded-xl border",
                        reward.unlocked ? "border-[#D32F2F]/20 bg-red-50" : "border-gray-100 bg-gray-50 opacity-60"
                     )}>
                        <div className="flex items-center gap-3">
                           <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs",
                              reward.unlocked ? "bg-[#D32F2F] text-white" : "bg-gray-200 text-gray-500"
                           )}>
                              {reward.pts}
                           </div>
                           <span className="font-bold text-gray-900">{reward.label}</span>
                        </div>
                        {reward.unlocked ? (
                           <button className="px-3 py-1 bg-white text-[#D32F2F] text-xs font-bold rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                              Utiliser
                           </button>
                        ) : (
                           <Lock size={16} className="text-gray-400"/>
                        )}
                     </div>
                  ))}
               </div>
            </div>
            
            {/* Parrainage */}
            <div className="bg-[#D32F2F] p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold text-2xl mb-2">Parrainez un ami 🎁</h3>
                  <p className="opacity-90 mb-6">Gagnez 50 points pour chaque ami invité.</p>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex justify-between items-center mb-4">
                     <span className="font-mono text-xl tracking-widest font-bold">MAMADOU-24</span>
                     <button 
                        onClick={() => {
                           navigator.clipboard.writeText("MAMADOU-24");
                           toast.success("Code copié !");
                        }}
                        className="text-xs font-bold bg-white text-[#D32F2F] px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                     >
                        COPIER
                     </button>
                  </div>
                  <button className="w-full py-3 bg-white text-[#D32F2F] rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-colors">
                     PARTAGER LE CODE
                  </button>
               </div>
               <Users className="absolute -bottom-6 -right-6 text-white/10" size={180} />
            </div>
         </div>
         
         {/* Historique Points */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <History className="text-[#D32F2F]"/> Historique des Points
            </h3>
            <div className="space-y-3">
               {pointsHistory.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                           "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                           entry.type === "earned" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                           {entry.type === "earned" ? "+" : "-"}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{entry.action}</p>
                           <p className="text-xs text-gray-500">{entry.date}</p>
                        </div>
                     </div>
                     <span className={cn(
                        "font-bold text-sm",
                        entry.type === "earned" ? "text-green-600" : "text-red-600"
                     )}>
                        {entry.points} pts
                     </span>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Codes Promo Actifs */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Gift className="text-[#D32F2F]"/> Codes Promo Actifs
            </h3>
            <div className="space-y-3">
               {activePromoCodes.map((promo, i) => (
                  <div key={i} className={cn(
                     "flex items-center justify-between p-4 rounded-xl border",
                     promo.used ? "bg-gray-50 border-gray-200 opacity-60" : "bg-[#FFF8E7] border-[#D4AF37]/20"
                  )}>
                     <div className="flex items-center gap-3">
                        <div className={cn(
                           "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs",
                           promo.used ? "bg-gray-200 text-gray-500" : "bg-[#D32F2F] text-white"
                        )}>
                           {promo.discount}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{promo.code}</p>
                           <p className="text-xs text-gray-500">Valide jusqu'au {promo.validUntil}</p>
                        </div>
                     </div>
                     {promo.used ? (
                        <span className="text-xs font-bold text-gray-500">Utilisé</span>
                     ) : (
                        <button className="px-4 py-2 bg-[#D32F2F] text-white text-xs font-bold rounded-lg hover:bg-[#B71C1C] transition-colors">
                           Utiliser
                        </button>
                     )}
                  </div>
               ))}
            </div>
         </div>
         
         {/* Avantages par Niveau */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Star className="text-[#D32F2F]"/> Avantages par Niveau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {Object.entries(tierBenefits).map(([tier, benefits]) => (
                  <div key={tier} className={cn(
                     "p-4 rounded-xl border",
                     tier === "Silver" ? "border-[#FFD700] bg-yellow-50" : "border-gray-200 bg-gray-50"
                  )}>
                     <h4 className="font-bold text-gray-900 mb-2">{tier}</h4>
                     <ul className="space-y-1 text-sm text-gray-600">
                        {benefits.map((benefit, i) => (
                           <li key={i} className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-600 shrink-0"/>
                              {benefit}
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const ProfileView = ({ onLogout }: { onLogout: () => void }) => {
   const [editingField, setEditingField] = useState<string | null>(null);
   const [userInfo, setUserInfo] = useState({
      firstName: "Mamadou",
      lastName: "Diop",
      email: "mamadou.diop@orange.sn",
      phone: "+221 77 123 45 67",
      emailVerified: true,
      phoneVerified: true
   });
   const [addresses, setAddresses] = useState([
      { id: "addr1", label: "Route des Almadies, Villa 12", isDefault: true },
      { id: "addr2", label: "Mermoz, Rue 15, Villa 8", isDefault: false },
      { id: "addr3", label: "Plateau, Avenue Pompidou", isDefault: false }
   ]);
   const [savedPayments, setSavedPayments] = useState([
      { id: "pay1", method: "orange", name: "Orange Money", phone: "+221 77 123 45 67", logo: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/Orange-Money-recrute-pour-ces-02-postes-08-Novembre-2024_wr0bvp.png" },
      { id: "pay2", method: "wave", name: "Wave", phone: "+221 77 123 45 67", logo: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/images_2_nnjbsa.png" }
   ]);
   const [twoFAEnabled, setTwoFAEnabled] = useState(true);
   const [notifications, setNotifications] = useState({
      email: true,
      sms: true,
      push: true
   });
   
   const handleEditField = (field: string) => {
      setEditingField(field);
   };
   
   const handleSaveField = (field: string, value: string) => {
      setUserInfo({ ...userInfo, [field]: value });
      setEditingField(null);
      toast.success("Information mise à jour !");
   };
   
   return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 space-y-6">
         <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
         
         {/* Statistiques améliorées */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart2 className="text-[#D32F2F]"/> Statistiques</h3>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={SPENDING_DATA}>
                        <defs><linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D32F2F" stopOpacity={0.2}/><stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 10px 20px rgba(0,0,0,0.1)'}} />
                        <Area type="monotone" dataKey="amount" stroke="#D32F2F" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                   <div className="text-center"><div className="text-2xl font-bold text-gray-900">47</div><div className="text-xs text-gray-500 uppercase">Commandes</div></div>
                   <div className="text-center border-x border-gray-100"><div className="text-2xl font-bold text-gray-900">285k</div><div className="text-xs text-gray-500 uppercase">Dépensé (FCFA)</div></div>
                   <div className="text-center"><div className="text-2xl font-bold text-[#D32F2F]">Croissant</div><div className="text-xs text-gray-500 uppercase">Favori</div></div>
               </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-lg text-white">
               <div className="flex items-start justify-between mb-8"><div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><Zap size={24} className="text-yellow-400 fill-current"/></div><span className="text-xs font-bold bg-black/20 px-2 py-1 rounded-lg">INSIGHT IA</span></div>
               <p className="text-lg font-medium leading-relaxed mb-4">"Vous commandez souvent le <span className="font-bold text-yellow-300">Mardi matin</span>. On vous prépare un café ?"</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">Commander mon habituel</button>
            </div>
         </div>
         
         {/* Informations Personnelles avec édition */}
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold bg-gray-50">Informations Personnelles</div>
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1">
                     <User className="text-gray-400"/>
                     <div className="flex-1">
                        {editingField === 'name' ? (
                           <div className="flex gap-2">
                              <input 
                                 defaultValue={`${userInfo.firstName} ${userInfo.lastName}`}
                                 className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                 onBlur={(e) => {
                                    const parts = e.target.value.split(' ');
                                    if (parts.length >= 2) {
                                       handleSaveField('firstName', parts[0]);
                                       handleSaveField('lastName', parts.slice(1).join(' '));
                                    }
                                 }}
                                 autoFocus
                              />
                           </div>
                        ) : (
                           <div>
                              <div className="text-sm font-bold">{userInfo.firstName} {userInfo.lastName}</div>
                              <div className="text-xs text-gray-500">Nom & Prénom</div>
                           </div>
                        )}
                     </div>
                  </div>
                  <button onClick={() => handleEditField('name')} className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
               </div>
               
               <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1">
                     <Phone className="text-gray-400"/>
                     <div className="flex-1">
                        {editingField === 'phone' ? (
                           <div className="flex gap-2">
                              <input 
                                 defaultValue={userInfo.phone}
                                 className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                 onBlur={(e) => handleSaveField('phone', e.target.value)}
                                 autoFocus
                              />
                           </div>
                        ) : (
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold">{userInfo.phone}</span>
                                 {userInfo.phoneVerified && <CheckCircle size={14} className="text-green-600"/>}
                              </div>
                              <div className="text-xs text-gray-500">Téléphone {userInfo.phoneVerified ? "✓ Vérifié" : "(Non vérifié)"}</div>
                           </div>
                        )}
                     </div>
                  </div>
                  <button onClick={() => handleEditField('phone')} className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
               </div>
               
               <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1">
                     <Mail className="text-gray-400"/>
                     <div className="flex-1">
                        {editingField === 'email' ? (
                           <div className="flex gap-2">
                              <input 
                                 type="email"
                                 defaultValue={userInfo.email}
                                 className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                                 onBlur={(e) => handleSaveField('email', e.target.value)}
                                 autoFocus
                              />
                           </div>
                        ) : (
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold">{userInfo.email}</span>
                                 {userInfo.emailVerified && <CheckCircle size={14} className="text-green-600"/>}
                              </div>
                              <div className="text-xs text-gray-500">Email {userInfo.emailVerified ? "✓ Vérifié" : "(Non vérifié)"}</div>
                           </div>
                        )}
                     </div>
                  </div>
                  <button onClick={() => handleEditField('email')} className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
               </div>
            </div>
         </div>
         
         {/* Gestion Adresses */}
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold bg-gray-50 flex items-center justify-between">
               <span>Gestion des Adresses</span>
               <button className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1">
                  <Plus size={14}/> Ajouter
               </button>
            </div>
            <div className="p-6 space-y-3">
               {addresses.map(addr => (
                  <div key={addr.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                     <div className="flex items-center gap-3 flex-1">
                        <MapPin className="text-gray-400" size={18}/>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{addr.label}</span>
                              {addr.isDefault && (
                                 <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">DÉFAUT</span>
                              )}
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
                        <button className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Gestion Paiements */}
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold bg-gray-50 flex items-center justify-between">
               <span>Moyens de Paiement Sauvegardés</span>
               <button className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1">
                  <Plus size={14}/> Ajouter
               </button>
            </div>
            <div className="p-6 space-y-3">
               {savedPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                     <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-8 rounded bg-white border border-gray-100 overflow-hidden shrink-0">
                           <img src={payment.logo} alt={payment.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-900">{payment.name}</div>
                           <div className="text-xs text-gray-500">{payment.phone}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
                        <button className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Sécurité */}
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold bg-gray-50">Sécurité & Connexion</div>
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <Shield className="text-green-600"/>
                     <div>
                        <div className="text-sm font-bold">Double Authentification (2FA)</div>
                        <div className="text-xs text-gray-500">Sécuriser mon compte</div>
                     </div>
                  </div>
                  <button 
                     onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                     className={cn(
                        "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
                        twoFAEnabled ? "bg-green-500" : "bg-gray-300"
                     )}
                  >
                     <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        twoFAEnabled ? "right-1" : "left-1"
                     )}></div>
                  </button>
               </div>
               <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-3">
                     <Smartphone className="text-gray-400"/>
                     <div>
                        <div className="text-sm font-bold">Appareils Connectés</div>
                        <div className="text-xs text-gray-500">iPhone 13, MacBook Pro (2 actifs)</div>
                     </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400"/>
               </div>
            </div>
         </div>
         
         {/* Notifications */}
         <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold bg-gray-50">Préférences de Notifications</div>
            <div className="p-6 space-y-4">
               {[
                  { key: 'email', label: 'Notifications Email', icon: Mail },
                  { key: 'sms', label: 'Notifications SMS', icon: MessageCircle },
                  { key: 'push', label: 'Notifications Push', icon: Bell }
               ].map(notif => (
                  <div key={notif.key} className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <notif.icon className="text-gray-400" size={18}/>
                        <div className="text-sm font-bold">{notif.label}</div>
                     </div>
                     <button 
                        onClick={() => setNotifications({...notifications, [notif.key]: !notifications[notif.key as keyof typeof notifications]})}
                        className={cn(
                           "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
                           notifications[notif.key as keyof typeof notifications] ? "bg-green-500" : "bg-gray-300"
                        )}
                     >
                        <div className={cn(
                           "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                           notifications[notif.key as keyof typeof notifications] ? "right-1" : "left-1"
                        )}></div>
                     </button>
                  </div>
               ))}
            </div>
         </div>
         
         <button onClick={onLogout} className="w-full py-4 text-[#D32F2F] font-bold bg-red-50 hover:bg-red-100 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <LogOut size={20}/> Se déconnecter
         </button>
      </div>
   );
};

const NotificationsDrawer = ({ isOpen, onClose, unreadCount }: { isOpen: boolean, onClose: () => void, unreadCount: number }) => {
   const [notifications, setNotifications] = useState(NOTIFICATIONS);
   const unread = notifications.filter(n => !n.read).length;
   
   const markAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("Toutes les notifications marquées comme lues");
   };
   
   const handleNotificationAction = (notif: any) => {
      if (notif.type === "order") {
         toast.info("Redirection vers le suivi de commande...");
      } else if (notif.type === "promo") {
         toast.info("Redirection vers les offres...");
      }
   };
   
   return (
      <AnimatePresence>
         {isOpen && (
            <>
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="fixed inset-0 bg-black/20 z-[80] backdrop-blur-sm" />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[90] shadow-2xl flex flex-col">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Bell className="text-[#D32F2F]"/>
                        <h2 className="font-bold text-lg">Notifications</h2>
                        {unread > 0 && (
                           <span className="bg-[#D32F2F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {unread}
                           </span>
                        )}
                     </div>
                     <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                     {notifications.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                           <Bell size={48} className="mx-auto mb-4 opacity-30"/>
                           <p className="text-sm">Aucune notification</p>
                        </div>
                     ) : (
                        notifications.map(notif => (
                           <div 
                              key={notif.id} 
                              onClick={() => handleNotificationAction(notif)}
                              className={cn(
                                 "p-4 rounded-xl border relative overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-[0.98]",
                                 notif.read ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
                              )}
                           >
                              {!notif.read && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                              <div className="flex gap-3">
                                 <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                    notif.type === "order" ? "bg-green-100 text-green-600" : 
                                    notif.type === "promo" ? "bg-purple-100 text-purple-600" : 
                                    notif.type === "fidelite" ? "bg-yellow-100 text-yellow-600" :
                                    "bg-red-100 text-red-600"
                                 )}>
                                    {notif.type === "order" ? <ShoppingBag size={18}/> : 
                                     notif.type === "promo" ? <Gift size={18}/> : 
                                     notif.type === "fidelite" ? <Star size={18}/> :
                                     <Shield size={18}/>}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-900">{notif.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{notif.msg}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">{notif.time}</span>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
                  {unread > 0 && (
                     <div className="p-4 border-t border-gray-100">
                        <button 
                           onClick={markAllAsRead}
                           className="w-full py-3 text-sm font-bold text-[#D32F2F] hover:bg-red-50 rounded-xl transition-colors"
                        >
                           Tout marquer comme lu ({unread})
                        </button>
                     </div>
                  )}
               </motion.div>
            </>
         )}
      </AnimatePresence>
   );
};

const CategoryCarousel = ({ active, onSelect }: { active: string, onSelect: (id: string) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 bg-white border-b border-gray-100 sticky top-0 md:top-0 z-30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center gap-2">
        <button onClick={() => scroll('left')} className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#D32F2F] hover:border-[#D32F2F] transition-all shrink-0">
          <ChevronLeft size={20}/>
        </button>
        
        <div ref={scrollRef} className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-2 items-center">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onSelect(cat.id)} className={cn("flex flex-col items-center gap-2 md:gap-3 min-w-[80px] md:min-w-[100px] shrink-0 transition-all group", active === cat.id ? "scale-105" : "opacity-70 hover:opacity-100")}>
              <div className={cn("w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl shadow-sm border transition-all group-hover:shadow-md", active === cat.id ? "bg-[#D32F2F] border-[#D32F2F] text-white" : "bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-[#D32F2F]/30")}>{cat.icon}</div>
              <span className={cn("text-xs md:text-sm font-bold whitespace-nowrap", active === cat.id ? "text-[#D32F2F]" : "text-gray-500")}>{cat.name}</span>
            </button>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#D32F2F] hover:border-[#D32F2F] transition-all shrink-0">
          <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );
};

const StoreSelector = ({ onClose, onSelect }: { onClose: () => void, onSelect: (store: any) => void }) => {
   const [search, setSearch] = useState("");
   const [locating, setLocating] = useState(false);
   
   const handleGeo = () => {
      setLocating(true);
      setTimeout(() => {
         setLocating(false);
         setSearch("Mermoz");
         toast.success("Position trouvée : Mermoz");
      }, 1500);
   };

   const filteredStores = STORES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end md:items-center justify-center p-0 md:p-4">
         <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="bg-[#FAFAFA] w-full md:max-w-xl h-[90vh] md:h-[700px] md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
               <h3 className="font-bold text-xl text-gray-900">Choisir une boutique</h3>
               <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20}/></button>
            </div>
            
            {/* Search & Location Actions */}
            <div className="p-4 md:p-6 bg-white space-y-4 shadow-sm z-0">
               <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Saisissez votre adresse ou quartier..." 
                     className="w-full h-12 bg-gray-50 rounded-xl pl-12 pr-4 border border-gray-200 focus:border-[#D32F2F] focus:ring-4 focus:ring-[#D32F2F]/10 outline-none transition-all font-medium"
                  />
               </div>
               
               <button 
                  onClick={handleGeo}
                  disabled={locating}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#D32F2F]/10 text-[#D32F2F] font-bold rounded-xl hover:bg-[#D32F2F]/20 transition-colors disabled:opacity-50"
               >
                  {locating ? <RefreshCw className="animate-spin" size={20}/> : <Crosshair size={20}/>}
                  {locating ? "Localisation en cours..." : "Utiliser ma position actuelle"}
               </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {search ? `Résultats pour "${search}"` : "Boutiques à proximité"}
               </div>
               
               {filteredStores.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                     <MapIcon size={48} className="mx-auto mb-4 text-gray-300"/>
                     <p className="font-bold text-gray-900">Aucune boutique trouvée</p>
                     <p className="text-sm">Essayez une autre adresse.</p>
                  </div>
               ) : (
                  filteredStores.map(store => (
                     <div key={store.id} onClick={() => onSelect(store)} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#D32F2F]/30 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group">
                        <div className="flex gap-4 md:gap-6">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gray-200 shrink-0 overflow-hidden">
                              <ImageWithFallback src={store.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#D32F2F] transition-colors">{store.name}</h4>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                 <MapPin size={16} className={store.distance.includes("1.2") ? "text-green-600" : ""} /> 
                                 <span className={store.distance.includes("1.2") ? "text-green-700 font-bold" : ""}>{store.distance}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                 <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", store.status === 'Ouverte' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{store.status}</span>
                                 {store.stock === 'Dispo' && <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Stock OK</span>}
                              </div>
                           </div>
                           {store.status === 'Ouverte' && (
                              <div className="flex flex-col justify-center">
                                 <ChevronRight className="text-gray-300 group-hover:text-[#D32F2F] transition-colors" size={24} />
                              </div>
                           )}
                        </div>
                        {store.status !== 'Ouverte' && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-gray-500 backdrop-blur-[1px]">FERMÉE</div>}
                     </div>
                  ))
               )}
            </div>
         </motion.div>
      </motion.div>
   );
};

const PaymentModal = ({ total, onClose, onPay }: { total: number, onClose: () => void, onPay: () => void }) => (
  <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0"><h2 className="text-lg font-bold">Paiement</h2><button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button></div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
         <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2 mb-4"><img src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" alt="Logo" className="w-full h-full object-contain" /></div>
            <span className="text-sm text-gray-500 font-bold uppercase">Montant à payer</span><span className="text-4xl font-bold text-[#D32F2F] mt-1">{total} FCFA</span>
         </div>
         <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-2">Choisissez votre moyen de paiement :</h3>
            
            {/* Orange Money */}
            <button className="w-full bg-[#FF7900]/10 border border-[#FF7900]/20 p-4 rounded-xl flex items-center gap-4 hover:bg-[#FF7900]/20 transition-colors group active:scale-[0.98]">
               <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                  <img 
                    src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/Orange-Money-recrute-pour-ces-02-postes-08-Novembre-2024_wr0bvp.png" 
                    alt="Orange Money" 
                    className="w-full h-full object-contain p-1"
                  />
               </div>
               <div className="text-left flex-1">
                  <div className="font-bold text-gray-900">Orange Money</div>
                  <div className="text-xs text-gray-500 font-mono">+221 77 123 45 67</div>
               </div>
               <div className="ml-auto w-6 h-6 rounded-full border-2 border-[#FF7900] flex items-center justify-center bg-white group-hover:bg-[#FF7900] transition-colors">
                  <div className="w-3 h-3 rounded-full bg-[#FF7900] group-hover:bg-white"></div>
               </div>
            </button>

            {/* Mixx By Yas */}
            <button className="w-full bg-purple-50/50 border border-purple-200 p-4 rounded-xl flex items-center gap-4 hover:bg-purple-50 transition-colors group active:scale-[0.98]">
               <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                  <img 
                    src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/channels4_profile_rqd24x.jpg" 
                    alt="Mixx By Yas" 
                    className="w-full h-full object-contain p-1"
                  />
               </div>
               <div className="text-left flex-1">
                  <div className="font-bold text-gray-900">Mixx By Yas</div>
                  <div className="text-xs text-gray-500 font-mono">+221 77 123 45 67</div>
               </div>
               <div className="ml-auto w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white group-hover:border-purple-500 group-hover:bg-purple-500 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-white"></div>
               </div>
            </button>

            {/* Wave */}
            <button className="w-full bg-blue-50/50 border border-blue-200 p-4 rounded-xl flex items-center gap-4 hover:bg-blue-50 transition-colors group active:scale-[0.98]">
               <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                  <img 
                    src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/images_2_nnjbsa.png" 
                    alt="Wave" 
                    className="w-full h-full object-contain p-1"
                  />
               </div>
               <div className="text-left flex-1">
                  <div className="font-bold text-gray-900">Wave</div>
                  <div className="text-xs text-gray-500 font-mono">+221 77 123 45 67</div>
               </div>
               <div className="ml-auto w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white group-hover:border-blue-500 group-hover:bg-blue-500 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-white"></div>
               </div>
            </button>
         </div>
      </div>
      <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"><button onClick={onPay} className="w-full h-14 bg-[#D32F2F] text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-200 hover:bg-[#B71C1C] active:scale-95 transition-all flex items-center justify-center gap-2">PAYER {total} FCFA <ArrowRight size={20}/></button></div>
    </motion.div>
  </div>
);

const TrackingView = ({ onBack }: { onBack: () => void }) => {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([{ id: 1, text: "Je suis en route 🚚", time: "15:42", sender: "driver" }, { id: 2, text: "Merci ! Sonnez 2 fois 🙏", time: "15:43", sender: "me" }]);
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row h-full">
       <div className="h-1/2 md:h-full md:flex-1 bg-gray-200 relative">
          <div className="absolute top-4 left-4 z-10"><button onClick={onBack} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"><ArrowRight className="rotate-180" size={24}/></button></div>
          
          <div className="relative w-full h-full overflow-hidden bg-gray-100">
            <ImageWithFallback src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-60" alt="Map" />
            
            {/* Itinerary Path Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* Shadow Path */}
               <path d="M 20 80 C 40 80 60 30 80 20" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="4" strokeLinecap="round" />
               {/* Main Path */}
               <path 
                  d="M 20 80 C 40 80 60 30 80 20" 
                  fill="none" 
                  stroke="#D32F2F" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 4" 
                  strokeLinecap="round"
                  className="drop-shadow-sm"
               >
                  <animate attributeName="stroke-dashoffset" from="100" to="0" dur="20s" repeatCount="indefinite" />
               </path>
            </svg>

            {/* Customer Location (Fixed) */}
            <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-[85%] z-10 flex flex-col items-center">
               <div className="bg-black text-white px-2 py-1 rounded-md shadow-lg mb-1 text-[10px] font-bold tracking-wide">VOUS</div>
               <div className="relative">
                  <div className="absolute -inset-4 bg-[#D32F2F]/20 rounded-full animate-ping"></div>
                  <div className="w-8 h-8 bg-black border-2 border-white text-white rounded-full flex items-center justify-center shadow-xl relative z-10">
                     <Home size={14} fill="currentColor" />
                  </div>
               </div>
               <div className="w-0.5 h-6 bg-black/80"></div>
               <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px]"></div>
            </div>

            {/* Driver Marker (Animated) */}
            <motion.div 
               className="absolute z-20 flex flex-col items-center"
               initial={{ left: "20%", top: "80%" }}
               animate={{ 
                  left: ["20%", "30%", "50%", "70%", "80%"], 
                  top: ["80%", "78%", "55%", "25%", "20%"] 
               }}
               transition={{ 
                  duration: 15, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatDelay: 2
               }}
               style={{ translateX: "-50%", translateY: "-100%" }}
            >
               <div className="bg-white text-[#D32F2F] px-2 py-1 rounded-md shadow-lg mb-1 text-[10px] font-bold border border-red-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
                  Livreur
               </div>
               <div className="w-10 h-10 bg-[#D32F2F] border-[3px] border-white rounded-full flex items-center justify-center shadow-2xl relative">
                  <Navigation size={18} className="text-white fill-current -rotate-45 relative left-[-1px]" />
               </div>
               <div className="w-12 h-12 bg-[#D32F2F]/10 rounded-full absolute top-6 -z-10 animate-ping"></div>
            </motion.div>
          </div>

       </div>
       <div className="flex-1 md:w-[450px] md:flex-none bg-white md:border-l border-gray-200 shadow-2xl relative z-20 flex flex-col">
          <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-1"></div>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
             <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-100"><ImageWithFallback src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80" className="w-full h-full object-cover"/></div><div><h3 className="font-bold text-xl text-gray-900">Mamadou (Livreur)</h3><div className="flex items-center gap-1 text-sm text-gray-500 font-medium"><Star size={14} className="text-[#D4AF37] fill-current"/> 4.9 • En route (5 min)</div></div></div>
             <button className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"><Phone size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"><div className="text-center text-gray-400 text-sm">Aujourd'hui</div>{chat.map(m => (<div key={m.id} className={cn("flex flex-col", m.sender === 'me' ? "items-end" : "items-start")}><div className={cn("px-5 py-3 rounded-2xl max-w-[85%] text-sm font-medium shadow-sm", m.sender === 'me' ? "bg-[#D32F2F] text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none")}>{m.text}</div><span className="text-[10px] text-gray-400 mt-1 px-1 font-bold">{m.time}</span></div>))}</div>
          <div className="p-4 md:p-6 bg-white border-t border-gray-100 pb-8 flex gap-3"><input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Écrivez un message..." className="flex-1 bg-gray-100 border-none rounded-full px-6 h-14 focus:ring-2 focus:ring-red-100 outline-none font-medium"/><button className="w-14 h-14 bg-[#D32F2F] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:bg-[#B71C1C] transition-colors"><ArrowRight size={24} /></button></div>
       </div>
    </div>
  );
};

const CartDrawer = ({ cart, onClose, onPay }: { cart: any[], onClose: () => void, onPay: () => void }) => {
   const [selectedAddress, setSelectedAddress] = useState("addr1");
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("orange");
   const [promoCode, setPromoCode] = useState("SILVER20"); // Code promo auto-appliqué
   const [showPromoInput, setShowPromoInput] = useState(false);
   
   const addresses = [
      { id: "addr1", label: "Route des Almadies, Villa 12", isDefault: true },
      { id: "addr2", label: "Mermoz, Rue 15, Villa 8", isDefault: false },
      { id: "addr3", label: "Plateau, Avenue Pompidou", isDefault: false }
   ];
   
   const savedPayments = [
      { id: "orange", name: "Orange Money", phone: "+221 77 123 45 67", logo: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/Orange-Money-recrute-pour-ces-02-postes-08-Novembre-2024_wr0bvp.png" },
      { id: "wave", name: "Wave", phone: "+221 77 123 45 67", logo: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/images_2_nnjbsa.png" }
   ];
   
   const subtotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
   const deliveryFee = 1500;
   const promoDiscount = promoCode ? Math.floor(subtotal * 0.2) : 0; // 20% de réduction
   const total = subtotal + deliveryFee - promoDiscount;
   const pointsEarned = Math.floor(total / 100); // 1 point pour 100 FCFA
   
   const canOneClick = selectedAddress && selectedPaymentMethod && cart.length > 0;
   
   return (
      <div className="h-full flex flex-col">
         <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <ShoppingBag className="text-[#D32F2F]"/> Mon Panier ({cart.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-60">
                  <ShoppingCart size={48} />
                  <p className="font-medium">Votre panier est vide</p>
               </div>
            ) : (
               <>
                  {/* Sélection Adresse */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Adresse de livraison</label>
                     <div className="space-y-2">
                        {addresses.map(addr => (
                           <label key={addr.id} className={cn(
                              "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                              selectedAddress === addr.id ? "border-[#D32F2F] bg-red-50" : "border-gray-200 hover:border-gray-300"
                           )}>
                              <input 
                                 type="radio" 
                                 name="address" 
                                 checked={selectedAddress === addr.id}
                                 onChange={() => setSelectedAddress(addr.id)}
                                 className="mt-1 text-[#D32F2F]"
                              />
                              <div className="flex-1">
                                 <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span className="font-medium text-sm text-gray-900">{addr.label}</span>
                                    {addr.isDefault && (
                                       <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">DÉFAUT</span>
                                    )}
                                 </div>
                              </div>
                              <button className="text-gray-400 hover:text-[#D32F2F]"><Edit2 size={16}/></button>
                           </label>
                        ))}
                        <button className="w-full py-2 text-sm font-bold text-[#D32F2F] hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                           <Plus size={16}/> Ajouter une adresse
                        </button>
                     </div>
                  </div>

                  {/* Articles */}
                  <div className="space-y-3">
                     {cart.map((item, i) => (
                        <div key={i} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                           <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              <ImageWithFallback src={item.image} className="w-full h-full object-cover"/>
                           </div>
                           <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                              <div className="flex justify-between items-end mt-2">
                                 <span className="font-bold text-[#D32F2F]">{item.price} F</span>
                                 <button className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Code Promo */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     {promoCode && !showPromoInput ? (
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Gift size={16} className="text-[#D32F2F]"/>
                              <span className="text-sm font-bold text-gray-900">Code promo: <span className="text-[#D32F2F]">{promoCode}</span></span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">-{promoDiscount} F</span>
                           </div>
                           <button onClick={() => setShowPromoInput(true)} className="text-xs text-gray-500 hover:text-[#D32F2F]">Modifier</button>
                        </div>
                     ) : (
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Code promo</label>
                           <div className="flex gap-2">
                              <input 
                                 type="text" 
                                 value={promoCode}
                                 onChange={(e) => setPromoCode(e.target.value)}
                                 placeholder="Entrez un code"
                                 className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#D32F2F] focus:ring-0 outline-none"
                              />
                              <button className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg text-sm font-bold hover:bg-[#B71C1C] transition-colors">
                                 Appliquer
                              </button>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Méthode de paiement sauvegardée */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Moyen de paiement</label>
                     <div className="space-y-2">
                        {savedPayments.map(payment => (
                           <label key={payment.id} className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                              selectedPaymentMethod === payment.id ? "border-[#D32F2F] bg-red-50" : "border-gray-200 hover:border-gray-300"
                           )}>
                              <input 
                                 type="radio" 
                                 name="payment" 
                                 checked={selectedPaymentMethod === payment.id}
                                 onChange={() => setSelectedPaymentMethod(payment.id)}
                                 className="text-[#D32F2F]"
                              />
                              <div className="w-12 h-8 rounded bg-white border border-gray-100 overflow-hidden shrink-0">
                                 <img src={payment.logo} alt={payment.name} className="w-full h-full object-contain p-1" />
                              </div>
                              <div className="flex-1">
                                 <span className="font-medium text-sm text-gray-900">{payment.name}</span>
                                 <p className="text-xs text-gray-500">{payment.phone}</p>
                              </div>
                           </label>
                        ))}
                        <button className="w-full py-2 text-sm font-bold text-[#D32F2F] hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                           <Plus size={16}/> Ajouter un moyen de paiement
                        </button>
                     </div>
                  </div>
               </>
            )}
         </div>
         
         {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] space-y-4">
               {/* Récapitulatif */}
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                     <span>Sous-total</span>
                     <span>{subtotal.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                     <span>Livraison</span>
                     <span>{deliveryFee.toLocaleString()} F</span>
                  </div>
                  {promoDiscount > 0 && (
                     <div className="flex justify-between text-green-600 font-bold">
                        <span>Réduction ({promoCode})</span>
                        <span>-{promoDiscount.toLocaleString()} F</span>
                     </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                     <span>Total</span>
                     <span className="text-[#D32F2F]">{total.toLocaleString()} F</span>
                  </div>
                  
                  {/* Points gagnés */}
                  <div className="bg-[#FFF8E7] p-3 rounded-lg border border-[#D4AF37]/20 flex items-center justify-between mt-3">
                     <div className="flex items-center gap-2">
                        <Star size={16} className="text-[#FFD700] fill-current"/>
                        <span className="text-sm font-bold text-gray-900">Points gagnés</span>
                     </div>
                     <span className="text-lg font-bold text-[#D32F2F]">+{pointsEarned} pts</span>
                  </div>
               </div>
               
               {/* Bouton Checkout 1-clic */}
               <button 
                  onClick={onPay} 
                  className={cn(
                     "w-full h-14 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#B71C1C] active:scale-95 transition-all flex items-center justify-center gap-2",
                     canOneClick 
                        ? "bg-[#D32F2F] text-white shadow-red-200" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                  disabled={!canOneClick}
               >
                  {canOneClick ? (
                     <>
                        <Zap size={20}/> CHECKOUT 1-CLIC
                     </>
                  ) : (
                     "COMPLÉTEZ LES INFORMATIONS"
                  )}
                  <ArrowRight size={20}/>
               </button>
            </div>
         )}
      </div>
   );
}

// --- Main App Logic ---

export default function ClientApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedStore, setSelectedStore] = useState<any>(STORES[0]);
  const [showStores, setShowStores] = useState(false);
  const [activeCat, setActiveCat] = useState("viennoiserie");
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const momentsRef = useRef<HTMLDivElement>(null);
  const habitsRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    toast.success(`${item.name} ajouté !`, { position: 'bottom-center' });
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
       prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
    toast.success(favorites.includes(id) ? "Retiré des favoris" : "Ajouté aux favoris");
  }

  const handlePay = () => {
     setShowPayment(false);
     setCart([]);
     setIsTracking(true);
     localStorage.setItem('active_order', 'BDS-001');
     toast.success("Commande validée ! Suivi activé.");
  };

  const handleLogout = () => {
     setIsLoggedIn(false);
     // Nettoyer les données de session
     try {
       localStorage.removeItem('bds_client_session');
       localStorage.removeItem('bds_client_cart');
     } catch (e) {
       console.error('Erreur nettoyage session:', e);
     }
     toast.success("Déconnexion réussie !");
     // Rediriger vers la page d'accueil
     navigate('/');
  };

  const scrollMoments = (dir: 'left' | 'right') => {
    if(momentsRef.current) {
       momentsRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  }

  const scrollHabits = (dir: 'left' | 'right') => {
    if(habitsRef.current) {
       habitsRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  }

  if (isTracking) {
     return <TrackingView onBack={() => setIsTracking(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans relative flex flex-col">
      <Header 
         store={selectedStore} 
         onStoreClick={() => setShowStores(true)} 
         cartCount={cart.length}
         onCartClick={() => window.innerWidth >= 1024 ? null : setShowPayment(true)} 
         onNotifClick={() => setShowNotif(true)}
         onNavigate={setActiveTab}
         onLogout={handleLogout}
         isLoggedIn={isLoggedIn}
         unreadNotifCount={NOTIFICATIONS.filter(n => !n.read).length}
      />
      
      <div className="flex-1 container mx-auto max-w-7xl flex gap-8 p-0 md:p-6 items-start pb-24 md:pb-0">
         {/* Desktop Sidebar Nav */}
         <DesktopSidebar active={activeTab} onChange={setActiveTab} />

         {/* Main Content Area */}
         <div className="flex-1 min-w-0">
            {activeTab === "home" && (
               <>
                  <div className="p-4 md:p-0">
                     {/* Dashboard Personnalisé */}
                     <div className="mb-8 md:mb-12 space-y-6">
                        {/* Points Fidélité & Adresse */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* Carte Fidélité */}
                           <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                              <div className="relative z-10">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold border border-[#FFD700]/30">
                                       <Star size={12} fill="currentColor"/> NIVEAU SILVER 🥈
                                    </div>
                                 </div>
                                 <div className="mb-4">
                                    <div className="text-3xl md:text-4xl font-bold mb-1">247 <span className="text-lg opacity-60 font-normal">pts</span></div>
                                    <p className="text-sm text-gray-300">Plus que 53 points pour Gold 🥇</p>
                                 </div>
                                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#FFD700] rounded-full" style={{ width: '82%' }}></div>
                                 </div>
                                 <p className="text-xs text-gray-400 mt-2">82% vers Gold</p>
                              </div>
                           </div>

                           {/* Adresse par défaut */}
                           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                              <div className="flex items-start justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#D32F2F]">
                                       <MapPin size={20} />
                                    </div>
                                    <div>
                                       <p className="text-xs text-gray-500 font-bold uppercase mb-1">Adresse par défaut</p>
                                       <p className="font-bold text-gray-900 text-sm">Route des Almadies, Villa 12</p>
                                    </div>
                                 </div>
                                 <button className="text-gray-400 hover:text-[#D32F2F]">
                                    <Edit2 size={18} />
                                 </button>
                              </div>
                              <button className="w-full py-2 text-xs font-bold text-[#D32F2F] hover:bg-red-50 rounded-lg transition-colors">
                                 Modifier l'adresse
                              </button>
                           </div>
                        </div>

                        {/* Recommandations "Pour vous" */}
                        <div>
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-lg md:text-xl text-gray-900 flex items-center gap-2">
                                 <Zap className="text-[#FF9800]" size={20} /> Pour vous
                              </h3>
                              <button className="text-sm font-bold text-[#D32F2F] hover:underline">Voir tout</button>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {FULL_CATALOG.slice(0, 4).map(product => (
                                 <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={() => addToCart(product)}
                                    onClick={() => setSelectedProduct(product)}
                                    isFavorite={favorites.includes(product.id)}
                                    onToggleFavorite={() => toggleFavorite(product.id)}
                                 />
                              ))}
                           </div>
                        </div>

                        {/* Commandes récentes & Favoris */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* 3 Commandes récentes */}
                           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                 <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <History size={18} className="text-[#D32F2F]" /> Commandes récentes
                                 </h3>
                                 <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-[#D32F2F] hover:underline">
                                    Voir tout
                                 </button>
                              </div>
                              <div className="space-y-3">
                                 {ORDERS_HISTORY.slice(0, 3).map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setActiveTab("orders")}>
                                       <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                             <span className="font-bold text-sm text-gray-900">{order.id}</span>
                                             <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                                                order.status === "Livrée" ? "bg-green-100 text-green-700" :
                                                order.status === "Annulée" ? "bg-red-100 text-red-700" :
                                                "bg-orange-100 text-orange-700"
                                             )}>{order.status}</span>
                                          </div>
                                          <p className="text-xs text-gray-500">{order.date} • {order.items.join(", ")}</p>
                                       </div>
                                       <div className="text-right ml-4">
                                          <p className="font-bold text-[#D32F2F]">{order.total.toLocaleString()} F</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* 4 Favoris */}
                           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                 <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <Heart size={18} className="text-[#D32F2F] fill-current" /> Mes Favoris
                                 </h3>
                                 <button onClick={() => setActiveTab("favorites")} className="text-xs font-bold text-[#D32F2F] hover:underline">
                                    Voir tout ({favorites.length})
                                 </button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 {FULL_CATALOG.filter(p => favorites.includes(p.id)).slice(0, 4).map(product => (
                                    <div key={product.id} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                       <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-gray-200">
                                          <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                                       </div>
                                       <p className="font-bold text-xs text-gray-900 line-clamp-1">{product.name}</p>
                                       <p className="text-[#D32F2F] font-bold text-xs mt-1">{product.price} F</p>
                                    </div>
                                 ))}
                                 {favorites.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-400">
                                       <Heart size={32} className="mx-auto mb-2 opacity-30" />
                                       <p className="text-sm">Aucun favori</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Offres exclusives */}
                        <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl p-6 text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                           <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                 <div>
                                    <h3 className="font-bold text-xl md:text-2xl mb-2">Offres Exclusives 🎁</h3>
                                    <p className="text-white/90 text-sm">Profitez de réductions spéciales membres</p>
                                 </div>
                                 <Gift size={32} className="text-white/20" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl font-bold mb-1">-20%</div>
                                    <div className="text-xs opacity-90">Sur tous les sandwichs</div>
                                 </div>
                                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl font-bold mb-1">1+1</div>
                                    <div className="text-xs opacity-90">Viennoiseries offertes</div>
                                 </div>
                                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                    <div className="text-2xl font-bold mb-1">500 pts</div>
                                    <div className="text-xs opacity-90">Bonus commande</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Mobile Search */}
                     <div className="md:hidden relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input placeholder="Rechercher..." className="w-full h-12 bg-white rounded-full pl-12 pr-4 shadow-sm border border-gray-100 focus:ring-2 focus:ring-[#D32F2F] outline-none"/>
                     </div>

                     {/* Moments Section - Carousel with Buttons */}
                     <div className="mb-12 md:mb-16">
                        <div className="flex items-center justify-between mb-6 md:mb-8 px-4 md:px-0">
                           <h2 className="font-bold text-2xl md:text-4xl text-gray-900 tracking-tight leading-tight">
                              Savourez les moments avec <span className="text-[#D32F2F]">La Brioche Dorée</span>
                           </h2>
                           <div className="hidden md:flex gap-3">
                              <button onClick={() => scrollMoments('left')} className="w-12 h-12 rounded-full border border-gray-200 text-[#D32F2F] flex items-center justify-center hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] transition-all">
                                 <ChevronLeft size={24} />
                              </button>
                              <button onClick={() => scrollMoments('right')} className="w-12 h-12 rounded-full border border-gray-200 text-[#D32F2F] flex items-center justify-center hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] transition-all">
                                 <ChevronRight size={24} />
                              </button>
                           </div>
                        </div>
                        
                        <div ref={momentsRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 pb-4 snap-x scroll-smooth">
                           {[
                              { title: "Viennoiseries", desc: "Le savoir-faire français pour un réveil en douceur.", img: "https://images.unsplash.com/photo-1709798289100-7b46217e0325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBicmVha2Zhc3QlMjB2ZXJ0aWNhbHxlbnwxfHx8fDE3NzA4MDkxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                              { title: "Sandwichs", desc: "Des recettes gourmandes préparées sur place chaque matin.", img: "https://images.unsplash.com/photo-1670842587871-326b95acbc8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWd1ZXR0ZSUyMHNhbmR3aWNoJTIwbHVuY2glMjB2ZXJ0aWNhbHxlbnwxfHx8fDE3NzA4MDkxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                              { title: "Desserts", desc: "Une touche sucrée irrésistible pour finir en beauté.", img: "https://images.unsplash.com/photo-1693464337393-746af7c390d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMHRhcnQlMjBkZXNzZXJ0JTIwdmVydGljYWx8ZW58MXx8fHwxNzcwODA5MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
                              { title: "Boissons", desc: "Rafraîchissez-vous avec nos jus pressés et cafés.", img: "https://images.unsplash.com/photo-1607690506833-498e04ab3ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMHRhcnQlMjBkZXNzZXJ0JTIwdmVydGljYWx8ZW58MXx8fHwxNzcwODA5MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" }
                           ].map((m, i) => (
                              <div key={i} className="min-w-[300px] md:min-w-[400px] h-[350px] md:h-[500px] rounded-[32px] relative overflow-hidden group cursor-pointer shadow-lg snap-center shrink-0">
                                 <ImageWithFallback src={m.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-white font-extrabold text-3xl md:text-4xl mb-3 tracking-tight">{m.title}</h3>
                                    <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">{m.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Habits - Carousel with Buttons */}
                     <div className="mb-8 md:mb-12">
                        <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                           <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg md:text-2xl"><span className="text-[#FF9800]">⚡</span> Vos Habitudes</h2>
                           <div className="flex items-center gap-4">
                              <button className="text-sm font-bold text-[#D32F2F] hover:underline">Voir tout</button>
                              <div className="hidden md:flex gap-2">
                                 <button onClick={() => scrollHabits('left')} className="w-8 h-8 rounded-full border border-gray-200 text-[#D32F2F] flex items-center justify-center hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] transition-all">
                                    <ChevronLeft size={16} />
                                 </button>
                                 <button onClick={() => scrollHabits('right')} className="w-8 h-8 rounded-full border border-gray-200 text-[#D32F2F] flex items-center justify-center hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] transition-all">
                                    <ChevronRight size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                        <div ref={habitsRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 pb-4 snap-x scroll-smooth">
                           {HABITS.map(h => (
                             <div key={h.id} className="min-w-[220px] md:min-w-[260px] snap-center shrink-0 h-full">
                                <ProductCard 
                                  product={h} 
                                  onAdd={() => addToCart(h)} 
                                  onClick={() => setSelectedProduct(h)} 
                                  isFavorite={favorites.includes(h.id)}
                                  onToggleFavorite={() => toggleFavorite(h.id)}
                                  compact={false} 
                                />
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Onglets Catalogue */}
                  <div className="sticky top-20 md:top-0 bg-[#FAFAFA] z-30 pb-4 md:mx-0">
                     <div className="flex items-center gap-2 px-4 md:px-0 mb-4 overflow-x-auto scrollbar-hide">
                        {[
                          { id: "pour-vous", label: "Pour vous", icon: Zap },
                          { id: "favoris", label: "Favoris", icon: Heart },
                          { id: "deja-commandes", label: "Déjà commandés", icon: History }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveCat(tab.id)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0",
                              activeCat === tab.id
                                ? "bg-[#D32F2F] text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            )}
                          >
                            <tab.icon size={16} className={activeCat === tab.id ? "fill-current" : ""} />
                            {tab.label}
                            {tab.id === "favoris" && favorites.length > 0 && (
                              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                                {favorites.length}
                              </span>
                            )}
                          </button>
                        ))}
                     </div>
                     
                     {/* Categories */}
                     {activeCat !== "favoris" && activeCat !== "deja-commandes" && (
                        <CategoryCarousel active={activeCat === "pour-vous" ? "viennoiserie" : activeCat} onSelect={setActiveCat} />
                     )}
                  </div>

                  {/* Catalog */}
                  <div className="space-y-6 min-h-[400px] p-4 md:p-0">
                     {activeCat === "favoris" ? (
                        <FavoritesView 
                          favorites={favorites} 
                          onAdd={addToCart} 
                          onToggleFavorite={toggleFavorite}
                          onExplore={() => setActiveCat("pour-vous")} 
                        />
                     ) : activeCat === "deja-commandes" ? (
                        <div>
                           <h2 className="font-bold text-gray-900 text-xl md:text-2xl mb-6 flex items-center gap-2">
                              <History className="text-[#D32F2F]" size={20} /> Déjà commandés
                           </h2>
                           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                              {FULL_CATALOG.filter(p => ORDERS_HISTORY.some(o => o.items.some(item => item.includes(p.name.split(' ')[0])))).map(p => (
                                <ProductCard 
                                  key={p.id} 
                                  product={p} 
                                  onAdd={() => addToCart(p)} 
                                  onClick={() => setSelectedProduct(p)} 
                                  isFavorite={favorites.includes(p.id)}
                                  onToggleFavorite={() => toggleFavorite(p.id)}
                                />
                              ))}
                           </div>
                        </div>
                     ) : (
                        <>
                           <h2 className="font-bold text-gray-900 text-xl md:text-2xl capitalize flex items-center gap-2">
                              {CATEGORIES.find(c => c.id === activeCat)?.icon} {CATEGORIES.find(c => c.id === activeCat)?.name}
                           </h2>
                           <div className="grid grid-cols-2 gap-4 md:gap-6">
                              {FULL_CATALOG.filter(p => p.cat === activeCat || activeCat === 'viennoiserie' || activeCat === 'pour-vous').map(p => (
                                <ProductCard 
                                  key={p.id} 
                                  product={p} 
                                  onAdd={() => addToCart(p)} 
                                  onClick={() => setSelectedProduct(p)} 
                                  isFavorite={favorites.includes(p.id)}
                                  onToggleFavorite={() => toggleFavorite(p.id)}
                                />
                              ))}
                           </div>
                        </>
                     )}
                  </div>
               </>
            )}

            {activeTab === "favorites" && (
                <FavoritesView 
                    favorites={favorites} 
                    onAdd={addToCart} 
                    onToggleFavorite={toggleFavorite}
                    onExplore={() => setActiveTab("home")} 
                />
            )}
            {activeTab === "orders" && <OrdersView onReorder={() => setActiveTab("home")} />}
            {activeTab === "loyalty" && <LoyaltyView />}
            {activeTab === "profile" && <ProfileView onLogout={handleLogout} />}
         </div>

         {/* Desktop Right Cart (Only on Home) */}
         {activeTab === "home" && (
            <div className="hidden lg:block w-[350px] shrink-0 sticky top-24 h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <CartDrawer cart={cart} onClose={() => {}} onPay={() => setShowPayment(true)} />
            </div>
         )}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} cartCount={cart.length} />

      <AnimatePresence>
         {cart.length > 0 && activeTab === "home" && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="lg:hidden fixed bottom-20 left-0 right-0 px-4 z-40 max-w-md mx-auto pointer-events-none">
               <button onClick={() => setShowPayment(true)} className="w-full bg-[#D32F2F] text-white h-16 rounded-2xl shadow-xl shadow-red-200 flex items-center justify-between px-6 active:scale-95 transition-transform pointer-events-auto">
                  <div className="flex items-center gap-3"><div className="bg-white/20 px-3 py-1 rounded-lg font-bold">{cart.length}</div><span className="font-bold text-lg">Voir Panier</span></div><span className="font-bold text-xl">{cartTotal} F</span>
               </button>
            </motion.div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {showStores && <StoreSelector onClose={() => setShowStores(false)} onSelect={(s) => { setSelectedStore(s); setShowStores(false); }} />}
         {showPayment && <PaymentModal total={cartTotal} onClose={() => setShowPayment(false)} onPay={handlePay} />}
         {showNotif && <NotificationsDrawer isOpen={showNotif} onClose={() => setShowNotif(false)} unreadCount={NOTIFICATIONS.filter(n => !n.read).length} />}
         
         {/* Product Detail Modal */}
         {selectedProduct && (
            <ProductDetailModal 
               product={selectedProduct} 
               onClose={() => setSelectedProduct(null)}
               onAdd={(qty) => {
                  for(let i=0; i<qty; i++) addToCart(selectedProduct);
                  setSelectedProduct(null);
                  toast.success(`${qty}x ${selectedProduct.name} ajouté !`);
               }}
            />
         )}
      </AnimatePresence>
    </div>
  );
}
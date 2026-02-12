import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Heart, Clock, ArrowRight, Star, TrendingUp, Award, ChevronRight, Repeat } from "lucide-react";
import { PRODUCTS, STORES, Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { StoreCard, ProductCard } from "../components/Cards";
import { ProductModal } from "../components/ProductModal";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { toast } from "sonner";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// Mock Data for Dashboard
const RECENT_ORDERS = [
  { id: "CMD-2849", date: "Hier, 19:30", items: "2x Croissant aux amandes, 1x Baguette", total: 4500, status: "Livré" },
  { id: "CMD-2810", date: "05 Fév, 08:15", items: "1x Café Latte, 1x Pain au chocolat", total: 3200, status: "Livré" },
  { id: "CMD-2755", date: "01 Fév, 13:00", items: "3x Sandwich Poulet, 3x Coca", total: 12500, status: "Livré" }
];

const FAVORITES_IDS = ["prod-1", "prod-3", "prod-5", "prod-2"]; // Example IDs

export default function ClientHome({ onAddToCart }: { onAddToCart: (product: Product, quantity: number) => void }) {
  const navigate = useNavigate();
  const recentOrdersRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("Pour vous");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(FAVORITES_IDS);

  const categories = ["Pour vous", "Favoris", "Déjà commandés", "Viennoiseries", "Pains", "Pâtisseries", "Sandwichs"];

  // Toggle Favorite
  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (favorites.includes(productId)) {
      setFavorites(prev => prev.filter(id => id !== productId));
      toast.info("Retiré des favoris");
    } else {
      setFavorites(prev => [...prev, productId]);
      toast.success("Ajouté aux favoris ❤️");
    }
  };

  // Filter Logic
  const getFilteredProducts = () => {
    let base = PRODUCTS;
    
    // Search override
    if (searchQuery) {
        return base.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category logic
    switch (activeCategory) {
        case "Pour vous":
            // Mock algorithm: New items + Random selection
            return base.filter(p => p.isNew || favorites.includes(p.id) || Math.random() > 0.5).slice(0, 8);
        case "Favoris":
            return base.filter(p => favorites.includes(p.id));
        case "Déjà commandés":
             // Mock history based on typical items
            return base.filter(p => ["1", "3", "9", "4"].includes(p.id));
        default:
            return base.filter(p => p.category === activeCategory);
    }
  };

  const displayedProducts = getFilteredProducts();

  // Mock Exclusive Offers (different products with discounts)
  const exclusiveOffers = PRODUCTS.slice(0, 4).reverse().map(p => ({
    ...p,
    id: `excl-${p.id}`,
    name: `PROMO: ${p.name}`, 
    price: Math.floor(p.price * 0.8),
    isNew: false 
  }));

  return (
    <>
      {/* --- DASHBOARD HEADER (LOYALTY) --- */}
      <header className="relative bg-[#1A1A1A] text-white pt-32 pb-24 overflow-hidden">
         <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-bds-gold/10 to-transparent pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                
                {/* Greeting & Status */}
                <div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded border border-gray-700">MEMBER SINCE 2024</span>
                        <span className="flex items-center gap-1 text-bds-gold text-xs font-bold"><Award size={12}/> SILVER MEMBER</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Bonjour, Fatou ���</h1>
                    <p className="text-gray-400 max-w-lg">Ravi de vous revoir ! Vous avez économisé <span className="text-white font-bold">42 300 FCFA</span> ce mois-ci grâce à vos avantages fidélité.</p>
                </div>

                {/* Loyalty Card */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl w-full md:w-96 shadow-2xl relative overflow-hidden group hover:border-bds-gold/50 transition-colors cursor-pointer"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ImageWithFallback src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" className="w-24 h-24 object-contain grayscale" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Votre Solde</p>
                            <div className="text-4xl font-serif font-bold text-bds-gold flex items-baseline gap-2">
                                247 <span className="text-sm text-gray-400 font-sans font-normal">pts</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">🥈</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Silver</span>
                            <span>Gold (1000 pts)</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "24.7%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-bds-gold to-yellow-200"
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-right mt-1">Plus que 753 pts pour devenir Gold !</p>
                    </div>
                </motion.div>
            </div>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-16 mb-20">
        
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Search */}
             <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Recherche rapide</label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Croissant, Pizza..." 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-bds-gold/20 focus:border-bds-gold transition-all"
                    />
                </div>
             </div>

             {/* Last Order Shortcut */}
             <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-bds-red relative group overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Repeat size={64}/></div>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-bds-red uppercase tracking-wide">Dernière commande</span>
                    <span className="text-xs text-gray-400">Hier</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">2x Croissant...</h3>
                <p className="text-sm text-gray-500 mb-4">4 500 FCFA • Livré</p>
                <button 
                    onClick={() => recentOrdersRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-bold text-gray-900 underline flex items-center gap-1 hover:text-bds-red cursor-pointer"
                >
                    Recommander en 1-clic <ArrowRight size={14}/>
                </button>
             </div>

             {/* Favorites Shortcut */}
             <div className="bg-bds-gold text-white p-6 rounded-2xl shadow-lg shadow-yellow-500/20 relative overflow-hidden cursor-pointer hover:bg-yellow-600 transition-colors" onClick={() => setActiveCategory("Favoris")}>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">4 FAVORIS</span>
                        <Heart fill="currentColor" size={24}/>
                    </div>
                    <h3 className="font-serif font-bold text-2xl mb-1">Vos péchés mignons</h3>
                    <p className="text-white/80 text-sm">Commandez vos favoris en quelques secondes.</p>
                </div>
             </div>
        </div>

        {/* Catalog Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                    {activeCategory === "Pour vous" ? "Recommandé pour vous ✨" : activeCategory}
                 </h2>
                 <p className="text-gray-500 mt-1">Sélection personnalisée selon vos goûts</p>
            </div>

            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-4 md:pb-0 gap-2 no-scrollbar">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2",
                      activeCategory === cat 
                        ? "bg-black text-white shadow-lg scale-105" 
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {cat === "Favoris" && <Heart size={14} className={activeCategory === cat ? "fill-white" : ""} />}
                    {cat}
                  </button>
                ))}
            </div>
          </div>
          
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedProducts.slice(0, 4).map(product => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className="relative group"
                >
                  {/* Custom Card Wrapper to add Favorite Button Overlay */}
                  <div className="relative">
                      <ProductCard product={product} onQuickView={() => setSelectedProduct(product)} />
                      <button 
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all"
                      >
                        <Heart 
                            size={18} 
                            className={cn("transition-colors", favorites.includes(product.id) ? "fill-bds-red text-bds-red" : "text-gray-400")} 
                        />
                      </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {displayedProducts.length === 0 && (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-400" size={32}/>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Aucun résultat</h3>
                    <p className="text-gray-500">Essayez une autre catégorie ou modifiez votre recherche.</p>
                </div>
            )}
          </motion.div>
          
          <div className="flex justify-end mt-8">
             <button 
                onClick={() => navigate('/client/search')} 
                className="group flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-bds-red transition-colors px-4 py-2 rounded-full hover:bg-red-50"
             >
                Voir plus <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
             </button>
          </div>
        </section>

        {/* Exclusive Offers Section */}
        <section className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-6 md:p-8 border border-red-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
             
             <div className="mb-8 relative z-10">
               <div className="flex items-center gap-3 mb-2">
                   <span className="bg-red-100 text-bds-red text-[10px] font-bold px-2 py-1 rounded-full border border-red-200 animate-pulse">TEMPS LIMITÉ</span>
               </div>
               <h2 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                  Offres Exclusives 🔥
               </h2>
               <p className="text-gray-600">Profitez de -20% sur cette sélection spéciale.</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                {exclusiveOffers.map(product => (
                  <div key={product.id} className="relative group">
                       <ProductCard product={product} onQuickView={() => setSelectedProduct(product)} />
                       
                       {/* Favorite Button Overlay */}
                       <button 
                         onClick={(e) => toggleFavorite(e, product.id)}
                         className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all"
                       >
                         <Heart 
                             size={18} 
                             className={cn("transition-colors", favorites.includes(product.id) ? "fill-bds-red text-bds-red" : "text-gray-400")} 
                         />
                       </button>

                       {/* Direct Add to Cart Overlay */}
                       <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             onAddToCart(product, 1);
                             toast.success(`1x ${product.name} ajouté au panier`);
                          }}
                          className="absolute bottom-24 right-4 z-10 w-10 h-10 bg-black text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-bds-red flex items-center justify-center border border-gray-800"
                          title="Ajouter au panier"
                       >
                          <TrendingUp size={18} />
                       </button>
                  </div>
                ))}
             </div>
             
             <div className="flex justify-end mt-8 relative z-10">
                 <button 
                    onClick={() => navigate('/client/search')} 
                    className="group flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-bds-red transition-colors px-4 py-2 rounded-full hover:bg-red-50"
                 >
                    Voir plus <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
                 </button>
             </div>
        </section>

        {/* Recent Orders Section - Refactored for Mobile & Style */}
        <section ref={recentOrdersRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-32">
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                         Commandes Récentes
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Suivez et gérez vos dernières commandes</p>
                </div>
                <button 
                    onClick={() => navigate('/client/profile', { state: { activeTab: 'orders' } })}
                    className="text-bds-red font-bold text-sm hover:underline flex items-center gap-1 bg-red-50 px-4 py-2 rounded-full transition-colors hover:bg-red-100 w-full md:w-auto justify-center"
                >
                     Voir tout l'historique <ChevronRight size={14}/>
                </button>
            </div>
            
            <div className="divide-y divide-gray-100">
                {RECENT_ORDERS.map(order => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors group">
                        {/* Mobile/Card Layout */}
                        <div className="md:hidden flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                     <span className="text-xs font-bold text-gray-400 block mb-1">{order.date}</span>
                                     <h4 className="font-bold text-gray-900 text-lg">{order.total.toLocaleString()} FCFA</h4>
                                </div>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> {order.status}
                                </span>
                            </div>
                            <div>
                                 <p className="text-sm text-gray-600 line-clamp-2 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">{order.items}</p>
                                 <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform shadow-md shadow-black/10">
                                        <Repeat size={14}/> Recommander
                                    </button>
                                 </div>
                            </div>
                        </div>

                        {/* Desktop/Table Row Layout (Hidden on Mobile) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 items-center text-sm">
                            <div className="col-span-2 font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <Clock size={14} />
                                </div>
                                #{order.id}
                            </div>
                            <div className="col-span-2 text-gray-500">{order.date}</div>
                            <div className="col-span-4 text-gray-900 truncate pr-4 font-medium" title={order.items}>{order.items}</div>
                            <div className="col-span-2 font-bold text-lg">{order.total.toLocaleString()} F</div>
                            <div className="col-span-2 flex justify-end items-center gap-4">
                                 <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> {order.status}
                                </span>
                                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-bds-red hover:border-bds-red hover:text-white transition-all">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={(p, q) => {
          onAddToCart(p, q);
          toast.success(`${q}x ${p.name} ajouté au panier`);
        }}
      />
    </>
  );
}

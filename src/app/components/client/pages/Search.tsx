import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Store, Filter, SlidersHorizontal, ArrowLeft, X, LayoutGrid } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { PRODUCTS, STORES, Product, Store as StoreType } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProductCard, StoreCard } from "../components/Cards";
import { ProductModal } from "../components/ProductModal";
import { BDSButton } from "@/app/components/shared/BDSButton";

export default function ClientSearch({ onAddToCart }: { onAddToCart: (product: Product, quantity: number) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const categories = ["Tout", "Viennoiseries", "Pains", "Pâtisseries", "Sandwichs", "Boissons"];

  // Handle store filter from navigation state
  useMemo(() => {
    if (location.state?.storeId) {
        setSelectedStoreId(location.state.storeId);
        setActiveTab('products');
        // Clear state to avoid persistent filter on refresh if desired, but keeping it is fine
        // window.history.replaceState({}, document.title); // Optional
    }
  }, [location.state]);

  const selectedStore = useMemo(() => STORES.find(s => s.id === selectedStoreId), [selectedStoreId]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Tout" || product.category === selectedCategory;
      // In a real app, check if product is in store. Here we assume all products are in all stores unless specific logic
      // We can simulate randomness or just return true
      const matchesStore = selectedStoreId ? true : true; 
      
      return matchesSearch && matchesCategory && matchesStore;
    });
  }, [searchQuery, selectedCategory, selectedStoreId]);

  // Filter Stores
  const filteredStores = useMemo(() => {
    return STORES.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-8">
            <button 
                onClick={() => navigate('/client')} 
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 text-sm font-bold transition-colors"
            >
                <ArrowLeft size={16}/> Retour
            </button>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Explorer le menu</h1>
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={activeTab === 'products' ? "Rechercher un produit..." : "Rechercher une boutique..."}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-bds-gold/50 shadow-sm"
                        autoFocus
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                        >
                            <X size={16}/>
                        </button>
                    )}
                </div>
                
                {/* Tabs Toggle */}
                <div className="bg-gray-200 p-1 rounded-xl flex">
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'products' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}
                    >
                        <LayoutGrid size={16}/> Produits
                    </button>
                    <button 
                        onClick={() => setActiveTab('stores')}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'stores' ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}
                    >
                        <Store size={16}/> Boutiques
                    </button>
                </div>
            </div>
        </div>

        {/* Selected Store Banner */}
        <AnimatePresence>
            {selectedStore && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-6"
                >
                    <div className="bg-white border border-bds-gold/30 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <Store size={20}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Boutique sélectionnée</p>
                                <p className="font-bold text-gray-900">{selectedStore.name}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setSelectedStoreId(null);
                                navigate('.', { state: {} }); // Clear state
                            }}
                            className="text-sm font-bold text-gray-500 hover:text-red-500 flex items-center gap-1"
                        >
                            <X size={14}/> Retirer le filtre
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Categories (Products only) */}
        <AnimatePresence>
            {activeTab === 'products' && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-8 overflow-hidden"
                >
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                                    selectedCategory === cat 
                                        ? "bg-black text-white border-black" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Results */}
        <div className="min-h-[400px]">
            {activeTab === 'products' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onQuickView={() => setSelectedProduct(product)} 
                        />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500">Aucun produit trouvé pour "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map(store => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                    {filteredStores.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500">Aucune boutique trouvée pour "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
            product={selectedProduct} 
            isOpen={!!selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={(product, quantity) => {
                onAddToCart(product, quantity);
                setSelectedProduct(null);
                // The toast is handled in the parent or we can add one here
            }}
        />
      )}
    </div>
  );
}

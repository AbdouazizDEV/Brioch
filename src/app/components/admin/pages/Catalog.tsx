import { useState } from "react";
import { 
  Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Copy, 
  CheckCircle, AlertTriangle, X, Upload, Info, ChevronDown,
  Download, PieChart, TrendingUp, Layers, Package
} from "lucide-react";
import { PRODUCTS, STORES } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data extensions
const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "milk", label: "Lait" },
  { id: "eggs", label: "Oeufs" },
  { id: "nuts", label: "Fruits à coque" },
  { id: "soy", label: "Soja" }
];

const MOCK_SALES_DATA = [
  { day: 'Lun', sales: 12 },
  { day: 'Mar', sales: 19 },
  { day: 'Mer', sales: 15 },
  { day: 'Jeu', sales: 25 },
  { day: 'Ven', sales: 32 },
  { day: 'Sam', sales: 45 },
  { day: 'Dim', sales: 38 },
];

export default function AdminCatalog() {
  const [products, setProducts] = useState(PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [categories, setCategories] = useState(["Viennoiseries", "Pains", "Pâtisseries", "Sandwichs", "Boissons", "Traiteur"]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(products.filter(p => p.id !== id));
      toast.success("Produit supprimé");
    }
  };

  const handleSave = (product: any) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
      toast.success("Produit modifié");
    } else {
      setProducts([...products, { ...product, id: Date.now().toString(), rating: 0, reviews: 0 }]);
      toast.success("Produit ajouté");
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveCategory = (newCategory: string) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      toast.success(`Catégorie "${newCategory}" ajoutée`);
    } else if (categories.includes(newCategory)) {
      toast.error("Cette catégorie existe déjà");
      return;
    }
    setIsCategoryModalOpen(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Catalogue exporté en CSV");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gray-900">Catalogue Produits</h2>
          <p className="text-sm text-gray-500">Gérez l'offre, les prix et les stocks par boutique</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <BDSButton variant="outline" onClick={handleExport} disabled={isExporting} className="gap-2 flex-1 md:flex-none">
            {isExporting ? "Export..." : <><Download size={16}/> Export CSV</>}
          </BDSButton>
          <BDSButton onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="gap-2 shadow-bds-cta flex-1 md:flex-none">
            <Plus size={16}/> <span className="hidden md:inline">Ajouter produit</span><span className="md:hidden">Ajouter</span>
          </BDSButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
         <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab("products")}
              className={cn("pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", 
                activeTab === "products" ? "border-bds-red text-bds-red" : "border-transparent text-gray-500 hover:text-gray-800")}
            >
              <Package size={18} /> Tous les produits
            </button>
            <button 
              onClick={() => setActiveTab("categories")}
              className={cn("pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", 
                activeTab === "categories" ? "border-bds-red text-bds-red" : "border-transparent text-gray-500 hover:text-gray-800")}
            >
              <Layers size={18} /> Catégories
            </button>
         </div>
      </div>

      {activeTab === "products" ? (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-bds-card border border-gray-100 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher (ex: Croissant, Pain...)" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-bds-red text-sm"
              />
            </div>
            <BDSButton variant="outline" className="gap-2 hidden md:flex"><Filter size={16}/> Filtres</BDSButton>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Produit</th>
                    <th className="px-6 py-4">Prix Base</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4 text-center">Disponibilité</th>
                    <th className="px-6 py-4 text-center">Stock Global</th>
                    <th className="px-6 py-4 text-center">Ventes/j</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                            <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold font-mono">{product.price} F</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.available ? (
                          <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                            <CheckCircle size={12}/> En ligne
                          </span>
                        ) : (
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                            <X size={12}/> Masqué
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-500 text-lg">∞</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">
                        {Math.floor(Math.random() * 50) + 10}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className="bg-white p-4 rounded-xl shadow-bds-card border border-gray-100 flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                   <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                      </div>
                      <span className="font-bold text-bds-red font-mono">{product.price} F</span>
                   </div>
                   <div className="flex items-center gap-2 mt-2 mb-3">
                      {product.available ? (
                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">En ligne</span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold">Masqué</span>
                      )}
                      <span className="text-xs text-gray-400">• {Math.floor(Math.random() * 50) + 10} ventes/j</span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="flex-1 py-1.5 bg-gray-50 text-gray-700 rounded-md text-xs font-bold border border-gray-200">Modifier</button>
                      <button onClick={() => handleDelete(product.id)} className="w-8 flex items-center justify-center bg-red-50 text-red-600 rounded-md border border-red-100"><Trash2 size={14}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Categories View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {categories.map((cat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 flex flex-col justify-between h-48 group hover:border-bds-red transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl">
                      {cat[0]}
                   </div>
                   <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
                </div>
                <div>
                   <h3 className="font-bold text-lg text-gray-900">{cat}</h3>
                   <p className="text-sm text-gray-500">{Math.floor(Math.random() * 20) + 5} produits</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-orange-400 h-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                </div>
             </div>
           ))}
           <button 
             onClick={() => setIsCategoryModalOpen(true)}
             className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center h-48 text-gray-400 hover:text-bds-red hover:border-bds-red transition-colors bg-gray-50/50"
           >
              <Plus size={32} />
              <span className="font-bold mt-2">Nouvelle catégorie</span>
           </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal 
            product={editingProduct} 
            onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
            onSave={handleSave}
            categories={categories}
          />
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <CategoryModal 
            onClose={() => setIsCategoryModalOpen(false)} 
            onSave={handleSaveCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductModal({ product, onClose, onSave, categories }: { product: any, onClose: () => void, onSave: (p: any) => void, categories: string[] }) {
  const [formData, setFormData] = useState(product || {
    name: "",
    category: "Viennoiseries",
    description: "",
    price: "",
    available: true,
    image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80",
    allergens: []
  });
  
  const [modalTab, setModalTab] = useState<"info" | "stock" | "stats">("info");

  const toggleAllergen = (id: string) => {
    const current = formData.allergens || [];
    if (current.includes(id)) {
      setFormData({ ...formData, allergens: current.filter((a: string) => a !== id) });
    } else {
      setFormData({ ...formData, allergens: [...current, id] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold font-serif">{product ? "Modifier le produit" : "Ajouter un produit"}</h3>
            <p className="text-xs text-gray-500">ID: {product?.id || "Nouveau"}</p>
          </div>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-100 px-6">
           <button 
             onClick={() => setModalTab("info")} 
             className={cn("py-3 px-4 text-sm font-bold border-b-2 transition-colors", modalTab === "info" ? "border-bds-red text-bds-red" : "border-transparent text-gray-500")}
           >Informations</button>
           <button 
             onClick={() => setModalTab("stock")} 
             className={cn("py-3 px-4 text-sm font-bold border-b-2 transition-colors", modalTab === "stock" ? "border-bds-red text-bds-red" : "border-transparent text-gray-500")}
           >Stocks & Prix</button>
           <button 
             onClick={() => setModalTab("stats")} 
             className={cn("py-3 px-4 text-sm font-bold border-b-2 transition-colors", modalTab === "stats" ? "border-bds-red text-bds-red" : "border-transparent text-gray-500")}
           >Statistiques</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {modalTab === "info" && (
            <div className="space-y-6">
              {/* Photo */}
              <div className="flex gap-6 items-start">
                <div className="w-32 h-32 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative group cursor-pointer">
                  <ImageWithFallback src={formData.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold flex flex-col items-center"><Upload size={16} className="mb-1"/> Changer</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom du produit *</label>
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-bds-red outline-none" 
                      placeholder="Ex: Croissant au beurre"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-bds-red outline-none bg-white"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Prix de base</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full border border-gray-200 rounded-lg p-2.5 pr-8 text-sm focus:border-bds-red outline-none font-mono" 
                          placeholder="1500"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-xs font-bold">F</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Description courte</label>
                 <textarea 
                   value={formData.description}
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-bds-red outline-none h-20 resize-none"
                   placeholder="Description visible par les clients..."
                 />
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Allergènes</label>
                 <div className="flex flex-wrap gap-2">
                    {ALLERGENS.map(allergen => (
                       <button
                         key={allergen.id}
                         onClick={() => toggleAllergen(allergen.id)}
                         className={cn(
                           "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5",
                           (formData.allergens || []).includes(allergen.id)
                             ? "bg-red-50 text-red-700 border-red-200"
                             : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                         )}
                       >
                         {allergen.label}
                         {(formData.allergens || []).includes(allergen.id) && <CheckCircle size={12} />}
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {modalTab === "stock" && (
            <div className="space-y-4">
               <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                  <Info size={18} className="flex-shrink-0" />
                  <p>Vous pouvez personnaliser le prix et gérer le stock pour chaque boutique individuellement.</p>
               </div>
               
               <div className="space-y-3">
                 {STORES.map(store => (
                   <div key={store.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded text-bds-red focus:ring-bds-red w-4 h-4"/>
                            <span className="font-bold text-gray-900">{store.name}</span>
                         </div>
                         <div className="text-xs text-gray-500">Dernière mise à jour: 2h</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Prix (FCFA)</label>
                            <input 
                              defaultValue={formData.price || 1500}
                              className="w-full bg-white border border-gray-200 rounded p-2 text-sm font-mono"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Stock actuel</label>
                            <input 
                              type="number"
                              defaultValue={Math.floor(Math.random() * 50)}
                              className="w-full bg-white border border-gray-200 rounded p-2 text-sm font-mono"
                            />
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {modalTab === "stats" && (
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                     <div className="text-xs text-gray-500 font-bold uppercase mb-1">Ventes Totales</div>
                     <div className="text-2xl font-bold font-serif text-gray-900">1,245</div>
                     <div className="text-xs text-green-600 font-bold mt-1 flex items-center justify-center gap-1"><TrendingUp size={10}/> +12%</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                     <div className="text-xs text-gray-500 font-bold uppercase mb-1">Revenu</div>
                     <div className="text-2xl font-bold font-serif text-gray-900">1.8M</div>
                     <div className="text-xs text-gray-400 font-bold mt-1">FCFA</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                     <div className="text-xs text-gray-500 font-bold uppercase mb-1">Note Moy.</div>
                     <div className="text-2xl font-bold font-serif text-bds-gold">4.8</div>
                     <div className="text-xs text-gray-400 font-bold mt-1">sur 5</div>
                  </div>
               </div>

               <div>
                  <h4 className="font-bold text-gray-900 mb-4">Ventes des 7 derniers jours</h4>
                  <div className="h-48 w-full bg-white rounded-lg border border-gray-100 p-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_SALES_DATA}>
                           <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={5} />
                           <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                           />
                           <Area type="monotone" dataKey="sales" stroke="#D32F2F" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <BDSButton variant="outline" onClick={onClose}>Annuler</BDSButton>
          <BDSButton onClick={() => onSave(formData)} className="px-8 shadow-bds-cta">Enregistrer</BDSButton>
        </div>
      </motion.div>
    </div>
  );
}

function CategoryModal({ onClose, onSave }: { onClose: () => void, onSave: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold font-serif">Nouvelle catégorie</h3>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nom de la catégorie *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-bds-red outline-none" 
              placeholder="Ex: Glaces"
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <BDSButton variant="outline" onClick={onClose}>Annuler</BDSButton>
          <BDSButton onClick={() => onSave(name)} disabled={!name.trim()} className="px-8 shadow-bds-cta">Ajouter</BDSButton>
        </div>
      </motion.div>
    </div>
  );
}
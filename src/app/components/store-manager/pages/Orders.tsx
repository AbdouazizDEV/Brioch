import { useState, useMemo } from "react";
import { 
  Search, Filter, Clock, Truck, ShoppingBag, X, 
  Printer, MessageSquare, AlertTriangle, User, MoreHorizontal, Phone
} from "lucide-react";
import { ORDERS, Order } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function StoreManagerOrders({ storeId }: { storeId: string }) {
  // Filter orders by storeId automatically
  const [orders, setOrders] = useState<Order[]>(ORDERS.filter(o => o.storeId === storeId));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state (no store filter needed - already filtered)
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterMode, setFilterMode] = useState("Tous");
  const [filterDate, setFilterDate] = useState("Tous");
  const [filterDriver, setFilterDriver] = useState("Tous");
  const [managerComment, setManagerComment] = useState("");

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone?.includes(searchQuery);
      
      const matchesStatus = filterStatus === "Tous" || order.status === filterStatus;
      const matchesMode = filterMode === "Tous" || order.deliveryMode === filterMode;
      const matchesDate = filterDate === "Tous" || true;
      const matchesDriver = filterDriver === "Tous" || order.driverId === filterDriver;
      
      return matchesSearch && matchesStatus && matchesMode && matchesDate && matchesDriver;
    });
  }, [orders, searchQuery, filterStatus, filterMode, filterDate, filterDriver]);

  // Status Badge Style
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Validée': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En préparation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En livraison': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Livrée': return 'bg-green-100 text-green-800 border-green-200';
      case 'Annulée': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6">
      
      <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par N°, Client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl text-sm outline-none focus:border-bds-red focus:ring-1 focus:ring-bds-red transition-all" 
            />
          </div>
          <div className="flex gap-3">
             <BDSButton onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-12 gap-2"><Filter size={18}/> Filtres</BDSButton>
             <BDSButton className="h-12 shadow-bds-cta gap-2"><Printer size={18}/> Exporter CSV</BDSButton>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="Tous">Tous les statuts</option>
                <option value="Validée">Validée</option>
                <option value="En préparation">En préparation</option>
                <option value="En livraison">En livraison</option>
                <option value="Livrée">Livrée</option>
                <option value="Annulée">Annulée</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
                <option value="Tous">Tous les modes</option>
                <option value="Livraison">Livraison</option>
                <option value="Click & Collect">Click & Collect</option>
                <option value="Sur place">Sur place</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                <option value="Tous">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" value={filterDriver} onChange={(e) => setFilterDriver(e.target.value)}>
                <option value="Tous">Tous les livreurs</option>
                <option value="driver1">Mamadou Diop</option>
                <option value="driver2">Amadou Ndiaye</option>
              </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[800px]">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Commande</th>
              <th className="px-6 py-4">Heure</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Aucune commande trouvée pour votre boutique
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedOrder(order)}>
                  <td className="px-6 py-4 font-bold font-mono text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date.split(',')[1] || order.date}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{order.customer.name}</div>
                    <div className="text-gray-400 text-xs">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 font-medium bg-gray-100 w-fit px-3 py-1 rounded-full text-xs">
                      {order.deliveryMode === 'Livraison' ? <Truck size={14} /> : <ShoppingBag size={14} />}
                      {order.deliveryMode}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">{order.total} F</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusStyle(order.status))}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal - Same as Admin but without store management */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 sticky top-0 z-10">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <button onClick={() => setSelectedOrder(null)} className="md:hidden mr-2"><X/></button>
                     <h2 className="text-2xl font-bold font-serif">{selectedOrder.id}</h2>
                   </div>
                   <div className="flex gap-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusStyle(selectedOrder.status))}>
                        {selectedOrder.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 flex items-center gap-1">
                        <Clock size={12}/> 14 min écoulées
                      </span>
                   </div>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="hidden md:block p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="p-6 space-y-8">
                
                {/* Timeline */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Suivi</h3>
                   <div className="space-y-4 pl-2 border-l-2 border-gray-200 ml-2">
                      <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                        <p className="font-bold text-sm">Commande validée</p>
                        <p className="text-xs text-gray-500">14:35 (Système)</p>
                      </div>
                      <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                        <p className="font-bold text-sm">En préparation</p>
                        <p className="text-xs text-gray-500">14:38 (Aminata - Préparateur)</p>
                      </div>
                      <div className="relative pl-6 opacity-50">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                        <p className="font-bold text-sm">Prête / En livraison</p>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 italic">
                      ℹ️ Le statut est géré par l'équipe en cuisine. Vous supervisez uniquement.
                   </div>
                </div>

                {/* Customer */}
                <div>
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">
                     <User size={16} className="text-bds-red" /> Client
                   </h3>
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-500 mb-1">{selectedOrder.customer.phone}</p>
                        <span className="text-xs bg-bds-gold/20 text-yellow-800 px-2 py-0.5 rounded font-bold">SILVER MEMBER</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 border rounded hover:bg-gray-50" title="Appeler"><Phone size={16}/></button>
                        <button className="p-2 border rounded hover:bg-gray-50" title="SMS"><MessageSquare size={16}/></button>
                      </div>
                   </div>
                   {selectedOrder.address && (
                     <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 flex items-start gap-2">
                       <Truck size={16} className="mt-0.5 text-gray-400 shrink-0" />
                       {selectedOrder.address}
                     </div>
                   )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">
                    <ShoppingBag size={16} className="text-bds-red" /> Articles
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm items-center">
                        <span className="font-medium text-gray-700">{item.quantity}x {item.product.name}</span>
                        <span className="font-bold text-gray-900">{item.product.price * item.quantity} F</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-medium text-gray-500">Total Payé</span>
                      <span className="font-bold text-2xl text-bds-red">{selectedOrder.total} F</span>
                    </div>
                  </div>
                </div>

                {/* Manager Private Comments */}
                <div>
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">
                     <MessageSquare size={16} className="text-bds-red" /> Commentaires Privés
                   </h3>
                   <div className="space-y-3">
                     <textarea 
                       value={managerComment}
                       onChange={(e) => setManagerComment(e.target.value)}
                       placeholder="Ajouter un commentaire pour l'équipe..."
                       className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-bds-red outline-none h-24 resize-none"
                     />
                     <div className="flex gap-2">
                       <BDSButton variant="outline" size="sm" onClick={() => {
                         toast.success("Commentaire enregistré");
                         setManagerComment("");
                       }}>
                         Enregistrer
                       </BDSButton>
                     </div>
                   </div>
                </div>

                {/* Manager Actions */}
                <div>
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">
                     <AlertTriangle size={16} className="text-bds-red" /> Actions
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                     <button className="col-span-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-sm">
                       <Printer size={16} /> Imprimer ticket
                     </button>
                     <button className="col-span-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-sm">
                       <User size={16} /> Réassigner livreur
                     </button>
                     <button className="col-span-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-sm">
                       <Phone size={16} /> Contacter client
                     </button>
                     <button className="col-span-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-sm">
                       <Truck size={16} /> Contacter livreur
                     </button>
                     <button className="col-span-2 p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 font-bold text-sm">
                       <AlertTriangle size={16} /> Signaler un problème
                     </button>
                   </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

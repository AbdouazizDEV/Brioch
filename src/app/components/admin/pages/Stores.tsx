import { useState } from "react";
import { Plus, MapPin, Clock, Phone, Settings, Edit, Power, CheckCircle, X } from "lucide-react";
import { STORES } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AdminStores() {
  const [stores, setStores] = useState(STORES);
  const [editingStore, setEditingStore] = useState<any>(null);

  const handleToggleStatus = (id: string) => {
    setStores(stores.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
    toast.success("Statut de la boutique mis à jour");
  };

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold font-serif text-gray-900">Gestion des Boutiques</h2>
           <p className="text-sm text-gray-500">Configurez vos points de vente</p>
        </div>
        <BDSButton onClick={() => setEditingStore({})} className="gap-2 shadow-bds-cta"><Plus size={18}/> Ajouter une boutique</BDSButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
            <div className="h-48 relative overflow-hidden">
               <ImageWithFallback src={store.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => handleToggleStatus(store.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md flex items-center gap-1.5 transition-colors", 
                      store.isOpen ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                    )}
                  >
                    <Power size={12} />
                    {store.isOpen ? "OUVERTE" : "FERMÉE"}
                  </button>
               </div>
               <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl font-serif">{store.name}</h3>
               </div>
            </div>
            
            <div className="p-6 space-y-4">
               <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={18} className="text-bds-red shrink-0 mt-0.5"/>
                  <span>{store.address}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone size={18} className="text-bds-red shrink-0"/>
                  <span>+221 33 820 XX XX</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock size={18} className="text-bds-red shrink-0"/>
                  <span>{store.hours}</span>
               </div>

               <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-2 rounded text-center">
                     <span className="block text-xs text-gray-400 font-bold uppercase">Commandes</span>
                     <span className="font-bold text-gray-900">18</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                     <span className="block text-xs text-gray-400 font-bold uppercase">CA Jour</span>
                     <span className="font-bold text-gray-900">452K</span>
                  </div>
               </div>
               
               <div className="flex gap-2 pt-2">
                 <button onClick={() => setEditingStore(store)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Edit size={16} /> Modifier
                 </button>
                 <button className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Settings size={16} /> Configurer
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (Simplified) */}
      <AnimatePresence>
        {editingStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold font-serif">{editingStore.id ? "Modifier Boutique" : "Nouvelle Boutique"}</h3>
                   <button onClick={() => setEditingStore(null)}><X size={24}/></button>
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                      <input className="w-full border p-3 rounded-lg bg-gray-50" defaultValue={editingStore.name} placeholder="Nom de la boutique" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Adresse</label>
                      <input className="w-full border p-3 rounded-lg bg-gray-50" defaultValue={editingStore.address} placeholder="Adresse complète" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Heure Ouverture</label>
                        <input type="time" className="w-full border p-3 rounded-lg bg-gray-50" defaultValue="07:00" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Heure Fermeture</label>
                        <input type="time" className="w-full border p-3 rounded-lg bg-gray-50" defaultValue="21:00" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Services</label>
                      <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-bds-red"/> Livraison</label>
                         <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-bds-red"/> Click & Collect</label>
                         <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-bds-red"/> Sur place</label>
                      </div>
                   </div>
                </div>
                <div className="mt-8 flex gap-3 justify-end">
                   <BDSButton variant="outline" onClick={() => setEditingStore(null)}>Annuler</BDSButton>
                   <BDSButton onClick={() => { toast.success("Enregistré"); setEditingStore(null); }}>Enregistrer</BDSButton>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

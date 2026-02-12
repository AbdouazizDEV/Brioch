import { useState } from "react";
import { 
  Plus, Search, Filter, MoreHorizontal, Star, Truck, Utensils, 
  X, Save, Ban, MapPin, Phone, Calendar, History, TrendingUp 
} from "lucide-react";
import { DRIVERS } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Preparators
const PREPARATORS = [
  { id: 'prep-1', name: 'Aminata Sall', store: 'Almadies', phone: '+221 77 123 45 67', status: 'Actif', orders: 18, avgTime: '16min', perf: 95 },
  { id: 'prep-2', name: 'Fatou Ba', store: 'Mermoz', phone: '+221 77 234 56 78', status: 'Actif', orders: 15, avgTime: '18min', perf: 92 },
  { id: 'prep-3', name: 'Ousmane Fall', store: 'Plateau', phone: '+221 77 345 67 89', status: 'Inactif', orders: 0, avgTime: '-', perf: 0 },
];

const PERFORMANCE_DATA = [
  { day: 'Lun', value: 85 },
  { day: 'Mar', value: 92 },
  { day: 'Mer', value: 88 },
  { day: 'Jeu', value: 95 },
  { day: 'Ven', value: 90 },
  { day: 'Sam', value: 98 },
  { day: 'Dim', value: 94 },
];

export default function AdminTeam() {
  const [activeTab, setActiveTab] = useState<"drivers" | "preparators">("drivers");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const handleMemberClick = (member: any, type: "driver" | "preparator") => {
    setSelectedMember({ ...member, type });
  };

  const closeDetail = () => setSelectedMember(null);

  const handleSave = () => {
    toast.success("Informations mises à jour avec succès");
    closeDetail();
  };

  const handleDeactivate = () => {
    toast.error("Compte désactivé");
    closeDetail();
  };
  
  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold font-serif text-gray-900">Gestion de l'Équipe</h2>
           <p className="text-sm text-gray-500">Gérez vos livreurs et préparateurs</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
              <button 
                onClick={() => setActiveTab("drivers")}
                className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2", activeTab === "drivers" ? "bg-black text-white shadow" : "text-gray-500 hover:bg-gray-50")}
              >
                <Truck size={16} /> Livreurs
              </button>
              <button 
                onClick={() => setActiveTab("preparators")}
                className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2", activeTab === "preparators" ? "bg-black text-white shadow" : "text-gray-500 hover:bg-gray-50")}
              >
                <Utensils size={16} /> Préparateurs
              </button>
           </div>
           <BDSButton className="gap-2 shadow-bds-cta"><Plus size={18}/> Ajouter membre</BDSButton>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-bds-card border border-gray-100 flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input placeholder="Rechercher par nom..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-bds-red text-sm" />
         </div>
         <BDSButton variant="outline" className="gap-2"><Filter size={16}/> Filtres</BDSButton>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-hidden">
         {activeTab === "drivers" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Livreur</th>
                    <th className="px-6 py-4">Véhicule</th>
                    <th className="px-6 py-4">Courses (Auj)</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Performance</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DRIVERS.map(driver => (
                    <tr key={driver.id} onClick={() => handleMemberClick(driver, 'driver')} className="hover:bg-gray-50 cursor-pointer group transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                             <ImageWithFallback src={driver.photo} className="w-full h-full object-cover" />
                           </div>
                           <div>
                             <div className="font-bold text-gray-900 group-hover:text-bds-red transition-colors">{driver.name}</div>
                             <div className="text-xs text-gray-500">{driver.phone}</div>
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{driver.vehicle}</span></td>
                      <td className="px-6 py-4 font-bold">{driver.deliveriesToday}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-bds-gold">
                          <Star size={14} fill="currentColor" /> {driver.rating}
                          <span className="text-gray-400 text-xs font-normal">(120)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 mb-1">
                           <div className="bg-green-500 h-full rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">98% Succès</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn("px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit", 
                            driver.status === 'En service' ? "bg-green-100 text-green-700" : 
                            driver.status === 'Occupé' ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                         )}>
                           <div className={cn("w-1.5 h-1.5 rounded-full", driver.status === 'En service' ? "bg-green-500" : driver.status === 'Occupé' ? "bg-orange-500" : "bg-gray-400")}></div>
                           {driver.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-bds-black"><MoreHorizontal size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">Préparateur</th>
                    <th className="px-6 py-4">Boutique</th>
                    <th className="px-6 py-4">Commandes (Auj)</th>
                    <th className="px-6 py-4">Temps Moyen</th>
                    <th className="px-6 py-4">Performance</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PREPARATORS.map(prep => (
                    <tr key={prep.id} onClick={() => handleMemberClick(prep, 'preparator')} className="hover:bg-gray-50 cursor-pointer group transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center text-gray-500 bg-gray-100">
                              <span className="font-bold text-lg">{prep.name[0]}</span>
                           </div>
                           <div>
                             <div className="font-bold text-gray-900 group-hover:text-bds-red transition-colors">{prep.name}</div>
                             <div className="text-xs text-gray-500">ID: {prep.id}</div>
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-4"><span className="font-medium text-gray-700">{prep.store}</span></td>
                      <td className="px-6 py-4 font-bold">{prep.orders}</td>
                      <td className="px-6 py-4 font-mono font-bold text-gray-600">{prep.avgTime}</td>
                      <td className="px-6 py-4">
                         {prep.perf > 0 ? (
                           <div className="flex items-center gap-2">
                             <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${prep.perf}%` }}></div>
                             </div>
                             <span className="text-xs font-bold text-purple-700">{prep.perf}%</span>
                           </div>
                         ) : (
                           <span className="text-xs text-gray-400">-</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn("px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit", 
                            prep.status === 'Actif' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                         )}>
                           <div className={cn("w-1.5 h-1.5 rounded-full", prep.status === 'Actif' ? "bg-green-500" : "bg-gray-400")}></div>
                           {prep.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-bds-black"><MoreHorizontal size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         )}
      </div>

      {/* Member Detail Panel */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDetail}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      {selectedMember.photo ? (
                         <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                           <ImageWithFallback src={selectedMember.photo} className="w-full h-full object-cover" />
                         </div>
                      ) : (
                         <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-2xl">
                           {selectedMember.name[0]}
                         </div>
                      )}
                      <div>
                         <h2 className="text-xl font-bold font-serif">{selectedMember.name}</h2>
                         <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            {selectedMember.type === 'driver' ? <Truck size={14} /> : <Utensils size={14} />}
                            {selectedMember.type === 'driver' ? 'Livreur' : 'Préparateur'} • {selectedMember.status}
                         </div>
                      </div>
                   </div>
                   <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                </div>

                {/* Info Form */}
                <div className="space-y-4">
                   <h3 className="font-bold text-gray-900 border-b pb-2">Informations personnelles</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500">Téléphone</label>
                         <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm font-medium">
                            <Phone size={14} className="text-gray-400"/>
                            {selectedMember.phone || "+221 77 XXX XX XX"}
                         </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500">Zone / Boutique</label>
                         <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm font-medium">
                            <MapPin size={14} className="text-gray-400"/>
                            {selectedMember.store || "Zone Centre"}
                         </div>
                      </div>
                      {selectedMember.type === 'driver' && (
                        <div className="space-y-1">
                           <label className="text-xs font-bold text-gray-500">Véhicule</label>
                           <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm font-medium">
                              <Truck size={14} className="text-gray-400"/>
                              {selectedMember.vehicle}
                           </div>
                        </div>
                      )}
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500">Date d'embauche</label>
                         <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm font-medium">
                            <Calendar size={14} className="text-gray-400"/>
                            12 Jan 2024
                         </div>
                      </div>
                   </div>
                </div>

                {/* Performance Chart */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-bold text-gray-900">Performance Hebdomadaire</h3>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                         <TrendingUp size={12} /> +4.5%
                      </div>
                   </div>
                   <div className="h-48 w-full bg-white rounded-lg border border-gray-100 p-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                           <defs>
                              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                           <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={5} />
                           <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              cursor={{ stroke: '#D32F2F', strokeWidth: 1 }}
                           />
                           <Area type="monotone" dataKey="value" stroke="#D32F2F" strokeWidth={2} fillOpacity={1} fill="url(#colorPerf)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                         <div className="text-xs text-gray-500 mb-1">Commandes</div>
                         <div className="font-bold text-lg">145</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                         <div className="text-xs text-gray-500 mb-1">Temps moy.</div>
                         <div className="font-bold text-lg">18m</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                         <div className="text-xs text-gray-500 mb-1">Satisfaction</div>
                         <div className="font-bold text-lg text-bds-gold">4.8</div>
                      </div>
                   </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                   <h3 className="font-bold text-gray-900 border-b pb-2">Activité récente</h3>
                   <div className="space-y-3">
                      {[1,2,3].map(i => (
                         <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="mt-1 min-w-[60px] text-xs text-gray-400 font-medium">10:3{i} AM</div>
                            <div>
                               <div className="font-medium text-gray-800">Commande #{2340+i} livrée</div>
                               <div className="text-xs text-gray-500">Zone Mermoz • 2500 FCFA</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white pb-6">
                   <BDSButton onClick={handleSave} className="flex-1 gap-2 shadow-bds-cta"><Save size={18}/> Enregistrer</BDSButton>
                   <BDSButton onClick={handleDeactivate} variant="outline" className="flex-1 gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700">
                      <Ban size={18}/> Désactiver
                   </BDSButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
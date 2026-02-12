import { useState } from "react";
import { 
  Navigation, Plus, Minus, MapPin, Phone, Truck, Clock, 
  AlertTriangle, User 
} from "lucide-react";
import { ORDERS, DRIVERS, Order } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function StoreManagerDeliveries({ storeId }: { storeId: string }) {
  // Filter by storeId
  const activeDeliveries = ORDERS.filter(o => 
    (o.status === 'En livraison' || o.status === 'En préparation') && o.storeId === storeId
  );
  const [selectedDelivery, setSelectedDelivery] = useState<Order | null>(null);
  const [view, setView] = useState<"map" | "list">("map");

  const unassignedOrders = ORDERS.filter(o => 
    o.status === 'Validée' && 
    o.deliveryMode === 'Livraison' && 
    !o.driverId && 
    o.storeId === storeId
  ).slice(0, 2);

  const handleAutoAssign = (orderId: string) => {
    toast.info("Algorithme d'assignation lancé...");
    setTimeout(() => {
        toast.success(`Commande ${orderId} assignée à Mamadou DIOP (Score: 98%)`);
    }, 1000);
  };

  // Filter drivers assigned to this store
  const storeDrivers = DRIVERS.filter(d => d.storeId === storeId || !d.storeId).slice(0, 8);

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6 flex flex-col h-full">
        
        <div className="flex justify-between items-center">
            <div>
               <h2 className="text-xl font-bold font-serif">Gestion des Livraisons</h2>
               <p className="text-sm text-gray-500">Supervision de la flotte de votre boutique</p>
            </div>
            <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button onClick={() => setView("map")} className={cn("px-3 py-1.5 rounded-md text-sm font-bold transition-colors", view === "map" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50")}>Carte</button>
                <button onClick={() => setView("list")} className={cn("px-3 py-1.5 rounded-md text-sm font-bold transition-colors", view === "list" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50")}>Liste</button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map Area */}
            <div className={cn("col-span-1 lg:col-span-2 bg-white rounded-xl shadow-bds-card border border-gray-100 relative overflow-hidden group transition-all", view === "list" && "hidden lg:block")}>
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gray-200">
                  <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg')] bg-repeat bg-[length:100px_100px] grayscale pointer-events-none"></div>
                  <ImageWithFallback src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770565305/dakar_multicolor_eudavu.webp" className="w-full h-full object-cover" />
                </div>
                
                {/* Simulated Pins - Only drivers from this store */}
                {storeDrivers.map((driver, i) => (
                   <motion.div 
                     key={driver.id}
                     initial={{ scale: 0 }} animate={{ scale: 1 }}
                     className="absolute cursor-pointer group/pin"
                     style={{ top: `${20 + (i * 15) % 60}%`, left: `${10 + (i * 23) % 80}%` }}
                     whileHover={{ scale: 1.2 }}
                   >
                      <div className={cn(
                         "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white relative",
                         driver.status === 'En service' ? "bg-blue-500" : driver.status === 'Occupé' ? "bg-blue-700" : "bg-gray-400"
                      )}>
                        <Truck size={14} />
                        {driver.status === 'En service' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                      </div>
                      {/* Pin Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-xl text-xs whitespace-nowrap hidden group-hover/pin:block z-10 min-w-[150px]">
                         <div className="font-bold text-gray-900 text-sm mb-1">{driver.name}</div>
                         <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <span className={cn("w-2 h-2 rounded-full", driver.status === 'En service' ? "bg-green-500" : "bg-orange-500")}></span>
                            {driver.vehicle} • {driver.status}
                         </div>
                         <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-bds-gold">★ {driver.rating}</span>
                            <span className="text-gray-400">2.1 km</span>
                         </div>
                      </div>
                   </motion.div>
                ))}

                {/* Store Pin */}
                <div className="absolute bottom-[200px] left-[170px] -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform z-10">
                   <div className="bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold mb-1 whitespace-nowrap border border-gray-200">Votre Boutique</div>
                   <div className="w-14 h-14 bg-[#D32F2F] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
                      <MapPin size={28} fill="currentColor" />
                   </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                   <button className="bg-white p-2 rounded shadow-md hover:bg-gray-100"><Navigation size={20}/></button>
                   <button className="bg-white p-2 rounded shadow-md hover:bg-gray-100"><Plus size={20}/></button>
                   <button className="bg-white p-2 rounded shadow-md hover:bg-gray-100"><Minus size={20}/></button>
                </div>

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-gray-100 text-xs space-y-2">
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div> Boutique</div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div> Livreur actif</div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div> Client</div>
                </div>
            </div>

            {/* Sidebar Stats & List */}
            <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 flex flex-col overflow-hidden h-full">
                {/* Stats Panel */}
                <div className="p-4 border-b border-gray-100 grid grid-cols-2 gap-3 bg-gray-50">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 uppercase font-bold">Actifs</div>
                        <div className="text-xl font-bold text-blue-600">{storeDrivers.filter(d => d.status === 'En service').length}/{storeDrivers.length}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 uppercase font-bold">En cours</div>
                        <div className="text-xl font-bold text-gray-900">{activeDeliveries.length}</div>
                    </div>
                    <div className="col-span-2 bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                        <div>
                           <div className="text-xs text-gray-500 uppercase font-bold">Temps Moyen</div>
                           <div className="text-xl font-bold text-gray-900">32 min</div>
                        </div>
                        <div className="text-right">
                           <div className="text-xs text-gray-500 uppercase font-bold">Succès</div>
                           <div className="text-xl font-bold text-green-600">98.5%</div>
                        </div>
                    </div>
                </div>

                {/* Alerts / Unassigned */}
                {unassignedOrders.length > 0 && (
                   <div className="p-4 bg-red-50 border-b border-red-100">
                      <h4 className="font-bold text-red-800 text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle size={14}/> À assigner ({unassignedOrders.length})
                      </h4>
                      <div className="space-y-2">
                         {unassignedOrders.map(order => (
                            <div key={order.id} className="bg-white p-3 rounded border border-red-200 shadow-sm">
                               <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-xs text-gray-900">{order.id}</span>
                                  <span className="font-bold text-xs text-red-600">{order.total} F</span>
                               </div>
                               <p className="text-xs text-gray-500 mb-2 truncate">{order.address || "Zone inconnue"}</p>
                               <div className="flex gap-2">
                                  <button onClick={() => handleAutoAssign(order.id)} className="flex-1 bg-red-600 text-white text-[10px] font-bold py-1.5 rounded hover:bg-red-700 transition-colors">
                                     AUTO-ASSIGNER
                                  </button>
                                  <button className="px-2 border border-gray-200 rounded hover:bg-gray-50">
                                     <User size={12}/>
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* Active List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                    <div className="px-2 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Livraisons en cours</div>
                    {activeDeliveries.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        Aucune livraison en cours
                      </div>
                    ) : (
                      activeDeliveries.map(order => (
                        <div 
                          key={order.id} 
                          onClick={() => setSelectedDelivery(order)}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-colors group bg-white hover:border-blue-300",
                            selectedDelivery?.id === order.id ? "ring-2 ring-blue-500 border-transparent" : "border-gray-100"
                          )}
                        >
                             <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-sm text-gray-900">{order.id}</span>
                                 <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", order.status === 'En préparation' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700")}>
                                   {order.status === 'En préparation' ? 'PRÉPARATION' : 'EN ROUTE'}
                                 </span>
                             </div>
                             <div className="flex items-start gap-2 text-xs text-gray-600 mb-3">
                                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400"/>
                                <span className="line-clamp-2">{order.address}</span>
                             </div>
                             
                             <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                                <div className="flex items-center gap-2 flex-1">
                                   <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                      <ImageWithFallback src={`https://randomuser.me/api/portraits/men/${parseInt(order.id.slice(-2)) % 50}.jpg`} className="w-full h-full object-cover"/>
                                   </div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-900">Mamadou D.</p>
                                      <p className="text-[10px] text-gray-500">ETA: 12 min</p>
                                   </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="p-1.5 bg-gray-100 rounded hover:bg-blue-50 hover:text-blue-600"><Phone size={12}/></button>
                                   <button className="p-1.5 bg-gray-100 rounded hover:bg-blue-50 hover:text-blue-600"><MapPin size={12}/></button>
                                </div>
                             </div>
                        </div>
                      ))
                    )}
                </div>
            </div>
        </div>

        {/* Selected Delivery Details Overlay */}
        <AnimatePresence>
           {selectedDelivery && (
             <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="fixed bottom-0 right-0 lg:right-auto lg:left-72 lg:w-[calc(100%-19rem)] bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20"
             >
                <div className="flex flex-col md:flex-row justify-between items-center p-4 md:px-8 md:py-6 gap-4">
                   <div className="flex items-center gap-6 w-full md:w-auto">
                      <div>
                         <h3 className="font-bold text-lg text-gray-900">{selectedDelivery.customer.name}</h3>
                         <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-mono bg-gray-100 px-1 rounded">{selectedDelivery.id}</span>
                            <span>•</span>
                            <span className="font-bold text-gray-900">{selectedDelivery.total} F</span>
                         </div>
                      </div>
                      <div className="hidden md:block h-10 w-px bg-gray-200"></div>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden ring-2 ring-white shadow-sm">
                            <ImageWithFallback src={`https://randomuser.me/api/portraits/men/${parseInt(selectedDelivery.id.slice(-2)) % 50}.jpg`} className="w-full h-full object-cover"/>
                         </div>
                         <div>
                            <p className="font-bold text-sm">Amadou Ndiaye</p>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                               <Truck size={10} /> À 5 min de destination
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                      <BDSButton variant="outline" size="sm" onClick={() => setSelectedDelivery(null)} className="flex-1 md:flex-none">Fermer</BDSButton>
                      <BDSButton size="sm" className="gap-2 flex-1 md:flex-none"><Phone size={14}/> Contacter Livreur</BDSButton>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
    </div>
  )
}

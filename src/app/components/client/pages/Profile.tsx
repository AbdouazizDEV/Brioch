import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Package, MapPin, CreditCard, LogOut, Edit2, ChevronRight, Clock, CheckCircle, Award, Gift, Share2, Plus, Trash2, Shield, Bell } from "lucide-react";
import { ORDERS } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Tab = 'profile' | 'orders' | 'loyalty' | 'addresses' | 'payments';

export default function ClientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  
  // Mock User Data
  const [user, setUser] = useState({
    name: "Fatou Diop",
    email: "fatou.diop@example.com",
    phone: "+221 77 123 45 67",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    points: 247,
    level: "Silver"
  });

  const [addresses, setAddresses] = useState([
      { id: 1, name: "Domicile", address: "Mermoz, Rue 12, Villa 45", default: true },
      { id: 2, name: "Bureau", address: "Plateau, Av. Bourguiba", default: false }
  ]);

  const [payments, setPayments] = useState([
      { id: 1, type: "Wave", number: "+221 77 ... 67", default: true },
      { id: 2, type: "Orange Money", number: "+221 70 ... 45", default: false }
  ]);

  const handleLogout = () => {
    toast.success("Déconnexion réussie");
    navigate('/');
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors", 
        activeTab === id 
            ? "bg-bds-red text-white shadow-md font-bold" 
            : "text-gray-600 hover:bg-gray-50"
        )}
    >
        <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Mon Espace</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-6 flex flex-col items-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                   <div className="relative">
                       <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mb-4 shadow-lg">
                          <ImageWithFallback src={user.photo} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute bottom-4 right-0 bg-bds-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                           {user.level}
                       </div>
                   </div>
                   <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                   <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                   <div className="bg-gray-100 rounded-full px-4 py-1 text-xs font-bold text-gray-600">
                       {user.points} points
                   </div>
                </div>
                <nav className="p-2 space-y-1">
                   <SidebarItem id="profile" icon={User} label="Profil & Sécurité" />
                   <SidebarItem id="loyalty" icon={Award} label="Fidélité & Parrainage" />
                   <SidebarItem id="orders" icon={Package} label="Mes Commandes" />
                   <SidebarItem id="addresses" icon={MapPin} label="Adresses" />
                   <SidebarItem id="payments" icon={CreditCard} label="Paiement" />
                </nav>
                <div className="p-4 border-t border-gray-100 mt-2">
                   <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                     <LogOut size={18} /> Déconnexion
                   </button>
                </div>
             </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                 {activeTab === 'profile' && (
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                         <h2 className="text-xl font-bold font-serif">Informations Personnelles</h2>
                         <BDSButton variant="outline" size="sm" icon={Edit2}>Modifier</BDSButton>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Prénom & Nom</label>
                            <div className="p-3 bg-gray-50 rounded-xl font-medium border border-gray-100">{user.name}</div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <div className="p-3 bg-gray-50 rounded-xl font-medium border border-gray-100 flex justify-between items-center">
                                {user.email}
                                <CheckCircle size={16} className="text-green-500" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                            <div className="p-3 bg-gray-50 rounded-xl font-medium border border-gray-100">{user.phone}</div>
                         </div>
                      </div>

                      <div className="flex justify-between items-center mb-6 pt-6 border-t border-gray-100">
                         <h2 className="text-xl font-bold font-serif">Sécurité</h2>
                      </div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                              <div className="flex items-center gap-4">
                                  <div className="p-2 bg-gray-100 rounded-lg"><Shield size={20}/></div>
                                  <div>
                                      <p className="font-bold text-sm">Mot de passe</p>
                                      <p className="text-xs text-gray-500">Dernière modification il y a 3 mois</p>
                                  </div>
                              </div>
                              <button className="text-sm font-bold text-gray-900 underline">Modifier</button>
                          </div>
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                              <div className="flex items-center gap-4">
                                  <div className="p-2 bg-gray-100 rounded-lg"><Bell size={20}/></div>
                                  <div>
                                      <p className="font-bold text-sm">Notifications</p>
                                      <p className="text-xs text-gray-500">Email, SMS et Push activés</p>
                                  </div>
                              </div>
                              <button className="text-sm font-bold text-gray-900 underline">Gérer</button>
                          </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'loyalty' && (
                     <div className="space-y-6">
                         {/* Status Card */}
                         <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-bds-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                             <div className="relative z-10">
                                 <div className="flex justify-between items-start mb-8">
                                     <div>
                                         <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">Votre niveau actuel</p>
                                         <h2 className="text-4xl font-serif font-bold text-bds-gold flex items-center gap-2">Silver <Award className="fill-bds-gold"/></h2>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-4xl font-bold">{user.points}</p>
                                         <p className="text-sm text-gray-400">points cumulés</p>
                                     </div>
                                 </div>
                                 
                                 <div className="mb-2 flex justify-between text-xs font-bold text-gray-400">
                                     <span>Silver</span>
                                     <span>Gold (1000 pts)</span>
                                 </div>
                                 <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-6">
                                     <div className="h-full w-[24.7%] bg-gradient-to-r from-bds-gold to-yellow-200 shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                                 </div>
                                 <p className="text-sm text-gray-300">🎉 Plus que <strong>753 points</strong> pour devenir Gold et bénéficier de la livraison gratuite illimitée !</p>
                             </div>
                         </div>

                         {/* Referral */}
                         <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                             <div className="flex-1">
                                 <div className="inline-block p-2 bg-blue-50 text-blue-700 rounded-lg mb-4"><Share2 size={24}/></div>
                                 <h3 className="text-2xl font-serif font-bold mb-2">Parrainez vos amis</h3>
                                 <p className="text-gray-500 mb-4">Offrez -10% à vos amis et gagnez <span className="font-bold text-bds-gold">+50 points</span> à chacune de leur première commande !</p>
                                 <div className="flex gap-2">
                                     <div className="bg-gray-100 px-4 py-3 rounded-xl font-mono font-bold tracking-widest text-gray-900 border border-gray-200">
                                         FATOU2026
                                     </div>
                                     <BDSButton>Copier</BDSButton>
                                 </div>
                             </div>
                             <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 text-center">
                                 <p className="font-bold text-gray-900 text-3xl mb-1">2</p>
                                 <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Amis parrainés</p>
                                 <div className="mt-4 flex justify-center -space-x-2">
                                     {[1,2].map(i => (
                                         <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {activeTab === 'addresses' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold font-serif">Mes Adresses</h2>
                            <BDSButton size="sm" icon={Plus}>Ajouter</BDSButton>
                        </div>
                        <div className="grid gap-4">
                            {addresses.map(addr => (
                                <div key={addr.id} className="p-4 border-2 rounded-xl flex items-center justify-between group transition-colors hover:border-gray-300 border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-full", addr.default ? "bg-red-50 text-bds-red" : "bg-gray-100 text-gray-500")}>
                                            <MapPin size={20} className={addr.default ? "fill-current" : ""}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                {addr.name} 
                                                {addr.default && <span className="bg-red-100 text-bds-red text-[10px] px-2 py-0.5 rounded-full uppercase">Défaut</span>}
                                            </h4>
                                            <p className="text-sm text-gray-500">{addr.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-gray-900"><Edit2 size={16}/></button>
                                        <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                 {activeTab === 'payments' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold font-serif">Moyens de Paiement</h2>
                            <BDSButton size="sm" icon={Plus}>Ajouter</BDSButton>
                        </div>
                        <div className="grid gap-4">
                            {payments.map(pm => (
                                <div key={pm.id} className="p-4 border-2 rounded-xl flex items-center justify-between group transition-colors hover:border-gray-300 border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-full", pm.default ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500")}>
                                            <CreditCard size={20}/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                {pm.type}
                                                {pm.default && <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full uppercase">Défaut</span>}
                                            </h4>
                                            <p className="text-sm text-gray-500 font-mono">{pm.number}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

                 {activeTab === 'orders' && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold font-serif mb-6 px-1">Historique Complet</h2>
                        {ORDERS.map((order) => (
                          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/client/tracking')}>
                             <div className="flex justify-between items-start">
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                       <span className="font-bold text-lg">{order.id}</span>
                                       <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">{order.date}</span>
                                   </div>
                                   <p className="text-sm text-gray-500">{order.items.length} articles • Total: {order.total} FCFA</p>
                                </div>
                                <div className="text-right">
                                    <span className={cn("px-2 py-1 rounded text-xs font-bold block mb-2", 
                                        order.status === 'Livrée' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {order.status}
                                    </span>
                                    <button className="text-xs font-bold text-bds-red hover:underline">Voir détails</button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

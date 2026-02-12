import { useState } from "react";
import { 
  Building2, Truck, Bell, Users, Shield, 
  Save, AlertCircle, Check, Eye, EyeOff, MapPin, Clock, Phone, Mail
} from "lucide-react";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Settings tabs for Store Manager (limited compared to Super Admin)
const SETTINGS_TABS = [
  { id: "general", label: "Informations Boutique", icon: Building2 },
  { id: "delivery", label: "Livraison", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Sécurité", icon: Shield },
];

export default function StoreManagerSettings({ storeId }: { storeId: string }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Paramètres enregistrés avec succès");
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">Paramètres Boutique</h2>
          <p className="text-sm text-gray-500">Configuration de votre boutique Brioche Dorée Almadies</p>
        </div>
        <BDSButton onClick={handleSave} disabled={isLoading} className="gap-2 shadow-bds-cta">
          {isLoading ? "Enregistrement..." : <><Save size={18}/> Enregistrer</>}
        </BDSButton>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-hidden sticky top-8">
            <nav className="flex flex-col p-2">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                    activeTab === tab.id 
                      ? "bg-bds-red text-white shadow-md transform scale-[1.02]" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-bds-card border border-gray-100 p-6 md:p-8 min-h-[500px]"
            >
              {activeTab === "general" && <GeneralSettings />}
              {activeTab === "delivery" && <DeliverySettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "security" && <SecuritySettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Informations de la boutique</h3>
        <p className="text-sm text-gray-500 mb-6">Ces informations apparaissent sur l'application client.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom de la boutique</label>
            <input type="text" defaultValue="Brioche Dorée Almadies" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" defaultValue="+221 33 824 24 24" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" defaultValue="almadies@briochedoree.sn" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Adresse complète</label>
            <input type="text" defaultValue="Route de l'Aéroport, Almadies, Dakar" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Photo de la boutique</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-bds-red transition-colors">
              <div className="text-gray-400 text-sm">Cliquez pour uploader une photo</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Horaires d'ouverture</h3>
        <div className="space-y-4">
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700">{day}</div>
              <div className="flex items-center gap-2 flex-1">
                <input type="time" defaultValue="07:00" className="w-32 p-2 border border-gray-200 rounded-lg text-sm" />
                <span className="text-gray-500">-</span>
                <input type="time" defaultValue="21:00" className="w-32 p-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-bds-red" />
                <span className="text-sm text-gray-600">Fermé</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Services disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Livraison', desc: 'Service de livraison à domicile' },
            { label: 'Click & Collect', desc: 'Retrait en boutique' },
            { label: 'Sur place', desc: 'Consommation sur place' }
          ].map((service) => (
            <label key={service.label} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" defaultChecked className="mt-1 rounded text-bds-red" />
              <div>
                <div className="font-bold text-sm text-gray-900">{service.label}</div>
                <div className="text-xs text-gray-500">{service.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliverySettings() {
  const [baseFee, setBaseFee] = useState(1500);
  const [radius, setRadius] = useState(12);
  const [prepTime, setPrepTime] = useState(15);
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Configuration de la Livraison</h3>
        <p className="text-sm text-gray-500 mb-6">Définissez les règles de tarification et de zone pour votre boutique.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 flex justify-between">
                 <span>Frais de livraison de base</span>
                 <span className="font-bold text-bds-red">{baseFee} FCFA</span>
               </label>
               <input 
                 type="range" min="0" max="5000" step="100" 
                 value={baseFee} onChange={(e) => setBaseFee(Number(e.target.value))}
                 className="w-full accent-bds-red" 
               />
               <div className="flex justify-between text-xs text-gray-400">
                 <span>Gratuit</span>
                 <span>5000 FCFA</span>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 flex justify-between">
                 <span>Rayon de livraison maximum</span>
                 <span className="font-bold text-bds-red">{radius} km</span>
               </label>
               <input 
                 type="range" min="1" max="50" step="1" 
                 value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                 className="w-full accent-bds-red" 
               />
               <div className="flex justify-between text-xs text-gray-400">
                 <span>1 km</span>
                 <span>50 km</span>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 flex justify-between">
                 <span>Temps de préparation (Click & Collect)</span>
                 <span className="font-bold text-bds-red">{prepTime} min</span>
               </label>
               <input 
                 type="range" min="5" max="60" step="5" 
                 value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))}
                 className="w-full accent-bds-red" 
               />
               <div className="flex justify-between text-xs text-gray-400">
                 <span>5 min</span>
                 <span>60 min</span>
               </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
             <h4 className="font-bold text-sm text-gray-900 mb-3">Note importante</h4>
             <p className="text-xs text-gray-600 mb-3">
               Les paramètres globaux de livraison sont gérés par le Super Admin. 
               Vous pouvez personnaliser les paramètres spécifiques à votre boutique ici.
             </p>
             <div className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-200">
               <strong>Paramètres globaux:</strong> Algorithme d'attribution, méthodes de paiement, etc.
             </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Seuils de gratuité</h3>
        <div className="flex items-center gap-4">
           <div className="w-12 h-6 bg-bds-red rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
           <span className="text-sm text-gray-700">Activer la livraison gratuite au-delà d'un certain montant</span>
        </div>
        <div className="mt-4 max-w-xs">
          <label className="text-xs font-medium text-gray-500">Montant minimum</label>
          <div className="relative mt-1">
             <input type="number" defaultValue="25000" className="w-full p-2.5 pl-4 pr-12 border border-gray-200 rounded-lg text-sm" />
             <span className="absolute right-4 top-2.5 text-gray-400 text-sm">FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Notifications Email</h3>
        <p className="text-sm text-gray-500 mb-6">Gérez les alertes pour votre boutique.</p>

        <div className="space-y-4">
           {[
             { title: "Nouvelle commande reçue", desc: "Alerte immédiate lors d'une nouvelle commande", active: true },
             { title: "Rapport journalier", desc: "Résumé des ventes envoyé chaque soir à 23h", active: true },
             { title: "Alerte Stock faible", desc: "Quand un produit atteint le seuil critique", active: false },
             { title: "Problème de livraison", desc: "Retard ou annulation par un livreur", active: true },
           ].map((notif, idx) => (
             <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex gap-3">
                   <div className="mt-1 text-gray-500"><Mail size={18} /></div>
                   <div>
                      <div className="font-bold text-gray-900 text-sm">{notif.title}</div>
                      <div className="text-xs text-gray-500">{notif.desc}</div>
                   </div>
                </div>
                <div className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors", notif.active ? "bg-bds-red" : "bg-gray-300")}>
                   <div className={cn("w-3 h-3 bg-white rounded-full absolute top-1 shadow-sm transition-all", notif.active ? "right-1" : "left-1")}></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Sécurité du compte</h3>
        <p className="text-sm text-gray-500 mb-6">Paramètres de sécurité pour protéger votre accès.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                   <Shield size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 text-sm">Double Authentification (2FA)</h4>
                   <p className="text-xs text-gray-500 max-w-md">Exiger un code envoyé par SMS/Email à chaque connexion.</p>
                </div>
             </div>
             <div className="w-12 h-6 bg-bds-red rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                   <AlertCircle size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 text-sm">Expiration de session</h4>
                   <p className="text-xs text-gray-500">Déconnecter automatiquement après 30 minutes d'inactivité.</p>
                </div>
             </div>
             <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
         <h3 className="text-lg font-bold text-gray-900 mb-4">Sessions actives</h3>
         <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                     <div className="font-bold text-sm text-gray-900">Chrome sur MacOS (Vous)</div>
                     <div className="text-xs text-gray-500">Dakar, SN • Actif maintenant</div>
                  </div>
               </div>
               <span className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded">Actuel</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div>
                     <div className="font-bold text-sm text-gray-900">Safari sur iPhone</div>
                     <div className="text-xs text-gray-500">Dakar, SN • Il y a 2h</div>
                  </div>
               </div>
               <button className="text-xs text-red-600 hover:underline">Révoquer</button>
            </div>
         </div>
      </div>
    </div>
  );
}

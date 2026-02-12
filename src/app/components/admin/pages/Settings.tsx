import { useState } from "react";
import { 
  Building2, Truck, CreditCard, Bell, Users, Shield, 
  Save, AlertCircle, Check, Eye, EyeOff, Plus, Trash2, Mail
} from "lucide-react";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Mock Data for Settings
const SETTINGS_TABS = [
  { id: "general", label: "Général", icon: Building2 },
  { id: "delivery", label: "Livraison", icon: Truck },
  { id: "payment", label: "Paiement DiziPay", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "security", label: "Sécurité", icon: Shield },
];

export default function AdminSettings() {
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
          <h2 className="text-2xl font-bold font-serif text-gray-900">Paramètres</h2>
          <p className="text-sm text-gray-500">Configuration globale de la plateforme Brioche Dorée</p>
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
              {activeTab === "payment" && <PaymentSettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "users" && <UsersSettings />}
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
        <h3 className="text-lg font-bold text-gray-900 mb-1">Informations de l'entreprise</h3>
        <p className="text-sm text-gray-500 mb-6">Ces informations apparaissent sur les factures et l'application client.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom de l'entreprise</label>
            <input type="text" defaultValue="Brioche Dorée Sénégal" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email de contact</label>
            <input type="email" defaultValue="contact@briochedoree.sn" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Téléphone Service Client</label>
            <input type="tel" defaultValue="+221 33 824 24 24" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Site Web</label>
            <input type="url" defaultValue="https://briochedoree.sn" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Adresse du Siège</label>
            <input type="text" defaultValue="Route de Ouakam, Dakar, Sénégal" className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Localisation & Devise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Devise</label>
            <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm bg-white">
              <option>Franc CFA (XOF)</option>
              <option>Euro (EUR)</option>
              <option>Dollar (USD)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fuseau Horaire</label>
            <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-bds-red outline-none text-sm bg-white">
              <option>GMT (Dakar)</option>
              <option>GMT+1 (Paris)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
             <h3 className="text-lg font-bold text-gray-900">Mode Maintenance</h3>
             <p className="text-sm text-gray-500">Désactive l'accès à l'application client pour maintenance.</p>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors hover:bg-gray-300">
             <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliverySettings() {
  const [baseFee, setBaseFee] = useState(1500);
  const [radius, setRadius] = useState(15);
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Configuration de la Livraison</h3>
        <p className="text-sm text-gray-500 mb-6">Définissez les règles de tarification et de zone.</p>

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
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
             <h4 className="font-bold text-sm text-gray-900 mb-3">Algorithme d'attribution</h4>
             <div className="space-y-3">
               <label className="flex items-start gap-3 p-3 bg-white border border-bds-red/30 rounded-lg cursor-pointer">
                 <input type="radio" name="algo" defaultChecked className="mt-1 accent-bds-red" />
                 <div>
                   <div className="font-bold text-sm text-gray-900">Proximité + Disponibilité</div>
                   <div className="text-xs text-gray-500">Le livreur disponible le plus proche est assigné automatiquement.</div>
                 </div>
               </label>
               <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                 <input type="radio" name="algo" className="mt-1 accent-bds-red" />
                 <div>
                   <div className="font-bold text-sm text-gray-900">Tour de rôle (Round Robin)</div>
                   <div className="text-xs text-gray-500">Distribution équitable des commandes entre les livreurs connectés.</div>
                 </div>
               </label>
               <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                 <input type="radio" name="algo" className="mt-1 accent-bds-red" />
                 <div>
                   <div className="font-bold text-sm text-gray-900">Manuel uniquement</div>
                   <div className="text-xs text-gray-500">Les managers doivent assigner manuellement chaque commande.</div>
                 </div>
               </label>
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

function PaymentSettings() {
  const [testMode, setTestMode] = useState(true);
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">DiziPay Configuration</h3>
           <p className="text-sm text-gray-500">Gérez l'intégration avec la passerelle de paiement DiziPay.</p>
         </div>
         <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
            <CreditCard size={14} /> Connecté
         </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={cn("w-3 h-3 rounded-full", testMode ? "bg-orange-500" : "bg-green-500")}></div>
               <div>
                 <h4 className="font-bold text-gray-900">Mode Test (Sandbox)</h4>
                 <p className="text-xs text-gray-500">Pour le développement et les tests uniquement</p>
               </div>
            </div>
            <div 
              onClick={() => setTestMode(!testMode)}
              className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", testMode ? "bg-orange-500" : "bg-gray-200")}
            >
              <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", testMode ? "right-1" : "left-1")}></div>
            </div>
         </div>

         <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Clé API Publique</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value="pk_test_51MzQ2lE3x8z9Xy4c..." 
                  readOnly 
                  className="flex-1 bg-white p-2.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-600" 
                />
                <button className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                  <Save size={18} className="rotate-0" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Clé Secrète</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                   <input 
                     type={showKey ? "text" : "password"} 
                     value="sk_test_51MzQ2lE3x8z9Xy4c..." 
                     readOnly 
                     className="w-full bg-white p-2.5 border border-gray-200 rounded-lg text-sm font-mono text-gray-600" 
                   />
                   <button 
                     onClick={() => setShowKey(!showKey)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                   </button>
                </div>
              </div>
            </div>
         </div>
      </div>

      <div>
         <h4 className="font-bold text-gray-900 mb-4">Méthodes de paiement acceptées</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Wave', 'Orange Money', 'Carte Bancaire', 'Espèces à la livraison'].map((method) => (
               <label key={method} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-bds-red rounded" />
                  <span className="text-sm font-medium text-gray-700">{method}</span>
               </label>
            ))}
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
        <p className="text-sm text-gray-500 mb-6">Gérez les alertes envoyées aux administrateurs et clients.</p>

        <div className="space-y-4">
           {[
             { title: "Nouvelle commande reçue", desc: "Alerte immédiate lors d'une nouvelle commande", active: true },
             { title: "Rapport journalier", desc: "Résumé des ventes envoyé chaque soir à 23h", active: true },
             { title: "Alerte Stock faible", desc: "Quand un produit atteint le seuil critique", active: false },
             { title: "Problème de livraison", desc: "Retard ou annulation par un livreur", active: true },
             { title: "Nouvel avis client", desc: "Lorsqu'un client laisse une note < 3 étoiles", active: false },
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

      <div className="border-t border-gray-100 pt-6">
         <h3 className="text-lg font-bold text-gray-900 mb-4">Destinataires des rapports</h3>
         <div className="flex flex-wrap gap-2 mb-3">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-2">
               admin@briochedoree.sn <button className="hover:text-red-500"><Trash2 size={12} /></button>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-2">
               manager.plateau@briochedoree.sn <button className="hover:text-red-500"><Trash2 size={12} /></button>
            </div>
         </div>
         <div className="flex gap-2 max-w-md">
            <input type="email" placeholder="Ajouter un email..." className="flex-1 p-2 border border-gray-200 rounded-lg text-sm" />
            <BDSButton variant="outline" size="sm">Ajouter</BDSButton>
         </div>
      </div>
    </div>
  );
}

function UsersSettings() {
  const users = [
    { name: "Amadou Diallo", role: "Super Admin", email: "admin@briochedoree.sn", status: "Actif" },
    { name: "Fatou Sow", role: "Manager (Plateau)", email: "fatou.s@briochedoree.sn", status: "Actif" },
    { name: "Moussa Diop", role: "Manager (Almadies)", email: "moussa.d@briochedoree.sn", status: "Inactif" },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">Utilisateurs et Accès</h3>
           <p className="text-sm text-gray-500">Gérez les comptes ayant accès au back-office.</p>
         </div>
         <BDSButton size="sm" className="gap-2"><Plus size={16} /> Nouvel utilisateur</BDSButton>
       </div>

       <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4">Utilisateur</th>
                 <th className="px-6 py-4">Rôle</th>
                 <th className="px-6 py-4">Statut</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {users.map((user, i) => (
                 <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                       <div className="font-bold text-gray-900">{user.name}</div>
                       <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn("px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit", 
                          user.status === 'Actif' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                       )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Actif' ? "bg-green-500" : "bg-red-500")}></div>
                          {user.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-400 hover:text-red-500 font-medium text-xs">Modifier</button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
       </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Sécurité du compte</h3>
        <p className="text-sm text-gray-500 mb-6">Paramètres de sécurité avancés pour protéger la plateforme.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                   <Shield size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 text-sm">Double Authentification (2FA)</h4>
                   <p className="text-xs text-gray-500 max-w-md">Exiger un code envoyé par SMS/Email à chaque connexion pour tous les administrateurs.</p>
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
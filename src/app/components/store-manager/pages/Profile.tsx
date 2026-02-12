import { BDSButton } from "@/app/components/shared/BDSButton";

export default function StoreManagerProfile() {
  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-6">
      <h2 className="text-xl font-bold font-serif">Mon Profil</h2>
      <div className="bg-white rounded-xl shadow-bds-card border border-gray-100 overflow-hidden max-w-3xl">
         <div className="h-32 bg-gradient-to-r from-bds-black to-gray-800"></div>
         <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-bds-red text-white flex items-center justify-center font-bold text-3xl shadow-lg">M</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Manager Boutique</h3>
                <p className="text-gray-500 text-sm mb-6">Brioche Dorée Almadies</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</label>
                    <p className="font-medium">manager.almadies@briochedoree.sn</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Téléphone</label>
                    <p className="font-medium">+221 77 123 45 67</p>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Rôle</label>
                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Manager Boutique</span>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Boutique assignée</label>
                     <p className="font-medium">Brioche Dorée Almadies</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                 <h4 className="font-bold text-gray-800 mb-4">Sécurité</h4>
                 <div className="space-y-4">
                   <BDSButton variant="outline" className="w-full justify-start bg-white">Changer mot de passe</BDSButton>
                   <BDSButton variant="outline" className="w-full justify-start bg-white">Double authentification</BDSButton>
                   <BDSButton variant="outline" className="w-full justify-start bg-white text-red-600 border-red-200 hover:bg-red-50">Déconnexion de tous les appareils</BDSButton>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

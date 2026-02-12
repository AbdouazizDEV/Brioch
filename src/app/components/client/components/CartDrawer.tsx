import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Ticket, Zap, ArrowRight, Minus, Plus, MapPin, CreditCard, ChevronRight, Check } from "lucide-react";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Product } from "@/lib/data";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export interface CartItem {
  product: Product;
  quantity: number;
}

const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA';

export function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty, total, onCheckout }: { 
    isOpen: boolean, 
    onClose: () => void, 
    items: CartItem[], 
    onRemove: (id: string) => void, 
    onUpdateQty: (id: string, qty: number) => void,
    total: number,
    onCheckout: () => void
}) {
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState("Maison (Almadies, Villa 45...)");
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const [addresses, setAddresses] = useState([
    { label: "Maison", value: "Almadies, Villa 45, Rue 12" },
    { label: "Bureau", value: "Plateau, Imm. SDIH, 4ème étage" },
    { label: "Chez Maman", value: "Mermoz, Sacré-Cœur 3" },
  ]);

  const handleApplyPromo = () => {
    if (promo.toUpperCase() === "BDS2026") {
      setDiscount(total * 0.2); // 20%
      toast.success("Code promo appliqué ! (-20%)");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D32F2F', '#D4AF37', '#ffffff']
      });
    } else {
      toast.error("Code promo invalide");
    }
  };
  
  const finalTotal = total - discount;

  const handleOneClickCheckout = () => {
      setIsCheckingOut(true);
      // Simulate rapid process
      setTimeout(() => {
          onCheckout();
          setIsCheckingOut(false);
      }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-serif font-bold">Mon Panier ({items.length})</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                   <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 opacity-50">
                        <ShoppingBag size={40} className="text-gray-500" />
                   </div>
                   <h3 className="text-gray-900 font-bold text-lg mb-2">Votre panier est vide</h3>
                   <p className="max-w-[200px]">Découvrez nos viennoiseries et faites-vous plaisir !</p>
                   <button onClick={onClose} className="mt-8 px-8 py-3 bg-black text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                        Découvrir la carte
                   </button>
                </div>
              ) : (
                <>
                    {/* Items List */}
                    <div className="space-y-4">
                        {items.map((item, idx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={`${item.product.id}-${idx}`} 
                            className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <ImageWithFallback src={item.product.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.product.name}</h4>
                                    <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={16}/></button>
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                        <button onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-white rounded text-gray-500"><Minus size={12}/></button>
                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="p-1 hover:bg-white rounded text-gray-500"><Plus size={12}/></button>
                                    </div>
                                    <span className="font-bold text-bds-red text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>

                    {/* Upsell / Complementary items could go here */}
                </>
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                
                {/* 1-Click Settings Preview */}
                <div className="mb-6 space-y-3">
                    <div 
                        onClick={() => setIsAddressSelectorOpen(true)}
                        className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 cursor-pointer hover:border-blue-200 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MapPin size={16}/></div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Livrer à</p>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{address}</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400"/>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 cursor-pointer hover:border-indigo-200 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-indigo-100 bg-white">
                                <ImageWithFallback 
                                    src="https://images.unsplash.com/photo-1659509342258-36b5d7797237?auto=format&fit=crop&q=80&w=100" 
                                    className="w-full h-full object-cover"
                                    alt="DiziPay"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Payer avec</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">DiziPay</p>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-white border border-indigo-100 rounded text-indigo-600 font-bold shadow-sm">Wave / OM</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400"/>
                    </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                    {!discount ? (
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    value={promo}
                                    onChange={(e) => setPromo(e.target.value)}
                                    placeholder="Code promo (ex: BDS2026)" 
                                    className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-bds-gold focus:ring-1 focus:ring-bds-gold/20 transition-all"
                                />
                            </div>
                            <button onClick={handleApplyPromo} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50" disabled={!promo}>
                                OK
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-xl text-green-700">
                             <span className="text-sm font-bold flex items-center gap-2"><Zap size={16} className="fill-green-500"/> Code appliqué !</span>
                             <button onClick={() => {setDiscount(0); setPromo("");}} className="text-xs underline hover:text-green-800">Retirer</button>
                        </div>
                    )}
                </div>
                
                {/* Totals */}
                <div className="space-y-1 mb-6">
                   <div className="flex justify-between text-sm text-gray-500"><span>Sous-total</span> <span>{formatPrice(total)}</span></div>
                   <div className="flex justify-between text-sm text-gray-500"><span>Livraison</span> <span className="text-green-600 font-bold">Gratuite (Silver)</span></div>
                   {discount > 0 && <div className="flex justify-between text-sm text-green-600 font-bold"><span>Réduction</span> <span>-{formatPrice(discount)}</span></div>}
                   <div className="flex justify-between text-2xl font-serif font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2">
                        <span>Total</span> 
                        <span>{formatPrice(finalTotal)}</span>
                   </div>
                   <div className="flex items-center gap-1 justify-end text-xs text-bds-gold font-bold mt-1">
                        <Zap size={12} fill="currentColor" /> Vous gagnerez +{Math.floor(finalTotal / 100)} points
                   </div>
                </div>
                
                {/* 1-Click Button */}
                <BDSButton 
                    className={cn("w-full h-14 text-lg font-bold rounded-xl shadow-bds-cta flex items-center justify-center gap-3 overflow-hidden relative", isCheckingOut ? "bg-green-600 hover:bg-green-700 border-green-600" : "")} 
                    onClick={handleOneClickCheckout}
                    disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                          <Check size={24} className="animate-bounce" /> COMMANDÉ !
                      </motion.div>
                  ) : (
                      <>
                        <Zap className="fill-white animate-pulse" /> COMMANDER EN 1-CLIC
                      </>
                  )}
                  
                  {isCheckingOut && (
                      <motion.div 
                        className="absolute bottom-0 left-0 h-1 bg-white/30"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5 }}
                      />
                  )}
                </BDSButton>
                <p className="text-center text-[10px] text-gray-400 mt-3">En commandant, vous acceptez nos CGV.</p>
              </div>
            )}

            {/* Address Selector Overlay */}
            <AnimatePresence>
                {isAddressSelectorOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="absolute inset-0 z-50 bg-white flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-xl font-serif font-bold">Changer d'adresse</h2>
                            <button onClick={() => setIsAddressSelectorOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Mes adresses</p>
                            {addresses.map((addr, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => { setAddress(`${addr.label} (${addr.value})`); setIsAddressSelectorOpen(false); }}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                                        address.includes(addr.label) ? "border-bds-gold bg-amber-50" : "border-gray-200 hover:border-bds-gold/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", address.includes(addr.label) ? "bg-bds-gold text-white" : "bg-gray-100 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600")}>
                                            <MapPin size={20}/>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900">{addr.label}</span>
                                            <span className="text-xs text-gray-500">{addr.value}</span>
                                        </div>
                                    </div>
                                    {address.includes(addr.label) && <Check size={20} className="text-bds-gold"/>}
                                </button>
                            ))}
                            
                            {isAddingAddress ? (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-gray-900">Nouvelle adresse</p>
                                        <button onClick={() => setIsAddingAddress(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                                    </div>
                                    
                                    <button onClick={() => { setNewAddress("Position actuelle (Géoréférencée)"); toast.info("Localisation récupérée !"); }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                                        <Zap size={16}/> Utiliser ma position actuelle
                                    </button>
                                    
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                        <input 
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                            placeholder="Ou saisissez une adresse..." 
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-bds-gold transition-all"
                                            autoFocus
                                        />
                                    </div>

                                    <button 
                                        onClick={() => {
                                            if (!newAddress) return;
                                            setAddresses([...addresses, { label: "Nouvelle", value: newAddress }]);
                                            setAddress(`Nouvelle (${newAddress})`);
                                            setIsAddingAddress(false);
                                            setNewAddress("");
                                            setIsAddressSelectorOpen(false);
                                            toast.success("Adresse ajoutée !");
                                        }}
                                        disabled={!newAddress}
                                        className="w-full py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                    >
                                        Confirmer
                                    </button>
                                </motion.div>
                            ) : (
                                <button 
                                    onClick={() => setIsAddingAddress(true)}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={20}/> Ajouter une nouvelle adresse
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

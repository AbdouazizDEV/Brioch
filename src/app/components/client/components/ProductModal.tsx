import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Minus, Plus, Info, Star } from "lucide-react";
import { Product } from "@/lib/data";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA';

export function ProductModal({ product, isOpen, onClose, onAddToCart }: { product: Product | null, isOpen: boolean, onClose: () => void, onAddToCart: (p: Product, q: number) => void }) {
  const [qty, setQty] = useState(1);

  useEffect(() => { if(isOpen) setQty(1); }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-[85vh] md:h-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
          <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
        </div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full overflow-y-auto">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-bds-gold tracking-widest uppercase">Brioche Dorée</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-bds-red">{product.price} FCFA</span>
              <div className="flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                <Star size={14} fill="currentColor" /> {product.rating}
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                 <span className="font-bold text-gray-700">Quantité</span>
                 <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm px-2 py-1">
                   <button onClick={() => setQty(Math.max(1, qty-1))} className="p-2 hover:bg-gray-100 rounded-md"><Minus size={16}/></button>
                   <span className="font-bold w-4 text-center">{qty}</span>
                   <button onClick={() => setQty(qty+1)} className="p-2 hover:bg-gray-100 rounded-md"><Plus size={16}/></button>
                 </div>
               </div>
               
               <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex gap-3 text-sm text-blue-800">
                  <Info size={20} className="flex-shrink-0" />
                  <p>Commandez maintenant pour une livraison estimée dans <strong>30-45 minutes</strong>.</p>
               </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-auto">
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
               <span>Sous-total</span>
               <span className="font-bold text-gray-900 text-lg">{formatPrice(product.price * qty)}</span>
            </div>
            <BDSButton 
              onClick={() => { onAddToCart(product, qty); onClose(); }} 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              Ajouter au panier
            </BDSButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

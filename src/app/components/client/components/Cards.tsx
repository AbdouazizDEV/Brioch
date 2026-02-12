import { motion } from "motion/react";
import { Clock, Star, MapPin, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { Product, Store } from "@/lib/data";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { cn } from "@/lib/utils";

export function StoreCard({ store, onClick }: { store: Store, onClick?: () => void }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/client/search', { state: { storeId: store.id } });
    }
  };

  return (
    <motion.div 
      onClick={handleClick}
      whileHover={{ y: -5 }}
      className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white shadow-lg hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
           <span className={cn("px-3 py-1 rounded-full text-xs font-bold shadow-sm border", store.isOpen ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200")}>
             {store.isOpen ? "Ouvert" : "Fermé"}
           </span>
        </div>
        <ImageWithFallback src={store.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1 text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg w-fit mb-1">
             <Clock size={12} className="text-bds-gold"/> {store.deliveryTime}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-serif font-bold text-xl text-gray-900">{store.name}</h3>
           <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
             <Star size={14} className="fill-bds-gold text-bds-gold" />
             <span className="text-xs font-bold text-yellow-700">{store.rating}</span>
           </div>
        </div>
        <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
          <MapPin size={14} /> {store.city} • {store.distance}
        </p>
        <div className="flex gap-2">
           {store.hasDelivery && <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600">Livraison</span>}
           {store.hasClickCollect && <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600">Click & Collect</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCard({ product, onQuickView }: { product: Product, onQuickView: () => void }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="aspect-square relative overflow-hidden bg-gray-50 cursor-pointer" onClick={onQuickView}>
        <ImageWithFallback src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
            {product.isNew && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                Nouveau
              </span>
            )}
            {product.name.includes("PROMO") && (
              <span className="bg-bds-red text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm animate-pulse uppercase tracking-wider">
                Promo
              </span>
            )}
            {product.rating >= 4.9 && (
              <span className="bg-bds-gold text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
                <Star size={8} fill="currentColor"/> Préféré
              </span>
            )}
        </div>

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur text-gray-400 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
          <Heart size={18} />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/40 to-transparent">
           <BDSButton size="sm" className="shadow-lg rounded-full bg-white text-black hover:bg-gray-100 font-bold text-xs h-9 px-6 border-none">
             Aperçu rapide
           </BDSButton>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 truncate pr-2">{product.name.replace("PROMO: ", "")}</h3>
          <span className="font-bold text-bds-red whitespace-nowrap">{product.price} F</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">{product.description}</p>
        <div className="flex items-center gap-1 text-xs text-yellow-600">
          <Star size={12} fill="currentColor" /> {product.rating} ({product.reviews})
        </div>
      </div>
    </div>
  );
}

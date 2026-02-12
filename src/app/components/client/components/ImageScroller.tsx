import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Instagram } from "lucide-react";

const IMAGES = [
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497441/brioche5_mi1fgt.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497439/brioche-doree_lss543.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497441/brioche3_yuez3r.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497439/brioche1_ya3k2x.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497437/brioche_sphmx1.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497439/brioche4_ijsecr.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497441/brioche3_yuez3r.webp",
  "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770497437/brioche_sphmx1.webp"
];

export function ImageScroller() {
  return (
    <div className="bg-white py-12 overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
        <div>
           <p className="text-bds-red font-bold text-xs tracking-widest uppercase mb-1">Social</p>
           <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">La vie chez Brioche Dorée</h2>
        </div>
        <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-bds-red transition-colors">
            <Instagram size={18} /> @briochedoreesenegal
        </a>
      </div>

      <div className="relative w-full">
        <div className="flex gap-4 w-max animate-scroll">
          {/* First set of images */}
          {IMAGES.map((src, index) => (
            <div key={`img-1-${index}`} className="relative group w-64 h-64 md:w-72 md:h-72 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer">
               <ImageWithFallback src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                   <Instagram className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={32} />
               </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {IMAGES.map((src, index) => (
            <div key={`img-2-${index}`} className="relative group w-64 h-64 md:w-72 md:h-72 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer">
               <ImageWithFallback src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                   <Instagram className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" size={32} />
               </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

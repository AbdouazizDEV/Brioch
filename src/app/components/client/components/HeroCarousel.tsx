import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80",
      title: "L'Art de la Boulangerie",
      subtitle: "Découvrez nos nouvelles créations artisanales",
      action: "Commander"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80",
      title: "Petit-Déjeuner Royal",
      subtitle: "Commencez la journée avec le sourire",
      action: "Voir le menu"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80",
      title: "Pâtisseries Fines",
      subtitle: "L'élégance à la française, chez vous",
      action: "Découvrir"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden rounded-b-[3rem] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10" />
          <ImageWithFallback src={slides[current].image} className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-end items-center pb-24 text-center px-6">
        <motion.div
          key={`text-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-4">
             Nouveauté 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg leading-tight">
            {slides[current].title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light mb-8 max-w-lg mx-auto leading-relaxed">
            {slides[current].subtitle}
          </p>
          <BDSButton className="h-14 px-10 text-lg rounded-full shadow-[0_8px_30px_rgb(212,175,55,0.4)] hover:scale-105 transition-transform bg-gradient-to-r from-bds-gold to-yellow-500 border-none text-black font-bold">
            {slides[current].action} <ArrowRight className="ml-2 w-5 h-5" />
          </BDSButton>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              current === idx ? "w-8 bg-bds-gold" : "w-2 bg-white/40 hover:bg-white"
            )}
          />
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Routes, Route, useNavigate, Link } from "react-router";
import { 
  MapPin, ShoppingBag, Search, Menu, X, Star, Plus, Minus, 
  Trash2, ChevronRight, Navigation, Clock, Store, CreditCard, ChevronDown, Truck, Package, ChevronLeft, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { PRODUCTS, STORES, Product, Store as StoreType } from "@/lib/data";
import { cn } from "@/lib/utils";

// --- Types ---
interface CartItem extends Product {
  quantity: number;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  instructions: string;
  email?: string;
  password?: string;
  createAccount?: boolean;
}

// --- Components ---

function MomentsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const moments = [
    {
      title: "Sandwichs",
      description: "Des recettes gourmandes préparées sur place chaque matin.",
      image: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770857881/tasty-burger-delicious-fast-food-high-quality-food-sandwich-tomato-cheese-hamburger-american-lunch-vegetable-restaurant-chain-promotion-promo-material-advertisement-ad-menu-offer-sauce-photo_soabkp.webp"
    },
    {
      title: "Viennoiseries",
      description: "Le savoir-faire français pour un réveil en douceur.",
      image: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770857881/71cf45040ecad053bfc27f9ca8ee5bc6_c9mpzp.webp"
    },
    {
      title: "Pâtisseries",
      description: "Une touche sucrée irrésistible pour finir en beauté.",
      image: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770857880/ap-omelet-mediumThreeByTwo440_tkri1y.webp"
    },
    {
      title: "Plats Chauds",
      description: "Des plats savoureux préparés avec des ingrédients frais.",
      image: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770857881/aiguillettes-de-poulet-panees-a-l-airfryer-ou-au-four_kxr0kp.webp"
    },
    {
      title: "Boissons",
      description: "Rafraîchissez-vous avec nos jus pressés et cafés.",
      image: "https://res.cloudinary.com/dhivn2ahm/image/upload/v1770897907/orange-juice-and-slices-of-orange-isolated-on-white_pymipk.webp"
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth < 768 ? 280 : 400;
      const gap = window.innerWidth < 768 ? 16 : 24;
      const scrollAmount = cardWidth + gap;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="mb-8 md:mb-12 lg:mb-16">
      <div className="flex items-center justify-between mb-4 md:mb-6 lg:mb-8 px-4 md:px-0">
        <h2 className="font-serif font-bold text-xl md:text-3xl lg:text-4xl text-gray-900 tracking-tight leading-tight pr-4 md:pr-0">
          Savourez les moments avec <span className="text-bds-red">Brioche Dorée</span>
        </h2>
        <div className="hidden lg:flex gap-3 shrink-0">
          <button 
            onClick={() => scroll('left')} 
            className="w-12 h-12 rounded-full border border-gray-200 text-bds-red flex items-center justify-center hover:bg-bds-red hover:text-white hover:border-bds-red transition-all shadow-sm active:scale-95"
            aria-label="Précédent"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="w-12 h-12 rounded-full border border-gray-200 text-bds-red flex items-center justify-center hover:bg-bds-red hover:text-white hover:border-bds-red transition-all shadow-sm active:scale-95"
            aria-label="Suivant"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto no-scrollbar px-4 md:px-0 pb-4 snap-x scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {moments.map((moment, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[400px] h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-2xl md:rounded-[32px] relative overflow-hidden group cursor-pointer shadow-lg snap-center shrink-0"
              onClick={() => {
                const el = document.getElementById('products-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ImageWithFallback 
                src={moment.image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={moment.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-3 tracking-tight">{moment.title}</h3>
                <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium leading-relaxed">{moment.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="lg:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {moments.map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-white/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product, e?: React.MouseEvent) => void }) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group active:scale-[0.98]">
      <div className="h-36 sm:h-40 md:h-48 relative overflow-hidden">
        <ImageWithFallback 
          src={product.image} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          alt={product.name}
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-bds-gold text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
            NOUVEAU
          </span>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base flex-1">{product.name}</h3>
          <div className="flex items-center gap-0.5 md:gap-1 bg-yellow-50 text-yellow-700 px-1 md:px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold shrink-0">
            <Star size={8} className="md:w-[10px] md:h-[10px]" fill="currentColor" /> 
            <span className="hidden sm:inline">{product.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-[10px] md:text-xs line-clamp-2 mb-2 md:mb-3 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-auto gap-2">
          <span className="text-bds-red font-bold text-base md:text-lg">{product.price.toLocaleString()} F</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product, e);
            }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-50 text-bds-red hover:bg-bds-red hover:text-white flex items-center justify-center transition-colors active:scale-95 shrink-0 relative z-10"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <Plus size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationSidebar({ 
  selectedStore, 
  setSelectedStore, 
  address, 
  setAddress, 
  onLocateMe 
}: { 
  selectedStore: string | null, 
  setSelectedStore: (id: string) => void,
  address: string,
  setAddress: (addr: string) => void,
  onLocateMe: () => void
}) {
  return (
    <div className="bg-[#FFF8E7] p-4 md:p-6 lg:p-8 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto">
      <div className="mb-6 md:mb-8">
        <h2 className="font-serif font-bold text-xl md:text-2xl mb-2 text-gray-900">Où souhaitez-vous être livré ?</h2>
        <p className="text-gray-500 text-xs md:text-sm">Entrez votre adresse ou choisissez une boutique.</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Votre adresse</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Almadies, Mermoz..." 
              className="w-full pl-10 pr-4 h-11 md:h-12 rounded-xl border-2 border-gray-200 focus:border-bds-red focus:ring-0 text-sm"
            />
          </div>
          <button 
            onClick={onLocateMe}
            className="mt-2 text-bds-red text-xs md:text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <Navigation size={14} /> Utiliser ma position actuelle
          </button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FFF8E7] px-2 text-gray-500">OU</span></div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Boutiques à proximité</label>
           <div className="space-y-3">
             {STORES.slice(0, 3).map(store => (
               <label 
                key={store.id} 
                className={cn(
                  "block p-3 rounded-xl border-2 cursor-pointer transition-all bg-white hover:border-gray-300",
                  selectedStore === store.id ? "border-bds-red bg-red-50/50" : "border-transparent shadow-sm"
                )}
               >
                 <div className="flex items-start gap-3">
                   <input 
                    type="radio" 
                    name="store" 
                    className="mt-1 text-bds-red focus:ring-bds-red"
                    checked={selectedStore === store.id}
                    onChange={() => setSelectedStore(store.id)}
                   />
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <span className="font-bold text-sm text-gray-900">{store.name}</span>
                       <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                         {store.isOpen ? "OUVERT" : "FERMÉ"}
                       </span>
                     </div>
                     <p className="text-xs text-gray-500 mt-0.5">{store.distance} • {store.deliveryTime}</p>
                   </div>
                 </div>
               </label>
             ))}
           </div>
        </div>
        
        <BDSButton className="w-full mt-4" disabled={!address && !selectedStore} onClick={() => {
            const el = document.getElementById('products-grid');
            el?.scrollIntoView({ behavior: 'smooth' });
        }}>
          VOIR LES PRODUITS
        </BDSButton>
      </div>
    </div>
  );
}

function GuestCheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  total,
  onSuccess 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  total: number,
  onSuccess: (info: GuestInfo) => void
}) {
  const [step, setStep] = useState<"form" | "payment">("form");
  const [info, setInfo] = useState<GuestInfo>({
    firstName: "", lastName: "", phone: "+221 ", address: "", instructions: "",
    createAccount: false, email: "", password: ""
  });
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");
  const [selectedPayment, setSelectedPayment] = useState<"orange" | "mixx" | "wave" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'firstName':
        if (value.length < 2) {
          newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
        } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(value)) {
          newErrors.firstName = "Le prénom ne peut contenir que des lettres";
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (value.length < 2) {
          newErrors.lastName = "Le nom doit contenir au moins 2 caractères";
        } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(value)) {
          newErrors.lastName = "Le nom ne peut contenir que des lettres";
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'phone':
        const phoneRegex = /^\+221\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/;
        if (value.length < 9) {
          newErrors.phone = "Le numéro doit contenir au moins 9 chiffres";
        } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          newErrors.phone = "Format invalide. Ex: +221 77 123 45 67";
        } else {
          delete newErrors.phone;
        }
        break;
      case 'address':
        if (value.length < 5) {
          newErrors.address = "L'adresse doit contenir au moins 5 caractères";
        } else {
          delete newErrors.address;
        }
        break;
      case 'email':
        if (info.createAccount && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.email = "Format d'email invalide";
          } else {
            delete newErrors.email;
          }
        }
        break;
      case 'password':
        if (info.createAccount && value) {
          if (value.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
          } else {
            delete newErrors.password;
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const isValid = 
    info.firstName.length >= 2 && 
    info.lastName.length >= 2 && 
    info.phone.length >= 9 && 
    info.address.length >= 5 &&
    Object.keys(errors).length === 0 &&
    (!info.createAccount || (info.email && info.password && !errors.email && !errors.password));

  const handlePaymentMethod = (method: "orange" | "mixx" | "wave") => {
    setSelectedPayment(method);
  };

  const handleSubmit = () => {
    if (step === "form") {
       if (!isValid) {
         toast.error("Veuillez remplir tous les champs requis correctement");
         return;
       }
       setStep("payment");
    } else {
       if (!selectedPayment) {
         toast.error("Veuillez sélectionner un moyen de paiement");
         return;
       }
       // Sauvegarder les données en session
       try {
         localStorage.setItem('bds_guest_info', JSON.stringify({
           ...info,
           deliveryMode,
           paymentMethod: selectedPayment
         }));
       } catch (e) {
         console.error('Erreur sauvegarde session:', e);
       }
       
       // Simulate payment processing
       toast.loading(`Traitement du paiement via ${selectedPayment === 'orange' ? 'Orange Money' : selectedPayment === 'mixx' ? 'Mixx By Yas' : 'Wave'}...`);
       setTimeout(() => {
         toast.dismiss();
         onSuccess(info);
       }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold font-serif">
            {step === "form" ? "📦 Finaliser votre commande" : "💳 Paiement sécurisé"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          {step === "form" ? (
            <>
              <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex items-start gap-3">
                 <div className="bg-blue-100 p-1 rounded-full"><Clock size={14}/></div>
                 <p>Commandez sans créer de compte. Nous demandons juste le nécessaire pour vous livrer.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Prénom *</label>
                  <input 
                    value={info.firstName} 
                    onChange={e => {
                      setInfo({...info, firstName: e.target.value});
                      validateField('firstName', e.target.value);
                    }}
                    onBlur={() => validateField('firstName', info.firstName)}
                    className={cn(
                      "w-full border-2 rounded-lg p-3 focus:ring-0 transition-colors",
                      errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                    )}
                    placeholder="Fatou"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600 font-medium">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nom *</label>
                  <input 
                    value={info.lastName} 
                    onChange={e => {
                      setInfo({...info, lastName: e.target.value});
                      validateField('lastName', e.target.value);
                    }}
                    onBlur={() => validateField('lastName', info.lastName)}
                    className={cn(
                      "w-full border-2 rounded-lg p-3 focus:ring-0 transition-colors",
                      errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                    )}
                    placeholder="Sall"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600 font-medium">{errors.lastName}</p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Téléphone *</label>
                  <input 
                    type="tel"
                    value={info.phone} 
                    onChange={e => {
                      setInfo({...info, phone: e.target.value});
                      validateField('phone', e.target.value);
                    }}
                    onBlur={() => validateField('phone', info.phone)}
                    className={cn(
                      "w-full border-2 rounded-lg p-3 focus:ring-0 transition-colors",
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                    )}
                    placeholder="+221 77 123 45 67"
                  />
                  {errors.phone ? (
                    <p className="text-xs text-red-600 font-medium">{errors.phone}</p>
                  ) : (
                    <p className="text-xs text-gray-500">Pour le suivi de commande et contact livreur</p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Adresse de livraison *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                      value={info.address} 
                      onChange={e => {
                        setInfo({...info, address: e.target.value});
                        validateField('address', e.target.value);
                      }}
                      onBlur={() => validateField('address', info.address)}
                      className={cn(
                        "w-full border-2 rounded-lg p-3 pl-10 focus:ring-0 transition-colors",
                        errors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                      )}
                      placeholder="Rue, Quartier, Villa..."
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-red-600 font-medium">{errors.address}</p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Instructions (Optionnel)</label>
                  <textarea 
                    value={info.instructions} 
                    onChange={e => setInfo({...info, instructions: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-bds-red focus:ring-0 text-sm h-20 resize-none" 
                    placeholder="Maison bleue, sonnez 2 fois..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">Mode de récupération</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDeliveryMode("delivery")}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      deliveryMode === "delivery" ? "border-bds-red bg-red-50 text-bds-red" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1"><Truck size={18}/> Livraison</div>
                    <div className="text-xs opacity-80">30-45 min • 1 500 F</div>
                  </button>
                  <button 
                    onClick={() => setDeliveryMode("pickup")}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      deliveryMode === "pickup" ? "border-bds-gold bg-yellow-50 text-bds-gold" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                     <div className="flex items-center gap-2 font-bold mb-1"><Store size={18}/> Click & Collect</div>
                     <div className="text-xs opacity-80">15-20 min • Gratuit</div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <input 
                  type="checkbox" 
                  id="create-account"
                  className="w-5 h-5 text-bds-red rounded border-gray-300 focus:ring-bds-red"
                  checked={!!info.createAccount}
                  onChange={e => setInfo({...info, createAccount: e.target.checked})}
                />
                <label htmlFor="create-account" className="text-sm cursor-pointer">
                  <span className="font-bold">Créer un compte</span> pour commander plus vite la prochaine fois
                </label>
              </div>

              {info.createAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email *</label>
                    <input 
                        type="email"
                        value={info.email || ""} 
                        onChange={e => {
                          setInfo({...info, email: e.target.value});
                          validateField('email', e.target.value);
                        }}
                        onBlur={() => validateField('email', info.email || '')}
                        className={cn(
                          "w-full border-2 rounded-lg p-3 focus:ring-0 transition-colors",
                          errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                        )}
                        placeholder="email@exemple.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Mot de passe *</label>
                    <input 
                        type="password" 
                        value={info.password || ""} 
                        onChange={e => {
                          setInfo({...info, password: e.target.value});
                          validateField('password', e.target.value);
                        }}
                        onBlur={() => validateField('password', info.password || '')}
                        className={cn(
                          "w-full border-2 rounded-lg p-3 focus:ring-0 transition-colors",
                          errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-bds-red"
                        )}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-600 font-medium">{errors.password}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
               <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold">Récapitulatif</h3>
                    <button onClick={() => setStep("form")} className="text-xs text-bds-red font-bold underline">Modifier</button>
                 </div>
                 <p className="text-sm text-gray-600">
                   {info.firstName} {info.lastName}<br/>
                   {info.phone}<br/>
                   {info.address}
                 </p>
                 <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                   {deliveryMode === "delivery" ? <><Truck size={12}/> Livraison à domicile</> : <><Store size={12}/> Click & Collect</>}
                 </div>
               </div>

               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900">Moyen de paiement</h3>
                 <div className="grid grid-cols-1 gap-3">
                    {/* Orange Money */}
                    <button 
                      onClick={() => handlePaymentMethod('orange')}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full text-left relative overflow-hidden group active:scale-[0.98]",
                        selectedPayment === 'orange' 
                          ? "border-orange-500 bg-orange-50/50 shadow-md" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                                <img 
                                  src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/Orange-Money-recrute-pour-ces-02-postes-08-Novembre-2024_wr0bvp.png" 
                                  alt="Orange Money" 
                                  className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block text-sm sm:text-base">Orange Money</span>
                                <span className="text-xs text-gray-500">Paiement mobile sécurisé</span>
                            </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white transition-all",
                          selectedPayment === 'orange' ? "border-orange-500" : "border-gray-300"
                        )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full transition-all",
                              selectedPayment === 'orange' ? "bg-orange-500" : "bg-transparent"
                            )} />
                        </div>
                    </button>

                    {/* Mixx By Yas */}
                    <button 
                      onClick={() => handlePaymentMethod('mixx')}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full text-left relative overflow-hidden group active:scale-[0.98]",
                        selectedPayment === 'mixx' 
                          ? "border-purple-500 bg-purple-50/50 shadow-md" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                                <img 
                                  src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/channels4_profile_rqd24x.jpg" 
                                  alt="Mixx By Yas" 
                                  className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block text-sm sm:text-base">Mixx By Yas</span>
                                <span className="text-xs text-gray-500">Portefeuille digital</span>
                            </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white transition-all",
                          selectedPayment === 'mixx' ? "border-purple-500" : "border-gray-300"
                        )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full transition-all",
                              selectedPayment === 'mixx' ? "bg-purple-500" : "bg-transparent"
                            )} />
                        </div>
                    </button>

                    {/* Wave */}
                    <button 
                      onClick={() => handlePaymentMethod('wave')}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full text-left relative overflow-hidden group active:scale-[0.98]",
                        selectedPayment === 'wave' 
                          ? "border-blue-500 bg-blue-50/50 shadow-md" 
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden border border-gray-100">
                                <img 
                                  src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1742918314/images_2_nnjbsa.png" 
                                  alt="Wave" 
                                  className="w-full h-full object-contain p-1"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block text-sm sm:text-base">Wave</span>
                                <span className="text-xs text-gray-500">Paiement mobile instantané</span>
                            </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white transition-all",
                          selectedPayment === 'wave' ? "border-blue-500" : "border-gray-300"
                        )}>
                            <div className={cn(
                              "w-3 h-3 rounded-full transition-all",
                              selectedPayment === 'wave' ? "bg-blue-500" : "bg-transparent"
                            )} />
                        </div>
                    </button>
                 </div>
               </div>

               <div className="border-t border-gray-100 pt-6">
                 <div className="flex justify-between items-center text-xl font-bold mb-6">
                   <span>Total à payer</span>
                   <span className="text-bds-red">{total.toLocaleString()} FCFA</span>
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
          <BDSButton 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={(step === "form" && !isValid) || (step === "payment" && !selectedPayment)}
          >
            {step === "form" ? (
              "CONTINUER VERS LE PAIEMENT"
            ) : (
              <>
                {selectedPayment ? (
                  `PAYER ${total.toLocaleString()} FCFA avec ${
                    selectedPayment === 'orange' ? 'Orange Money' : 
                    selectedPayment === 'mixx' ? 'Mixx By Yas' : 
                    'Wave'
                  }`
                ) : (
                  "SÉLECTIONNEZ UN MOYEN DE PAIEMENT"
                )}
              </>
            )}
          </BDSButton>
          {step === "payment" && !selectedPayment && (
            <p className="text-xs text-red-600 text-center mt-2 font-medium">
              Veuillez sélectionner un moyen de paiement
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmationModal({ orderId, onClose, onCreateAccount }: { orderId: string, onClose: () => void, onCreateAccount: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-600" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold font-serif mb-2"
          >
            Commande confirmée !
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-6"
          >
            Votre commande a été enregistrée avec succès
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-4 rounded-xl mb-6"
          >
            <p className="text-xs text-gray-500 mb-1">Numéro de commande</p>
            <p className="text-xl font-bold font-mono text-bds-red">{orderId}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
              <CheckCircle size={12} className="text-green-600" />
              SMS de confirmation envoyé
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <BDSButton 
              onClick={onClose}
              className="w-full"
            >
              Suivre ma commande
            </BDSButton>
            
            <div className="bg-[#FFF8E7] p-4 rounded-xl border border-[#D4AF37]/20">
              <h4 className="font-bold text-sm mb-2 text-gray-900">Créez votre compte</h4>
              <p className="text-xs text-gray-600 mb-3">
                Gagnez <span className="font-bold text-bds-red">10%</span> sur votre prochaine commande !
              </p>
              <button
                onClick={onCreateAccount}
                className="text-xs font-bold text-bds-red hover:underline flex items-center justify-center gap-1"
              >
                Créer mon compte <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function VisitorHome() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Charger le panier depuis localStorage
    try {
      const saved = localStorage.getItem('bds_visitor_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    // Check local storage on initial load
    try {
      return localStorage.getItem("bds_active_order");
    } catch (e) {
      return null;
    }
  });
  const [flyingItem, setFlyingItem] = useState<{id: string, x: number, y: number} | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('bds_visitor_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Erreur sauvegarde panier:', e);
    }
  }, [cart]);

  // Add to cart with fly animation
  const addToCart = (product: Product, event?: React.MouseEvent) => {
    // Animation fly to cart
    if (event) {
      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const cartButton = document.querySelector('[aria-label="Panier"]') as HTMLElement;
      if (cartButton) {
        const cartRect = cartButton.getBoundingClientRect();
        setFlyingItem({
          id: product.id,
          x: cartRect.left + cartRect.width / 2 - buttonRect.left - buttonRect.width / 2,
          y: cartRect.top + cartRect.height / 2 - buttonRect.top - buttonRect.height / 2
        });
        setTimeout(() => setFlyingItem(null), 600);
      }
    }

    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      const newCart = existing 
        ? prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)
        : [...prev, { ...product, quantity: 1 }];
      return newCart;
    });
    
    toast.success(`${product.name} ajouté au panier`, { position: 'bottom-center', duration: 2000 });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQ = p.quantity + delta;
        return newQ > 0 ? { ...p, quantity: newQ } : p;
      }
      return p;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 1500;
  const finalTotal = cartTotal + (cartTotal > 0 ? deliveryFee : 0);

  const filteredProducts = useMemo(() => {
    let products = PRODUCTS;
    
    // Filter by search query
    if (searchQuery) {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Filter by category
    if (selectedCategory !== "Tout") {
      products = products.filter(p => p.category === selectedCategory);
    }
    
    return products;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 md:h-20 bg-white border-b border-gray-100 sticky top-0 z-40 px-4 md:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <Link to="/" className="shrink-0">
             <img 
               src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" 
               alt="Brioche Dorée" 
               className="h-8 md:h-10 w-auto rounded-lg" 
             />
          </Link>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 flex-1 max-w-md">
             <Search size={18} className="text-gray-400 shrink-0"/>
             <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 outline-none"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {activeOrderId && (
            <Link 
              to={`/track/${activeOrderId}`}
              className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-orange-100 text-orange-700 rounded-full text-[10px] md:text-xs font-bold hover:bg-orange-200 transition-colors animate-pulse"
            >
              <Package size={14} className="md:w-4 md:h-4" /> 
              <span className="hidden md:inline">Suivre ma commande</span>
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag size={20} className="md:w-6 md:h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-bds-red text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
          
          <Link 
            to="/auth/login" 
            className="hidden md:block px-4 md:px-5 py-1.5 md:py-2 rounded-full border-2 border-bds-red text-bds-red font-bold text-xs md:text-sm hover:bg-red-50 transition-colors"
          >
            Connexion
          </Link>
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Menu">
            <Menu size={20}/>
          </button>
        </div>
      </header>

      {/* Fly to cart animation */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 1,
              opacity: 1
            }}
            animate={{ 
              x: flyingItem.x,
              y: flyingItem.y,
              scale: 0.3,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed z-[100] pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="w-8 h-8 bg-bds-red rounded-full flex items-center justify-center text-white shadow-lg">
              <Plus size={16} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar - Location */}
        <aside className="w-full lg:w-1/3 xl:w-[380px] shrink-0 border-r border-gray-200 z-30 bg-[#FFF8E7]">
          <LocationSidebar 
            selectedStore={selectedStore} 
            setSelectedStore={setSelectedStore}
            address={address}
            setAddress={setAddress}
            onLocateMe={() => {
              setAddress("Route des Almadies, Dakar");
              toast.success("Position trouvée !");
            }}
          />
        </aside>

        {/* Right Content - Products */}
        <div className="flex-1 bg-white overflow-x-hidden">
          <div className="p-4 md:p-8">
            {/* Moments Carousel Section */}
            <MomentsCarousel />

            {/* Categories / Filters Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4" id="products-grid">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl mb-1 text-gray-900">Nos meilleures ventes 🥐</h1>
                <p className="text-gray-500 text-sm md:text-base">Les favoris du moment, livrés chez vous.</p>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 {['Tout', 'Viennoiseries', 'Pains', 'Sandwichs', 'Pâtisseries', 'Boissons'].map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setSelectedCategory(cat)}
                     className={cn(
                       "px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap shrink-0",
                       selectedCategory === cat 
                         ? "bg-bds-red text-white shadow-md" 
                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <h2 className="font-serif font-bold text-xl">Mon Panier ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">Votre panier est vide</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-bds-red font-bold text-sm">Commencer mes achats</button>
                  </div>
                ) : (
                  <>
                     <div className="bg-[#FFF8E7] p-4 rounded-xl text-sm border border-[#D4AF37]/20 flex gap-3">
                       <MapPin className="text-bds-gold shrink-0 mt-0.5" size={16} />
                       <div>
                         <span className="font-bold text-gray-900 block mb-1">Livraison à...</span>
                         <span className="text-gray-600 block">{address || "Veuillez sélectionner une adresse"}</span>
                       </div>
                     </div>

                     <div className="space-y-4">
                       {cart.map(item => (
                         <div key={item.id} className="flex gap-4">
                           <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                             <ImageWithFallback src={item.image} className="w-full h-full object-cover"/>
                           </div>
                           <div className="flex-1 flex flex-col justify-between">
                             <div className="flex justify-between items-start">
                               <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                               <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                             </div>
                             <p className="text-sm text-gray-500">{item.price.toLocaleString()} F</p>
                             <div className="flex items-center gap-3">
                               <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus size={12}/></button>
                               <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus size={12}/></button>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Sous-total</span>
                      <span>{cartTotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Livraison</span>
                      <span>{deliveryFee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{finalTotal.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  <BDSButton 
                    className="w-full" 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                  >
                    COMMANDER
                  </BDSButton>
                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Clock size={12}/> Pas de compte nécessaire
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <GuestCheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart}
        total={finalTotal}
        onSuccess={(info) => {
          setIsCheckoutOpen(false);
          // Générer un numéro de commande
          const orderId = `BDS-${String(Math.floor(Math.random()*100000)).padStart(5, '0')}`;
          setConfirmedOrderId(orderId);
          setShowConfirmation(true);
          
          // Vider le panier
          setCart([]);
          localStorage.removeItem('bds_visitor_cart');
          
          // Persist order ID
          localStorage.setItem("bds_active_order", orderId);
          setActiveOrderId(orderId);
          
          // Simuler envoi SMS
          toast.success(`SMS de confirmation envoyé au ${info.phone}`, { duration: 3000 });
        }}
      />

      <AnimatePresence>
        {showConfirmation && confirmedOrderId && (
          <ConfirmationModal
            orderId={confirmedOrderId}
            onClose={() => {
              setShowConfirmation(false);
              navigate(`/track/${confirmedOrderId}`);
            }}
            onCreateAccount={() => {
              setShowConfirmation(false);
              navigate('/auth/login?createAccount=true');
            }}
          />
        )}
          </AnimatePresence>

      {/* Footer sticky avec panier */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 p-4 md:hidden"
        >
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={24} className="text-bds-red" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-bds-red text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-lg text-bds-red">{finalTotal.toLocaleString()} F</p>
              </div>
            </div>
            <BDSButton
              onClick={() => {
                setIsCartOpen(true);
              }}
              className="flex-1"
            >
              Voir panier
            </BDSButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function VisitorApp() {
  return (
    <Routes>
      <Route path="/" element={<VisitorHome />} />
    </Routes>
  );
}
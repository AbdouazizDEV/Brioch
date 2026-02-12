import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import { 
  MapPin, Phone, CheckCircle, Navigation, Package, User, ArrowRight, 
  MessageCircle, X, Send, ChevronUp, Mic, Camera, Settings, LogOut,
  Bell, Bike, Shield, CircleDollarSign, History, Star, Menu, AlertTriangle,
  ChevronRight, Calendar, Clock, Home, ClipboardList, RefreshCw, LayoutDashboard,
  Map as MapIcon, TrafficCone, Mail, Store, Truck, FileText, PenLine, Upload,
  Battery, BatteryCharging, BatteryWarning, Volume2, VolumeX, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { DRIVERS, ORDERS } from "@/lib/data";
import { toast } from "sonner";
import { motion, AnimatePresence, PanInfo, useAnimation, useMotionValue, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Design System Constants ---
const COLORS = {
  primary: "#D32F2F",
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
  textMain: "#111827", // gray-900
  textSec: "#6B7280", // gray-500
};

// --- Data ---
const HISTORY_DATA = [
  { id: "BDS-089", date: "Aujourd'hui, 14:30", client: "Moussa Fall", address: "Ouakam", price: 5400, gain: 850, rating: 5 },
  { id: "BDS-088", date: "Aujourd'hui, 13:15", client: "Awa Sy", address: "Point E", price: 12000, gain: 1250, rating: 5 },
  { id: "BDS-087", date: "Aujourd'hui, 12:00", client: "Jean Gomis", address: "Fann", price: 3500, gain: 600, rating: 4 },
];

const PERFORMANCE_DATA = [
  { day: 'Lun', val: 12 },
  { day: 'Mar', val: 15 },
  { day: 'Mer', val: 10 },
  { day: 'Jeu', val: 18 },
  { day: 'Ven', val: 24 },
  { day: 'Sam', val: 28 },
  { day: 'Dim', val: 14 },
];

// --- Utils ---
const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// --- Shared Components ---

// Updated Button with Design System specs (Height 56px for primary)
const BDSButton = ({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  onClick, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline", size?: "sm" | "md" | "lg" }) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic(15); // Light tap
    onClick?.(e);
  };

  const baseStyles = "font-sans font-bold rounded-2xl transition-all duration-200 flex items-center justify-center active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    primary: "bg-[#D32F2F] text-white shadow-md hover:bg-[#B71C1C] shadow-red-200",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-[#D32F2F] text-[#D32F2F] bg-transparent hover:bg-red-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };

  const sizes = {
    sm: "h-10 px-4 text-sm min-w-[40px]",
    md: "h-12 px-6 text-base",     // Secondary actions
    lg: "h-[56px] px-8 text-lg"     // Primary CTA (56px)
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Hooks ---
const useBattery = () => {
  const [level, setLevel] = useState(1);
  const [charging, setCharging] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ((navigator as any).getBattery) {
      setSupported(true);
      (navigator as any).getBattery().then((battery: any) => {
        setLevel(battery.level);
        setCharging(battery.charging);
        
        battery.addEventListener('levelchange', () => setLevel(battery.level));
        battery.addEventListener('chargingchange', () => setCharging(battery.charging));
      });
    }
  }, []);

  return { level, charging, supported, isLow: level < 0.2 };
};

// --- Main Components ---

function DeliveryLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handlePinChange = (index: number, value: string) => {
    triggerHaptic(10);
    if (value.length > 1) value = value[0];
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }
    
    // Auto submit
    if (newPin.every(d => d !== "") && index === 3 && value) {
      triggerHaptic([50, 50, 50]); // Success pattern
      setTimeout(() => navigate('/livreur/dashboard'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#D32F2F] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="mb-12 text-center z-10">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3 transform hover:rotate-6 transition-transform duration-300">
          <Bike size={48} className="text-[#D32F2F]" />
        </div>
        <h1 className="font-bold text-3xl mb-1 tracking-tight">Brioche Dorée</h1>
        <p className="text-white/80 font-medium text-sm tracking-widest uppercase">Livreur App</p>
      </div>

      <div className="w-full max-w-xs bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 z-10 shadow-2xl">
        <label className="block text-center text-sm font-medium mb-8 opacity-90 text-white">Entrez votre code PIN</label>
        <div className="flex justify-center gap-3 mb-8">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(i, e.target.value)}
              className="w-12 h-16 bg-white text-[#D32F2F] text-center text-3xl font-bold rounded-2xl outline-none focus:ring-4 focus:ring-white/30 transition-all shadow-lg placeholder:text-gray-300 caret-transparent"
              placeholder="•"
            />
          ))}
        </div>
        <BDSButton 
          size="lg"
          onClick={() => navigate('/livreur/dashboard')} 
          className="w-full bg-white text-[#D32F2F] hover:bg-gray-50 text-lg font-bold"
        >
          Se connecter <ArrowRight size={20} className="ml-2"/>
        </BDSButton>
      </div>
      <p className="absolute bottom-8 text-white/50 text-xs font-mono">v2.4.0 • ID: LIV-2026</p>
    </div>
  );
}

function DeliveryDashboard() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { level, isLow, charging } = useBattery();
  const [batteryMode, setBatteryMode] = useState(false);

  // Simulating Notifications
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        triggerHaptic([100, 50, 100]); // Attention pattern
        toast.custom((t) => (
          <div 
            className="bg-white rounded-2xl shadow-2xl border-l-4 border-[#D32F2F] p-4 flex items-start gap-4 cursor-pointer w-full max-w-sm"
            onClick={() => {
              toast.dismiss(t);
              navigate('/livreur/detail');
            }}
          >
            <div className="bg-red-50 p-2 rounded-full text-[#D32F2F]">
              <Bike size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Nouvelle course disponible !</h4>
              <p className="text-sm text-gray-600 mt-1">Almadies • 5.4 km • 12 450 FCFA</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Payée</span>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Urgent</span>
              </div>
            </div>
            <button className="text-gray-400"><X size={16}/></button>
          </div>
        ), { duration: 8000, position: 'top-center' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, navigate]);

  // Battery Check
  useEffect(() => {
    if (isLow && !charging && !batteryMode) {
      toast.warning("Batterie faible (<20%). Mode économie activé.", {
        icon: <BatteryWarning className="text-orange-500"/>,
        duration: 5000
      });
      setBatteryMode(true);
    }
  }, [isLow, charging, batteryMode]);

  const handleRefresh = () => {
    triggerHaptic(20);
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerHaptic(10);
      toast.success("Données actualisées");
    }, 1500);
  };
  
  // Pull to refresh
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY.current);
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };
  
  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      handleRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 md:pb-0 relative font-sans flex flex-col md:flex-row">
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-50">
         <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center text-white shadow-lg">
               <Bike size={24} />
             </div>
             <div>
               <h1 className="font-bold text-gray-900 leading-none">Brioche<br/>Dorée</h1>
             </div>
         </div>
         <div className="flex-1 p-4 space-y-2">
            <button onClick={() => navigate('/livreur/dashboard')} className="w-full flex items-center gap-3 p-3 bg-red-50 text-[#D32F2F] font-bold rounded-xl">
               <LayoutDashboard size={20}/> Tableau de bord
            </button>
            <button onClick={() => navigate('/livreur/history')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
               <History size={20}/> Historique
            </button>
            <button onClick={() => navigate('/livreur/profile')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
               <User size={20}/> Mon Profil
            </button>
         </div>
         <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
               <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                  <ImageWithFallback src={DRIVERS[0].photo} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold truncate">Mamadou Diop</div>
                  <div className="text-xs text-gray-500">Livreur</div>
               </div>
               <button onClick={() => navigate('/')} className="text-gray-400 hover:text-red-600"><LogOut size={18}/></button>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-white p-6 pt-12 pb-6 rounded-b-[32px] shadow-sm flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-100 shadow-sm">
               <ImageWithFallback src={DRIVERS[0].photo} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Bonjour,</div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Mamadou 👋</h2>
            </div>
          </div>
          <div className="flex gap-2">
             <button onClick={handleRefresh} className={cn("p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform", isRefreshing && "animate-spin")}>
               <RefreshCw size={24} />
             </button>
             <button onClick={() => navigate('/livreur/settings')} className="p-3 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 active:scale-90 transition-transform">
               <Settings size={24} />
             </button>
          </div>
        </div>

        <div className="hidden md:flex bg-white px-8 py-4 border-b border-gray-200 justify-between items-center sticky top-0 z-40">
           <h2 className="text-xl font-bold text-gray-800">Tableau de bord</h2>
           <div className="flex items-center gap-3">
               <div className={cn("px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2", isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                  <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-600 animate-pulse" : "bg-gray-400")}></div>
                  {isOnline ? "En Ligne" : "Hors Ligne"}
               </div>
               <BDSButton onClick={handleRefresh} variant="ghost" size="sm" className={cn(isRefreshing && "animate-spin")}><RefreshCw size={18}/></BDSButton>
               <div className="w-px h-6 bg-gray-200 mx-1"></div>
               <span className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
           </div>
        </div>

        <div 
          className="p-5 md:p-8 space-y-6 max-w-7xl mx-auto w-full relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull to refresh indicator */}
          {pullDistance > 0 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex items-center gap-2 text-[#D32F2F]">
              <RefreshCw 
                size={24} 
                className={cn("transition-transform", pullDistance > 60 && "animate-spin")}
                style={{ transform: `rotate(${pullDistance * 3.6}deg)` }}
              />
              <span className="text-sm font-bold">
                {pullDistance > 60 ? "Relâchez pour actualiser" : "Tirez pour actualiser"}
              </span>
            </div>
          )}
          {/* Status Toggle Card */}
          <div className="bg-white p-5 md:p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <div className={cn("text-xs font-bold uppercase mb-1 tracking-wider", isOnline ? "text-[#4CAF50]" : "text-gray-400")}>
                Statut actuel
              </div>
              <div className={cn("font-bold text-xl md:text-2xl", isOnline ? "text-[#4CAF50]" : "text-gray-500")}>
                {isOnline ? "🟢 EN SERVICE" : "🔴 HORS SERVICE"}
              </div>
            </div>
            <button 
              onClick={() => {
                 setIsOnline(!isOnline);
                 triggerHaptic([30]);
              }}
              className={cn("w-20 h-10 md:w-24 md:h-12 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20", isOnline ? "bg-[#4CAF50] focus:ring-green-500" : "bg-gray-300 focus:ring-gray-400")}
            >
              <div className={cn("absolute top-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center", isOnline ? "left-[calc(100%-2.25rem)] md:left-[calc(100%-2.75rem)]" : "left-1")}>
                 {isOnline ? <CheckCircle size={16} className="text-green-600"/> : <X size={16} className="text-gray-400"/>}
              </div>
            </button>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Performance Aujourd'hui</h3>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 text-center active:scale-[0.98] transition-transform">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-[#D32F2F] rounded-full flex items-center justify-center mx-auto mb-2"><CheckCircle size={20} /></div>
                  <div className="text-[#D32F2F] font-bold text-2xl md:text-3xl">12</div>
                  <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mt-1">Livrées</div>
               </div>
               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 text-center active:scale-[0.98] transition-transform">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-[#FF9800] rounded-full flex items-center justify-center mx-auto mb-2"><Bike size={20} /></div>
                  <div className="text-[#FF9800] font-bold text-2xl md:text-3xl">2</div>
                  <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mt-1">En cours</div>
               </div>
               <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 text-center active:scale-[0.98] transition-transform">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-2"><CircleDollarSign size={20} /></div>
                  <div className="text-[#4CAF50] font-bold text-lg md:text-3xl">18k</div>
                  <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mt-1">Gains</div>
               </div>
            </div>
          </div>

          <div className="flex-1">
             <div className="flex justify-between items-end mb-3 ml-1">
                <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  Courses Actives <span className="bg-[#D32F2F] text-white text-[10px] px-2 py-0.5 rounded-full min-w-[20px] text-center">2</span>
                </h3>
             </div>
             
             {!isOnline ? (
               <div className="bg-white p-8 md:p-16 rounded-[24px] shadow-sm border border-gray-100 text-center opacity-70 flex flex-col items-center justify-center h-64">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Bike size={40} />
                  </div>
                  <p className="font-bold text-gray-900 text-lg">Vous êtes hors service</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Activez votre statut pour commencer à recevoir des demandes de livraison.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => navigate('/livreur/detail')} className="bg-white rounded-[24px] shadow-md border-l-4 border-[#D32F2F] overflow-hidden active:scale-[0.98] transition-transform cursor-pointer group relative touch-manipulation">
                     <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                        <ArrowRight className="text-[#D32F2F]" />
                     </div>
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                              <span className="bg-red-100 text-[#D32F2F] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 animate-pulse"><AlertTriangle size={12}/> URGENT</span>
                              <span className="text-gray-400 text-xs font-mono bg-gray-50 px-2 py-1 rounded">#BDS-091</span>
                           </div>
                           <span className="font-bold text-xl md:text-2xl text-[#D32F2F]">12 450 F</span>
                        </div>
                        <div className="mb-5">
                           <div className="flex items-center gap-2 text-gray-900 font-bold text-lg leading-snug">
                              <MapPin size={20} className="text-[#D32F2F] shrink-0" /> <span className="truncate">Almadies → Mermoz</span>
                           </div>
                           <p className="text-gray-500 text-sm ml-7 flex items-center gap-2 mt-1"><Clock size={16}/> 3.2 km • ~15 min</p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                           <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200">FS</div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">Fatou Sall</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> +221 77 123 45 67</p>
                           </div>
                           <BDSButton size="sm" className="shadow-none">
                              DÉTAILS
                           </BDSButton>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer group touch-manipulation">
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                              <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><Package size={12}/> À RÉCUPÉRER</span>
                              <span className="text-gray-400 text-xs font-mono bg-gray-50 px-2 py-1 rounded">#BDS-092</span>
                           </div>
                           <span className="font-bold text-xl md:text-2xl text-gray-900">8 300 F</span>
                        </div>
                        <div className="mb-4">
                           <h4 className="font-bold text-gray-900 text-lg">Mermoz (Click & Collect)</h4>
                           <p className="text-green-600 font-bold text-xs bg-green-50 inline-block px-2 py-1 rounded mt-1">✓ Prête depuis 3 min</p>
                        </div>
                        <BDSButton variant="secondary" size="md" className="w-full">VOIR DÉTAILS</BDSButton>
                     </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
      
      <BottomNav active="home" />
    </div>
  );
}

function BottomNav({ active }: { active: 'home' | 'history' | 'profile' }) {
  const navigate = useNavigate();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-6 flex justify-between items-center z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
       <button onClick={() => navigate('/livreur/dashboard')} className={cn("flex flex-col items-center gap-1 w-20 py-2 rounded-xl transition-colors active:scale-90", active === 'home' ? "text-[#D32F2F]" : "text-gray-400")}>
          <Home size={28} strokeWidth={active === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Accueil</span>
       </button>
       <button onClick={() => navigate('/livreur/history')} className={cn("flex flex-col items-center gap-1 w-20 py-2 rounded-xl transition-colors active:scale-90", active === 'history' ? "text-[#D32F2F]" : "text-gray-400")}>
          <ClipboardList size={28} strokeWidth={active === 'history' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Historique</span>
       </button>
       <button onClick={() => navigate('/livreur/profile')} className={cn("flex flex-col items-center gap-1 w-20 py-2 rounded-xl transition-colors active:scale-90", active === 'profile' ? "text-[#D32F2F]" : "text-gray-400")}>
          <User size={28} strokeWidth={active === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Profil</span>
       </button>
    </div>
  );
}

function ChatModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour, je suis en route vers vous 🚚', sender: 'me', time: '14:30' },
    { id: '2', text: 'Super merci ! Le portail est vert.', sender: 'client', time: '14:32' },
  ]);
  const [input, setInput] = useState('');
  
  const quickReplies = [
    "J'arrive dans 5 min", 
    "Je suis devant", 
    "Je cherche l'adresse",
    "Merci et bonne dégustation ! 🥐"
  ];

  const sendMessage = (text: string = input) => {
    if(!text.trim()) return;
    triggerHaptic(10);
    setMessages([...messages, { id: Date.now().toString(), text, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          className="fixed inset-0 z-50 bg-white flex flex-col md:max-w-md md:right-0 md:left-auto md:shadow-2xl"
        >
           <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10 min-h-[64px]">
              <div className="flex items-center gap-3">
                 <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100"><X size={28} className="text-gray-500"/></button>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg">Fatou Sall</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div> En ligne</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <a href="tel:771234567" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95" onClick={() => triggerHaptic(10)}>
                  <Phone size={24}/>
                </a>
                <a href="sms:771234567" className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95" onClick={() => triggerHaptic(10)}>
                  <MessageCircle size={24}/>
                </a>
              </div>
           </div>

           <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
              {messages.map(m => (
                 <div key={m.id} className={cn("flex flex-col", m.sender === 'me' ? "items-end" : "items-start")}>
                    <div className={cn(
                       "max-w-[85%] px-5 py-3 rounded-2xl text-base shadow-sm",
                       m.sender === 'me' ? "bg-[#D32F2F] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    )}>
                       {m.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                 </div>
              ))}
           </div>

           <div className="p-4 bg-white border-t border-gray-100 pb-8">
              <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                 {quickReplies.map(r => (
                    <button key={r} onClick={() => sendMessage(r)} className="whitespace-nowrap px-4 py-2 bg-gray-100 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-200 border border-gray-200 active:scale-95 transition-transform">
                       {r}
                    </button>
                 ))}
              </div>
              <div className="flex items-center gap-3">
                 <button className="text-gray-400 p-2 hover:text-gray-600 active:scale-90"><Camera size={28}/></button>
                 <div className="flex-1 relative">
                    <input 
                       value={input}
                       onChange={e => setInput(e.target.value)}
                       placeholder="Message..."
                       className="w-full bg-gray-100 border-0 rounded-full pl-5 pr-10 py-4 text-base focus:ring-2 focus:ring-red-100 outline-none"
                       onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                 </div>
                 <button onClick={() => sendMessage()} disabled={!input.trim()} className="w-12 h-12 bg-[#D32F2F] text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-[#B71C1C] transition-colors active:scale-90">
                    <Send size={20} className="ml-0.5"/>
                 </button>
              </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeliveryDetailFlow() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"assigned" | "driving" | "arrived">("assigned");
  const [isOpen, setIsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [driverProgress, setDriverProgress] = useState(0); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const controls = useAnimation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate Driving Progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === "driving") {
       interval = setInterval(() => {
          setDriverProgress(prev => {
             const next = prev + 5; 
             if (next >= 100) return 100;
             return next;
          });
       }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status]);

  // Derived Values
  const totalDistance = 3.2; 
  const distanceRemaining = Math.max(0, totalDistance * (1 - driverProgress / 100)).toFixed(1);
  const totalTime = 15; 
  const eta = Math.ceil(totalTime * (1 - driverProgress / 100));
  const isNear = driverProgress > 90;

  const onDragEnd = (event: any, info: PanInfo) => {
    if (!isMobile) return; 
    
    // Simple swipe detection
    if (info.offset.y < -50) {
       setIsOpen(true);
       triggerHaptic(10);
    } else if (info.offset.y > 50) {
       setIsOpen(false);
       triggerHaptic(10);
    }
  };

  const handleMainAction = () => {
    if (status === "assigned") {
      setStatus("driving");
      setIsOpen(false); // Collapse to show map
      toast.info("Itinéraire vers le client démarré 📍");
    } else if (status === "driving") {
       toast.success("Ouverture de Google Maps...");
    } else {
      setConfirmOpen(true);
    }
  };

  useEffect(() => {
    if (!isMobile) {
       controls.set({ y: 0, height: "auto" }); 
    }
  }, [controls, isMobile]);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-200 font-sans">
      <MapOverlay status={status} progress={driverProgress} />

      <div className="absolute top-4 left-4 z-20">
        <button onClick={() => navigate('/livreur/dashboard')} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform border border-gray-100">
           <ArrowRight className="rotate-180" size={24} />
        </button>
      </div>

      <AnimatePresence>
        {reportOpen && <ReportProblemModal onClose={() => setReportOpen(false)} />}
        {confirmOpen && <ConfirmationModal onClose={() => setConfirmOpen(false)} onConfirm={() => {
           setConfirmOpen(false);
           confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#D32F2F', '#4CAF50', '#FF9800'] });
           triggerHaptic([50, 50, 100]);
           toast.success("Livraison effectuée avec succès ! 🎉");
           setTimeout(() => navigate('/livreur/dashboard'), 2000);
        }} />}
        {chatOpen && <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />}
      </AnimatePresence>

      <motion.div
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.05}
        onDragEnd={onDragEnd}
        animate={isMobile ? { height: isOpen ? "85vh" : "40vh", y: 0 } : { height: "auto", y: 0 }}
        initial={isMobile ? { height: "40vh" } : { height: "auto" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
           "bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col",
           // Mobile Styles (Fixed to bottom, animated height)
           "fixed bottom-0 left-0 right-0 rounded-t-[32px]",
           // Desktop Styles (Absolute positioned panel)
           "md:absolute md:top-4 md:left-4 md:bottom-4 md:w-[420px] md:rounded-[24px] md:border md:border-gray-200 md:h-auto"
        )}
      >
        <div 
           onClick={() => setIsOpen(!isOpen)}
           className="md:hidden w-full h-10 flex items-center justify-center cursor-pointer active:cursor-grabbing border-b border-gray-50 bg-white rounded-t-[32px] shrink-0 hover:bg-gray-50 transition-colors"
        >
           <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto pb-40 md:pb-24 bg-white scrollbar-hide">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="font-bold text-2xl md:text-2xl text-gray-900">Commande #BDS-091</span>
              </div>
              <div className="flex gap-2 mb-2">
                 <span className="bg-red-100 text-[#D32F2F] text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 animate-pulse"><AlertTriangle size={12}/> URGENT</span>
                 <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle size={12}/> PAYÉE</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-gray-50 p-5 rounded-[20px] border border-gray-100">
                <div className="flex justify-between items-start mb-5">
                   <div>
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Client</div>
                      <div className="font-bold text-xl text-gray-900">Fatou Sall</div>
                      <div className="text-gray-500 text-sm font-mono flex items-center gap-1 mt-1"><Phone size={14}/> +221 77 123 45 67</div>
                   </div>
                   <div className="flex gap-3">
                      <a href="tel:771234567" className="w-12 h-12 bg-[#D32F2F] text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 hover:bg-[#B71C1C] transition-all">
                        <Phone size={24} />
                      </a>
                      <button onClick={() => setChatOpen(true)} className="w-12 h-12 bg-white text-[#D32F2F] border-2 border-[#D32F2F] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 hover:bg-red-50 transition-all">
                        <MessageCircle size={24} />
                      </button>
                   </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                   <div className="text-xs text-gray-500 uppercase font-bold mb-2">Adresse</div>
                   <div className="font-bold text-gray-900 flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200">
                     <MapPin size={24} className="text-[#D32F2F] mt-0.5 shrink-0"/> 
                     <div>
                        <span className="block text-lg leading-tight">Rue 12, Villa 45, Almadies</span>
                        <span className="text-yellow-800 font-medium text-sm mt-2 block bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                          ⚠️ Maison bleue, sonnez 2x
                        </span>
                     </div>
                   </div>
                </div>
             </div>

             <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center gap-2 px-1"><Package size={16}/> Articles (3)</h3>
                <ul className="space-y-3">
                   {["2x Croissant au beurre", "1x Pain au chocolat", "2x Baguette tradition"].map((item, i) => (
                     <li key={i} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <span className="font-medium text-gray-900 text-base">{item}</span>
                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><CheckCircle size={16}/></div>
                     </li>
                   ))}
                </ul>
             </div>
             
             <div className="flex justify-between items-center p-5 bg-[#1A1A1A] text-white rounded-[20px] shadow-lg">
                <span className="font-bold text-gray-300">Total commande</span>
                <span className="font-mono text-3xl font-bold text-[#D4AF37]">12 450 F</span>
             </div>
             
             <div className="text-center pt-2 pb-8">
                <button onClick={() => setReportOpen(true)} className="text-sm font-bold text-gray-400 hover:text-[#D32F2F] flex items-center justify-center gap-2 transition-colors py-3 px-4 rounded-xl hover:bg-red-50 w-full active:scale-98">
                   <AlertTriangle size={18}/> Signaler un problème
                </button>
             </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-gray-100 z-40 md:rounded-b-2xl pb-6 md:pb-6 pt-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
           {status === "driving" && (
              <div className="mb-4 flex justify-between items-center px-2">
                 <div>
                    <span className="text-xs text-gray-500 font-bold uppercase">Destination</span>
                    <div className="font-bold text-gray-900 text-lg">Fatou Sall ({distanceRemaining} km)</div>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-gray-500 font-bold uppercase">ETA</span>
                    <div className={cn("font-bold text-lg", eta < 5 ? "text-red-600 animate-pulse" : "text-green-600")}>~{eta} min</div>
                 </div>
              </div>
           )}
           
           {status === "driving" && !isNear ? (
              <BDSButton 
                size="lg" 
                onClick={handleMainAction}
                className="w-full text-lg font-bold shadow-xl bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-3"
              >
                <Navigation size={24}/> OUVRIR GOOGLE MAPS
              </BDSButton>
           ) : status === "driving" && isNear ? (
              <BDSButton 
                size="lg" 
                onClick={() => setStatus("arrived")}
                className="w-full text-lg font-bold shadow-xl bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-2xl flex items-center justify-center gap-3 animate-pulse"
              >
                 <CheckCircle size={24}/> CONFIRMER LA LIVRAISON
              </BDSButton>
           ) : (
             <BDSButton 
               size="lg" 
               onClick={handleMainAction}
               className={cn(
                 "w-full text-lg font-bold shadow-xl transition-all flex items-center justify-center gap-3 rounded-2xl", 
                 status === "arrived" ? "bg-[#4CAF50] hover:bg-[#43A047] text-white" : "bg-[#D32F2F] hover:bg-[#B71C1C] text-white"
               )}
             >
               {status === "assigned" && <><Package size={24}/> J'AI RÉCUPÉRÉ</>}
               {status === "arrived" && <><CheckCircle size={24}/> CONFIRMER</>}
             </BDSButton>
           )}
        </div>
      </motion.div>
    </div>
  );
}

function MapOverlay({ status, progress }: { status: string, progress: number }) {
  const getPos = (p: number) => {
    if (p < 33) {
      const t = p / 33;
      return { x: 180 + (400 - 180) * t, y: 600 + (400 - 600) * t };
    } else if (p < 66) {
      const t = (p - 33) / 33;
      return { x: 400 + (200 - 400) * t, y: 400 + (300 - 400) * t };
    } else {
      const t = (p - 66) / 34;
      return { x: 200 + (550 - 200) * t, y: 300 + (150 - 300) * t };
    }
  };
  
  const driverPos = getPos(progress);

  return (
    <div className="absolute inset-0 bg-[#E5E7EB] w-full h-full">
      <div className="absolute inset-0 opacity-60 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg')] bg-repeat bg-[length:100px_100px] grayscale"></div>
      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-80" alt="Map" />

      {/* Traffic Layer & Route */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg">
        <path 
          d="M 180 600 Q 400 400 200 300 T 550 150" 
          fill="none" 
          stroke="#2196F3" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        <path d="M 180 600 Q 250 540 300 490" fill="none" stroke="#4CAF50" strokeWidth="4" className="opacity-60" />
        <path d="M 300 490 Q 400 400 200 300" fill="none" stroke="#FF9800" strokeWidth="4" className="opacity-60" />
        <path d="M 200 300 T 550 150" fill="none" stroke="#F44336" strokeWidth="4" className="opacity-60" />
      </svg>
      
      <div className="absolute top-20 right-4 bg-white/90 p-2 rounded-lg shadow-md z-10">
         <TrafficCone size={20} className="text-orange-500" />
      </div>

      <div className="absolute top-[140px] left-[540px] -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer group z-10">
         <div className="bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold mb-1 whitespace-nowrap border border-gray-200 opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1">Fatou Sall</div>
         <MapPin size={56} className="text-[#4CAF50] drop-shadow-xl" fill="currentColor" />
         <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 animate-ping"></div>
      </div>

      <div className="absolute bottom-[200px] left-[170px] -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer z-10">
         <div className="bg-white px-3 py-1.5 rounded-lg shadow-md text-xs font-bold mb-1 whitespace-nowrap border border-gray-200">Brioche Dorée</div>
         <div className="w-14 h-14 bg-[#D32F2F] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
            <Home size={28} fill="currentColor" />
         </div>
      </div>

      {status === "driving" && (
        <div 
          className="absolute w-12 h-12 z-20 transition-all duration-[2000ms] ease-linear"
          style={{ left: driverPos.x, top: driverPos.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white relative">
             <Navigation size={24} className="transform rotate-45" />
             <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
             Vous
          </div>
        </div>
      )}
      
      <button className="absolute right-6 bottom-28 md:bottom-12 bg-white p-4 rounded-full shadow-lg text-blue-600 z-10 hover:bg-gray-50 active:scale-95 transition-all">
         <Navigation size={28} />
      </button>
    </div>
  );
}

function ReportProblemModal({ onClose }: { onClose: () => void }) {
   const problems = [
      "Client absent / injoignable", "Adresse introuvable", "Adresse incorrecte", 
      "Client refuse la commande", "Accident / panne véhicule", "Produits manquants", "Autre"
   ];
   
   const [selected, setSelected] = useState(problems[0]);
   const [image, setImage] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
         const reader = new FileReader();
         reader.onload = (ev) => setImage(ev.target?.result as string);
         reader.readAsDataURL(e.target.files[0]);
      }
   }

   const handleSubmit = () => {
      triggerHaptic(20);
      toast.success("Signalement envoyé au manager");
      onClose();
   };
   
   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
         <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-2xl"
         >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
               <h3 className="font-bold text-[#D32F2F] flex items-center gap-2"><AlertTriangle size={20}/> Signaler un problème</h3>
               <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               <div className="space-y-2">
                  {problems.map(p => (
                     <label key={p} className={cn(
                        "flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors active:scale-[0.99]",
                        selected === p ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:bg-gray-50"
                     )}>
                        <input 
                           type="radio" 
                           name="problem" 
                           checked={selected === p}
                           onChange={() => { setSelected(p); triggerHaptic(5); }}
                           className="w-5 h-5 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300" 
                        />
                        <span className={cn("font-medium", selected === p ? "text-[#D32F2F]" : "text-gray-700")}>{p}</span>
                     </label>
                  ))}
               </div>
               
               <textarea className="w-full border border-gray-200 rounded-xl p-3 text-base focus:border-[#D32F2F] outline-none h-24 resize-none focus:ring-1 focus:ring-red-200 transition-all" placeholder="Expliquez le problème en quelques mots..." />
               
               <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center active:bg-gray-100 transition-colors">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {image ? (
                     <div className="relative h-32 w-full">
                        <img src={image} className="h-full w-full object-cover rounded-lg" alt="Preuve" />
                        <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X size={16}/></button>
                     </div>
                  ) : (
                     <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700">
                        <Camera size={24} />
                        <span className="text-xs font-bold">Ajouter une photo (Optionnel)</span>
                     </div>
                  )}
               </div>

               <BDSButton onClick={handleSubmit} size="lg" className="w-full h-14">ENVOYER AU MANAGER</BDSButton>
               <button onClick={onClose} className="w-full text-center py-3 text-gray-500 font-bold text-sm hover:text-gray-700 active:text-gray-900">Annuler</button>
            </div>
         </motion.div>
      </div>
   );
}

function ConfirmationModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
   const [photo, setPhoto] = useState<string | null>(null);
   const [signature, setSignature] = useState<string | null>(null);
   const [isSigning, setIsSigning] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const signatureRef = useRef<HTMLDivElement>(null);
   
   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
         const reader = new FileReader();
         reader.onload = (ev) => setPhoto(ev.target?.result as string);
         reader.readAsDataURL(e.target.files[0]);
         triggerHaptic(10);
      }
   };
   
   const startSignature = () => {
      setIsSigning(true);
      triggerHaptic(5);
   };
   
   const handleConfirm = () => {
      triggerHaptic([50, 50, 100]);
      onConfirm();
   };
   
   return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-2xl"
         >
            <div className="p-6 text-center border-b border-gray-50">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <CheckCircle size={32}/>
               </div>
               <h3 className="text-xl font-bold mb-1 text-gray-900">Confirmer la livraison ?</h3>
               <p className="text-gray-500 text-sm">Commande #BDS-091 • Fatou Sall</p>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               {/* Photo Preuve */}
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Photo preuve (Optionnel)</label>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  {photo ? (
                     <div className="relative h-48 rounded-xl overflow-hidden border-2 border-green-200">
                        <img src={photo} className="w-full h-full object-cover" alt="Preuve" />
                        <button onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
                           <X size={16}/>
                        </button>
                     </div>
                  ) : (
                     <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer active:scale-[0.99]"
                     >
                        <Camera size={32} />
                        <span className="text-xs font-bold uppercase">Ajouter une photo</span>
                     </div>
                  )}
               </div>
               
               {/* Signature Client */}
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Signature client (Optionnel)</label>
                  {signature ? (
                     <div className="relative h-32 rounded-xl overflow-hidden border-2 border-green-200 bg-white">
                        <img src={signature} className="w-full h-full object-contain" alt="Signature" />
                        <button onClick={() => setSignature(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
                           <X size={16}/>
                        </button>
                     </div>
                  ) : (
                     <div 
                        ref={signatureRef}
                        onClick={startSignature}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-2 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer active:scale-[0.99] h-32"
                     >
                        <PenLine size={32} />
                        <span className="text-xs font-bold uppercase">Demander signature</span>
                     </div>
                  )}
               </div>
               
               {/* Gains affichés */}
               <div className="bg-[#FFF8E7] p-4 rounded-xl border border-[#D4AF37]/20">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Gain pour cette livraison</p>
                        <p className="text-2xl font-bold text-[#D32F2F]">+850 F</p>
                     </div>
                     <CircleDollarSign size={32} className="text-[#D4AF37]" />
                  </div>
               </div>
               
               <div className="flex gap-3 pt-2">
                  <BDSButton variant="secondary" onClick={onClose} className="flex-1">ANNULER</BDSButton>
                  <button 
                     onClick={handleConfirm} 
                     className="flex-[2] py-4 bg-[#4CAF50] text-white rounded-2xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-[#43A047] active:scale-95 transition-all"
                  >
                     <CheckCircle size={20} /> CONFIRMER
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
   );
}

function DeliveryHistory() {
   const navigate = useNavigate();
   const [filter, setFilter] = useState<"today" | "7d" | "30d">("today");
   
   const filteredData = HISTORY_DATA; // Simuler filtrage selon période
   const summary: Record<typeof filter, { total: number; count: number }> = {
      today: { total: 18500, count: 12 },
      "7d": { total: 125000, count: 78 },
      "30d": { total: 485000, count: 312 }
   };
   
   return (
     <div className="min-h-screen bg-[#F5F5F5] pb-24 md:pb-0 flex flex-col md:flex-row font-sans">
       <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-50">
         <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center text-white shadow-lg"><Bike size={24} /></div>
             <div><h1 className="font-bold text-gray-900 leading-none">Brioche<br/>Dorée</h1></div>
         </div>
         <div className="flex-1 p-4 space-y-2">
            <button onClick={() => navigate('/livreur/dashboard')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors"><LayoutDashboard size={20}/> Tableau de bord</button>
            <button onClick={() => navigate('/livreur/history')} className="w-full flex items-center gap-3 p-3 bg-red-50 text-[#D32F2F] font-bold rounded-xl"><History size={20}/> Historique</button>
            <button onClick={() => navigate('/livreur/profile')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors"><User size={20}/> Mon Profil</button>
         </div>
       </div>
       <div className="flex-1 overflow-y-auto">
         <div className="bg-white p-6 pt-8 shadow-sm mb-4 sticky top-0 z-10 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Historique des courses</h1>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
               {[
                  { id: "today", label: "Aujourd'hui" },
                  { id: "7d", label: "7 jours" },
                  { id: "30d", label: "30 jours" }
               ].map(f => (
                  <button 
                     key={f.id}
                     onClick={() => {
                        setFilter(f.id as typeof filter);
                        triggerHaptic(5);
                     }}
                     className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors active:scale-95",
                        filter === f.id 
                           ? "bg-[#D32F2F] text-white shadow-md hover:bg-[#B71C1C]" 
                           : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                     )}
                  >
                     {f.label}
                  </button>
               ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Gains</div>
                  <div className="text-2xl font-bold text-[#D32F2F]">{summary[filter].total.toLocaleString()} F</div>
               </div>
               <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="text-gray-500 text-xs font-bold uppercase mb-1">Livraisons</div>
                  <div className="text-2xl font-bold text-gray-900">{summary[filter].count}</div>
               </div>
            </div>
         </div>
         <div className="p-4 md:p-8 space-y-4 max-w-4xl">
            {filteredData.length === 0 ? (
               <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-bold text-gray-900 mb-2">Aucune livraison</p>
                  <p className="text-sm text-gray-500">Aucune livraison pour cette période</p>
               </div>
            ) : (
               filteredData.map(item => (
               <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.99]">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-gray-900">{item.client}</span>
                        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">#{item.id}</span>
                     </div>
                     <div className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={14} className="text-gray-400"/> {item.address} • {item.date}</div>
                     <div className="mt-2 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={12} fill={i < item.rating ? "#D4AF37" : "#E5E7EB"} className={i < item.rating ? "text-[#D4AF37]" : "text-gray-200"} strokeWidth={0} />
                        ))}
                     </div>
                  </div>
                  <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-0 pt-3 sm:pt-0 border-gray-50">
                     <div>
                        <div className="font-bold text-lg text-[#4CAF50]">+{item.gain} F</div>
                        <div className="text-xs text-gray-400 font-bold uppercase">Gain net</div>
                     </div>
                     <div className="text-sm font-medium text-gray-500">{item.price} F</div>
                  </div>
               </div>
               ))
            )}
         </div>
       </div>
       <BottomNav active="history" />
     </div>
   );
}

function DeliveryProfile() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 md:pb-0 font-sans flex flex-col md:flex-row">
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-50">
         <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#D32F2F] rounded-xl flex items-center justify-center text-white shadow-lg"><Bike size={24} /></div>
             <div><h1 className="font-bold text-gray-900 leading-none">Brioche<br/>Dorée</h1></div>
         </div>
         <div className="flex-1 p-4 space-y-2">
            <button onClick={() => navigate('/livreur/dashboard')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors"><LayoutDashboard size={20}/> Tableau de bord</button>
            <button onClick={() => navigate('/livreur/history')} className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors"><History size={20}/> Historique</button>
            <button onClick={() => navigate('/livreur/profile')} className="w-full flex items-center gap-3 p-3 bg-red-50 text-[#D32F2F] font-bold rounded-xl"><User size={20}/> Mon Profil</button>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-[#1A1A1A] h-48 md:h-64 relative md:rounded-b-none rounded-b-[40px] shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80')] bg-cover opacity-20"></div>
          <button onClick={() => navigate(-1)} className="md:hidden absolute top-4 left-4 text-white p-2 bg-white/10 rounded-full backdrop-blur-md"><X size={24}/></button>
        </div>
        <div className="px-6 md:px-12 -mt-20 md:-mt-24 relative z-10 max-w-4xl mx-auto mb-12">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 bg-white rounded-[32px] shadow-xl p-6 md:p-8 w-full border border-gray-100">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-50 shadow-lg overflow-hidden bg-gray-100 shrink-0">
               <ImageWithFallback src={DRIVERS[0].photo} className="w-full h-full object-cover" />
             </div>
             <div className="text-center md:text-left text-gray-900 flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-black">Mamadou Diop</h1>
                <p className="text-gray-500 text-sm font-medium flex items-center justify-center md:justify-start gap-2 mt-1"><Bike size={16}/> Livreur depuis 6 mois • ID: LIV-2026</p>
             </div>
             <div className="md:ml-auto flex flex-col gap-2 items-center md:items-end">
                <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full shadow-sm flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                     <Star key={i} size={16} fill="#D4AF37" className="text-[#D4AF37]" strokeWidth={0} />
                  ))}
                  <span className="text-sm font-bold text-gray-900 ml-1">4.8 (127 avis)</span>
                </div>
                <button className="text-xs font-bold text-[#D32F2F] flex items-center gap-1 hover:underline p-2">
                  <PenLine size={12}/> Modifier profil
                </button>
             </div>
          </div>

          <div className="space-y-6">
            {/* Stats Chart */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">Performance de la semaine</h3>
               <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={PERFORMANCE_DATA}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <RechartsTooltip 
                           cursor={{fill: '#f3f4f6'}}
                           contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                           {PERFORMANCE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 5 ? '#D32F2F' : '#E5E7EB'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100 mt-6 pt-6 border-t border-gray-50">
                  <div>
                     <div className="font-bold text-2xl md:text-3xl text-gray-900">847</div>
                     <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-2 font-bold tracking-wide">Courses Totales</div>
                  </div>
                  <div>
                     <div className="font-bold text-2xl md:text-3xl text-green-600">98%</div>
                     <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-2 font-bold tracking-wide">Taux de Succès</div>
                  </div>
                  <div>
                     <div className="font-bold text-2xl md:text-3xl text-blue-600">28m</div>
                     <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-2 font-bold tracking-wide">Temps Moyen</div>
                  </div>
               </div>
            </div>

            {/* Informations Personnelles */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">Informations Personnelles</div>
               <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Phone size={20}/>
                     </div>
                     <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Téléphone</p>
                        <p className="font-medium text-gray-900">+221 77 123 45 67</p>
                     </div>
                     <button className="text-gray-400 hover:text-[#D32F2F]">
                        <PenLine size={18}/>
                     </button>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Mail size={20}/>
                     </div>
                     <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                        <p className="font-medium text-gray-900">mamadou.diop@briochedoree.sn</p>
                     </div>
                     <button className="text-gray-400 hover:text-[#D32F2F]">
                        <PenLine size={18}/>
                     </button>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center">
                        <Store size={20}/>
                     </div>
                     <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase">Boutique assignée</p>
                        <p className="font-medium text-gray-900">Brioche Dorée Almadies</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">Préférences</div>
                 {[
                    { icon: Bell, label: "Notifications", value: true }, 
                    { icon: Navigation, label: "Géolocalisation", value: true }, 
                    { icon: Battery, label: "Mode Économie", value: false },
                    { icon: Volume2, label: "Sons & Alertes", value: true },
                    { icon: Settings, label: "Paramètres App" }
                 ].map((item, i) => (
                    <div key={i} className="p-4 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><item.icon size={20} /></div>
                          <span className="font-medium text-gray-900">{item.label}</span>
                       </div>
                       {item.value !== undefined ? (
                          <div className={cn("w-12 h-7 rounded-full relative transition-colors duration-300", item.value ? "bg-[#4CAF50]" : "bg-gray-300")}>
                             <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300", item.value ? "left-6" : "left-1")}></div>
                          </div>
                       ) : <ChevronRight size={20} className="text-gray-400" />}
                    </div>
                 ))}
              </div>
              <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">Véhicule & Permis</div>
                 <div className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center"><Bike size={20}/></div>
                       <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Véhicule</p>
                          <p className="font-medium text-gray-900">Scooter Yamaha Crypton</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><Truck size={20}/></div>
                       <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Immatriculation</p>
                          <p className="font-medium text-gray-900">DK-2026-BD</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><FileText size={20}/></div>
                       <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Permis</p>
                          <p className="font-medium text-gray-900">Catégorie A (Valide)</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <BDSButton onClick={() => navigate('/')} variant="outline" className="w-full text-[#D32F2F] border-red-200 hover:bg-red-50 h-14 text-lg font-bold rounded-2xl shadow-sm bg-white"><LogOut size={20} className="mr-2"/> SE DÉCONNECTER</BDSButton>
            <div className="text-center text-xs text-gray-400 pb-4">Brioche Dorée Sénégal • Version 2.4.0 (Build 20260208)</div>
          </div>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}

// --- Main App Route ---
export default function DeliveryApp() {
  const location = useLocation();
  useEffect(() => {
    document.body.style.backgroundColor = "#F5F5F5";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);
  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen relative overflow-x-hidden">
      <Routes>
        <Route path="/" element={<DeliveryLogin />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="detail" element={<DeliveryDetailFlow />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="profile" element={<DeliveryProfile />} />
        <Route path="settings" element={<DeliveryProfile />} />
      </Routes>
    </div>
  );
}
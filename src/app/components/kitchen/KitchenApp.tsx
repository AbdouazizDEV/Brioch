import { Routes, Route, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { 
  ChefHat, Clock, AlertCircle, CheckCircle, X, ChevronRight, 
  Thermometer, Trash2, Camera, Play, Pause, RotateCcw,
  List, Bell, Utensils, Maximize2, LogOut, Coffee, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

// --- Types & Data ---

type OrderStatus = "pending" | "preparing" | "baking" | "cooling" | "packaging" | "quality_check" | "ready";

interface KitchenOrder {
  id: string;
  client: string;
  items: { name: string; qty: number; notes?: string }[];
  status: OrderStatus;
  startTime: Date;
  estimatedTime: number; // minutes
  priority: boolean;
  ovenConfig?: { temp: number; time: number }; // if needs baking
}

const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: "BDS-091",
    client: "Fatou Sall",
    items: [
      { name: "Croissant au beurre", qty: 2 },
      { name: "Pain au chocolat", qty: 1 },
      { name: "Baguette tradition", qty: 2, notes: "Bien cuite svp" }
    ],
    status: "baking",
    startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    estimatedTime: 15,
    priority: true,
    ovenConfig: { temp: 180, time: 12 }
  },
  {
    id: "BDS-094",
    client: "Moussa Diop",
    items: [
      { name: "Sandwich Poulet", qty: 1, notes: "Sans mayonnaise" },
      { name: "Coca Cola", qty: 1 }
    ],
    status: "preparing",
    startTime: new Date(Date.now() - 1000 * 60 * 2),
    estimatedTime: 8,
    priority: false
  },
  {
    id: "BDS-095",
    client: "Awa Ndiaye",
    items: [
      { name: "Tarte aux pommes", qty: 1 },
      { name: "Café Allongé", qty: 1 }
    ],
    status: "pending",
    startTime: new Date(),
    estimatedTime: 5,
    priority: false
  }
];

const STEPS = [
  { id: "preparing", label: "Assemblage", icon: Utensils },
  { id: "baking", label: "Four", icon: Thermometer },
  { id: "cooling", label: "Refroidissement", icon: Clock },
  { id: "packaging", label: "Emballage", icon: Coffee }, // Using Coffee as placeholder for packaging icon not available in lucide subset commonly used or similar
  { id: "quality_check", label: "Contrôle Qualité", icon: CheckCircle },
  { id: "ready", label: "Prête", icon: Bell },
];

// --- Components ---

function KitchenHeader() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-20 px-6 flex items-center justify-between shadow-sm z-30 relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <ChefHat size={28} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">Cuisine</h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Brioche Dorée Almadies</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <div className="text-2xl font-mono font-bold text-gray-900 leading-none">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-gray-500 font-medium uppercase mt-1">
            {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div className="h-10 w-px bg-gray-200 mx-2"></div>
        <button className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <Maximize2 size={24} />
        </button>
        <button onClick={() => navigate('/')} className="p-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
}

function OrderCard({ order, onStatusChange }: { order: KitchenOrder, onStatusChange: (id: string, status: OrderStatus) => void }) {
  const [elapsed, setElapsed] = useState(0);
  const isLate = elapsed > order.estimatedTime;

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - order.startTime.getTime()) / 1000 / 60);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.startTime]);

  const currentStepIndex = STEPS.findIndex(s => s.id === order.status);
  const nextStep = STEPS[currentStepIndex + 1]?.id as OrderStatus;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-2xl shadow-sm border-l-8 overflow-hidden flex flex-col min-h-[300px]",
        order.priority ? "border-red-500" : "border-gray-200"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-xl text-gray-900">#{order.id}</span>
            {order.priority && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded animate-pulse">URGENT</span>
            )}
          </div>
          <div className="text-sm font-medium text-gray-500">{order.client}</div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-lg text-sm font-bold font-mono flex items-center gap-1",
          isLate ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
        )}>
          <Clock size={14} />
          {elapsed} / {order.estimatedTime} min
        </div>
      </div>

      {/* Items */}
      <div className="p-4 flex-1 bg-gray-50/50">
        <ul className="space-y-3">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5">
                {item.qty}x
              </div>
              <div>
                <span className="font-bold text-gray-800 text-lg leading-tight block">{item.name}</span>
                {item.notes && <span className="text-sm text-orange-600 font-medium italic block mt-0.5">⚠️ {item.notes}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline Actions */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex justify-between items-center mb-4 px-1">
          {STEPS.slice(0, 5).map((step, idx) => {
             const isActive = idx === currentStepIndex;
             const isPast = idx < currentStepIndex;
             const Icon = step.icon;
             return (
               <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isActive ? "bg-red-600 text-white scale-110 shadow-lg" : isPast ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"
                  )}>
                    <Icon size={14} />
                  </div>
                  {isActive && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide absolute mt-9">{step.label}</span>}
               </div>
             )
          })}
        </div>

        {nextStep && (
          <button 
            onClick={() => onStatusChange(order.id, nextStep)}
            className="w-full h-16 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            TERMINER {STEPS.find(s => s.id === order.status)?.label.toUpperCase()} <ChevronRight />
          </button>
        )}
        {!nextStep && (
          <div className="w-full h-16 bg-green-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2">
            <CheckCircle /> COMMANDE PRÊTE
          </div>
        )}
      </div>
    </motion.div>
  );
}

function OvenWidget({ order, onClose }: { order: KitchenOrder, onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState((order.ovenConfig?.time || 10) * 60);
  const [paused, setPaused] = useState(false);
  const totalTime = (order.ovenConfig?.time || 10) * 60;
  
  useEffect(() => {
    if(paused || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [paused, timeLeft]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed bottom-6 right-6 w-80 bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-700"
    >
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-red-500">🔥</span>
          <span className="font-bold">FOUR N°1</span>
        </div>
        <span className="text-xs font-mono text-gray-400">#{order.id}</span>
      </div>
      
      <div className="p-6 text-center">
        <div className="text-5xl font-mono font-bold tracking-wider mb-2">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        
        <div className="h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-500 to-red-500" 
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-center gap-4 text-sm font-medium text-gray-400 mb-6">
          <span>{order.ovenConfig?.temp}°C</span>
          <span>•</span>
          <span>{order.ovenConfig?.time} min</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setTimeLeft(t => t + 60)} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg font-bold">+1m</button>
          <button onClick={() => setPaused(!paused)} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-yellow-500">
            {paused ? <Play size={20} className="mx-auto"/> : <Pause size={20} className="mx-auto"/>}
          </button>
          <button onClick={() => setTimeLeft(totalTime)} className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-red-400">
            <RotateCcw size={20} className="mx-auto"/>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle size={20}/> SORTIR DU FOUR
        </button>
      </div>
    </motion.div>
  );
}

function QualityCheckModal({ order, onConfirm, onClose }: { order: KitchenOrder, onConfirm: () => void, onClose: () => void }) {
  const [checks, setChecks] = useState< Record<string, boolean> >({});
  const allChecked = ["items", "qty", "visual", "temp", "pack", "label"].every(k => checks[k]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
            <Shield size={28}/> Contrôle Qualité Final
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-blue-100 rounded-full text-blue-900"><X size={24}/></button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-500 uppercase text-sm mb-4">Points de contrôle</h3>
            {[
              { id: "items", label: "Tous les articles présents" },
              { id: "qty", label: "Quantités correctes" },
              { id: "visual", label: "Aspect visuel (dorure/cuisson)" },
              { id: "temp", label: "Température appropriée" },
              { id: "pack", label: "Emballage propre & scellé" },
              { id: "label", label: "Étiquette client apposée" },
            ].map(item => (
              <label key={item.id} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className={cn(
                   "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                   checks[item.id] ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white"
                 )}>
                   {checks[item.id] && <CheckCircle size={16} />}
                 </div>
                 <input 
                   type="checkbox" 
                   className="hidden" 
                   checked={!!checks[item.id]} 
                   onChange={() => setChecks(p => ({ ...p, [item.id]: !p[item.id] }))}
                 />
                 <span className="font-medium text-gray-800 text-lg">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col h-full">
             <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-4 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer min-h-[200px]">
                <Camera size={48} />
                <span className="font-bold">Ajouter photo preuve (Optionnel)</span>
             </div>
             
             <button 
               disabled={!allChecked}
               onClick={onConfirm}
               className="w-full h-16 mt-6 bg-blue-600 text-white rounded-xl font-bold text-xl shadow-xl hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
             >
               <CheckCircle size={24}/> VALIDER & MARQUER PRÊTE
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function KitchenDashboard() {
  const [orders, setOrders] = useState<KitchenOrder[]>(MOCK_ORDERS);
  const [activeOvenOrder, setActiveOvenOrder] = useState<KitchenOrder | null>(orders.find(o => o.status === "baking") || null);
  const [qualityCheckOrder, setQualityCheckOrder] = useState<KitchenOrder | null>(null);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // Logic triggers
    if (newStatus === "baking") {
      setActiveOvenOrder(order);
    } else if (order.status === "baking" && newStatus !== "baking") {
      setActiveOvenOrder(null);
    }

    if (newStatus === "quality_check") {
      setQualityCheckOrder(order);
      return; // Don't update status yet, wait for modal
    }

    if (newStatus === "ready") {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Commande #${id} prête ! Notification envoyée.`);
    }

    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "preparing");
  const activeOrders = orders.filter(o => ["baking", "cooling", "packaging"].includes(o.status));
  
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col overflow-hidden">
      <KitchenHeader />
      
      <main className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-8 h-full min-w-[1024px]">
          
          {/* Column 1: A faire (New & Prep) */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <List /> À FAIRE ({pendingOrders.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 no-scrollbar">
              {pendingOrders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>

          {/* Column 2: En cours (Cooking / Processing) */}
          <div className="w-1/3 flex flex-col gap-4">
             <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-xl font-bold text-orange-600 uppercase tracking-wider flex items-center gap-2">
                <Utensils /> EN PRÉPARATION ({activeOrders.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20 no-scrollbar">
              {activeOrders.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>

          {/* Column 3: Stats / Finished */}
          <div className="w-1/3 flex flex-col gap-6">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-400 uppercase text-sm mb-4">Performance Service</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-green-50 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-green-600">12</div>
                      <div className="text-xs font-bold text-green-800 uppercase mt-1">Prêtes</div>
                   </div>
                   <div className="p-4 bg-blue-50 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-blue-600">8m</div>
                      <div className="text-xs font-bold text-blue-800 uppercase mt-1">Moy. Temps</div>
                   </div>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex-1">
                <h3 className="font-bold text-gray-400 uppercase text-sm mb-4">Commandes Prêtes</h3>
                <div className="space-y-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl opacity-60">
                        <span className="font-bold text-gray-600">#BDS-08{9-i}</span>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">LIVRÉE</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {activeOvenOrder && (
          <OvenWidget 
            order={activeOvenOrder} 
            onClose={() => handleStatusChange(activeOvenOrder.id, "cooling")} 
          />
        )}
        {qualityCheckOrder && (
          <QualityCheckModal 
            order={qualityCheckOrder}
            onClose={() => setQualityCheckOrder(null)}
            onConfirm={() => {
              handleStatusChange(qualityCheckOrder.id, "ready");
              setQualityCheckOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KitchenApp() {
  return (
    <Routes>
      <Route path="/" element={<KitchenDashboard />} />
    </Routes>
  );
}
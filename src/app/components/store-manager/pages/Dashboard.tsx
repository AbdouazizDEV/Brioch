import { 
  ShoppingBag, Clock, TrendingUp, CheckCircle, AlertTriangle, 
  Users, Activity, DollarSign, Store
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/data";

export default function StoreManagerDashboard({ storeId }: { storeId: string }) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate data refresh
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);
  
  // Mock Data - Limited to this store only
  const hourlyData = [
    { name: '08h', orders: 8 }, { name: '10h', orders: 22 },
    { name: '12h', orders: 45 }, { name: '14h', orders: 28 },
    { name: '16h', orders: 35 }, { name: '18h', orders: 18 }, { name: '20h', orders: 32 }
  ];
  const modeData = [
    { name: 'Livraison', value: 65, color: '#D32F2F' },
    { name: 'Click & Collect', value: 35, color: '#D4AF37' },
  ];
  const productsData = [
    { name: 'Croissant', sales: 45 }, { name: 'Pain Choc', sales: 32 },
    { name: 'Baguette', sales: 28 }, { name: 'Sandwich', sales: 22 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)]">
      
      {/* Header Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">Tableau de bord</h2>
          <p className="text-sm text-gray-500">Aperçu en temps réel de votre boutique</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           Actualisé {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Store Info Badge */}
      <div className="bg-white p-4 rounded-xl shadow-bds-card border border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-bds-red/10 flex items-center justify-center">
          <Store size={24} className="text-bds-red" />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase">Boutique assignée</p>
          <p className="font-bold text-gray-900">Brioche Dorée Almadies</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard 
          title="CA Digital" 
          value="425 500 F" 
          sub="+18% vs hier" 
          sub2="+12% vs mois dernier"
          target="71%" 
          targetValue={71}
          objective={600000}
          current={425500}
          icon={DollarSign} 
          color="text-bds-gold" 
        />
        <KPICard 
          title="Commandes du jour" 
          value="18" 
          sub="+8% vs hier" 
          sub2="+5% vs mois dernier"
          target="En cours: 5" 
          targetValue={72}
          objective={25}
          current={18}
          icon={ShoppingBag} 
        />
        <KPICard 
          title="Taux Conversion" 
          value="14.2%" 
          sub="+1.8pts" 
          sub2="+0.9pts vs mois dernier"
          target="Obj: 18%" 
          targetValue={78.9}
          objective={18}
          current={14.2}
          icon={Activity} 
        />
        <KPICard 
          title="Panier Moyen" 
          value="23 650 F" 
          sub="+6% vs hier" 
          sub2="+4% vs mois dernier"
          target="Vs hier: 22.3K" 
          targetValue={85}
          objective={28000}
          current={23650}
          icon={TrendingUp} 
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Alerts */}
         <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 flex flex-col justify-center space-y-4">
            <h3 className="font-bold text-gray-800 font-serif">⚠️ Actions Requises</h3>
            <div className="space-y-3">
               <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm flex items-start gap-3 border border-red-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold">2 commandes en attente d'assignation</p>
                    <button className="text-xs font-bold underline mt-1 hover:text-red-950">Assigner maintenant →</button>
                  </div>
               </div>
               <div className="p-3 bg-orange-50 text-orange-800 rounded-lg text-sm flex items-start gap-3 border border-orange-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold">Stock faible : Croissant</p>
                    <p className="text-xs opacity-80">12 restants</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Activity Feed */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-bds-card border border-gray-100">
            <h3 className="font-bold text-gray-800 font-serif mb-4">Activité temps réel</h3>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
               {NOTIFICATIONS.slice(0, 5).map((notif) => (
                 <div key={notif.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0">
                    <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", notif.type === 'order' ? "bg-green-500" : "bg-blue-500")}></div>
                    <div>
                       <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                       <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{notif.time}</span>
                          <span>•</span>
                          <span>{notif.message}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Hour */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 min-w-0">
          <h3 className="font-bold text-gray-800 mb-6 font-serif">Commandes par heure</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{background: '#1A1A1A', border: 'none', borderRadius: '8px', color: 'white'}} />
                <Line type="monotone" dataKey="orders" stroke="#D32F2F" strokeWidth={3} dot={{r: 4, fill: '#D32F2F'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Mode Split */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 flex flex-col min-w-0">
          <h3 className="font-bold text-gray-800 mb-2 font-serif">Répartition Mode</h3>
          <div className="flex-1 flex items-center gap-4">
             <div className="h-48 w-48 relative mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={modeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {modeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-2xl font-bold text-gray-900">65%</span>
                   <span className="text-xs text-gray-500">Livraison</span>
                </div>
             </div>
             <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-bds-red"></div>
                   <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold"><span>Livraison</span> <span>65%</span></div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1"><div className="w-[65%] h-full bg-bds-red rounded-full"></div></div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-bds-gold"></div>
                   <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold"><span>Click & Collect</span> <span>35%</span></div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1"><div className="w-[35%] h-full bg-bds-gold rounded-full"></div></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 min-w-0 lg:col-span-2">
           <h3 className="font-bold text-gray-800 mb-4 font-serif">Top 4 Produits de votre boutique</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productsData.map((prod, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-300 w-4">#{i+1}</span>
                    <div className="flex-1">
                       <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="font-bold">{prod.name}</span>
                          <span className="font-bold text-bds-red">{prod.sales} ventes</span>
                       </div>
                       <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-bds-red h-full rounded-full" style={{ width: `${(prod.sales / 50) * 100}%` }}></div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, sub, sub2, target, targetValue, objective, current, icon: Icon, color = "text-gray-900" }: any) {
  const progress = targetValue || (objective ? Math.min(100, (current / objective) * 100) : 0);
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-bds-card border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
         <div className="p-3 bg-gray-50 rounded-lg text-gray-600 group-hover:bg-red-50 group-hover:text-bds-red transition-colors">
            <Icon size={24} />
         </div>
         <div className="flex flex-col items-end gap-1">
           <span className={cn("text-xs font-bold px-2 py-1 rounded-full", sub.includes('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
             {sub}
           </span>
           {sub2 && (
             <span className="text-[10px] text-gray-500">{sub2}</span>
           )}
         </div>
      </div>
      <div className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</div>
      <div className={cn("text-3xl font-bold font-sans mb-3", color)}>{value}</div>
      
      {targetValue !== undefined && (
        <>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
             <div className={cn("h-full rounded-full group-hover:bg-bds-red transition-colors", progress >= 100 ? "bg-green-500" : "bg-gray-800")} style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
          <div className="text-[10px] text-gray-400 text-right">{target}</div>
        </>
      )}
    </div>
  );
}

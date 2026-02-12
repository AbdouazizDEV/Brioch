import { 
  ShoppingBag, Clock, TrendingUp, CheckCircle, AlertTriangle, 
  Users, Activity, DollarSign 
} from "lucide-react";
import { useEffect, useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { cn } from "@/lib/utils";
import { NOTIFICATIONS } from "@/lib/data";

export default function AdminDashboard() {
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
  
  // Mock Data
  const hourlyData = [
    { name: '08h', orders: 12 }, { name: '10h', orders: 35 },
    { name: '12h', orders: 85 }, { name: '14h', orders: 45 },
    { name: '16h', orders: 60 }, { name: '18h', orders: 30 }, { name: '20h', orders: 55 }
  ];
  const modeData = [
    { name: 'Livraison', value: 68, color: '#D32F2F' },
    { name: 'Click & Collect', value: 32, color: '#D4AF37' },
  ];
  const productsData = [
    { name: 'Croissant', sales: 87 }, { name: 'Pain Choc', sales: 64 },
    { name: 'Baguette', sales: 52 }, { name: 'Sandwich', sales: 43 },
  ];
  const storesData = [
    { name: 'Almadies', sales: 38 }, { name: 'Mermoz', sales: 32 },
    { name: 'Plateau', sales: 30 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)]">
      
      {/* Header Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">Tableau de bord</h2>
          <p className="text-sm text-gray-500">Aperçu en temps réel de l'activité</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           Actualisé {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard 
          title="CA Digital" 
          value="1 247 500 F" 
          sub="+23% vs hier" 
          sub2="+18% vs mois dernier"
          target="83%" 
          targetValue={83}
          objective={1500000}
          current={1247500}
          icon={DollarSign} 
          color="text-bds-gold" 
        />
        <KPICard 
          title="Commandes du jour" 
          value="47" 
          sub="+12% vs hier" 
          sub2="+8% vs mois dernier"
          target="En cours: 12" 
          targetValue={60}
          objective={60}
          current={47}
          icon={ShoppingBag} 
        />
        <KPICard 
          title="Taux Conversion" 
          value="15.3%" 
          sub="+2.1pts" 
          sub2="+1.2pts vs mois dernier"
          target="Obj: 20%" 
          targetValue={76.5}
          objective={20}
          current={15.3}
          icon={Activity} 
        />
        <KPICard 
          title="Panier Moyen" 
          value="26 500 F" 
          sub="+8% vs hier" 
          sub2="+5% vs mois dernier"
          target="Vs hier: 24.5K" 
          targetValue={88}
          objective={30000}
          current={26500}
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
                    <p className="font-bold">3 commandes en attente d'assignation</p>
                    <button className="text-xs font-bold underline mt-1 hover:text-red-950">Assigner maintenant →</button>
                  </div>
               </div>
               <div className="p-3 bg-orange-50 text-orange-800 rounded-lg text-sm flex items-start gap-3 border border-orange-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold">Stock faible : Croissant (Almadies)</p>
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
                   <span className="text-2xl font-bold text-gray-900">68%</span>
                   <span className="text-xs text-gray-500">Livraison</span>
                </div>
             </div>
             <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-bds-red"></div>
                   <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold"><span>Livraison</span> <span>68%</span></div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1"><div className="w-[68%] h-full bg-bds-red rounded-full"></div></div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-bds-gold"></div>
                   <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold"><span>Click & Collect</span> <span>32%</span></div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1"><div className="w-[32%] h-full bg-bds-gold rounded-full"></div></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 min-w-0">
           <h3 className="font-bold text-gray-800 mb-4 font-serif">Top 4 Produits</h3>
           <div className="space-y-4">
              {productsData.map((prod, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <span className="font-bold text-gray-300 w-4">#{i+1}</span>
                    <div className="flex-1">
                       <div className="flex justify-between text-sm font-medium mb-1">
                          <span>{prod.name}</span>
                          <span className="font-bold">{prod.sales} ventes</span>
                       </div>
                       <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-gray-800 h-full rounded-full" style={{ width: `${(prod.sales / 100) * 100}%` }}></div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Store Performance */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 min-w-0">
           <h3 className="font-bold text-gray-800 mb-4 font-serif">Performance Boutiques</h3>
           <div className="h-56 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={storesData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0"/>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                 <Bar dataKey="sales" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
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

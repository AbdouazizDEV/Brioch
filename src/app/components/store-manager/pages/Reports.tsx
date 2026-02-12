import { useState } from "react";
import { 
  TrendingUp, ShoppingBag, Users, Truck, Calendar, Download, 
  DollarSign, Activity
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { BDSButton } from "@/app/components/shared/BDSButton";
import { cn } from "@/lib/utils";

const COLORS = ['#D32F2F', '#D4AF37', '#1A1A1A', '#E0E0E0'];

export default function StoreManagerReports({ storeId }: { storeId: string }) {
  const [period, setPeriod] = useState("Ce mois");

  // Mock Data - Limited to this store
  const revenueData = [
    { day: '1', ca: 180 }, { day: '5', ca: 240 }, { day: '10', ca: 220 },
    { day: '15', ca: 320 }, { day: '20', ca: 280 }, { day: '25', ca: 350 }, { day: '30', ca: 420 }
  ];

  const salesByCat = [
    { name: 'Viennoiseries', value: 45 },
    { name: 'Pains', value: 25 },
    { name: 'Pâtisseries', value: 20 },
    { name: 'Sandwichs', value: 10 },
  ];

  return (
    <div className="p-4 md:p-8 bg-[rgb(254,255,233)] min-h-[calc(100vh-80px)] space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold font-serif text-gray-900">Rapports & Analytics</h2>
           <p className="text-sm text-gray-500">Analysez la performance de votre boutique</p>
        </div>
        <div className="flex gap-3 flex-wrap">
           <div className="relative">
              <select 
                value={period} onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2 rounded-lg text-sm font-medium outline-none focus:border-bds-red shadow-sm cursor-pointer"
              >
                <option>Aujourd'hui</option>
                <option>Ce mois</option>
                <option>Cette année</option>
              </select>
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
           </div>
           <BDSButton variant="outline" className="gap-2 bg-white"><Download size={16}/> Exporter PDF</BDSButton>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard title="Chiffre d'Affaires" value="2 847 500 F" change="+15%" positive icon={DollarSign} />
         <KPICard title="Commandes" value="428" change="+10%" positive icon={ShoppingBag} />
         <KPICard title="Panier Moyen" value="23 650 F" change="+4%" positive icon={TrendingUp} />
         <KPICard title="Marge Brute" value="52%" change="+1%" positive icon={Activity} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Evolution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 min-w-0">
           <h3 className="font-bold text-gray-800 mb-6 font-serif">Évolution du CA</h3>
           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={revenueData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                 <Tooltip contentStyle={{background: '#1A1A1A', border: 'none', borderRadius: '8px', color: 'white'}} />
                 <Line type="monotone" dataKey="ca" stroke="#D32F2F" strokeWidth={3} dot={{r: 4, fill: '#D32F2F', strokeWidth: 2, stroke: 'white'}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 flex flex-col min-w-0">
           <h3 className="font-bold text-gray-800 mb-6 font-serif">Répartition Ventes</h3>
           <div className="flex-1 min-h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={salesByCat} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {salesByCat.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {salesByCat.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background: COLORS[i % COLORS.length]}}/>
                  <span className="text-gray-600">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 font-serif flex items-center gap-2"><Truck size={18}/> Performance Livraison</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-green-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-700">97.8%</div>
                  <div className="text-xs font-bold text-green-600 uppercase">Taux de succès</div>
               </div>
               <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-700">30 min</div>
                  <div className="text-xs font-bold text-blue-600 uppercase">Temps moyen</div>
               </div>
               <div className="p-4 bg-orange-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-orange-700">4.2%</div>
                  <div className="text-xs font-bold text-orange-600 uppercase">Retards</div>
               </div>
               <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-700">128</div>
                  <div className="text-xs font-bold text-gray-600 uppercase">Total Livraisons</div>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 font-serif flex items-center gap-2"><Users size={18}/> Performance Équipe</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Livreurs actifs</span>
                  <span className="font-bold text-gray-900">5/6</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Préparateurs actifs</span>
                  <span className="font-bold text-gray-900">2/2</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Note moyenne livreurs</span>
                  <span className="font-bold text-bds-gold">4.7 ★</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Temps moyen préparation</span>
                  <span className="font-bold text-gray-900">17 min</span>
               </div>
            </div>
         </div>
      </div>
      
    </div>
  );
}

function KPICard({ title, value, change, positive, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-bds-card border border-gray-100 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon size={64} className="text-bds-red" />
      </div>
      <p className="text-sm text-gray-500 font-bold uppercase tracking-wide mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit", positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
         {positive ? "↗" : "↘"} {change}
      </div>
    </div>
  );
}

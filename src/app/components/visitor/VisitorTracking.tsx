import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { 
  CheckCircle, Clock, Truck, MapPin, Phone, MessageCircle, 
  ChevronLeft, Star, ArrowRight, User, X, Send
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for tracking
const MOCK_ORDER = {
  id: "BDS-20260207-089",
  customer: { name: "Fatou Sall", phone: "+221 77 123 45 67" },
  items: [
    { name: "Croissant au beurre", quantity: 2, price: 1500 },
    { name: "Pain au chocolat", quantity: 1, price: 1800 },
    { name: "Baguette tradition", quantity: 2, price: 2400 }
  ],
  total: 8700,
  subtotal: 7200,
  deliveryFee: 1500,
  address: "Rue 12, Villa 45, Almadies",
  instructions: "Maison bleue, sonnez 2 fois",
  driver: {
    name: "Mamadou DIOP",
    rating: 4.8,
    deliveries: 127,
    vehicle: "Moto Yamaha",
    license: "DK-2024-089",
    phone: "+221 77 000 00 00",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  timeline: [
    { status: "Commande validée", time: "15:42", done: true },
    { status: "En préparation", time: "15:47", done: true },
    { status: "Prise en charge livreur", time: "16:05", done: true },
    { status: "En livraison", time: "16:25 (Estimé)", done: true, current: true },
    { status: "Livrée", time: "--:--", done: false }
  ]
};

function ChatModal({ isOpen, onClose, driverName, driverImage }: any) {
  const [messages, setMessages] = useState([
    { sender: "driver", text: "Bonjour Fatou ! Je suis en route, j'arrive dans 10 minutes.", time: "16:15" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Auto-scroll to bottom would be good, but keeping it simple for now
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "me", text: newMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setNewMessage("");
    
    // Simulate reply
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: "driver", text: "D'accord, à tout de suite !", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[85vh] md:h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                     <ImageWithFallback src={driverImage} className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                 </div>
                 <div>
                   <h3 className="font-bold text-sm text-gray-900">{driverName}</h3>
                   <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> En ligne
                   </p>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20}/></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
               {messages.map((msg, i) => (
                 <div key={i} className={cn("flex flex-col max-w-[85%]", msg.sender === 'me' ? "ml-auto items-end" : "mr-auto items-start")}>
                   <div className={cn(
                     "p-3 rounded-2xl text-sm leading-relaxed",
                     msg.sender === 'me' ? "bg-bds-red text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                   )}>
                     {msg.text}
                   </div>
                   <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">{msg.time}</span>
                 </div>
               ))}
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-gray-100 bg-white">
               <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:border-bds-red focus-within:ring-1 focus-within:ring-bds-red/20 transition-all">
                 <input 
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Écrivez votre message..."
                   className="flex-1 h-10 px-4 bg-transparent outline-none text-sm placeholder:text-gray-400"
                   autoFocus
                 />
                 <button 
                  onClick={handleSend} 
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 rounded-full bg-bds-red text-white flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-bds-red transition-all shadow-sm"
                 >
                   <Send size={18} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                 </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function VisitorTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(MOCK_ORDER);
  const [driverPos, setDriverPos] = useState({ lat: 14.743, lng: -17.512 });
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState({ product: 0, driver: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate delivery completion after 60 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to auto-trigger delivery for testing
      // setOrder(prev => ({
      //   ...prev,
      //   timeline: prev.timeline.map(t => ({ ...t, done: true, current: false })),
      // }));
      // setShowRating(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  const handleRatingSubmit = () => {
    toast.success("Merci pour votre avis !");
    setShowRating(false);
  };

  if (showRating) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2">Commande livrée !</h2>
          <p className="text-gray-500 mb-8">Bon appétit Fatou ! 🥐</p>

          <div className="space-y-6 mb-8">
            <div>
              <p className="font-medium mb-2">Qualité des produits</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(p => ({...p, product: s}))} className={cn("text-2xl", s <= rating.product ? "text-yellow-400" : "text-gray-200")}>★</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Livraison (Mamadou)</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(p => ({...p, driver: s}))} className={cn("text-2xl", s <= rating.driver ? "text-yellow-400" : "text-gray-200")}>★</button>
                ))}
              </div>
            </div>
          </div>

          <textarea placeholder="Un commentaire ? (Optionnel)" className="w-full border border-gray-200 rounded-lg p-3 mb-6 text-sm resize-none h-24" />

          <BDSButton onClick={handleRatingSubmit} className="w-full mb-4">ENVOYER MON AVIS</BDSButton>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="bg-bds-red text-white p-2 rounded-lg">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Créez votre compte</h4>
                <p className="text-xs text-gray-500 mb-2">Gagnez 10% sur votre prochaine commande !</p>
                <button className="text-bds-red text-xs font-bold flex items-center gap-1 hover:underline">
                  Créer mon compte <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2">
             <img src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" alt="Logo" className="h-8 w-auto rounded-md" />
           </Link>
           <div className="text-right">
             <p className="text-xs text-gray-500">Commande</p>
             <p className="font-bold text-sm">{order.id}</p>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Timeline */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-serif font-bold text-lg mb-6">Suivi</h2>
            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {order.timeline.map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10 border-2",
                    step.done ? "bg-green-100 border-green-500 text-green-600" : 
                    step.current ? "bg-orange-100 border-orange-500 text-orange-600 animate-pulse" : "bg-white border-gray-200 text-gray-300"
                  )}>
                    {step.done ? <CheckCircle size={16} /> : step.current ? <Clock size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-200"/>}
                  </div>
                  <div>
                    <p className={cn("font-medium text-sm", step.current && "text-orange-600 font-bold")}>{step.status}</p>
                    <p className="text-xs text-gray-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck size={18}/> Votre Livreur</h3>
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                 <ImageWithFallback src={order.driver.image} className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="font-bold">{order.driver.name}</p>
                 <div className="flex items-center gap-1 text-xs text-yellow-500">
                   <Star size={12} fill="currentColor" />
                   <span className="text-gray-600 font-medium">{order.driver.rating}</span>
                   <span className="text-gray-400">• {order.driver.deliveries} courses</span>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">{order.driver.vehicle} • {order.driver.license}</p>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-3">
               <BDSButton size="sm" className="gap-2"><Phone size={14}/> Appeler</BDSButton>
               <BDSButton 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsChatOpen(true)}
               >
                 <MessageCircle size={14}/> SMS / Chat
               </BDSButton>
             </div>
          </div>
        </div>

        {/* Map & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative h-[300px] md:h-[400px] group">
            {/* Mock Map */}
            <div className="absolute inset-0 bg-gray-200">
               <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg')] bg-repeat bg-[length:100px_100px] grayscale pointer-events-none"></div>
               {/* Map Markers Simulation */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -top-16 -left-16 w-32 h-32 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                    <div className="w-8 h-8 bg-white rounded-full p-1 shadow-lg transform hover:scale-110 transition-transform">
                      <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Truck size={14} />
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap">
                      Mamadou est ici
                    </div>
                  </div>
               </div>
               
               <div className="absolute bottom-10 right-10">
                  <div className="w-8 h-8 bg-white rounded-full p-1 shadow-lg">
                      <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white">
                        <User size={14} />
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow text-xs font-bold whitespace-nowrap">
                      Vous
                    </div>
               </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-sm border border-gray-200">
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Estimation</p>
                   <p className="font-bold text-gray-900">Arrivée dans ~10 min</p>
                 </div>
                 <div className="h-8 w-px bg-gray-300 mx-4"></div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Distance</p>
                   <p className="font-bold text-gray-900">2.1 km</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Détails de la commande</h3>
            <div className="space-y-3 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString()} F</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Sous-total</span>
                 <span>{order.subtotal.toLocaleString()} F</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Livraison</span>
                 <span>{order.deliveryFee.toLocaleString()} F</span>
               </div>
               <div className="flex justify-between font-bold text-lg pt-2 text-bds-red">
                 <span>Total payé</span>
                 <span>{order.total.toLocaleString()} F</span>
               </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-6 space-y-3 text-sm">
               <div className="flex items-start gap-3">
                 <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0"/>
                 <div>
                   <p className="font-bold text-gray-700">Adresse de livraison</p>
                   <p className="text-gray-600">{order.address}</p>
                   <p className="text-gray-500 text-xs mt-1">Note: {order.instructions}</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="bg-[#FFF8E7] p-6 rounded-xl border border-[#D4AF37]/20 flex items-center justify-between">
             <div>
               <h4 className="font-bold font-serif text-[#D4AF37] mb-1">Pas encore de compte ?</h4>
               <p className="text-sm text-gray-600">Créez un compte pour suivre vos prochaines commandes plus facilement.</p>
             </div>
             <BDSButton variant="secondary" size="sm">Créer mon compte</BDSButton>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        driverName={order.driver.name}
        driverImage={order.driver.image}
      />
    </div>
  );
}
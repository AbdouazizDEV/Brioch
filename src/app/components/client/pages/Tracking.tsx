import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Truck,
  Clock,
  Navigation,
  Star,
  Package,
  ChevronRight,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { DRIVERS, ORDERS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BDSButton } from "@/app/components/shared/BDSButton";

// --- Sub-Component: Live Tracking (The Map View) ---
function LiveTrackingMap({
  order,
  onBack,
}: {
  order: any;
  onBack: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const driver = DRIVERS[0]; // Mock driver
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis en route avec votre commande.",
      sender: "driver",
      time: "12:30",
    },
    {
      id: 2,
      text: "Super, merci ! Le code d'entrée est 4580.",
      sender: "me",
      time: "12:31",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: newMessage,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "C'est noté !",
          sender: "driver",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col h-screen w-screen">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg')] bg-repeat bg-[length:100px_100px] opacity-10 pointer-events-none mix-blend-multiply"></div>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80"
          className="w-full h-full object-cover grayscale-[20%]"
        />

        {/* Route Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl">
          <path
            d="M 200 100 Q 300 300 500 500"
            fill="none"
            stroke="#D32F2F"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 10"
            className="animate-[dash_20s_linear_infinite]"
          />
          <circle
            cx="200"
            cy="100"
            r="12"
            fill="#D32F2F"
            stroke="white"
            strokeWidth="3"
          />
          <circle
            cx="500"
            cy="500"
            r="12"
            fill="#D4AF37"
            stroke="white"
            strokeWidth="3"
          />
        </svg>

        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={onBack}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>

      {/* Driver Pin */}
      <motion.div
        initial={{ x: 200, y: 100 }}
        animate={{ x: [200, 325, 500], y: [100, 300, 500] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 z-10 -ml-7 -mt-7 p-1 bg-white rounded-full shadow-2xl"
      >
        <div className="w-12 h-12 bg-bds-red rounded-full flex items-center justify-center text-white">
          <Truck size={24} />
        </div>
      </motion.div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isExpanded ? "0%" : "60%" }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 h-[80vh] flex flex-col transition-all duration-500"
      >
        <div
          className="w-full pt-4 pb-2 flex justify-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-8 mt-2">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                En route vers vous
              </h2>
              <p className="text-gray-500">
                Arrivée estimée :{" "}
                <span className="text-bds-red font-bold">
                  12:45
                </span>
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <Clock
                size={24}
                className="text-gray-600 animate-pulse"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative mb-10 pl-4 border-l-2 border-gray-100 space-y-8">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
              <h4 className="font-bold text-gray-900">
                Commande confirmée
              </h4>
              <p className="text-xs text-gray-400">12:00</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-bds-gold border-2 border-white shadow-sm ring-4 ring-yellow-100 animate-pulse"></div>
              <h4 className="font-bold text-gray-900">
                Livreur en route
              </h4>
              <p className="text-xs text-gray-400">12:30</p>
            </div>
            <div className="relative opacity-50">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
              <h4 className="font-bold text-gray-900">
                Livraison
              </h4>
            </div>
          </div>

          {/* Driver */}
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
              <ImageWithFallback
                src={driver.photo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">
                {driver.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Star size={12} fill="currentColor" />{" "}
                {driver.rating}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowChat(true)}
                className="p-3 bg-white rounded-xl shadow-sm hover:text-bds-red"
              >
                <MessageSquare size={20} />
              </button>
              <button className="p-3 bg-green-500 text-white rounded-xl shadow-sm">
                <Phone size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 shadow-sm">
              <button onClick={() => setShowChat(false)}>
                <ChevronLeft />
              </button>
              <h3 className="font-bold flex-1">
                {driver.name}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.sender === "me"
                      ? "self-end items-end"
                      : "items-start",
                  )}
                >
                  <div className={cn("flex items-end gap-2 mb-1 px-1", msg.sender === "me" ? "flex-row-reverse" : "flex-row")}>
                      <span className="text-xs text-gray-500 font-bold">{msg.sender === "me" ? "Moi" : "Livreur"}</span>
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm shadow-sm relative",
                      msg.sender === "me"
                        ? "bg-bds-red text-white rounded-tr-sm"
                        : "bg-white text-gray-800 rounded-tl-sm border border-gray-100",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <button className="p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </button>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm outline-none focus:bg-gray-100 transition-colors"
                placeholder="Écrivez votre message..."
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-bds-red text-white rounded-full shadow-lg shadow-red-200 hover:bg-red-700 transition-colors shrink-0"
              >
                <Navigation size={20} className="rotate-90" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Component: Orders History ---
export default function ClientTracking() {
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "active" | "history"
  >("history"); // Default to history to show pagination
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 30;

  const handleOrderClick = (order: any) => {
    if (activeTab === "active") {
      setSelectedOrder(order);
      setView("map");
    }
  };

  if (view === "map" && selectedOrder) {
    return (
      <LiveTrackingMap
        order={selectedOrder}
        onBack={() => setView("list")}
      />
    );
  }

  // Active Orders (Single Item)
  const activeOrders = ORDERS.slice(0, 1);

  // History Orders (Mock Long List)
  const baseHistory = [
    ...ORDERS.slice(1),
    {
      id: "CMD-OLD-1",
      status: "Livré",
      total: 15000,
      items: [
        { product: { name: "3x Pizza Royale" }, quantity: 1 },
      ],
      date: "01/02/2026",
    },
    {
      id: "CMD-OLD-2",
      status: "Annulé",
      total: 5000,
      items: [
        { product: { name: "2x Sandwich Thon" }, quantity: 1 },
      ],
      date: "28/01/2026",
    },
  ];
  // Duplicate to demonstrate pagination
  const historyOrders = [
    ...baseHistory,
    ...baseHistory,
    ...baseHistory,
  ].map((o, i) => ({ ...o, id: `${o.id}-${i}` }));

  const totalPages = Math.ceil(
    historyOrders.length / itemsPerPage,
  );
  const currentHistory = historyOrders.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Mes Commandes
          </h1>
          <p className="text-gray-500">
            Suivez vos commandes en cours et retrouvez votre
            historique.
          </p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "active"
                ? "bg-black text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50",
            )}
          >
            En cours (1)
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "history"
                ? "bg-black text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50",
            )}
          >
            Historique
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "active" ? (
          // Active Orders List (No Pagination)
          <div className="grid gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order)}
                className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-bds-red cursor-pointer hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-bds-red group-hover:scale-110 transition-transform">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        En cours de livraison
                      </h3>
                      <p className="text-sm text-gray-500">
                        Arrivée estimée : 12:45
                      </p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-bds-red px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    EN DIRECT
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      Commande {order.id}
                    </span>
                    <span className="font-bold">
                      {order.total} FCFA
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {order.items
                      .map(
                        (i) =>
                          `${i.quantity}x ${i.product.name}`,
                      )
                      .join(", ")}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-bds-red group-hover:translate-x-1 transition-transform">
                  Suivre sur la carte <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // History List (Paginated)
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {currentHistory.map((order, idx) => (
                <div
                  key={idx}
                  className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {order.status === "Livré" ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between md:justify-start md:gap-4 items-center mb-1">
                      <h4 className="font-bold text-gray-900">
                        {order.id}
                      </h4>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                          order.status === "Livré"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700",
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {order.date} • {order.items.length}{" "}
                      articles
                    </p>
                    <p className="text-sm text-gray-900 font-medium truncate max-w-md">
                      {order.items
                        .map(
                          (i: any) =>
                            `${i.quantity}x ${i.product.name}`,
                        )
                        .join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 md:justify-end w-full md:w-auto mt-4 md:mt-0">
                    <span className="font-bold text-gray-900">
                      {order.total} FCFA
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        title="Télécharger reçu"
                      >
                        <FileText size={18} />
                      </button>
                      <BDSButton
                        variant="outline"
                        className="h-9 text-xs"
                      >
                        Recommander
                      </BDSButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stylish Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() =>
                    setHistoryPage((p) => Math.max(1, p - 1))
                  }
                  disabled={historyPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-bds-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                  {Array.from({ length: totalPages }).map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setHistoryPage(i + 1)}
                        className={cn(
                          "w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                          historyPage === i + 1
                            ? "bg-bds-red text-white shadow-md scale-105"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        {i + 1}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setHistoryPage((p) =>
                      Math.min(totalPages, p + 1),
                    )
                  }
                  disabled={historyPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-bds-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
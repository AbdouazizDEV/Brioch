import { LucideIcon, Croissant, Coffee, Sandwich, Cake, MapPin, Bike, Clock, ChefHat, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Viennoiseries" | "Pains" | "Pâtisseries" | "Sandwichs" | "Boissons";
  image: string;
  available: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  isOpen: boolean;
  hours: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  hasDelivery: boolean;
  hasClickCollect: boolean;
  coordinates: { lat: number, lng: number };
}

export interface Order {
  id: string;
  date: string; // ISO or formatted
  status: "Validée" | "En préparation" | "En livraison" | "Livrée" | "Annulée";
  total: number;
  items: { product: Product; quantity: number }[];
  deliveryMode: "Livraison" | "Click & Collect";
  address?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  driverId?: string;
  storeId: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  status: "En service" | "Hors ligne" | "Occupé";
  deliveriesToday: number;
  rating: number;
  photo: string;
  vehicle: "Moto" | "Voiture" | "Vélo";
}

export interface Notification {
  id: string;
  type: "order" | "system" | "alert" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// --- DATA ---

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Croissant au Beurre",
    description: "Le classique pur beurre, croustillant et fondant. Préparé chaque matin.",
    price: 800,
    category: "Viennoiseries",
    image: "https://images.unsplash.com/photo-1733754348873-feeb45df3bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBjcm9pc3NhbnRzJTIwcGFzdHJ5fGVufDF8fHx8MTc3MDA4MjYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
    rating: 4.9,
    reviews: 124,
  },
  {
    id: "2",
    name: "Pain au Chocolat",
    description: "Feuilletage doré et barres de chocolat riche. Un délice pour le petit-déjeuner.",
    price: 900,
    category: "Viennoiseries",
    image: "https://images.unsplash.com/photo-1605273617377-5264b38d414a?auto=format&fit=crop&q=80&w=800",
    available: true,
    rating: 4.8,
    reviews: 98,
  },
  {
    id: "3",
    name: "Baguette Tradition",
    description: "La baguette à la française, mie alvéolée et croûte croustillante.",
    price: 500,
    category: "Pains",
    image: "https://images.unsplash.com/photo-1728670212431-ac192413f4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBiYWd1ZXR0ZSUyMGJyZWFkfGVufDF8fHx8MTc3MDA4MjYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
    rating: 4.7,
    reviews: 215,
  },
  {
    id: "4",
    name: "Sandwich Poulet Crudités",
    description: "Baguette fraîche, poulet rôti, mayonnaise maison, tomates et salade.",
    price: 2500,
    category: "Sandwichs",
    image: "https://images.unsplash.com/photo-1768854592371-1042a977798a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGJhZ3VldHRlJTIwZnJlc2h8ZW58MXx8fHwxNzcwMDgyNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
    rating: 4.6,
    reviews: 87,
  },
  {
    id: "5",
    name: "Opéra Chocolat Café",
    description: "Biscuit Joconde, ganache chocolat, crème au beurre café. L'élégance à la française.",
    price: 3500,
    category: "Pâtisseries",
    image: "https://images.unsplash.com/photo-1640794334523-b299f14d28db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW5jeSUyMGNob2NvbGF0ZSUyMGNha2V8ZW58MXx8fHwxNzcwMDgyNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
    rating: 4.9,
    reviews: 56,
  },
  {
    id: "6",
    name: "Éclair Pistache",
    description: "Pâte à choux, crème pâtissière pistache, glaçage fondant.",
    price: 2000,
    category: "Pâtisseries",
    image: "https://images.unsplash.com/photo-1628193073787-8d05267823f0?auto=format&fit=crop&q=80&w=800",
    available: true,
    rating: 4.8,
    reviews: 42,
    isNew: true,
  },
  {
    id: "7",
    name: "Pain de Campagne",
    description: "Pain rustique au levain, longue conservation.",
    price: 1200,
    category: "Pains",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    available: true,
    rating: 4.7,
    reviews: 30,
  },
  {
    id: "8",
    name: "Jus d'Orange Pressé",
    description: "33cl. Oranges fraîches locales pressées à la demande.",
    price: 1500,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800",
    available: true,
    rating: 4.9,
    reviews: 210,
  },
  {
    id: "9",
    name: "Coca Cola",
    description: "33cl. Canette fraîche.",
    price: 800,
    category: "Boissons",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
    available: true,
    rating: 4.5,
    reviews: 100,
  },
];

export const STORES: Store[] = [
  {
    id: "1",
    name: "Brioche Dorée Almadies",
    address: "Route des Almadies, Dakar",
    city: "Dakar",
    distance: "1.2 km",
    isOpen: true,
    hours: "07:00 - 23:00",
    image: "https://images.unsplash.com/photo-1761926271613-4f64d38cd83a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBzdG9yZWZyb250JTIwbW9kZXJufGVufDF8fHx8MTc3MDA4MjYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "30-45 min",
    hasDelivery: true,
    hasClickCollect: true,
    coordinates: { lat: 14.745, lng: -17.510 },
  },
  {
    id: "2",
    name: "Brioche Dorée Plateau",
    address: "Avenue Pompidou, Dakar-Plateau",
    city: "Dakar",
    distance: "5.4 km",
    isOpen: true,
    hours: "06:30 - 22:00",
    image: "https://images.unsplash.com/photo-1672749103540-6eb52167fecf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvciUyMGNvenl8ZW58MXx8fHwxNzcwMDgyNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 189,
    deliveryTime: "40-55 min",
    hasDelivery: true,
    hasClickCollect: true,
    coordinates: { lat: 14.670, lng: -17.430 },
  },
  {
    id: "3",
    name: "Brioche Dorée Mermoz",
    address: "Avenue Cheikh Anta Diop",
    city: "Dakar",
    distance: "2.8 km",
    isOpen: true,
    hours: "07:00 - 22:00",
    image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: 156,
    deliveryTime: "25-40 min",
    hasDelivery: true,
    hasClickCollect: true,
    coordinates: { lat: 14.710, lng: -17.470 },
  },
  {
    id: "4",
    name: "Brioche Dorée Point E",
    address: "Rue de l'Est, Point E",
    city: "Dakar",
    distance: "3.5 km",
    isOpen: false,
    hours: "07:00 - 21:00",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 98,
    deliveryTime: "35-50 min",
    hasDelivery: true,
    hasClickCollect: true,
    coordinates: { lat: 14.700, lng: -17.460 },
  },
];

export const DRIVERS: Driver[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `DRIVER-${i + 1}`,
  name: ["Amadou Ndiaye", "Moussa Diop", "Cheikh Fall", "Ibrahima Sow", "Abdoulaye Wade", "Babacar Sy", "Oumar Gueye", "Lamine Sané", "Modou Lo", "Youssou Ndour", "Ismaila Sarr", "Sadio Mané", "Kalidou Koulibaly", "Edouard Mendy", "Idrissa Gueye", "Cheikhou Kouyaté", "Famara Diédhiou", "Bamba Dieng", "Pape Gueye", "Nampalys Mendy"][i],
  phone: `+221 77 ${100 + i} ${20 + i} ${30 + i}`,
  status: i < 15 ? "En service" : (i < 18 ? "Occupé" : "Hors ligne"),
  deliveriesToday: Math.floor(Math.random() * 15) + 1,
  rating: (4 + Math.random()).toFixed(1) as unknown as number,
  photo: `https://randomuser.me/api/portraits/men/${20 + i}.jpg`,
  vehicle: i % 3 === 0 ? "Voiture" : "Moto"
}));

// Helper to generate orders
const generateOrders = (count: number): Order[] => {
  const statuses = ["Validée", "En préparation", "En livraison", "Livrée", "Annulée"] as const;
  const modes = ["Livraison", "Click & Collect"] as const;
  const customers = [
    { name: "Fatou Diop", phone: "+221 77 123 45 67" },
    { name: "Ibrahima Sow", phone: "+221 76 987 65 43" },
    { name: "Aminata Faye", phone: "+221 70 111 22 33" },
    { name: "Moussa Koné", phone: "+221 77 555 66 77" },
    { name: "Aïssatou Ba", phone: "+221 78 444 33 22" },
    { name: "Ousmane Diallo", phone: "+221 76 222 11 00" },
    { name: "Jean Dupont", phone: "+221 77 000 00 00" }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const store = STORES[Math.floor(Math.random() * STORES.length)];
    const itemsCount = Math.floor(Math.random() * 4) + 1;
    const items = Array.from({ length: itemsCount }).map(() => ({
      product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
      quantity: Math.floor(Math.random() * 3) + 1
    }));
    const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    
    // Date: mix of today and past few days
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 48));
    const formattedDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

    return {
      id: `BDS-${String(100 + i).padStart(3, '0')}`,
      date: formattedDate,
      status,
      total,
      items,
      deliveryMode: mode,
      address: mode === 'Livraison' ? `${['Mermoz', 'Almadies', 'Plateau', 'Point E'][Math.floor(Math.random()*4)]}, Rue ${Math.floor(Math.random()*20)}` : undefined,
      customer,
      driverId: status === 'En livraison' || status === 'Livrée' ? DRIVERS[Math.floor(Math.random() * DRIVERS.length)].id : undefined,
      storeId: store.id
    };
  }).sort((a, b) => (a.status === 'Validée' ? -1 : 1)); // Validée first
};

export const ORDERS = generateOrders(50);

export const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "order", title: "Nouvelle commande #BDS-089", message: "Almadies - 12 450 FCFA", time: "il y a 2 min", read: false },
  { id: "2", type: "system", title: "Commande #BDS-087 livrée", message: "Mermoz par Mamadou", time: "il y a 15 min", read: false },
  { id: "3", type: "alert", title: "Retard Livreur Mamadou", message: "Commande #BDS-085 (+15min)", time: "il y a 32 min", read: true },
  { id: "4", type: "info", title: "Mise à jour système", message: "Maintenance prévue ce soir", time: "il y a 2h", read: true },
  { id: "5", type: "order", title: "Annulation commande", message: "#BDS-082 par client", time: "il y a 3h", read: true },
  { id: "6", type: "order", title: "Nouvelle commande #BDS-090", message: "Plateau - 5 600 FCFA", time: "il y a 4h", read: true },
  { id: "7", type: "system", title: "Rapport journalier prêt", message: "Consultez vos statistiques", time: "il y a 5h", read: true },
  { id: "8", type: "info", title: "Nouveau produit ajouté", message: "Éclair Pistache disponible", time: "Hier", read: true },
];

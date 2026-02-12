import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { BDSButton } from "@/app/components/shared/BDSButton";
import { User, Truck, Briefcase, Eye, EyeOff, Check, AlertCircle, ArrowRight, ArrowLeft, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Components ---

const LogoBDS = ({ size = "large" }: { size?: "small" | "large" }) => (
  <div className={cn("flex flex-col items-center justify-center", size === "large" ? "scale-100" : "scale-75")}>
    <img 
      src="https://res.cloudinary.com/dhivn2ahm/image/upload/v1770252228/11142089-18498954_f2kodz.webp" 
      alt="Brioche Dorée" 
      className={cn("object-contain rounded-2xl", size === "large" ? "h-44" : "h-24")}
    />
  </div>
);

const RolePill = ({ role, selected, onClick, icon: Icon, label }: any) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all w-full h-32 gap-3",
      selected 
        ? "bg-bds-red border-bds-red text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] scale-105" 
        : "bg-transparent border-gray-200 text-gray-400 hover:border-bds-red hover:text-bds-red bg-white"
    )}
  >
    <Icon size={32} />
    <span className="font-bold text-sm">{label}</span>
  </motion.button>
);

const InputField = ({ label, type = "text", placeholder, icon: Icon }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input 
          type={isPassword && showPassword ? "text" : type} 
          placeholder={placeholder}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-bds-red focus:ring-1 focus:ring-bds-red transition-all bg-gray-50/50"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Screens ---

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-bds-cream to-white flex flex-col items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <LogoBDS />
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-gray-500 font-sans text-sm tracking-wide"
      >
        Plateforme Digitale Intégrée v2.0
      </motion.p>
      
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-bds-red"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function LoginScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"client" | "livreur" | "preparateur" | "manager" | "store-manager">("client");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = () => {
    // Simulate login
    if (role === "client") navigate("/client");
    else if (role === "livreur") navigate("/livreur");
    else if (role === "preparateur") navigate("/cuisine");
    else if (role === "manager") navigate("/admin");
    else if (role === "store-manager") navigate("/store-manager");
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-bds-cream relative items-center justify-center overflow-hidden p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-lg"
        >
           <LogoBDS size="large" />
           <h2 className="mt-12 font-serif text-4xl text-bds-black leading-tight">La brioche dorée<br/>Sénégal</h2>
           <p className="mt-6 text-lg text-gray-600 leading-relaxed">
             Une expérience unifiée pour nos clients et livreurs. Bienvenue dans l'ère v2.0.
           </p>
           
           <div className="mt-12 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <img src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80" alt="Bakery" className="object-cover w-full h-full" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
               <p className="text-white font-serif italic text-xl">"L'art de vivre à la sénégalais"</p>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center bg-white relative">
        <button 
          onClick={() => navigate('/')} 
          className="absolute top-6 left-6 lg:top-8 lg:left-8 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-bds-red transition-colors z-20 group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <motion.div
          key={isRegistering ? "register" : "login"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div>
            <h2 className="font-serif text-3xl text-bds-black mb-2">
              {isRegistering ? "Créer un compte" : "Connexion"}
            </h2>
            <p className="text-gray-500">
              {isRegistering ? "Rejoignez la communauté Brioche Dorée" : "Accédez à votre espace personnel"}
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Je suis :</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <RolePill 
                role="client" 
                label="Client" 
                icon={User} 
                selected={role === "client"} 
                onClick={() => setRole("client")} 
              />
              <RolePill 
                role="livreur" 
                label="Livreur" 
                icon={Truck} 
                selected={role === "livreur"} 
                onClick={() => setRole("livreur")} 
              />
              <RolePill 
                role="preparateur" 
                label="Cuisine" 
                icon={ChefHat} 
                selected={role === "preparateur"} 
                onClick={() => setRole("preparateur")} 
              />
              <RolePill 
                role="store-manager" 
                label="Manager Boutique" 
                icon={Briefcase} 
                selected={role === "store-manager"} 
                onClick={() => setRole("store-manager")} 
              />
              <RolePill 
                role="manager" 
                label="Super Admin" 
                icon={Eye} 
                selected={role === "manager"} 
                onClick={() => setRole("manager")} 
              />
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Prénom" placeholder="Mamadou" />
                <InputField label="Nom" placeholder="Diop" />
              </div>
            )}
            
            <InputField label={role === 'manager' || role === 'store-manager' ? "Identifiant" : "Email ou Téléphone"} placeholder={role === 'manager' ? "admin.bds" : role === 'store-manager' ? "manager.almadies" : "+221 77 000 00 00"} />
            <InputField label="Mot de passe" type="password" placeholder="••••••••" />
            
            {isRegistering && role === "livreur" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <h4 className="font-bold text-sm">Informations Livreur</h4>
                <div className="flex gap-2">
                   <select className="w-1/2 h-10 px-3 rounded-lg border border-gray-200 text-sm"><option>Moto</option><option>Scooter</option><option>Vélo</option></select>
                   <div className="w-1/2 h-10 px-3 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:border-bds-red">Upload Permis</div>
                </div>
              </motion.div>
            )}

            {!isRegistering && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-bds-red focus:ring-bds-red" />
                  <span className="text-gray-600">Se souvenir de moi</span>
                </label>
                <button type="button" className="text-bds-red hover:underline font-medium">Mot de passe oublié ?</button>
              </div>
            )}

            <BDSButton size="lg" className="w-full shadow-bds-cta h-14 text-lg font-bold" onClick={handleLogin}>
              {isRegistering ? "Créer mon compte" : "Se connecter"} <ArrowRight className="ml-2" />
            </BDSButton>
          </form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
              <button 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="ml-2 text-bds-black font-bold hover:underline"
              >
                {isRegistering ? "Se connecter" : "S'inscrire"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(location.pathname === "/");

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      {!showSplash && <LoginScreen />}
    </>
  );
}
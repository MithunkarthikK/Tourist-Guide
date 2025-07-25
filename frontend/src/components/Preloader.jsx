import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0c0c0c] to-black text-white">
      {/* Outer glow aura */}
      <motion.div
        className="absolute w-52 h-52 rounded-full bg-orange-500 blur-3xl opacity-10"
        animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Ripple + pin icon */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Ripple animation */}
        {[0, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="absolute bottom-2 w-16 h-16 rounded-full border border-orange-500/30"
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Floating Pin Icon */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter: "drop-shadow(0 0 10px rgba(255, 115, 0, 0.6))",
          }}
        >
          <MapPin className="w-16 h-16 text-orange-500 drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Text animation */}
      <motion.p
        className="mt-6 text-base md:text-lg font-medium tracking-wider text-orange-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Finding the best spots in Tamil Nadu...
      </motion.p>
    </div>
  );
};

export default Preloader;

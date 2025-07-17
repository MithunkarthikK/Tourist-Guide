import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <motion.div
        className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: '0 0 20px #ff6a00, 0 0 40px #ff6a00, 0 0 60px #ff6a00',
        }}
      ></motion.div>
    </div>
  );
};

export default Preloader;

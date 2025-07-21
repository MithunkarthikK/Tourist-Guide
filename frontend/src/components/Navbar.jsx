import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-[#121212] text-white px-6 py-4 shadow-md fixed top-0 w-full z-50 border-b border-[#222]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide glow-text-orange">
          Tourist Guide
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              className="hover:text-orange-400 transition-all duration-200"
            >
              <Link to={link.path}>{link.name}</Link>
            </motion.div>
          ))}

          {/* Login Button */}
          <Link
            to="/login"
            className="ml-4 px-4 py-1 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-200 glow-box-orange"
          >
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-4 px-2 space-y-2">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              className="hover:text-orange-400 text-base border-b border-[#222] py-1"
            >
              <Link to={link.path} onClick={() => setOpen(false)}>
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* Mobile Login Button */}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-2 text-center rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-200 glow-box-orange"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

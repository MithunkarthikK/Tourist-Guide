import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Info, Phone, LogIn, LogOut, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "./SearchContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const navLinks = [
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-[#121212] text-white px-4 py-3 shadow-md fixed top-0 w-full z-50 border-b border-[#222]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-wide glow-text-orange"
        >
          <MapPin size={22} className="text-orange-400" />
          <span className="hidden sm:inline">Tourist Guide</span>
        </Link>

        {/* Search bar (hidden on login/register) */}
        {!isAuthPage && (
          <form
            onSubmit={handleSearch}
            className="flex-grow px-4 flex justify-center"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city..."
              className="w-full max-w-md px-3 py-1.5 rounded-md bg-[#1c1c1c] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </form>
        )}

        {/* Desktop Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center space-x-4 text-base">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 hover:text-orange-400 transition-all duration-200"
              >
                {link.icon}
                <Link to={link.path}>{link.name}</Link>
              </motion.div>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1c1c1c] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#1c1c1c] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
              >
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        )}

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && !isAuthPage && (
        <div className="md:hidden mt-4 px-4 space-y-4 pb-4">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 text-base border-b border-[#333] py-2 hover:text-orange-400"
            >
              {link.icon}
              <Link to={link.path} onClick={() => setOpen(false)}>
                {link.name}
              </Link>
            </motion.div>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-2 text-center rounded-md bg-[#1c1c1c] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-2 text-center rounded-md bg-[#1c1c1c] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

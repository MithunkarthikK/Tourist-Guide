import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0c0c0c] text-gray-300 py-8 border-t border-white/10 mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand + Credit */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-white">Tamil Nadu Tourist Guide</h3>
          <p className="text-sm mt-1">Made with ❤️ by K Mithunkarthik</p>
          <p className="text-xs mt-1 text-gray-500">© {new Date().getFullYear()} All rights reserved</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-5 text-white text-xl">
          <a href="https://github.com/MithunkarthikK" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/k-mithunkarthik" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

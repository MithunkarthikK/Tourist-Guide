import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ENV API
const API_URL = import.meta.env.VITE_API_URL;

const DistrictCard = ({ district }) => {
  const navigate = useNavigate();
  const { id, name, description, image } = district;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-2xl p-4 bg-[#1f1f1f] transition-shadow duration-300 hover:shadow-[0_0_25px_#ff8c00] cursor-pointer"
      onClick={() => navigate(`/places/${id}`)}
    >
      <img
        src={image || "https://via.placeholder.com/300"}
        alt={name}
        className="rounded-xl w-full h-48 object-cover mb-4"
      />
      <h2 className="text-xl font-semibold mb-1">{name}</h2>
      <p className="text-sm text-gray-300">{description}</p>
    </motion.div>
  );
};

const ShimmerCard = () => (
  <div className="rounded-2xl p-4 bg-[#1f1f1f] animate-pulse">
    <div className="w-full h-48 bg-gray-700 rounded-xl mb-4" />
    <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
    <div className="h-3 w-full bg-gray-600 rounded" />
  </div>
);

const Home = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("top");
  const [loading, setLoading] = useState(true);

  const topCities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Kanyakumari", "Salem"];

  const regions = ["Central", "North", "South", "West"];

  useEffect(() => {
    axios
      .get(`${API_URL}/destinations/`)
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Error fetching districts:", err))
      .finally(() => setLoading(false));
  }, []);

  const getFilteredDistricts = () => {
    if (selectedRegion === "top") {
      return districts.filter((d) => topCities.includes(d.name));
    }
    return districts.filter((d) => d.region === selectedRegion);
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white px-4 py-10 pt-20 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide glow-text-orange">
          Discover Tamil Nadu — Culture. Nature. Legacy.
        </h1>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedRegion === region
                ? "bg-white text-black border-white"
                : "text-gray-400 border-gray-500 hover:bg-white hover:text-black"
            }`}
          >
            {region}
          </button>
        ))}
        <button
          onClick={() => setSelectedRegion("top")}
          className={`px-4 py-2 rounded-full border text-sm transition ${
            selectedRegion === "top"
              ? "bg-white text-black border-white"
              : "text-gray-400 border-gray-500 hover:bg-white hover:text-black"
          }`}
        >
          🔥 Top Cities
        </button>
      </div>

      {/* Grid: District Cards or Loading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <ShimmerCard key={idx} />)
          : getFilteredDistricts().map((district) => (
              <DistrictCard key={district.id} district={district} />
            ))}
      </div>
    </div>
  );
};

export default Home;

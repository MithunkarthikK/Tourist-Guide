import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../components/SearchContext";

const API_URL = import.meta.env.VITE_API_URL;

const trendingCities = ["Chennai", "Madurai", "Tiruchirappalli"];
const topCities = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Kanyakumari",
  "Salem",
];

const DistrictCard = ({ district }) => {
  const navigate = useNavigate();
  const { id, name, description, image } = district;
  const isTrending = trendingCities.includes(name);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/places/${id}`)}
      className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer shadow-md hover:shadow-lg hover:border-white/20 transition-all"
    >
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/300"}
          alt={name}
          className="w-full h-44 object-cover rounded-lg mb-4"
        />
        {isTrending && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            ⭐ Trending
          </span>
        )}
      </div>
      <h2 className="text-lg font-semibold text-white mb-1">{name}</h2>
      <p className="text-sm text-gray-300 line-clamp-3">{description}</p>
    </motion.div>
  );
};

const ShimmerCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
    <div className="w-full h-44 bg-gray-700 rounded-lg mb-4" />
    <div className="h-4 w-3/4 bg-gray-600 rounded mb-2" />
    <div className="h-3 w-full bg-gray-600 rounded" />
  </div>
);

const Home = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/destinations/`)
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Error fetching districts:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = districts
    .filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aTrending = trendingCities.includes(a.name);
      const bTrending = trendingCities.includes(b.name);
      if (aTrending && !bTrending) return -1;
      if (!aTrending && bTrending) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-[#101010] min-h-screen px-4 sm:px-6 md:px-10 py-20 text-white font-sans">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          {searchTerm ? "Search Results" : "Top Cities of Tamil Nadu"}
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {searchTerm
            ? "Explore cities matching your search."
            : "Discover iconic cities filled with culture, history, and beauty."}
        </p>
        {searchTerm && (
          <p className="mt-2 text-yellow-400">
            Showing results for: <strong>{searchTerm}</strong>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <ShimmerCard key={idx} />)
          : filteredDistricts.length > 0
          ? filteredDistricts.map((district) => (
              <DistrictCard key={district.id} district={district} />
            ))
          : (
            <div className="col-span-full text-center text-gray-400">
              No results found for "{searchTerm}".
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [districts, setDistricts] = useState([]);
  const [view, setView] = useState("top"); // "top" or "region"

  useEffect(() => {
    axios.get("http://localhost:8000/api/destinations/")
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const topCities = ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"];

  const groupedByRegion = districts.reduce((acc, dist) => {
    if (!acc[dist.region]) acc[dist.region] = [];
    acc[dist.region].push(dist);
    return acc;
  }, {});

  return (
    <div className="bg-[#121212] min-h-screen text-white px-6 py-10 pt-20 px-4 font-sans">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide glow-text-orange">
          Discover Tamil Nadu — Culture. Nature. Legacy.
        </h1>
      </div>

      {/* Toggle Toolbar */}
      <div className="flex justify-center gap-8 mb-10 text-lg font-medium">
        <span
          className={`cursor-pointer px-2 transition-colors ${
            view === "top" ? "text-orange-400 underline" : "text-gray-400"
          }`}
          onClick={() => setView("top")}
        >
          🔥 Top Picks
        </span>
        <span
          className={`cursor-pointer px-2 transition-colors ${
            view === "region" ? "text-orange-400 underline" : "text-gray-400"
          }`}
          onClick={() => setView("region")}
        >
          🌍 Regions
        </span>
      </div>

      {/* Top Cities View */}
      {view === "top" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {districts
            .filter((d) => topCities.includes(d.name))
            .map((d, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl p-4 bg-[#1f1f1f] transition-shadow duration-300 hover:shadow-[0_0_25px_#ff8c00]"
              >
                <img
                  src={d.image || "https://via.placeholder.com/300"}
                  alt={d.name}
                  className="rounded-xl w-full h-48 object-cover mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{d.name}</h2>
                <p className="text-sm text-gray-300">{d.description}</p>
              </motion.div>
            ))}
        </div>
      ) : (
        // Region Grid
        Object.entries(groupedByRegion).map(([region, items]) => (
          <div key={region} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">{region} Region</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((d, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl p-4 bg-[#1f1f1f] transition-shadow duration-300 hover:shadow-[0_0_25px_#ff8c00]"
                >
                  <img
                    src={d.image || "https://via.placeholder.com/300"}
                    alt={d.name}
                    className="rounded-xl w-full h-48 object-cover mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-1">{d.name}</h2>
                  <p className="text-sm text-gray-300">{d.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;

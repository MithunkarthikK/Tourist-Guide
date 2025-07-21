import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Shimmer UI while loading
const ShimmerCard = () => (
  <div className="animate-pulse bg-[#1f1f1f] rounded-xl p-4 h-64">
    <div className="bg-gray-700 h-40 w-full mb-4 rounded-lg"></div>
    <div className="h-4 bg-gray-600 mb-2 rounded w-3/4"></div>
    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
  </div>
);

// Card for a place
const PlaceCard = ({ districtName, place }) => (
  <Link
    to={`/places/${districtName}/${encodeURIComponent(place.name)}`}
    className="block bg-[#1f1f1f] rounded-xl p-4 hover:shadow-[0_0_20px_#ff8c00] transition duration-200"
  >
    <img
      src={place.image || "https://via.placeholder.com/300"}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/300";
      }}
      alt={place.name}
      className="w-full h-48 object-cover rounded-lg mb-3"
    />
    <h3 className="text-xl font-semibold truncate">{place.name}</h3>
    <p className="text-sm text-gray-400 line-clamp-3">
      {place.description?.slice(0, 80) || "No description available"}...
    </p>
  </Link>
);

const Places = () => {
  const { id } = useParams(); // id is district name
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/destinations/`)
      .then((res) => {
        const matched = res.data.find(
          (d) => d.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
        );
        if (!matched) {
          setError("District not found.");
        } else {
          setDistrict(matched);
        }
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="text-red-500 p-10 text-center text-lg">
        {error || "No data found."}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-6 py-12 font-sans">
      <h1 className="text-3xl font-bold text-orange-400 mb-6">
        {district.name} — Explore the Hidden & Famous
      </h1>

      {/* Popular */}
      {district.popular_places?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-orange-300">🌟 Popular Places</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {district.popular_places.map((place, idx) => (
              <PlaceCard key={idx} districtName={district.name} place={place} />
            ))}
          </div>
        </section>
      )}

      {/* Hidden */}
      {district.hidden_places?.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-300">🕵 Hidden Gems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {district.hidden_places.map((place, idx) => (
              <PlaceCard key={idx} districtName={district.name} place={place} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Places;

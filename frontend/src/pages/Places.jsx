import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ShimmerCard = () => (
  <div className="animate-pulse bg-[#1e1e1e] rounded-xl p-4 h-64 border border-gray-700 shadow-inner">
    <div className="bg-gray-700 h-40 w-full mb-4 rounded-md"></div>
    <div className="h-4 bg-gray-600 mb-2 rounded w-3/4"></div>
    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
  </div>
);

const PlaceCard = ({ districtName, place }) => (
  <Link
    to={`/places/${districtName}/${encodeURIComponent(place.name)}`}
    className="block bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-4 hover:border-orange-500 hover:shadow-orange-400/20 hover:shadow-md transition duration-300"
  >
    <img
      src={place.image || "https://via.placeholder.com/300"}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/300";
      }}
      alt={place.name}
      className="w-full h-40 object-cover rounded-md mb-3"
    />
    <h3 className="text-lg font-semibold text-white truncate">{place.name}</h3>
    <p className="text-sm text-gray-400 mt-1 line-clamp-3">
      {place.description?.slice(0, 100) || "No description available"}...
    </p>
  </Link>
);

const Places = () => {
  const { id } = useParams();
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
        matched ? setDistrict(matched) : setError("District not found.");
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#121212] text-white min-h-screen px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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

  const popularFiltered = district.popular_places || [];
  const hiddenFiltered = district.hidden_places || [];

  return (
    <div className="bg-[#121212] text-white min-h-screen px-6 py-12 font-sans">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white drop-shadow-sm">
          <MapPin className="text-orange-400" />
          {district.name} — Places to Explore
        </h1>
        <Link
          to="/"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 bg-[#1b1b1b] text-white hover:border-orange-500 hover:text-orange-400 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-orange-400">
          🌟 Popular Places
        </h2>
        {popularFiltered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularFiltered.map((place, idx) => (
              <PlaceCard key={idx} districtName={district.name} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No popular places found.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-orange-400">
          🔍 Hidden Gems
        </h2>
        {hiddenFiltered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hiddenFiltered.map((place, idx) => (
              <PlaceCard key={idx} districtName={district.name} place={place} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No hidden gems found.</p>
        )}
      </section>
    </div>
  );
};

export default Places;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PlaceDetails = () => {
  const { id, placeName } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/destinations/`)
      .then((res) => {
        const district = res.data.find(
          (d) => d.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
        );

        if (!district) {
          setError("District not found.");
          return;
        }

        const allPlaces = [...(district.popular_places || []), ...(district.hidden_places || [])];
        const found = allPlaces.find(
          (p) => p.name.toLowerCase() === decodeURIComponent(placeName).toLowerCase()
        );

        if (found) {
          setPlace({ ...found, districtName: district.name });
        } else {
          setError("Place not found.");
        }
      })
      .catch(() => setError("Failed to load place details."))
      .finally(() => setLoading(false));
  }, [id, placeName]);

  if (loading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-orange-400 animate-pulse">Loading Place Details...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="text-red-500 p-10 text-center text-lg bg-[#121212] min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white drop-shadow-sm">
            <MapPin className="text-orange-400" />
            {place.name}
          </h1>
          <Link
            to={`/places/${place.districtName}`}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 bg-[#1b1b1b] text-white hover:border-orange-500 hover:text-orange-400 transition"
          >
            ← Back to {place.districtName}
          </Link>
        </div>

        <img
          src={place.image || "https://via.placeholder.com/800x400"}
          alt={place.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/800x400";
          }}
          className="w-full h-64 md:h-96 object-cover rounded-xl border border-gray-800 mb-6 shadow-lg"
        />

        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2d2d2d] shadow-lg hover:shadow-orange-400/10 transition">
          <h2 className="text-xl font-semibold mb-3 text-orange-400">About {place.name}</h2>
          <p className="text-gray-300 leading-relaxed">
            {place.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;

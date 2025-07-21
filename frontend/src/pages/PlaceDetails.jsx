import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Load API from .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PlaceDetails = () => {
  const { districtId, placeName } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/destinations/${id}`);
        const districts = response.data;

        const matchedDistrict = districts.find(
          (d) => d.name.toLowerCase() === decodeURIComponent(districtId).toLowerCase()
        );

        if (!matchedDistrict) {
          setPlace(null);
          return;
        }

        const allPlaces = [
          ...(matchedDistrict?.popular_places || []),
          ...(matchedDistrict?.hidden_places || [])
        ];

        const decodedName = decodeURIComponent(placeName).trim().toLowerCase();

        const foundPlace = allPlaces.find(
          (p) => p.name?.trim().toLowerCase() === decodedName
        );

        setPlace(foundPlace || null);
      } catch (error) {
        console.error("Error fetching place:", error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [districtId, placeName]);

  if (loading) {
    return <div className="text-white text-center py-10 text-lg">Loading...</div>;
  }

  if (!place) {
    return (
      <div className="text-red-500 text-center py-10 text-lg">
        Place not found.
        <div className="mt-4">
          <Link
            to={`/places/${districtId}`}
            className="text-orange-400 hover:underline"
          >
            ← Back to District
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-6 py-12 font-sans">
      <Link
        to={`/places/${districtId}`}
        className="text-orange-400 hover:underline mb-6 inline-block"
      >
        ← Back to District
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-300 mb-6">{place.name}</h1>

        <img
          src={place.image || "https://via.placeholder.com/800x400"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/800x400";
          }}
          alt={place.name}
          className="w-full rounded-xl shadow mb-6 max-h-[400px] object-cover"
        />

        <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
          {place.description}
        </p>
      </div>
    </div>
  );
};

export default PlaceDetails;

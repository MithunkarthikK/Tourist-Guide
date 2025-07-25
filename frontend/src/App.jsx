import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
import PlaceDetails from "./pages/PlaceDetails";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import About from "./pages/About"
import Contact  from "./pages/Contact";
import Footer from "./pages/Footer";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <div className="bg-[#1c1c1e] min-h-screen text-white pt-7">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/places/:id" element={<Places />} />
            <Route path="/places/:id/:placeName" element={<PlaceDetails />} />

          </Routes>
          <Footer/>
        </div>
      )}
    </Router>
  );
}

export default App;

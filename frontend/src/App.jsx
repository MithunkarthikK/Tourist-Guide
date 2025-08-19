import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Places from "./pages/Places";
import PlaceDetails from "./pages/PlaceDetails";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";

function PrivateRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = !!sessionStorage.getItem("isAuthenticated"); 

  if (!isAuthenticated) {
    // Redirect to login, preserving current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/check_auth/", {
      credentials: "include",
    })
      .then((res) => {
        setIsAuthenticated(res.ok);
        if (res.ok) {
          sessionStorage.setItem("isAuthenticated", "true");
        } else {
          sessionStorage.removeItem("isAuthenticated");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    fetch("/api/logout/", { method: "POST", credentials: "include" }).then(() => {
      setIsAuthenticated(false);
      sessionStorage.removeItem("isAuthenticated");
    });
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="bg-[#1c1c1e] min-h-screen text-white pt-7">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        {/* Public routes accessible without login */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - require login */}
        <Route
          path="/places/:id"
          element={
            <PrivateRoute>
              <Places />
            </PrivateRoute>
          }
        />
        <Route
          path="/places/:id/:placeName"
          element={
            <PrivateRoute>
              <PlaceDetails />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = form;

    if (!username || !email || !password) {
      return toast.error("All fields are required!");
    }
    if (!isValidEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const text = await res.text();

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        return toast.error("Invalid response from server");
      }

      if (res.ok) {
        toast.success(data.message || "Registered successfully!");
        setForm({ username: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="bg-[#1c1c1c] text-white border border-[#2e2e2e] rounded-2xl w-full max-w-md p-8 shadow-md shadow-orange-500/10">
        <h2 className="text-3xl font-semibold mb-6 text-center">Create Account ✨</h2>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
              <User className="h-4 w-4" /> Full Name
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full bg-[#1f1f1f] border border-gray-600 rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
              disabled={isSubmitting}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full bg-[#1f1f1f] border border-gray-600 rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
              <Lock className="h-4 w-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full bg-[#1f1f1f] border border-gray-600 rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
                disabled={isSubmitting}
                required
                autoComplete="new-password"
              />
              <div
                className="absolute right-3 top-3 text-gray-400 cursor-pointer select-none"
                onClick={togglePassword}
                aria-label="Toggle password visibility"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && togglePassword()}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition font-medium ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:underline font-medium">
              Login
            </Link>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => toast("Google signup coming soon!")}
              className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm font-medium w-full"
              disabled={isSubmitting}
            >
              <FcGoogle size={20} />
              Sign Up with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

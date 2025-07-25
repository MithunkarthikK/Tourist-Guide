import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("All fields are required!");
    }

    // Replace with actual login API call
    toast.success("Logged in successfully!");
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-[#121212] min-h-screen flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="bg-[#1c1c1c] text-white border border-[#2e2e2e] rounded-2xl w-full max-w-md p-8 shadow-md shadow-orange-500/10">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
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
            />
          </div>

          <div className="relative">
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
              />
              <div
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition font-medium"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-400">
            Not registered?{" "}
            <Link
              to="/register"
              className="text-orange-400 hover:underline font-medium"
            >
              Create an account
            </Link>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => toast("Google signup coming soon!")}
              className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm font-medium w-full"
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

export default Login;

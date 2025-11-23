import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    field: "",
    goalHours: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      const response = await axios.post("https://studynsquare.onrender.com/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        field: form.field,
        goalHours: form.goalHours,
      });

      console.log("Signup response:", response.data);

      toast.success("Signup successful!");
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Signup failed");
      setMessage(error.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold text-[#5C6BC0] mb-6 text-center">
          Create Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Field of Study</label>
            <select
              name="field"
              value={form.field}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            >
              <option value="">Select</option>
              <option>Engineering</option>
              <option>Medicine</option>
              <option>Arts</option>
              <option>Commerce</option>
              <option>Science</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Daily Study Goal (hours)
            </label>
            <input
              type="number"
              name="goalHours"
              value={form.goalHours}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3C4F3]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-[#A3C4F3] to-[#D7BCE8] text-white py-2 rounded-full font-medium hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#5C6BC0] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

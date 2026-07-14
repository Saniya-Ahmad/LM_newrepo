import { useState } from "react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Registered successfully");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="form-card">
        <h2 className="text-2xl font-bold mb-2 text-slate-950 dark:text-slate-100">Create an account</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Register to submit license requests and view analytics</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">Create account</button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Already have an account? <a href="/" className="text-sky-600 hover:underline dark:text-sky-300">Sign in</a></p>
      </div>
    </div>
  );
}
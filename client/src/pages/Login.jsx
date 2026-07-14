import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        form
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      setUser(
        res.data.user
      );

      if (
        res.data.user.role ===
        "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="form-card">

        <div className="flex items-center gap-3 mb-4">

          <div className="h-10 w-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
            S
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
              Sign In
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access the dashboard
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">

              <input
                type="checkbox"
                className="h-4 w-4"
              />

              Remember me

            </label>

            <a
              href="#"
              className="text-sky-600 hover:underline dark:text-sky-300"
            >
              Forgot Password?
            </a>

          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Sign In
          </button>

        </form>
      </div>
    </div>
  );
}
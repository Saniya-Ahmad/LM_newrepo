import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthHeader() {
  const { user, logout, toggleTheme, theme } = useAuth();

  const location = useLocation();

  const isLogin = location.pathname === "/";
  const isRegister = location.pathname === "/register";

  return (
    <header className="shadow-xl transition-colors duration-300 bg-blue-600 dark:bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">

          <div
            className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center ${
              theme === "dark"
                ? "bg-white/10 ring-1 ring-white/20"
                : "bg-slate-100"
            }`}
          >
            <img
              src="/image.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>


          <div>
            <p className="text-base font-semibold tracking-wide">
              Software License Management
            </p>

            <p
              className={`text-sm ${
                theme === "dark"
                  ? "text-slate-400"
                  : "text-slate-200"
              }`}
            >
              License Analytics Dashboard
            </p>
          </div>

        </div>



        {/* Right Side */}

        <div className="flex items-center gap-3">


          {/* Login/Register Buttons */}

          {!user && (
            <>
              <Link
                to="/"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isLogin
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Login
              </Link>


              <Link
                to="/register"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isRegister
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Register
              </Link>
            </>
          )}



          {/* User Name */}

          {user && (
            <div className="rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white">
              {user.name || user.role || "Admin"}
            </div>
          )}



          {/* Logout for user */}

          {user && (
            <button
              onClick={logout}
              className="rounded-full px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}



          {/* Theme Toggle */}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>


        </div>

      </div>
    </header>
  );
}
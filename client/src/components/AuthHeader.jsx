import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthHeader() {
  const { user } = useAuth();
  const location = useLocation();

  const isLogin = location.pathname === "/";
  const isRegister = location.pathname === "/register";

  return (
    <header className="bg-blue-600 dark:bg-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
            <img
              src="/image.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              Software License Management
            </h1>
            <p className="text-sm text-slate-200 dark:text-slate-400">
              License Analytics Dashboard
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {!user && (
            <>
              <Link
                to="/"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isLogin
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  isRegister
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              {user.name || user.role || "Admin"}
            </span>
          )}

        </div>

      </div>
    </header>
  );
}
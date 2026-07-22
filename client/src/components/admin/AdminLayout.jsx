import { useEffect, useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [microsoftOpen, setMicrosoftOpen] = useState(true);
  const [matlabOpen, setMatlabOpen] = useState(true);
  const [mscOpen, setMscOpen] = useState(true);
  const [comsolOpen, setComsolOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user, theme, toggleTheme } = useAuth();
  const isDark = theme === "dark";

  const microsoftItems = [
    { label: "Dashboard", to: "/admin" },
    { label: "Lab-wise Licenses", to: "/admin/labwise-licenses" },
    { label: "License Details", to: "/admin/license-details" },
    { label: "Module Usage", to: "/admin/module-usage" },
    { label: "Module Visualization", to: "/admin/module-visualization" },
  ];

  const matlabItems = [
    { label: "Dashboard", to: "/admin/matlab" },
    { label: "Predictions", to: "/admin/matlab/predictions" },
  ];

  const mscItems = [
    { label: "Dashboard", to: "/admin/msc" },
    { label: "Predictions", to: "/admin/msc/predictions" },
  ];

  const comsolItems = [
    { label: "Dashboard", to: "/admin/comsol" },
    { label: "Predictions", to: "/admin/comsol/predictions" },
  ];

  const isActive = (path) => {
    switch (path) {
      case "/admin":
        return location.pathname === "/admin";

      case "/admin/matlab":
        return location.pathname === "/admin/matlab";

      case "/admin/msc":
        return location.pathname === "/admin/msc";

      case "/admin/comsol":
        return location.pathname === "/admin/comsol";

      default:
        return location.pathname === path;
    }
  };

  const linkClasses = (path, isMobile = false) => {
    const base =
      "block w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition";
    if (isActive(path)) {
      return `${base} bg-slate-900 text-white shadow`;
    }
    if (isMobile) {
      return `${base} text-slate-200 hover:bg-slate-800`;
    }
    return isDark
      ? `${base} text-slate-200 hover:bg-slate-800`
      : `${base} text-slate-700 hover:bg-slate-100`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {" "}
      <header
        className={`shadow-xl transition-colors duration-300 ${
          isDark ? "bg-slate-900 border-b border-slate-800" : "bg-blue-600"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-full overflow-hidden flex items-center justify-center ${isDark ? "bg-white/10" : "bg-slate-100"}`}
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
    isDark ? "text-sky-100" : "text-white-900"
  }`}
>
  Admin Workspace
</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20 md:hidden"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
            <div
              className={`rounded-full px-4 py-2 text-sm font-medium ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}
            >
              {user?.name || user?.role || "Admin"}
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 text-slate-100">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-3">
              <button
                type="button"
                onClick={() => setMicrosoftOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-slate-100 font-semibold"
              >
                <span>MICROSOFT</span>
                <span className="text-xs text-slate-400">
                  {microsoftOpen ? "Hide" : "Show"}
                </span>
              </button>
              {microsoftOpen && (
                <div className="mt-3 space-y-2">
                  {microsoftItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to, true)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-3">
              <button
                type="button"
                onClick={() => setMatlabOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-slate-100 font-semibold"
              >
                <span>MATLAB</span>
                <span className="text-xs text-slate-400">
                  {matlabOpen ? "Hide" : "Show"}
                </span>
              </button>
              {matlabOpen && (
                <div className="mt-3 space-y-2">
                  {matlabItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to, true)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-3">
              <button
                type="button"
                onClick={() => setMscOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-slate-100 font-semibold"
              >
                <span>MSC</span>
                <span className="text-xs text-slate-400">
                  {mscOpen ? "Hide" : "Show"}
                </span>
              </button>
              {mscOpen && (
                <div className="mt-3 space-y-2">
                  {mscItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to, true)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-3">
              <button
                type="button"
                onClick={() => setComsolOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-slate-100 font-semibold"
              >
                <span>COMSOL</span>
                <span className="text-xs text-slate-400">
                  {comsolOpen ? "Hide" : "Show"}
                </span>
              </button>
              {comsolOpen && (
                <div className="mt-3 space-y-2">
                  {comsolItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to, true)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex min-h-[calc(100vh-5rem)]">
        <aside
          className={`hidden md:flex flex-col w-80 shrink-0 border-r px-4 py-6 ${isDark ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-white"}`}
        >
          <div
            className={`flex items-center gap-3 pb-6 border-b mb-6 ${isDark ? "border-slate-800" : "border-slate-200"}`}
          >
            <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p
                className={`text-base font-semibold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}
              >
                License Analytics
              </p>
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Admin workspace
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`rounded-3xl border p-3 ${isDark ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <button
                type="button"
                onClick={() => setMicrosoftOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}
              >
                <span>MICROSOFT</span>
                <span className="text-xs text-slate-400">
                  {microsoftOpen ? "Hide" : "Show"}
                </span>
              </button>

              {microsoftOpen && (
                <div className="mt-3 space-y-2">
                  {microsoftItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`rounded-3xl border p-3 ${isDark ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <button
                type="button"
                onClick={() => setMatlabOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}
              >
                <span>MATLAB</span>
                <span className="text-xs text-slate-400">
                  {matlabOpen ? "Hide" : "Show"}
                </span>
              </button>

              {matlabOpen && (
                <div className="mt-3 space-y-2">
                  {matlabItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`rounded-3xl border p-3 ${isDark ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <button
                type="button"
                onClick={() => setMscOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}
              >
                <span>MSC</span>
                <span className="text-xs text-slate-400">
                  {mscOpen ? "Hide" : "Show"}
                </span>
              </button>

              {mscOpen && (
                <div className="mt-3 space-y-2">
                  {mscItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`rounded-3xl border p-3 ${isDark ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white"}`}
            >
              <button
                type="button"
                onClick={() => setComsolOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}
              >
                <span>COMSOL</span>
                <span className="text-xs text-slate-400">
                  {comsolOpen ? "Hide" : "Show"}
                </span>
              </button>

              {comsolOpen && (
                <div className="mt-3 space-y-2">
                  {comsolItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={linkClasses(item.to)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main
          className={`flex-1 p-6 transition-colors duration-300 ${
            isDark ? "bg-slate-950" : "bg-slate-100"
          }`}
        >
          <div
            className={`rounded-3xl p-6 min-h-[calc(100vh-5rem)] shadow-lg transition-colors duration-300
  ${
    isDark
      ? "bg-slate-900 border border-slate-800"
      : "bg-white border border-slate-200"
  }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

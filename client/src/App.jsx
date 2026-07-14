import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardForm from "./pages/Dashboard";
import RecentLogs from "./pages/RecentLogs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import LicenseDetails from "./pages/LicenseDetails";
import Matlab from "./pages/MatlabDashboard";
import MatlabPredictions from "./pages/MatlabPredictions";
import LabWiseLicenses from "./pages/LabWiseLicenses";
import ModuleUsage from "./pages/ModuleUsage";
import ModuleVisualization from "./pages/ModuleVisualization";
import MscDashboardPage from "./pages/MscDashboardPage";
import MscPredictions from "./pages/MscPredictions";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthHeader from "./components/AuthHeader";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 dark:bg-slate-900 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
            <img src="/image.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-wide">Software License Management</p>
            <p className="text-sm text-slate-200 dark:text-slate-400">License Analytics Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              {user.name || user.role || "Admin"}
            </span>
          )}
          {user && (
            <button onClick={logout} className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Private({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AdminPrivate({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return children;
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Software License Analytics Management System.</p>
        <p>Software license dummy data dashboard prototype.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminPrivate>
                <AdminLayout />
              </AdminPrivate>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="labwise-licenses" element={<LabWiseLicenses />} />
            <Route path="license-details" element={<LicenseDetails />} />
            <Route path="module-usage" element={<ModuleUsage />} />
            <Route path="module-visualization" element={<ModuleVisualization />} />
            <Route path="matlab">
              <Route index element={<Matlab />} />
              <Route path="predictions" element={<MatlabPredictions />} />
            </Route>
            <Route path="msc">
              <Route index element={<MscDashboardPage />} />
              <Route path="predictions" element={<MscPredictions />} />
            </Route>
          </Route>

          <Route
            path="/"
            element={
              <PublicRoute>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
                  <AuthHeader />

                  <main className="flex-1">
                    <Login />
                  </main>

                  <Footer />
                </div>
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
                  <AuthHeader />

                  <main className="flex-1">
                    <Register />
                  </main>

                  <Footer />
                </div>
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 flex flex-col">
                <Header />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1">
                  <Private>
                    <DashboardForm />
                  </Private>
                </main>

                <Footer />
              </div>
            }
          />

          <Route
            path="/logs"
            element={
              <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 flex flex-col">
                <Header />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1">
                  <Private>
                    <RecentLogs />
                  </Private>
                </main>

                <Footer />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

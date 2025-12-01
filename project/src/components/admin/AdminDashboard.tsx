import { useState, useEffect } from "react";

interface Client {
  id: number;
  name: string;
  rating?: number;
}
interface Vehicle {
  id: number;
  plate: string;
  model: string;
  brand: string;
}
interface Booking {
  id: number;
  client?: string;
  clientName?: string;
  customer?: string;
  date: string;
  time?: string;
}
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  FileText,
  BarChart,
  Settings,
  LogOut,
  Clock,
  Star,
  UserCheck,
} from "lucide-react";
import { clientService, vehicleService, appointmentService } from "../../services/api";

import ManageClients from "./ManageClients";
import ManageVehicles from "./ManageVehicles";
import ManageServices from "./ManageServices";
import ManageInvoices from "./ManageInvoices";
import Reports from "./Reports";
import SettingsPage from "./SettingsPage";
import NotificationToast from "./NotificationToast";
import Card from "../ui/Card";

/**
 * AdminDashboard
 * Panel de administración para Servi Collantas
 */
export default function AdminDashboard() {
  console.log("AdminDashboard component is rendering");
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Datos reales desde backend ---
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    console.log("useEffect running, backendUrl:", backendUrl);
    const fetchAll = async () => {
      setLoading(true);
      try {
        console.log("Fetching data from backend...");
        const [clientsRes, vehiclesRes, servicesRes] = await Promise.all([
          fetch(`${backendUrl}/api/clients`),
          fetch(`${backendUrl}/api/vehicles`),
          fetch(`${backendUrl}/api/bookings`),
        ]);
        console.log("Responses:", { clientsRes, vehiclesRes, servicesRes });
        const clientsData = clientsRes.ok ? await clientsRes.json() : [];
        const vehiclesData = vehiclesRes.ok ? await vehiclesRes.json() : [];
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        setClients(clientsData);
        setVehicles(vehiclesData);
        setServices(servicesData);
        console.log("Data set:", { clientsData, vehiclesData, servicesData });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchAll();
  }, [backendUrl]);

  const totalClients = clients.length;
  const totalVehicles = vehicles.length;
  const todayAppointments = services.filter(s => {
    const today = new Date().toISOString().slice(0, 10);
    return s.date === today;
  }).length;
  const avgRating = (
    clients.length > 0 ? (clients.reduce((sum, c) => sum + (c.rating || 0), 0) / clients.length) : 0
  ).toFixed(1);

  // --- Menú de navegación ---
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "vehicles", label: "Vehículos", icon: Car },
    { id: "services", label: "Servicios", icon: Wrench },
    { id: "invoices", label: "Facturas", icon: FileText },
    { id: "reports", label: "Reportes", icon: BarChart },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="bg-red-500 text-white p-4 text-center fixed top-0 left-0 right-0 z-50">
        DEBUG: AdminDashboard is rendering - View: {view}
      </div>
      {/* --- Sidebar --- */}
      <aside
        className={`w-72 bg-red-600 text-white flex flex-col shadow-2xl lg:relative fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-red-700">
          <h1 className="text-2xl font-bold">Servi Collantas</h1>
          <p className="text-sm text-red-200">Panel de Administración</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all duration-200 ${
                  view === item.id
                    ? "bg-white text-red-600 font-semibold shadow-lg"
                    : "hover:bg-red-700 text-red-100 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-xl w-full text-left text-white hover:bg-red-700 transition-all duration-200"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          role="button"
          tabIndex={0}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setSidebarOpen(false); }}
          aria-label="Cerrar menú lateral"
        />
      )}

      {/* --- Contenido --- */}
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((item) => item.id === view)?.label}
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* --- Dashboard --- */}
          {view === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-blue-500 text-white p-4 rounded">
                <h2>Dashboard Debug Info</h2>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>Clients: {clients.length}</p>
                <p>Vehicles: {vehicles.length}</p>
                <p>Services: {services.length}</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <span className="text-red-600 font-semibold">Cargando datos...</span>
                </div>
              ) : (
                <>
                  {/* Estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card title="Clientes" value={totalClients} icon={<Users className="text-blue-600" />} bg="bg-blue-100" />
                    <Card title="Vehículos" value={totalVehicles} icon={<Car className="text-green-600" />} bg="bg-green-100" />
                    <Card title="Citas Hoy" value={todayAppointments} icon={<Clock className="text-orange-600" />} bg="bg-orange-100" />
                    <Card title="Calificación Promedio" value={avgRating} icon={<Star className="text-yellow-600" />} bg="bg-yellow-100" />
                  </div>

                  {/* Actividad reciente y clientes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                      <div className="space-y-3">
                        {services.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                              <UserCheck className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{s.customer || s.clientName || s.client}</p>
                              <p className="text-sm text-gray-600">
                                {s.date} - {s.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Clientes Destacados</h3>
                      <div className="space-y-3">
                        {(() => {
                          const sortedClients = [...clients].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                          return sortedClients.slice(0, 3).map((c) => (
                            <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center font-bold text-red-700">
                                {c.name?.charAt(0) || "?"}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{c.name}</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm text-gray-600">{c.rating || 0}/5</span>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- Vistas de gestión --- */}
          {view === "clients" && <ManageClients />}
          {view === "vehicles" && <ManageVehicles />}
          {view === "services" && <ManageServices />}
          {view === "invoices" && <ManageInvoices />}
          {view === "reports" && <Reports />}
          {view === "settings" && <SettingsPage />}
        </div>
      </main>

      <NotificationToast notifications={[]} onClear={() => {}} />
    </div>
  );
}

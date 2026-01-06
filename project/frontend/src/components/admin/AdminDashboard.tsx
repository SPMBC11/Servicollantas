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
  DollarSign,
} from "lucide-react";
import { clientService, vehicleService, appointmentService } from "../../services/api";

import ManageClients from "./ManageClients";
import ManageVehicles from "./ManageVehicles";
import ManageServices from "./ManageServices";
import ManageInvoices from "./ManageInvoices";
import ManageReports from "./ManageReports";
import ManageAppointments from "./ManageAppointments";
import ManageMechanics from "./ManageMechanics";
import SettingsPage from "./SettingsPage";
import Card from "../ui/Card";
import { authService } from "../../services/api";

/**
 * AdminDashboard
 * Panel de administración para Servi Collantas
 */
export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Datos reales desde backend ---
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const [clientsRes, vehiclesRes, servicesRes, invoicesRes, mechanicsRes] = await Promise.all([
          fetch(`${backendUrl}/api/clients`, { headers }),
          fetch(`${backendUrl}/api/vehicles`, { headers }),
          fetch(`${backendUrl}/api/bookings`, { headers }),
          fetch(`${backendUrl}/api/invoices`, { headers }),
          fetch(`${backendUrl}/api/mechanics`, { headers }),
        ]);
        const clientsData = clientsRes.ok ? await clientsRes.json() : [];
        const vehiclesData = vehiclesRes.ok ? await vehiclesRes.json() : [];
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const invoicesData = invoicesRes.ok ? await invoicesRes.json() : [];
        const mechanicsData = mechanicsRes.ok ? await mechanicsRes.json() : [];
        setClients(clientsData);
        setVehicles(vehiclesData);
        setServices(servicesData);
        setInvoices(invoicesData);
        setMechanics(mechanicsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchAll();
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchAll, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const totalClients = clients.length;
  const totalVehicles = vehicles.length;
  const todayAppointments = services.filter(s => {
    const today = new Date().toISOString().slice(0, 10);
    return s.date === today;
  }).length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (parseFloat(inv.total) || 0), 0);
  const avgRating = (
    clients.length > 0 ? (clients.reduce((sum, c) => sum + (c.rating || 0), 0) / clients.length) : 0
  ).toFixed(1);

  // --- Menú de navegación ---
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "vehicles", label: "Vehículos", icon: Car },
    { id: "services", label: "Servicios", icon: Wrench },
    { id: "appointments", label: "Citas", icon: Clock },
    { id: "invoices", label: "Facturas", icon: FileText },
    { id: "mechanics", label: "Mecánicos", icon: UserCheck },
    { id: "reports", label: "Reportes", icon: BarChart },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    // Limpiar toda la información de autenticación
    authService.logout();
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirigir a login
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
                    <Card title="Facturas" value={totalInvoices} icon={<FileText className="text-purple-600" />} bg="bg-purple-100" />
                    <Card title="Ingresos Totales" value={`$${totalRevenue.toFixed(2)}`} icon={<DollarSign className="text-green-600" />} bg="bg-green-100" />
                    <Card title="Calificación Promedio" value={avgRating} icon={<Star className="text-yellow-600" />} bg="bg-yellow-100" />
                  </div>

                  {/* Actividad reciente, clientes y desempeño de mecánicos */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                      <div className="space-y-3">
                        {services.slice(0, 5).map((s) => (
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
                        {services.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">No hay actividad reciente</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Clientes Destacados</h3>
                      <div className="space-y-3">
                        {(() => {
                          const sortedClients = [...clients].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                          const topClients = sortedClients.slice(0, 3);
                          return topClients.length > 0 ? topClients.map((c) => (
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
                          )) : (
                            <p className="text-sm text-gray-500 text-center py-4">No hay clientes registrados</p>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-red-600" />
                        Desempeño de Mecánicos
                      </h3>
                      <div className="space-y-3">
                        {mechanics.length > 0 ? (
                          mechanics.slice(0, 5).map((mechanic) => {
                            const completionRate = mechanic.totalAppointments > 0
                              ? ((mechanic.completedAppointments / mechanic.totalAppointments) * 100).toFixed(0)
                              : 0;
                            return (
                              <div key={mechanic.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium text-gray-800">{mechanic.name}</p>
                                  {mechanic.averageRating > 0 && (
                                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                                      <Star className="w-3 h-3 fill-yellow-500" />
                                      {mechanic.averageRating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <p>{mechanic.completedAppointments}/{mechanic.totalAppointments} completadas</p>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all"
                                      style={{ width: `${completionRate}%` }}
                                    />
                                  </div>
                                  <p className="text-gray-500">{completionRate}% de éxito</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No hay mecánicos registrados</p>
                        )}
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
          {view === "appointments" && <ManageAppointments />}
          {view === "invoices" && <ManageInvoices />}
          {view === "mechanics" && <ManageMechanics />}
          {view === "reports" && <ManageReports />}
          {view === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

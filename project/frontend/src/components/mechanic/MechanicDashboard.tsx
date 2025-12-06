import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import Card from '../ui/Card';

interface Appointment {
  id: string;
  clientName: string;
  vehicleInfo: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pendiente' | 'completada' | 'cancelada';
}

interface MechanicStats {
  totalAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  averageRating: number;
}

const MechanicDashboard: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<MechanicStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Obtener datos del mecánico logueado
  useEffect(() => {
    const fetchMechanicData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        console.log('No token, redirecting to login');
        // window.location.href = '/login';
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching mechanic profile from:', `${backendUrl}/api/mechanics/profile`);
        // Obtener datos del mecánico y sus citas
        const res = await fetch(`${backendUrl}/api/mechanics/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
          const error = await res.json();
          console.error('Error response:', error);
          // window.location.href = '/login';
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log('Mechanic data:', data);
        
        setAppointments(data.appointments || []);
        setStats({
          totalAppointments: data.totalAppointments || 0,
          completedAppointments: data.completedAppointments || 0,
          todayAppointments: data.todayAppointments || 0,
          averageRating: data.averageRating || 0,
        });
      } catch (error) {
        console.error('Error fetching mechanic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanicData();
    // Actualizar cada 20 segundos
    const interval = setInterval(fetchMechanicData, 20000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mechanicEmail');
    window.location.href = '/';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Mis Citas', icon: Calendar },
    { id: 'performance', label: 'Desempeño', icon: TrendingUp },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const completionRate =
    stats.totalAppointments > 0
      ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1)
      : 0;

  // Datos de prueba para demostración
  const demoAppointments: Appointment[] = [
    {
      id: '1',
      clientName: 'Juan García',
      vehicleInfo: 'Toyota Corolla',
      serviceName: 'Cambio de aceite',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      status: 'pendiente',
    },
    {
      id: '2',
      clientName: 'María López',
      vehicleInfo: 'Honda Civic',
      serviceName: 'Alineación',
      date: new Date().toISOString().slice(0, 10),
      time: '14:00',
      status: 'pendiente',
    },
    {
      id: '3',
      clientName: 'Pedro Martínez',
      vehicleInfo: 'BMW X5',
      serviceName: 'Revisión general',
      date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      time: '10:30',
      status: 'confirmada',
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : demoAppointments;
  const demoStats = {
    totalAppointments: 15,
    completedAppointments: 12,
    todayAppointments: 2,
    averageRating: 4.8,
  };
  const displayStats = stats.totalAppointments > 0 ? stats : demoStats;
  const displayCompletionRate =
    displayStats.totalAppointments > 0
      ? ((displayStats.completedAppointments / displayStats.totalAppointments) * 100).toFixed(1)
      : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`w-72 bg-blue-600 text-white flex flex-col shadow-2xl lg:relative fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Servi Collantas</h1>
          <p className="text-sm text-blue-200">Panel de Mecánico</p>
        </div>

        {/* Menú */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  view === item.id
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {menuItems.find((m) => m.id === view)?.label || 'Dashboard'}
          </h2>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            M
          </div>
        </header>

        {/* Contenido */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Cargando datos...</p>
              </div>
            </div>
          ) : view === 'dashboard' ? (
            <div className="p-6 space-y-6">
              {/* Tarjetas de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Citas Totales</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{displayStats.totalAppointments}</p>
                    </div>
                    <Calendar className="w-12 h-12 text-blue-100" />
                  </div>
                </Card>

                <Card className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Completadas</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{displayStats.completedAppointments}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-100" />
                  </div>
                </Card>

                <Card className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Hoy</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{displayStats.todayAppointments}</p>
                    </div>
                    <Clock className="w-12 h-12 text-orange-100" />
                  </div>
                </Card>

                <Card className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Calificación</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{displayStats.averageRating.toFixed(1)}</p>
                    </div>
                    <Star className="w-12 h-12 text-yellow-100 fill-yellow-100" />
                  </div>
                </Card>
              </div>

              {/* Tasa de completitud */}
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" size={24} />
                  Tasa de Completitud
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${displayCompletionRate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{displayCompletionRate}%</span>
                </div>
              </Card>

              {/* Próximas citas */}
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Wrench className="text-blue-600" size={24} />
                  Próximas Citas
                </h3>
                {displayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {displayAppointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{apt.clientName}</p>
                          <p className="text-sm text-gray-600">{apt.vehicleInfo}</p>
                          <p className="text-sm text-gray-600">{apt.serviceName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {apt.date} a las {apt.time}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                            apt.status === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : apt.status === 'completada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <AlertCircle size={32} className="mb-2 opacity-50" />
                    <p>No hay citas próximas</p>
                  </div>
                )}
              </Card>
            </div>
          ) : view === 'appointments' ? (
            <div className="p-6">
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Todas mis Citas</h3>
                {displayAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Vehículo</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Servicio</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Hora</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayAppointments.map((apt) => (
                          <tr key={apt.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{apt.clientName}</td>
                            <td className="px-4 py-3">{apt.vehicleInfo}</td>
                            <td className="px-4 py-3">{apt.serviceName}</td>
                            <td className="px-4 py-3">{apt.date}</td>
                            <td className="px-4 py-3">{apt.time}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  apt.status === 'pendiente'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : apt.status === 'completada'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No hay citas</p>
                )}
              </Card>
            </div>
          ) : view === 'performance' ? (
            <div className="p-6">
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Mi Desempeño</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Citas Completadas</p>
                    <p className="text-4xl font-bold text-green-600">
                      {displayStats.completedAppointments}/{displayStats.totalAppointments}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Calificación Promedio</p>
                    <div className="flex items-center gap-2">
                      <p className="text-4xl font-bold text-yellow-600">{displayStats.averageRating.toFixed(1)}</p>
                      <Star className="text-yellow-600 fill-yellow-600" size={32} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : view === 'settings' ? (
            <div className="p-6">
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Esta sección está en desarrollo</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default MechanicDashboard;

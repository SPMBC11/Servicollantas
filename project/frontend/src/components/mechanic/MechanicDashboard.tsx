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
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/api';

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
  const [error, setError] = useState<string | null>(null);
  const [mechanicInfo, setMechanicInfo] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { addNotification } = useNotification();
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
          const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
          console.error('Error response:', errorData);
          setError(errorData.message || 'Error al cargar datos');
          addNotification(errorData.message || 'Error al cargar datos del mecánico', 'error');
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
        setMechanicInfo(data.mechanic || null);
        if (data.mechanic) {
          setSettingsForm(prev => ({ ...prev, name: data.mechanic.name || '' }));
        }
        setError(null);
      } catch (error: any) {
        console.error('Error fetching mechanic data:', error);
        setError('Error de conexión con el servidor');
        addNotification('Error de conexión con el servidor', 'error');
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
    authService.logout();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);

    // Validar que si se cambia la contraseña, ambas coincidan
    if (settingsForm.newPassword) {
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        addNotification('Las contraseñas no coinciden', 'error');
        setSettingsLoading(false);
        return;
      }
      if (settingsForm.newPassword.length < 6) {
        addNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        setSettingsLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addNotification('No hay token de autenticación', 'error');
        setSettingsLoading(false);
        return;
      }

      const updateData: any = {};
      if (settingsForm.name && settingsForm.name !== mechanicInfo?.name) {
        updateData.name = settingsForm.name;
      }
      if (settingsForm.newPassword) {
        updateData.currentPassword = settingsForm.currentPassword;
        updateData.newPassword = settingsForm.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        addNotification('No hay cambios para guardar', 'info');
        setSettingsLoading(false);
        return;
      }

      const res = await fetch(`${backendUrl}/api/mechanics/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addNotification(errorData.message || 'Error al actualizar perfil', 'error');
        setSettingsLoading(false);
        return;
      }

      const updatedData = await res.json();
      setMechanicInfo(updatedData);
      
      // Actualizar localStorage con el nuevo nombre
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.name = updatedData.name;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Limpiar formulario de contraseña
      setSettingsForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      addNotification('Perfil actualizado exitosamente', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      addNotification('Error de red al actualizar perfil', 'error');
    } finally {
      setSettingsLoading(false);
    }
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
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
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
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-800 font-semibold mb-2">Error al cargar datos</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : view === 'dashboard' ? (
            <div className="p-6 space-y-6">
              {/* Tarjetas de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Citas Totales</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {stats.totalAppointments}
                      </p>
                    </div>
                    <Calendar className="w-12 h-12 text-blue-100" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Completadas</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedAppointments}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-100" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Hoy</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{stats.todayAppointments}</p>
                    </div>
                    <Clock className="w-12 h-12 text-orange-100" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Calificación</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}</p>
                    </div>
                    <Star className="w-12 h-12 text-yellow-100 fill-yellow-100" />
                  </div>
                </div>
              </div>

              {/* Tasa de completitud */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-blue-600" size={24} />
                  Tasa de Completitud
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
                </div>
              </div>

              {/* Próximas citas */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Wrench className="text-blue-600" size={24} />
                  Próximas Citas
                </h3>
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
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
                    <Calendar size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No hay citas asignadas</p>
                    <p className="text-sm text-gray-400 text-center max-w-md">
                      Aún no tienes citas asignadas. Las citas aparecerán aquí cuando el administrador te las asigne.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : view === 'appointments' ? (
            <div className="p-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Todas mis Citas</h3>
                {appointments.length > 0 ? (
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
                        {appointments.map((apt) => (
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
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Calendar size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No hay citas registradas</p>
                    <p className="text-sm text-gray-400 text-center max-w-md">
                      Aún no tienes citas asignadas. Las citas aparecerán aquí cuando el administrador te las asigne.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : view === 'performance' ? (
            <div className="p-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Mi Desempeño</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Citas Completadas</p>
                    <p className="text-4xl font-bold text-green-600">
                      {stats.completedAppointments}/{stats.totalAppointments}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Calificación Promedio</p>
                    <div className="flex items-center gap-2">
                      <p className="text-4xl font-bold text-yellow-600">
                        {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                      </p>
                      {stats.averageRating > 0 && (
                        <Star className="text-yellow-600 fill-yellow-600" size={32} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : view === 'settings' ? (
            <div className="p-6">
              <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings className="text-blue-600" size={24} />
                  Configuración de Perfil
                </h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Información del usuario */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>

                    {mechanicInfo && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {mechanicInfo.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                      </div>
                    )}
                  </div>

                  {/* Cambio de contraseña */}
                  <div className="border-t pt-6 space-y-4">
                    <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Cambiar Contraseña
                    </h4>
                    <p className="text-sm text-gray-600">Deja estos campos vacíos si no deseas cambiar la contraseña</p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settingsForm.currentPassword}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          placeholder="Solo si vas a cambiar la contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settingsForm.confirmPassword}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirma tu nueva contraseña"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {settingsLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default MechanicDashboard;

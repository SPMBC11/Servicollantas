import React, { useState, useEffect } from "react";
import { Wrench, Star, CheckCircle, Clock, AlertCircle, Plus, X, Copy, Check, Edit2, Mail, Trash2 } from "lucide-react";
import Card from "../ui/Card";

interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalAppointments: number;
  completedAppointments: number;
  averageRating: number;
  status: string;
}

interface NewMechanic {
  name: string;
  phone: string;
  email: string;
}

const ManageMechanics: React.FC = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any>(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsMessage, setCredentialsMessage] = useState<string>("");
  const [lastPassword, setLastPassword] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewMechanic>({ name: '', phone: '', email: '' });
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMechanics([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/api/mechanics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          setMechanics([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setMechanics(Array.isArray(data) ? data : []);
      } catch {
        setMechanics([]);
      }
      setLoading(false);
    };
    fetchMechanics();

    // Actualizar mecánicos cada 20 segundos
    const interval = setInterval(fetchMechanics, 20000);
    
    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleCreateMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Por favor completa todos los campos");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/mechanics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Error al crear mecánico");
        return;
      }

      const data = await res.json();
      setCredentials(data.credentials);
      setLastPassword(data.credentials.password);
      setFormData({ name: '', phone: '', email: '' });
      
      // Recargar mecánicos
      const reloadRes = await fetch(`${backendUrl}/api/mechanics`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedMechanics = await reloadRes.json();
      setMechanics(updatedMechanics);
    } catch (err) {
      console.error(err);
      alert("Error de red al crear mecánico");
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEditMechanic = (mechanic: Mechanic) => {
    setEditingId(mechanic.id);
    setFormData({
      name: mechanic.name,
      phone: mechanic.phone,
      email: mechanic.email
    });
    setShowForm(true);
  };

  const handleUpdateMechanic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Por favor completa todos los campos");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/mechanics/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Error al actualizar mecánico");
        return;
      }

      setEditingId(null);
      setShowForm(false);
      setFormData({ name: '', phone: '', email: '' });
      
      // Recargar mecánicos
      const reloadRes = await fetch(`${backendUrl}/api/mechanics`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedMechanics = await reloadRes.json();
      setMechanics(Array.isArray(updatedMechanics) ? updatedMechanics : []);
      alert("Mecánico actualizado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error de red al actualizar mecánico");
    }
  };

  const handleDeleteMechanic = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este mecánico?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/mechanics/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Error al eliminar mecánico");
        return;
      }

      // Recargar mecánicos
      const reloadRes = await fetch(`${backendUrl}/api/mechanics`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedMechanics = await reloadRes.json();
      setMechanics(Array.isArray(updatedMechanics) ? updatedMechanics : []);
      alert("Mecánico eliminado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error de red al eliminar mecánico");
    }
  };

  const generateCredentialsMessage = (mechanic: Mechanic, password: string) => {
    const message = `Bienvenido al Portal de Mecánicos Servi-Collantas\n\nTus credenciales de acceso:\n\nEmail: ${mechanic.email}\nContraseña: ${password}\n\nPanel de Mecánico: http://localhost:5173/mechanic/dashboard\n\nPor favor, cambia tu contraseña en la primera sesión.`;
    setCredentialsMessage(message);
    setShowCredentialsModal(true);
  };

  const handleSendCredentials = async (mechanic: Mechanic) => {
    try {
      // Regenerar contraseña
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/mechanics/regenerate-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: mechanic.id })
      });
      if (!res.ok) throw new Error('Error al regenerar contraseña');
      const data = await res.json();
      setLastPassword(data.password);
      generateCredentialsMessage(mechanic, data.password);
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  // Estadísticas generales
  const totalMechanics = mechanics.length;
  const totalAppointmentsAll = mechanics.reduce((sum, m) => sum + m.totalAppointments, 0);
  const totalCompletedAll = mechanics.reduce((sum, m) => sum + m.completedAppointments, 0);
  const avgRatingAll = mechanics.length > 0 
    ? (mechanics.reduce((sum, m) => sum + m.averageRating, 0) / mechanics.length).toFixed(1)
    : 0;

  const getPerformanceLevel = (rating: number): { label: string; color: string } => {
    if (rating >= 4.5) return { label: "Excelente", color: "text-green-600 bg-green-100" };
    if (rating >= 4.0) return { label: "Muy Bueno", color: "text-blue-600 bg-blue-100" };
    if (rating >= 3.5) return { label: "Bueno", color: "text-yellow-600 bg-yellow-100" };
    return { label: "Necesita Mejora", color: "text-red-600 bg-red-100" };
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-red-600 font-semibold">Cargando mecánicos...</span>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              title="Total Mecánicos"
              value={totalMechanics}
              icon={<Wrench className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-100"
            />
            <Card
              title="Citas Totales"
              value={totalAppointmentsAll}
              icon={<Clock className="w-6 h-6 text-orange-600" />}
              bg="bg-orange-100"
            />
            <Card
              title="Citas Completadas"
              value={totalCompletedAll}
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              bg="bg-green-100"
            />
            <Card
              title="Calificación Promedio"
              value={`${avgRatingAll}/5`}
              icon={<Star className="w-6 h-6 text-yellow-600" />}
              bg="bg-yellow-100"
            />
          </div>

          {/* Modal de Credenciales */}
          {credentials && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-green-600">✅ Mecánico Creado</h3>
                  <button 
                    onClick={() => setCredentials(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-4">
                  <p className="text-sm text-yellow-800 font-semibold">
                    ⚠️ IMPORTANTE: Guarda estas credenciales. No se mostrarán de nuevo.
                  </p>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Email:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={credentials.email}
                        className="flex-1 border rounded px-3 py-2 bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(credentials.email, 'email')}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {copiedField === 'email' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600">Contraseña:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={credentials.password}
                        className="flex-1 border rounded px-3 py-2 bg-gray-50 text-sm font-mono font-bold"
                      />
                      <button
                        onClick={() => copyToClipboard(credentials.password, 'password')}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {copiedField === 'password' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <strong>Panel del Mecánico:</strong> http://localhost:5173/mechanic/dashboard
                  </p>
                  <button
                    onClick={() => setCredentials(null)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal para enviar credenciales */}
          {showCredentialsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-dark">Mensaje de Credenciales</h3>
                  <button 
                    onClick={() => setShowCredentialsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 min-h-32">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                      {credentialsMessage}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(credentialsMessage);
                        setCopiedField('message');
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className="flex items-center gap-2 flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {copiedField === 'message' ? <Check size={18} /> : <Copy size={18} />}
                      {copiedField === 'message' ? 'Copiado!' : 'Copiar Mensaje'}
                    </button>
                    <button
                      onClick={() => {
                        const email = credentialsMessage.split('Email: ')[1]?.split('\n')[0];
                        if (email) {
                          window.open(`mailto:${email}?subject=Credenciales Servi-Collantas&body=${encodeURIComponent(credentialsMessage)}`);
                        }
                      }}
                      className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      <Mail size={18} />
                      Enviar por Email
                    </button>
                    <button
                      onClick={() => setShowCredentialsModal(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      <X size={18} />
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para crear/editar mecánico */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-dark">
                    {editingId ? "Editar Mecánico" : "Agregar Nuevo Mecánico"}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', phone: '', email: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={editingId ? handleUpdateMechanic : handleCreateMechanic} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej: 573001234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Ej: juan@mecanico.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setFormData({ name: '', phone: '', email: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      {editingId ? "Actualizar" : "Crear"} Mecánico
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabla de mecánicos */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-6 h-6 text-red-600" />
                <h2 className="text-lg font-semibold text-dark">
                  Rendimiento de Mecánicos
                </h2>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                <Plus size={20} />
                Agregar Mecánico
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Teléfono</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3 text-center">Citas Totales</th>
                    <th className="px-6 py-3 text-center">Completadas</th>
                    <th className="px-6 py-3 text-center">% Completadas</th>
                    <th className="px-6 py-3 text-center">Calificación</th>
                    <th className="px-6 py-3 text-center">Desempeño</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mechanics.map((mechanic) => {
                    const completionRate = mechanic.totalAppointments > 0 
                      ? ((mechanic.completedAppointments / mechanic.totalAppointments) * 100).toFixed(1)
                      : 0;
                    const performanceLevel = getPerformanceLevel(mechanic.averageRating);
                    
                    return (
                      <tr key={mechanic.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-dark">{mechanic.name}</td>
                        <td className="px-6 py-4">{mechanic.phone}</td>
                        <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">
                          {mechanic.email}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">
                          {mechanic.totalAppointments}
                        </td>
                        <td className="px-6 py-4 text-center text-green-600 font-semibold">
                          {mechanic.completedAppointments}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="font-medium">{completionRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {mechanic.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${performanceLevel.color}`}
                          >
                            {performanceLevel.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditMechanic(mechanic)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleSendCredentials(mechanic)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                              title="Enviar Credenciales"
                            >
                              📧
                            </button>
                            <button
                              onClick={() => handleDeleteMechanic(mechanic.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {mechanics.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center text-gray-500 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-8 h-8 text-gray-400" />
                          No hay mecánicos registrados
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Detalles adicionales */}
            {mechanics.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4 text-dark">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mechanics.map((mechanic) => (
                    <div
                      key={mechanic.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-dark">{mechanic.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPerformanceLevel(mechanic.averageRating).color}`}>
                          {getPerformanceLevel(mechanic.averageRating).label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Experiencia:</span>{" "}
                          {mechanic.totalAppointments} citas
                        </p>
                        <p>
                          <span className="font-medium">Tasa de éxito:</span>{" "}
                          {mechanic.totalAppointments > 0
                            ? (
                                (mechanic.completedAppointments /
                                  mechanic.totalAppointments) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                        <p>
                          <span className="font-medium">Calificación:</span>{" "}
                          <span className="text-yellow-600 font-semibold">
                            {mechanic.averageRating.toFixed(1)}/5
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Contacto:</span>{" "}
                          {mechanic.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageMechanics;

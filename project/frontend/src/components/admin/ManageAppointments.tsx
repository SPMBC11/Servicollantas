import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Car, Wrench, AlertCircle, CheckCircle, XCircle, UserCheck, Star, Link2, Copy, Check } from "lucide-react";
import Card from "../ui/Card";
import { useNotification } from "../../context/NotificationContext";

interface Appointment {
  id: string;
  client_id: string;
  vehicle_id: string;
  service_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  client_name?: string;
  client_email?: string;
  vehicle_info?: string;
  service_name?: string;
  make?: string;
  model?: string;
  license_plate?: string;
  year?: number;
  invoice_id?: string;
  service_provider_id?: string;
  mechanic_name?: string;
  mechanic_email?: string;
  mechanic_phone?: string;
}

interface Mechanic {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'pending' | 'confirmed' | 'cancelled' | 'completed'>('pending');
  const [editingMechanicId, setEditingMechanicId] = useState<string | null>(null);
  const [ratingLinks, setRatingLinks] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch appointments
        const appointmentsRes = await fetch(`${backendUrl}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!appointmentsRes.ok) {
          addNotification("Error al obtener citas", "error");
          setLoading(false);
          return;
        }
        
        const appointmentsData = await appointmentsRes.json();
        // Map backend data to match our interface
        const mappedData = appointmentsData.map((apt: any) => ({
          ...apt,
          vehicle_info: apt.license_plate ? `${apt.make} ${apt.model} (${apt.license_plate})` : 'N/A'
        }));
        setAppointments(mappedData);
        
        // Fetch mechanics
        const mechanicsRes = await fetch(`${backendUrl}/api/mechanics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (mechanicsRes.ok) {
          const mechanicsData = await mechanicsRes.json();
          setMechanics(mechanicsData);
        }
      } catch {
        addNotification("Error de red al obtener datos", "error");
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleGenerateRatingLink = async (appointmentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addNotification("No hay token de autenticación.", "error");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/ratings/generate-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ appointmentId })
      });

      if (!res.ok) {
        const errorData = await res.json();
        addNotification(errorData.message || "Error al generar link de calificación", "error");
        return;
      }

      const data = await res.json();
      setRatingLinks(prev => ({ ...prev, [appointmentId]: data.url }));
      addNotification("Link de calificación generado exitosamente", "success");
    } catch (err) {
      console.error(err);
      addNotification("Error de red al generar link", "error");
    }
  };

  const handleCopyLink = async (link: string, appointmentId: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(appointmentId);
      addNotification("Link copiado al portapapeles", "success");
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Error copying link:', err);
      addNotification("Error al copiar el link", "error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: typeof editingStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addNotification("No hay token de autenticación.", "error");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        addNotification(errorData.message || "Error al actualizar el estado de la cita", "error");
        return;
      }
      
      const updatedAppointment = await res.json();
      setAppointments(appointments.map(a => a.id === id ? { ...a, ...updatedAppointment } : a));
      setEditingId(null);
      addNotification("Estado de la cita actualizado exitosamente", "success");
    } catch (err) {
      console.error(err);
      addNotification("Error de red al actualizar la cita", "error");
    }
  };

  const handleMechanicAssign = async (id: string, mechanicId: string | null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addNotification("No hay token de autenticación.", "error");
      return;
    }
    
    try {
      // First update the appointment with the mechanic
      const res = await fetch(`${backendUrl}/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ service_provider_id: mechanicId || null })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        addNotification(errorData.message || "Error al asignar mecánico", "error");
        return;
      }
      
      // Refresh appointments to get updated data
      const appointmentsRes = await fetch(`${backendUrl}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        const mappedData = data.map((apt: any) => ({
          ...apt,
          vehicle_info: apt.license_plate ? `${apt.make} ${apt.model} (${apt.license_plate})` : 'N/A'
        }));
        setAppointments(mappedData);
      }
      
      setEditingMechanicId(null);
      addNotification(
        mechanicId ? "Mecánico asignado exitosamente" : "Mecánico removido exitosamente",
        "success"
      );
    } catch (err) {
      console.error(err);
      addNotification("Error de red al asignar mecánico", "error");
    }
  };

  const generateInvoice = async (appointmentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      addNotification("No hay token de autenticación.", "error");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/invoices/from-appointment/${appointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        addNotification(errorData.message || "Error al generar la factura", "error");
        return;
      }
      
      const invoice = await res.json();
      addNotification(`Factura ${invoice.id} generada exitosamente`, "success");
    } catch (err) {
      console.error(err);
      addNotification("Error de red al generar la factura", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  };

  // Estadísticas
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-blue-600 font-semibold">Cargando citas...</span>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Total de Citas"
              value={totalAppointments}
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-100"
            />
            <Card
              title="Completadas"
              value={completedAppointments}
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              bg="bg-green-100"
            />
            <Card
              title="Pendientes"
              value={pendingAppointments}
              icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
              bg="bg-yellow-100"
            />
            <Card
              title="Canceladas"
              value={cancelledAppointments}
              icon={<XCircle className="w-6 h-6 text-red-600" />}
              bg="bg-red-100"
            />
          </div>

          {/* Tabla de citas */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Lista de Citas
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Hora</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Vehículo</th>
                    <th className="p-3">Servicio</th>
                    <th className="p-3">Mecánico</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {appointment.date}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {appointment.time}
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {appointment.client_name || 'N/A'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          {appointment.vehicle_info || 'N/A'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-gray-400" />
                          {appointment.service_name || 'N/A'}
                        </div>
                      </td>
                      <td className="p-3">
                        {editingMechanicId === appointment.id ? (
                          <select
                            value={appointment.service_provider_id || ''}
                            onChange={(e) => {
                              const newMechanicId = e.target.value || null;
                              handleMechanicAssign(appointment.id, newMechanicId);
                            }}
                            className="border rounded px-2 py-1 text-xs"
                            onBlur={() => setEditingMechanicId(null)}
                            autoFocus
                          >
                            <option value="">Sin asignar</option>
                            {mechanics.map(mechanic => (
                              <option key={mechanic.id} value={mechanic.id}>
                                {mechanic.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                            onClick={() => setEditingMechanicId(appointment.id)}
                            title="Click para asignar/editar mecánico"
                          >
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            <span className={appointment.mechanic_name ? 'font-medium' : 'text-gray-400 italic'}>
                              {appointment.mechanic_name || 'Sin asignar'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {editingId === appointment.id ? (
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value as typeof editingStatus)}
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            {getStatusLabel(appointment.status)}
                          </span>
                        )}
                      </td>
                      <td className="p-3 space-y-2">
                        {editingId === appointment.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(appointment.id, editingStatus)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setEditingId(appointment.id);
                                setEditingStatus(appointment.status);
                                setEditingMechanicId(appointment.service_provider_id || null);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                            >
                              Editar
                            </button>
                            {appointment.status === 'completed' && !appointment.invoice_id && (
                              <button
                                onClick={() => generateInvoice(appointment.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                Factura
                              </button>
                            )}
                            {appointment.status === 'completed' && appointment.service_provider_id && (
                              <div className="flex gap-1">
                                {ratingLinks[appointment.id] ? (
                                  <button
                                    onClick={() => handleCopyLink(ratingLinks[appointment.id], appointment.id)}
                                    className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center gap-1"
                                    title="Copiar link de calificación"
                                  >
                                    {copiedLink === appointment.id ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        Copiado
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        Copiar Link
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleGenerateRatingLink(appointment.id)}
                                    className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 flex items-center gap-1"
                                    title="Generar link de calificación"
                                  >
                                    <Star className="w-3 h-3" />
                                    Calificar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-500 py-6">
                        No hay citas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAppointments;

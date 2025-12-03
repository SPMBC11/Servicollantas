import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Car, Wrench, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Card from "../ui/Card";

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
}

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'pending' | 'confirmed' | 'cancelled' | 'completed'>('pending');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${backendUrl}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          alert("Error al obtener citas");
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        // Map backend data to match our interface
        const mappedData = data.map((apt: any) => ({
          ...apt,
          vehicle_info: apt.license_plate ? `${apt.make} ${apt.model} (${apt.license_plate})` : 'N/A'
        }));
        setAppointments(mappedData);
      } catch {
        alert("Error de red al obtener citas");
      }
      setLoading(false);
    };
    
    fetchAppointments();
  }, [backendUrl]);

  const handleStatusChange = async (id: string, newStatus: typeof editingStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No hay token de autenticación.");
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
        alert("Error al actualizar el estado de la cita");
        return;
      }
      
      const updatedAppointment = await res.json();
      setAppointments(appointments.map(a => a.id === id ? updatedAppointment : a));
      setEditingId(null);
      alert("Estado actualizado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error de red al actualizar la cita");
    }
  };

  const generateInvoice = async (appointmentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No hay token de autenticación.");
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
        alert("Error al generar la factura");
        return;
      }
      
      const invoice = await res.json();
      alert(`Factura ${invoice.id} generada exitosamente`);
    } catch (err) {
      console.error(err);
      alert("Error de red al generar la factura");
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
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            {appointment.status === 'completed' && (
                              <button
                                onClick={() => generateInvoice(appointment.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                              >
                                Factura
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-6">
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

// src/components/admin/ManageClients.tsx
import React, { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Edit } from "lucide-react";
import Card from "../ui/Card";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicle?: string;
}

const ManageClients: React.FC = () => {
  // Estado de clientes reales
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No hay token de autenticación. Inicia sesión como admin.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/api/clients`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          alert("Error al obtener clientes");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setClients(data);
      } catch {
        alert("Error de red al obtener clientes");
      }
      setLoading(false);
    };
    fetchClients();
  }, [backendUrl]);

  // Calcular estadísticas
  const totalClients = clients.length;
  // Si el backend no tiene el campo vehicle, puedes omitir activeClients o ajustarlo
  const activeClients = clients.filter(c => !!c.vehicle).length;

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación. Inicia sesión como admin.");
      return;
    }
    try {
      // Si tienes endpoint DELETE /api/clients/:id, úsalo aquí
      // await fetch(`${backendUrl}/api/clients/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setClients(clients.filter(c => c.id !== id));
    } catch {
      alert("Error de red al eliminar el cliente");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-red-600 font-semibold">Cargando clientes...</span>
        </div>
      ) : (
        <>
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              title="Clientes Totales" 
              value={totalClients} 
              icon={<Users className="w-6 h-6 text-blue-600" />} 
              bg="bg-blue-100" 
            />
            <Card 
              title="Clientes Activos" 
              value={activeClients} 
              icon={<Users className="w-6 h-6 text-green-600" />} 
              bg="bg-green-100" 
            />
            <Card 
              title="Nuevos este mes" 
              value={2} // lo puedes conectar a tu lógica real
              icon={<UserPlus className="w-6 h-6 text-purple-600" />} 
              bg="bg-purple-100" 
            />
          </div>

          {/* Tabla de clientes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-dark">Lista de Clientes</h2>
              <button className="flex items-center gap-2 bg-golden text-dark px-4 py-2 rounded-xl font-medium hover:bg-yellow-400 transition-colors">
                <UserPlus size={18} />
                Agregar Cliente
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Teléfono</th>
                    <th className="px-6 py-3">Vehículo</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-dark">{client.name}</td>
                      <td className="px-6 py-4">{client.email}</td>
                      <td className="px-6 py-4">{client.phone}</td>
                      <td className="px-6 py-4">{client.vehicle || "—"}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-6">
                        No hay clientes registrados
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

export default ManageClients;

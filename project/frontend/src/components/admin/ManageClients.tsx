// src/components/admin/ManageClients.tsx
import React, { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Edit, X, Check } from "lucide-react";
import Card from "../ui/Card";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
}

interface EditingClient extends Client {
  isEditing?: boolean;
}

const ManageClients: React.FC = () => {
  // Estado de clientes reales
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", phone: "", email: "" });
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000";

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
  }, []);

  // Calcular estadísticas
  const totalClients = clients.length;

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditFormData({ name: client.name, phone: client.phone, email: client.email });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación.");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/clients/${editingId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editFormData)
      });
      
      if (!res.ok) {
        alert("Error al actualizar cliente");
        return;
      }
      
      const updatedClient = await res.json();
      setClients(clients.map(c => c.id === editingId ? updatedClient : c));
      setEditingId(null);
      alert("Cliente actualizado exitosamente");
    } catch (err) {
      console.error(err);
      alert("Error de red al actualizar cliente");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: "", phone: "", email: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación. Inicia sesión como admin.");
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/clients/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (!res.ok) {
        alert("Error al eliminar cliente");
        return;
      }
      
      setClients(clients.filter(c => c.id !== id));
      alert("Cliente eliminado exitosamente");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              title="Clientes Totales" 
              value={totalClients} 
              icon={<Users className="w-6 h-6 text-blue-600" />} 
              bg="bg-blue-100" 
            />
            <Card 
              title="Nuevos este mes" 
              value={0} // Se puede mejorar agregando filtro de fecha
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
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    editingId === client.id ? (
                      <tr key={client.id} className="border-b bg-yellow-50">
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editFormData.phone}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-800 mr-3"
                            title="Guardar"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar"
                          >
                            <X size={18} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-dark">{client.name}</td>
                        <td className="px-6 py-4">{client.email}</td>
                        <td className="px-6 py-4">{client.phone}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-6">
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

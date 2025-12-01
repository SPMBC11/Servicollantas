// src/components/admin/ManageServices.tsx
import React, { useState, useEffect } from "react";
import { Settings, Pencil, Trash2, Plus, Clock, DollarSign } from "lucide-react";
import Card from "../ui/Card";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const ManageServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30
  });
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No hay token de autenticación. Inicia sesión como admin.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/api/services`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          alert("Error al obtener servicios");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setServices(data);
      } catch {
        alert("Error de red al obtener servicios");
      }
      setLoading(false);
    };
    fetchServices();
  }, [backendUrl]);

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 30
    });
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación. Inicia sesión como admin.");
      return;
    }
    
    try {
      let res;
      if (editingService) {
        // Actualizar servicio existente
        res = await fetch(`${backendUrl}/api/services/${editingService.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Crear nuevo servicio
        res = await fetch(`${backendUrl}/api/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }
      
      if (!res.ok) {
        alert(`Error al ${editingService ? 'actualizar' : 'crear'} servicio`);
        return;
      }
      
      const savedService = await res.json();
      
      if (editingService) {
        setServices(services.map(s => s.id === editingService.id ? savedService : s));
      } else {
        setServices([...services, savedService]);
      }
      
      setShowModal(false);
    } catch {
      alert(`Error de red al ${editingService ? 'actualizar' : 'crear'} servicio`);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación. Inicia sesión como admin.");
      return;
    }
    
    if (!confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        alert("Error al eliminar servicio");
        return;
      }
      
      setServices(services.filter(s => s.id !== id));
    } catch {
      alert("Error de red al eliminar servicio");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-red-600 font-semibold">Cargando servicios...</span>
        </div>
      ) : (
        <>
          {/* Card resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Servicios Disponibles"
              value={services.length}
              icon={<Settings className="text-red-600" />}
              bg="bg-red-100"
            />
          </div>

          {/* Lista de Servicios */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-600" /> Lista de Servicios
              </h2>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Servicio
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Duración</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{service.name}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {service.description}
                    </td>
                    <td className="p-3 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      {service.price != null ? Number(service.price).toFixed(2) : '0.00'}
                    </td>
                    <td className="p-3 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {service.duration} min
                    </td>
                    <td className="p-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(service.id)}
                        className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No hay servicios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal para agregar/editar servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? 'Editar Servicio' : 'Agregar Servicio'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Cambio de Aceite"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Descripción detallada del servicio"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                {editingService ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;

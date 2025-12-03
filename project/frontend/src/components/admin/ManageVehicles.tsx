// src/components/admin/ManageVehicles.tsx
import React, { useState, useEffect } from "react";
import { Car, Plus, Pencil, Trash2 } from "lucide-react";
import Card from "../ui/Card";

interface Vehicle {
  id: string;
  license_plate: string;
  model: string;
  make: string;
  year: number;
  client_id: string;
  client_name?: string;
  client_email?: string;
}

const ManageVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${backendUrl}/api/vehicles`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          alert("Error al obtener vehículos");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setVehicles(data);
      } catch {
        alert("Error de red al obtener vehículos");
      }
      setLoading(false);
    };
    fetchVehicles();
  }, [backendUrl]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        alert('Error al eliminar vehículo');
        return;
      }
      
      setVehicles(vehicles.filter(v => v.id !== id));
      alert('Vehículo eliminado exitosamente');
    } catch (err) {
      console.error('Error:', err);
      alert('Error de red al eliminar vehículo');
    }
  };

  const handleAdd = () => {
    alert('Agregar vehículo - Función por implementar');
  };

  const handleEdit = () => {
    alert('Editar vehículo - Función por implementar');
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-green-600 font-semibold">Cargando vehículos...</span>
        </div>
      ) : (
        <>
          {/* Resumen con Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Vehículos Registrados"
              value={vehicles.length}
              icon={<Car className="text-green-600" />}
              bg="bg-green-100"
            />
          </div>

          {/* Lista de Vehículos */}
          <div className="bg-white shadow rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Car className="w-5 h-5 text-green-600" /> Lista de Vehículos
              </h2>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" /> Agregar Vehículo
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3">Placa</th>
                  <th className="p-3">Modelo</th>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Año</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{vehicle.license_plate}</td>
                    <td className="p-3">{vehicle.model}</td>
                    <td className="p-3">{vehicle.make}</td>
                    <td className="p-3">{vehicle.year}</td>
                    <td className="p-3">{vehicle.client_name || 'N/A'}</td>
                    <td className="p-3 flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(vehicle.id as unknown as number)}
                        className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id as unknown as number)}
                        className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500 text-sm"
                    >
                      No hay vehículos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageVehicles;

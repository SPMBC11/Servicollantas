// src/components/admin/ManageInvoices.tsx
import React, { useState, useEffect } from "react";
import { FileText, FilePlus, Trash2, Download } from "lucide-react";
import Card from "../ui/Card";
import { Invoice } from "../../types";

const ManageInvoices: React.FC = () => {
  // Estado de facturas reales
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000";

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/api/invoices`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          console.error("Error al obtener facturas:", res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setInvoices(data);
      } catch {
        console.error("Error de red al obtener facturas (Backend posiblemente apagado)");
      }
      if (loading) setLoading(false);
    };
    
    setLoading(true);
    fetchInvoices();
    
    // Actualizar facturas cada 15 segundos
    const interval = setInterval(fetchInvoices, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // ...existing code...

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token de autenticación. Inicia sesión como admin.");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/invoices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        alert("Error al eliminar la factura");
        return;
      }
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch {
      alert("Error de red al eliminar la factura");
    }
  };

  // Estadísticas
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingCount = invoices.filter(inv => inv.status === "pendiente").length;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="text-red-600 font-semibold">Cargando facturas...</span>
        </div>
      ) : (
        <>
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Facturas Emitidas"
              value={totalInvoices}
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-100"
            />
            <Card
              title="Ingresos Totales"
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<FileText className="w-6 h-6 text-green-600" />}
              bg="bg-green-100"
            />
            <Card
              title="Facturas Pendientes"
              value={pendingCount}
              icon={<FileText className="w-6 h-6 text-orange-600" />}
              bg="bg-orange-100"
            />
          </div>

          {/* Tabla de facturas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-dark">
                Lista de Facturas
              </h2>
              <button className="flex items-center gap-2 bg-golden text-dark px-4 py-2 rounded-xl font-medium hover:bg-yellow-400 transition-colors">
                <FilePlus size={18} />
                Crear Factura
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Vehículo</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-dark">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4">{invoice.clientName}</td>
                      <td className="px-6 py-4">{invoice.vehicle}</td>
                      <td className="px-6 py-4">${invoice.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              alert("No hay token de autenticación. Inicia sesión como admin.");
                              return;
                            }
                            try {
                              const res = await fetch(`${backendUrl}/api/invoices/${invoice.id}/pdf`, {
                                method: "GET",
                                headers: {
                                  Authorization: `Bearer ${token}`
                                }
                              });
                              if (!res.ok) {
                                alert("Error al descargar la factura");
                                return;
                              }
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              window.open(url, "_blank");
                            } catch {
                              alert("Error de red al descargar la factura");
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-gray-500 py-6"
                      >
                        No hay facturas registradas
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

export default ManageInvoices;
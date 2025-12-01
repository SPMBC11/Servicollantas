// src/components/admin/Reports.tsx
import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import { FileText } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type Invoice = {
  id: string;
  clientName: string;
  total: number;
  date: string;
  services?: { id: string; name: string; price: number }[];
};

type ServiceSummary = {
  name: string;
  count: number;
  revenue: number;
};

const Reports: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummary[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvoices = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/invoices", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Error ${res.status} ${res.statusText} ${txt}`);
        }

        const data: Invoice[] = await res.json();
        console.log("fetchInvoices -> data:", data);

        setInvoices(Array.isArray(data) ? data : []);

        // construir resumen de servicios
        const servicesMap: Record<string, ServiceSummary> = {};
        const monthlyMap: Record<string, number> = {};

        (data || []).forEach((inv) => {
          const total = Number(inv.total || 0);

          // contabilizar mes
          const d = new Date(inv.date);
          if (!isNaN(d.getTime())) {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthlyMap[key] = (monthlyMap[key] || 0) + total;
          }

          // servicios
          (inv.services || []).forEach((s) => {
            if (!servicesMap[s.id]) servicesMap[s.id] = { name: s.name, count: 0, revenue: 0 };
            servicesMap[s.id].count += 1;
            servicesMap[s.id].revenue += Number(s.price || 0);
          });
        });

        const serviceArr = Object.values(servicesMap).sort((a, b) => b.count - a.count);
        setServiceSummary(serviceArr);

        const monthlyArr = Object.entries(monthlyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, revenue]) => ({ month, revenue }));
        setMonthlyRevenue(monthlyArr);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Reports fetch error:", err);
        setError(err instanceof Error ? err.message : "Error cargando reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
    return () => controller.abort();
  }, []);

  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((s, inv) => s + Number(inv.total || 0), 0);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold text-red-600">📊 Reportes</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <strong>Error:</strong> {error}
          <div className="text-xs text-gray-500 mt-2">
            Revisa la consola (F12) y la pestaña Network para ver la respuesta del servidor.
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-600 font-medium">Cargando reportes...</div>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Facturas Emitidas" value={totalInvoices} icon={<FileText className="w-6 h-6 text-red-600" />} bg="bg-red-100" />
            <Card title="Ingresos Totales" value={`$${totalRevenue.toFixed(2)}`} icon={<FileText className="w-6 h-6 text-green-600" />} bg="bg-green-100" />
            <Card title="Servicios Distintos" value={serviceSummary.length} icon={<FileText className="w-6 h-6 text-orange-600" />} bg="bg-orange-100" />
          </div>

          {/* Ingresos mensuales */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-dark">Ingresos Mensuales</h2>

            {/* si no hay datos, mostrar mensaje en vez de un chart vacío */}
            {monthlyRevenue.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No hay ingresos registrados para mostrar.</div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Servicios más vendidos */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-dark">Servicios Más Vendidos</h2>

            {serviceSummary.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No hay servicios vendidos aún.</div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabla resumen */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-dark">Resumen de Servicios</h2>

            {serviceSummary.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No hay datos suficientes</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Servicio</th>
                      <th className="px-6 py-3">Cantidad</th>
                      <th className="px-6 py-3">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceSummary.map((s) => (
                      <tr key={s.name} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4">{s.count}</td>
                        <td className="px-6 py-4">${s.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

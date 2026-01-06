import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp, DollarSign, Wrench, Download } from "lucide-react";
import Card from "../ui/Card";

interface ReportData {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  serviceBreakdown: Array<{
    service_name: string;
    count: number;
    revenue: number;
  }>;
  appointmentsByDay: Array<{
    date: string;
    count: number;
  }>;
}

const ManageReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000";

  // Establecer fechas por defecto (mes actual)
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
    
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona ambas fechas");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${backendUrl}/api/reports?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        alert("Error al generar el reporte");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
      alert("Error de red al generar el reporte");
    }
    setLoading(false);
  };

  const handleQuickFilter = (type: 'day' | 'month' | 'year') => {
    const today = new Date();
    let start: Date, end: Date;

    if (type === 'day') {
      start = today;
      end = today;
    } else if (type === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
    }

    setFilterType(type);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const downloadPDF = async () => {
    if (!reportData) return;
    
    // Crear un string HTML con el contenido del reporte
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte - ${new Date().toLocaleDateString('es-ES')}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 { color: #d32f2f; margin-bottom: 20px; }
          h2 { color: #1976d2; font-size: 18px; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-box { background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; }
          .stat-label { font-size: 12px; color: #666; font-weight: bold; }
          .stat-value { font-size: 24px; color: #d32f2f; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <h1>📊 Reporte de Servi Collantas</h1>
        <p>Fecha del reporte: ${new Date().toLocaleDateString('es-ES')}</p>
        <p>Período: ${startDate} al ${endDate}</p>
        
        <h2>📈 Estadísticas Generales</h2>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-label">Total de Citas</div>
            <div class="stat-value">${reportData.totalAppointments}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Citas Completadas</div>
            <div class="stat-value">${reportData.completedAppointments}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Ingresos Totales</div>
            <div class="stat-value">$${reportData.totalRevenue.toFixed(2)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Pendientes</div>
            <div class="stat-value">${reportData.pendingAppointments}</div>
          </div>
        </div>

        <h2>🔧 Desglose por Servicio</h2>
        <table>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Cantidad</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.serviceBreakdown.map(s => `
              <tr>
                <td>${s.service_name}</td>
                <td>${s.count}</td>
                <td>$${s.revenue.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>📅 Citas por Día</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cantidad de Citas</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.appointmentsByDay.map(d => `
              <tr>
                <td>${new Date(d.date).toLocaleDateString('es-ES')}</td>
                <td>${d.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Este reporte fue generado automáticamente por Servi Collantas</p>
          <p>${new Date().toLocaleString('es-ES')}</p>
        </div>
      </body>
      </html>
    `;

    // Crear un blob y descargarlo
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte-${new Date().getTime()}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Filtros de Reporte
        </h2>

        <div className="space-y-4">
          {/* Botones rápidos */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleQuickFilter('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => handleQuickFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Este Mes
            </button>
            <button
              onClick={() => handleQuickFilter('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Este Año
            </button>
          </div>

          {/* Selectores de fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
            {reportData && (
              <button
                onClick={downloadPDF}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resultados del reporte */}
      {reportData && (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Total de Citas"
              value={reportData.totalAppointments}
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              bg="bg-blue-100"
            />
            <Card
              title="Citas Completadas"
              value={reportData.completedAppointments}
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              bg="bg-green-100"
            />
            <Card
              title="Ingresos Totales"
              value={`$${reportData.totalRevenue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
              bg="bg-yellow-100"
            />
            <Card
              title="Pendientes/Canceladas"
              value={reportData.pendingAppointments + reportData.cancelledAppointments}
              icon={<Calendar className="w-6 h-6 text-red-600" />}
              bg="bg-red-100"
            />
          </div>

          {/* Desglose por servicios */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Servicios Solicitados
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Servicio</th>
                    <th className="p-3">Cantidad</th>
                    <th className="p-3">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.serviceBreakdown && reportData.serviceBreakdown.length > 0 ? (
                    reportData.serviceBreakdown.map((service, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{service.service_name}</td>
                        <td className="p-3">{service.count}</td>
                        <td className="p-3">${service.revenue.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 py-6">
                        No hay datos de servicios para este período
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Citas por día */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Citas por Día
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Cantidad de Citas</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.appointmentsByDay && reportData.appointmentsByDay.length > 0 ? (
                    reportData.appointmentsByDay.map((day, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{day.date}</td>
                        <td className="p-3">{day.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-500 py-6">
                        No hay datos de citas para este período
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!reportData && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Selecciona un rango de fechas y haz clic en "Generar Reporte" para ver estadísticas
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageReports;

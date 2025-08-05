import { useEffect, useState } from 'react';
import {
  getUserInvestmentReport,
  getUserDetailedTransactionReport
} from '@/utils/api';
import '../styles/reports.css';

const ReportCard = () => {
  const [filters, setFilters] = useState({
    userId: '',
    month: '',
    year: new Date().getFullYear(),
    mode: 'month'
  });

  const [view, setView] = useState('resumen'); // 'resumen' o 'detalle'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const isMonthly = filters.mode === 'month';

  useEffect(() => {
    handleBuscar(); // buscar automáticamente al cambiar el tipo de vista
  }, [view]);

  const buildParams = () => {
    const params = new URLSearchParams();
    params.append('mode', filters.mode);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.year) params.append('year', filters.year);
    if (isMonthly && filters.month) {
      params.append('month', filters.month);
    }
    return params;
  };

  const handleDownload = () => {
    const params = buildParams();
    const baseUrl =
      view === 'detalle'
        ? 'http://localhost:4000/api/transactions/download-user-detailed'
        : 'http://localhost:4000/api/transactions/download-report';

    if (!filters.userId) {
      alert("Debes ingresar un ID de usuario para descargar el detalle.");
      return;
    }

    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      if (view === 'detalle') {
        if (!filters.userId) {
          alert("Debes ingresar un ID de usuario para ver el detalle.");
          setLoading(false);
          return;
        }
        const result = await getUserDetailedTransactionReport(filters.userId);
        setData(result);
      } else {
        const params = Object.fromEntries(buildParams());
        const result = await getUserInvestmentReport(params);
        setData(result);
      }
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    handleBuscar();
  }, []);

  return (
    <div className="report-card">
      <div className="report-header">
        <h2 className="report-title">
          Reporte de Inversión {view === 'detalle' ? 'Detallado' : isMonthly ? 'Mensual' : 'Anual'}
        </h2>
        <div className="report-actions">
          <button className="button" onClick={handleDownload}>Descargar Reporte</button>

          <input
            type="number"
            name="userId"
            placeholder="ID Usuario"
            value={filters.userId}
            onChange={handleChange}
            className="input"
          />

          <select value={view} onChange={(e) => setView(e.target.value)} className="input">
            <option value="resumen">Resumen</option>
            <option value="detalle">Detalle</option>
          </select>

          {view === 'resumen' && (
            <>
              <select name="mode" value={filters.mode} onChange={handleChange} className="input">
                <option value="month">Por Mes</option>
                <option value="year">Por Año</option>
              </select>

              {isMonthly && (
                <select name="month" value={filters.month} onChange={handleChange} className="input">
                  <option value="">Mes</option>
                  {meses.map((m, idx) => idx > 0 && <option key={idx} value={idx}>{m}</option>)}
                </select>
              )}
            </>
          )}

          <input
            type="number"
            name="year"
            placeholder="Año"
            value={filters.year}
            onChange={handleChange}
            className="input"
          />

          <button className="button-secondary" onClick={handleBuscar}>Buscar</button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Cargando datos...</p>
        ) : data.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : view === 'detalle' ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Ítem</th>
                <th>Modelo</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Mes</th>
                <th>Fecha</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.nombre_completo}</td>
                  <td>{row.nombre_item}</td>
                  <td>{row.modelo}</td>
                  <td>{row.precio_unitario}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.total_item}</td>
                  <td>{row.mes}</td>
                  <td>{row.fecha_salida}</td>
                  <td>{row.observacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>{isMonthly ? 'Mes' : 'Año'}</th>
                <th>Total Invertido (Bs.)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i}>
                  <td>{r.user_id}</td>
                  <td>{r.user_name}</td>
                  <td>{r.mes?.trim() || r.anio}</td>
                  <td>
                    {Number(r.total_invertido).toLocaleString("es-BO", {
                      style: "currency",
                      currency: "BOB"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportCard;

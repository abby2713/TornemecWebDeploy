import { useEffect, useState } from 'react';
import {
  getUserInvestmentReport,
  getUserDetailedTransactionReport,
  getAllTransactionsReport,
  getItemAssignmentsReport
} from '@/utils/api';
import '../styles/reports.css';

const ReportItem = () => {
  const [filters, setFilters] = useState({
    userId: '',
    type: '',
    month: '',
    year: new Date().getFullYear(),
    mode: 'month',
    codigoitem: '',
    branchId: '' // 🆕 AÑADIDO filtro por sucursal
  });

  const [view, setView] = useState('resumen');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);


  const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const isMonthly = filters.mode === 'month';

  const buildParams = () => {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.year) params.append('year', filters.year);
    if (filters.mode) params.append('mode', filters.mode);
    if (filters.month && filters.mode === 'month') params.append('month', filters.month);
    if (filters.type) params.append('type', filters.type);
    if (filters.codigoitem) params.append('codigoitem', filters.codigoitem);
    if (filters.branchId) params.append('branchId', filters.branchId); // 🆕 Agregado
    return params;
  };

  const handleDownload = () => {
    let baseUrl = "";
    const params = new URLSearchParams();

    if (view === 'asignacion-item') {
      if (!filters.codigoitem) {
        alert("Debes ingresar un código de ítem para descargar el reporte.");
        return;
      }

      baseUrl = `http://localhost:4000/api/reportes/asignaciones-excel/${filters.codigoitem}`;
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      if (filters.userId) params.append('userid', filters.userId);
      if (filters.branchId) params.append('branchId', filters.branchId); // 🆕 agregado

    } else if (view === 'detalle') {
      if (!filters.userId) {
        alert("Debes ingresar un ID de usuario para descargar el detalle.");
        return;
      }

      baseUrl = 'http://localhost:4000/api/transactions/download-user-detailed';
      params.append('userId', filters.userId);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.codigoitem) params.append('codigoitem', filters.codigoitem);
      if (filters.branchId) params.append('branchId', filters.branchId); // 🆕 agregado

    } else if (view === 'completo') {
      baseUrl = 'http://localhost:4000/api/transactions/download-all-transactions';
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.codigoitem) params.append('codigoitem', filters.codigoitem);
      if (filters.type) params.append('type', filters.type);
      if (filters.branchId) params.append('branchId', filters.branchId); // 🆕 agregado

    } else {
      baseUrl = 'http://localhost:4000/api/transactions/download-report';
      const queryParams = buildParams();
      queryParams.forEach((value, key) => params.append(key, value));
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
        const result = await getUserDetailedTransactionReport({
          userId: filters.userId,
          month: filters.month,
          year: filters.year,
          codigoitem: filters.codigoitem,
          branchId: filters.branchId // 🆕 agregado
        });
        setData(result);

      } else if (view === 'completo') {
        const params = {
          userId: filters.userId,
          codigoitem: filters.codigoitem,
          month: filters.month,
          year: filters.year,
          type: filters.type,
          branchId: filters.branchId // 🆕 agregado
        };
        const result = await getAllTransactionsReport(params);
        setData(result);

      } else if (view === 'asignacion-item') {
        if (!filters.codigoitem) {
          alert("Debes ingresar un código de ítem.");
          setLoading(false);
          return;
        }
        const result = await getItemAssignmentsReport(
          filters.codigoitem,
          filters.year,
          filters.month,
          filters.userId,
          filters.branchId // 🆕 agregado
        );
        setData(result);

      } else {
        const { userId, codigoitem, ...paramsSinUserNiCodigoItem } = Object.fromEntries(buildParams());
        const result = await getUserInvestmentReport(paramsSinUserNiCodigoItem);
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
    const fetchBranches = async () => {
      try {
        const res = await fetch("http://localhost:4000/branches"); // Ajusta el endpoint si es diferente
        const data = await res.json();
        setBranches(data);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      }
    };
    setData([]); // Limpiar datos al cambiar vista
    handleBuscar();
    fetchBranches();
  }, [view]);

  return (
    <div className="report-card">
      <div className="report-header">
        <h2 className="report-title">
          {view === 'asignacion-item' ? 'Reporte de Asignación por Ítem' :
            view === 'detalle' ? 'Reporte Detallado' :
              view === 'completo' ? 'Entradas y Salidas' :
                isMonthly ? 'Reporte de Inversión Mensual' : 'Reporte de Inversión Anual'}
        </h2>

        <div className="report-actions">
          <button className="button" onClick={handleDownload}>Descargar Reporte</button>

          {view === 'asignacion-item' && (
            <>
              <input
                type="text"
                name="codigoitem"
                placeholder="Código del Ítem"
                value={filters.codigoitem}
                onChange={handleChange}
                className="input"
              />
              <input
                type="number"
                name="userId"
                placeholder="ID Usuario (opcional)"
                value={filters.userId}
                onChange={handleChange}
                className="input"
              />
              <select
                name="branchId"
                value={filters.branchId || ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">Todas las sucursales</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <select name="month" value={filters.month} onChange={handleChange} className="input">
                <option value="">Todos los meses</option>
                {meses.map((m, idx) => idx > 0 && (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>
            </>
          )}

          {view === 'detalle' && (
            <>
              <input
                type="number"
                name="userId"
                placeholder="ID Usuario"
                value={filters.userId}
                onChange={handleChange}
                className="input"
              />

              <input
                type="text"
                name="codigoitem"
                placeholder="Código del Ítem (opcional)"
                value={filters.codigoitem}
                onChange={handleChange}
                className="input"
              />

              <select name="month" value={filters.month} onChange={handleChange} className="input">
                <option value="">Todos los meses</option>
                {meses.map((m, idx) => idx > 0 && (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

            </>
          )}

          <select value={view} onChange={(e) => setView(e.target.value)} className="input">
            <option value="resumen">Resumen</option>
            <option value="detalle">Detalle</option>
            <option value="completo">Entradas y Salidas</option>
            <option value="asignacion-item">Asignación por Ítem</option>
          </select>

          {view === 'completo' && (
            <>
              <select name="type" value={filters.type} onChange={handleChange} className="input">
                <option value="">Todos</option>
                <option value="entrada">Entradas</option>
                <option value="salida">Salidas</option>
              </select>

              <input
                type="number"
                name="userId"
                placeholder="ID Usuario (opcional)"
                value={filters.userId}
                onChange={handleChange}
                className="input"
              />

              <input
                type="text"
                name="codigoitem"
                placeholder="Código del Ítem (opcional)"
                value={filters.codigoitem}
                onChange={handleChange}
                className="input"
              />

              <select name="month" value={filters.month} onChange={handleChange} className="input">
                <option value="">Todos los meses</option>
                {meses.map((m, idx) => idx > 0 && (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>
            </>
          )}

          {view === 'resumen' && (
            <>
              <select name="mode" value={filters.mode} onChange={handleChange} className="input">
                <option value="month">Por Mes</option>
                <option value="year">Por Año</option>
              </select>

              {isMonthly && (
                <select name="month" value={filters.month} onChange={handleChange} className="input">
                  <option value="">Mes</option>
                  {meses.map((m, idx) => idx > 0 && (
                    <option key={idx} value={idx}>{m}</option>
                  ))}
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
        {loading && <p>Cargando datos...</p>}
        {!loading && data.length === 0 && <p>No se encontraron resultados.</p>}

        {!loading && data.length > 0 && (
          <>
            {view === 'asignacion-item' && (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID Usuario</th>
                    <th>Usuario</th>
                    <th>Sucursal</th>
                    <th>Precio Unitario (Bs.)</th>
                    <th>Cantidad Asignada</th>
                    <th>Total Invertido (Bs.)</th>
                    <th>Ítem</th>
                    <th>Mes</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={`${row.user_id}-${i}`}>
                      <td>{row.user_id}</td>
                      <td>{row.usuario}</td>
                      <td>{row.sucursal || 'No especificado'}</td>
                      <td>Bs {Number(row.precio_unitario).toFixed(2)}</td>
                      <td>{row.cantidad_total_asignada}</td>
                      <td>Bs {Number(row.total_invertido).toFixed(2)}</td>
                      <td>{row.item_name}</td>
                      <td>{row.mes || "Sin mes"}</td>
                      <td>
                        {row.imagen_url ? (
                          <img src={`http://localhost:4000${row.imagen_url}`} alt="img" width={50} />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {view === 'detalle' && (
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
            )}

            {view === 'completo' && (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Ítem</th>
                    <th>Modelo</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Tipo</th>
                    <th>Mes</th>
                    <th>Fecha</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td>{row.nombre_usuario}</td>
                      <td>{row.nombre_item}</td>
                      <td>{row.modelo}</td>
                      <td>{row.precio_unitario}</td>
                      <td>{row.quantity}</td>
                      <td>{row.total_item}</td>
                      <td>{row.tipo_transaccion}</td>
                      <td>{row.mes}</td>
                      <td>{new Date(row.fecha).toLocaleDateString()}</td>
                      <td>{row.observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}


            {view === 'resumen' && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default ReportItem;

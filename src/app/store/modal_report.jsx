import { useEffect, useState } from "react";
import { getItemMovementReport } from "@/utils/api"; // asegúrate de tenerlo en utils/api

export default function ItemReportModal({ itemId, onClose }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await getItemMovementReport(itemId);
        setMovements(data);
      } catch (err) {
        console.error("Error al obtener reporte de movimientos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, [itemId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Reporte de Movimientos del Ítem #{itemId}</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : movements.length === 0 ? (
          <p>No se encontraron movimientos.</p>
        ) : (
          <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "8px" }}>Fecha</th>
                <th style={{ padding: "8px" }}>Tipo</th>
                <th style={{ padding: "8px" }}>Cantidad</th>
                <th style={{ padding: "8px" }}>Total acumulado</th>
                <th style={{ padding: "8px" }}>Descripción</th>
                <th style={{ padding: "8px" }}>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px" }}>
                    {new Date(m.transactiondate).toLocaleString("es-BO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td style={{ padding: "6px" }}>{m.movementtype}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>{m.quantity}</td>
                  <td style={{ padding: "6px", textAlign: "center", fontWeight: "bold" }}>
                    {m.current_total}
                  </td>
                  <td style={{ padding: "6px" }}>{m.description}</td>
                  <td style={{ padding: "6px" }}>{m.user_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

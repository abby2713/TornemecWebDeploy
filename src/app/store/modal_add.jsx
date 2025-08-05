import { useState, useEffect } from "react";

export default function ItemAdd({ item, onClose, onItemUpdated }) {
  const [cantidad, setCantidad] = useState(1);
  const [observacion, setObservacion] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const userId = sessionStorage.getItem("userId");




  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await fetch(`https://v14m7300-4000.brs.devtunnels.ms/movements/${item.id}`);
        const data = await response.json();
        const entradas = data.filter(mov => mov.movementtype === "entrada");
        setMovimientos(entradas);
      } catch (err) {
        console.error("Error al cargar historial de stock:", err);
      }
    };

    fetchMovimientos();
  }, [item.id]);

  const handleAddStock = async () => {
    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("Error: No se pudo obtener el usuario logueado.");
      return;
    }

    const payload = {
      userid: Number(userId),
      observation: observacion || `Ingreso de ${cantidad} unidad(es) de ${item.name}`,
      items: [
        {
          itemid: item.id,
          quantity: cantidad
        }
      ]
    };

    try {
      const response = await fetch("https://v14m7300-4000.brs.devtunnels.ms/api/transactions/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Stock añadido correctamente ✅");
        onItemUpdated();
        onClose();
      } else {
        const error = await response.json();
        console.error(error);
        alert("Error al añadir stock.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor.");
    }
  };


  const totalPages = Math.ceil(movimientos.length / itemsPerPage);
  const movimientosPaginados = movimientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div>
      <h2>Ingreso de Stock</h2>

      {/* Info del ítem */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
        <img
          src={`https://v14m7300-4000.brs.devtunnels.ms${item.imageurl}`}
          alt={item.name}
          style={{ width: "100px", borderRadius: "8px" }}
        />
        <div>
          <p><strong>Nombre:</strong> {item.name}</p>
          <p><strong>Stock actual:</strong> {item.stock}</p>
        </div>
      </div>

      {/* Cantidad */}
      <label>Cantidad a ingresar:</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* Observación */}
      <label>Observación (opcional):</label>
      <textarea
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        placeholder="Ej. Reposición por compra"
        rows="3"
        style={{ width: "100%", padding: "8px", marginBottom: "15px", resize: "vertical" }}
      />

      {/* Botones */}
      <button onClick={handleAddStock} style={{ marginRight: "10px" }}>
        Confirmar Ingreso
      </button>
      <button onClick={onClose}>Cancelar</button>

      {/* Historial de entradas */}
      <h4 style={{ marginTop: "30px" }}>Historial de entradas</h4>
      {movimientos.length === 0 ? (
        <p>No hay movimientos de entrada registrados.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc", backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>📅 Fecha</th>
              <th style={{ padding: "8px", textAlign: "center" }}>📦 Cantidad</th>
              <th style={{ padding: "8px", textAlign: "left" }}>📝 Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientosPaginados.map((mov) => (
              <tr key={mov.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "6px" }}>
                  {new Date(mov.createdat).toLocaleString("es-BO", {
                    day: "numeric",
                    month: "long",      // ← nombre del mes
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true        // formato 12h con "a. m./p. m."
                  })}
                </td>
                <td style={{ padding: "6px", textAlign: "center", fontWeight: "bold" }}>{mov.quantity}</td>
                <td style={{ padding: "6px" }}>{mov.description}</td>
              </tr>
            ))}
          </tbody>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ◀
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                ▶
              </button>
            </div>
          )}
        </table>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export default function ItemAsing({ item, onClose, onItemAssigned }) {
  const [usuarios, setUsuarios] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("https://v14m7300-4000.brs.devtunnels.ms/activos");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("Error al obtener la lista de usuarios.");
      }
    };
    fetchUsuarios();
  }, []);

  const handleAssign = async () => {
    if (!empleadoSeleccionado) {
      alert("Selecciona un empleado.");
      return;
    }

    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    if (cantidad > item.stock) {
      alert("No hay suficiente stock disponible.");
      return;
    }

    const payload = {
      userid: parseInt(empleadoSeleccionado),
      observation: observacion || `Asignación de ${cantidad} unidad(es) de ${item.name}`,
      items: [
        {
          itemid: item.id,
          quantity: cantidad
        }
      ]
    };

    try {
      const response = await fetch("https://v14m7300-4000.brs.devtunnels.ms/api/transactions/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Ítem asignado correctamente ✅");
        onItemAssigned();
        onClose();
      } else {
        const error = await response.json();
        console.error(error);
        alert("Error al asignar el ítem.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <h2>Asignación de Ítem</h2>

      {/* Info del ítem */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
        <img
          src={`https://v14m7300-4000.brs.devtunnels.ms${item.imageurl}`}
          alt={item.name}
          style={{ width: "100px", borderRadius: "8px" }}
        />
        <div>
          <p><strong>Nombre:</strong> {item.name}</p>
          <p><strong>Stock:</strong> {item.stock}</p>
        </div>
      </div>

      {/* Cantidad */}
      <label>Cantidad a asignar:</label>
      <input
        type="number"
        min="1"
        max={item.stock}
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {/* Empleado */}
      <label>Selecciona un empleado:</label>
      <select
        value={empleadoSeleccionado}
        onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      >
        <option value="">-- Seleccionar empleado --</option>
        {usuarios.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.lastname}
          </option>
        ))}
      </select>

      {/* Observación */}
      <label>Observación (opcional):</label>
      <textarea
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        placeholder="Ej. Entregado para uso en taller"
        rows="3"
        style={{ width: "100%", padding: "8px", marginBottom: "15px", resize: "vertical" }}
      />

      {/* Botones */}
      <button onClick={handleAssign} style={{ marginRight: "10px" }}>
        Confirmar Asignación
      </button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}

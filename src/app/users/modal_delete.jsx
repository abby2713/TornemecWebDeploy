'use client';
import { deleteUser } from '@/utils/api';

export default function UserDelete({ userId, onClose, onUserDeleted }) {
  
  const handleSubmit = async () => {
    try {
      const response = await deleteUser(userId);
      if (response.status === 200) {
        alert("Usuario eliminado correctamente");
        onUserDeleted();
        onClose();
      } else {
        alert("No se pudo eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Hubo un error al eliminar el usuario");
    }
  };

  return (
    <div className="create-item-container">
      <h2 className="form-title">¿Desea Eliminar el Registro?</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-buttons">
          <button type="submit" className="form-button form-button-primary">
            Aceptar
          </button>
          <button
            type="button"
            className="form-button form-button-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

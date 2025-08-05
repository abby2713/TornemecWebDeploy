'use client'

import { deleteMachine } from "@/utils/api";



export default function DeleteConfirmation({ machineId, onClose, onMachineDeleted }) {

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteMachine(machineId);
            if (response.status === 200 || response.status === 204) {
                alert("Registro Eliminado");
                onMachineDeleted();
                onClose();
            } else {
                alert("Error al eliminar la máquina. Código de estado: " + response.status);
            }
        } catch (error) {
            console.error("Error al eliminar la máquina:", error);
            alert("Error al eliminar la máquina. Ver la consola para más detalles.");
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

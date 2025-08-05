'use client'

import React, { useState, useEffect } from "react";
import "../../styles/forms.css"
import { getMachineDetail, getCategories, getBranches } from "@/utils/api";

export default function MachineDetailModal({ machineId, onClose }) {

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        model: "",
        description: "",
        serialNumber: "",
        year: "",
        statusmachine: "",
        voltage: "",
        phases: "",
        powerKW: "",
        price: "",
        categoryId: "",
        branchId: "",
        images: [],
    });

    const [categories, setCategories] = useState([]);
    const [branches, setBranches] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Cargar categorías
        const fetchCategories = async () => {
            try {
                const { status, data } = await getCategories(1);
                if (status === 200) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
            }
        };

        // Cargar sucursales
        const fetchBranches = async () => {
            try {
                const { status, data } = await getBranches();
                if (status === 200) {
                    setBranches(data);
                }
            } catch (error) {
                console.error("Error al cargar las sucursales:", error);
            }
        };

        fetchCategories();
        fetchBranches();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { status, data } = await getMachineDetail(machineId);
                if (status === 200) {
                    const machine = Array.isArray(data) ? data[0] : data; // Manejo si la API devuelve un array
                    const images = machine.images ? machine.images.map(img => `https://v14m7300-4000.brs.devtunnels.ms${img}`) : [];
                    setFormData({
                        name: machine.name || "",
                        brand: machine.brand || "",
                        model: machine.model || "",
                        description: machine.description || "",
                        serialNumber: machine.serialnumber || "",
                        year: machine.year || "",
                        statusmachine: machine.statusmachine || "",
                        voltage: machine.voltage || "",
                        phases: machine.phases || "",
                        powerKW: machine.powerkw || "",
                        price: machine.price || "",
                        categoryId: machine.categoryid || "",
                        branchId: machine.branchid || "",
                        images: images,
                    });
                    setCurrentImageIndex(0); // Reiniciar índice al cargar nuevas imágenes
                }
            } catch (error) {
                console.error("Error al cargar la máquina:", error);
            }
        };
        fetchData();
    }, [machineId]);

    // Obtener nombre de la categoría y sucursal usando el categoryId y branchId
    const categoryName = categories.find(cat => cat.id === formData.categoryId)?.name || "Categoría no encontrada";
    const branchName = branches.find(branch => branch.id === formData.branchId)?.name || "Sucursal no encontrada";

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex + 1 < formData.images.length ? prevIndex + 1 : 0
        );
    };

    return (
        <div className="create-item-container">
            <h2 className="form-title">DETALLES DE LA MÁQUINA</h2>
            <div className="form">
                <div className="form-group">
                    <label className="form-label">Nombre:</label>
                    <p className="form-value">{formData.name}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Marca:</label>
                    <p className="form-value">{formData.brand}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Modelo:</label>
                    <p className="form-value">{formData.model}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Número de Serie:</label>
                    <p className="form-value">{formData.serialNumber}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Año:</label>
                    <p className="form-value">{formData.year}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción:</label>
                    <p className="form-value">{formData.description}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Precio:</label>
                    <p className="form-value">{formData.price}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Estado de Maquina:</label>
                    <p className="form-value">{formData.statusmachine}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Voltaje:</label>
                    <p className="form-value">{formData.voltage}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Fases:</label>
                    <p className="form-value">{formData.phases}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Potencia (KW):</label>
                    <p className="form-value">{formData.powerKW}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Categoría:</label>
                    <p className="form-value">{categoryName}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Sucursal:</label>
                    <p className="form-value">{branchName}</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Imágenes:</label>
                    <div className="image-gallery">
                        {formData.images.length > 0 ? (
                            <div className="image-container">
                                <img
                                    src={formData.images[currentImageIndex]}
                                    alt={`Imagen ${currentImageIndex + 1}`}
                                    className="machine-image"
                                    onClick={handleNextImage}
                                    style={{ cursor: "pointer" }}
                                />
                                <p className="image-counter">
                                    {currentImageIndex + 1} / {formData.images.length}
                                </p>
                            </div>
                        ) : (
                            <p className="form-value">No hay imágenes disponibles.</p>
                        )}
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="button" className="form-button form-button-secondary" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

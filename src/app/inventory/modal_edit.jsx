'use client';

import React, { useState, useEffect } from "react";
import {
    getCategories,
    updateMachine,
    getMachineDetail,
    getBranches,
} from "../../utils/api.js";
import "../../styles/forms.css";

export default function MachineUpdateModal({ machineId, onClose, onMachineUpdated }) {
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
    });

    const [categories, setCategories] = useState([]);
    const [branches, setBranches] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { status, data } = await getMachineDetail(machineId);
                if (status === 200) {
                    const machine = Array.isArray(data) ? data[0] : data;
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
                    });
                    setExistingImages(machine.images || []);
                }
            } catch (error) {
                console.error("Error al cargar la máquina:", error);
            }
        };
        fetchData();
    }, [machineId]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const cats = await getCategories(1);
                const brs = await getBranches();
                if (cats.status === 200) setCategories(cats.data);
                if (brs.status === 200) setBranches(brs.data);
            } catch (error) {
                console.error("Error al cargar opciones:", error);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewImagesChange = (e) => {
        setNewImages([...e.target.files]);
    };

    // Eliminar una imagen
    const handleRemoveImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteImage = (url) => {
        setImagesToDelete((prev) => [...prev, url]);
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        newImages.forEach((img) => data.append("images", img));
        data.append("imagesToDelete", JSON.stringify(imagesToDelete));

        try {
            const response = await updateMachine(machineId, data);
            if (response.status === 200 || response.status === 204) {
                alert("Actualización exitosa");
                onMachineUpdated();
                onClose();
            } else {
                alert("Error al actualizar la máquina: " + response.statusText);
            }
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            alert("Hubo un error al actualizar los datos.");
        }
    };

    return (
        <div className="create-item-container">
            <h2 className="form-title">ACTUALIZAR MÁQUINA</h2>
            <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
                {Object.entries(formData).map(([key, value]) => (
                    key !== "categoryId" && key !== "branchId" ? (
                        <div className="form-group" key={key}>
                            <label className="form-label">{key}:</label>
                            <input type="text" name={key} value={value} onChange={handleChange} className="form-input" />
                        </div>
                    ) : null
                ))}

                <div className="form-group">
                    <label className="form-label">Categoría:</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="form-input">
                        <option value="">Seleccione una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Sucursal:</label>
                    <select name="branchId" value={formData.branchId} onChange={handleChange} className="form-input">
                        <option value="">Seleccione una sucursal</option>
                        {branches.map((br) => (
                            <option key={br.id} value={br.id}>{br.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Descripción:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Imágenes actuales:</label>
                    <div className="image-preview-container">
                        {existingImages.map((url) => (
                            <div key={url} className="image-preview-item">
                                <img src={`http://localhost:4000${url}`}
                                    alt="img"
                                    className="preview-img"
                                    width='100' />
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={() => handleDeleteImage(url)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Agregar nuevas imágenes:</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setNewImages(files);
                        }}
                    />
                    <div className="image-preview-container">
                        {newImages.map((file, index) => (
                            <div key={index} className="image-preview-item">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`preview-${index}`}
                                    className="preview-img"
                                    width='100'
                                />
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="form-button form-button-primary">Actualizar</button>
                    <button type="button" className="form-button form-button-secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

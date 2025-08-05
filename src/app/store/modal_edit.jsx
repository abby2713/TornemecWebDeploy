'use client';

import React, { useState, useEffect } from "react";
import {
    getBranches,
    getCategories,
    getItem,
    updateItem,
    getStores,
} from "@/utils/api";
import "../../styles/forms.css";

export default function ItemUpdateModal({ itemId, onClose, onItemUpdated }) {
    const [formData, setFormData] = useState({
        name: "",
        model: "",
        size: "",
        serialNumber: "",
        unitprice: "",
        categoryId: "",
        storeId: "",
        branchId: "",
        brand: "",
        codigoitem: ""
    });

    const [branches, setBranches] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stores, setStores] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { status, data } = await getItem(itemId);
                if (status === 200) {
                    const item = Array.isArray(data) ? data[0] : data;
                    setFormData({
                        name: item.name || "",
                        model: item.model || "",
                        size: item.size || "",
                        serialNumber: item.serialnumber || "",
                        unitprice: item.unitprice || "",
                        categoryId: item.categoryid || "",
                        storeId: item.storeid || "",
                        branchId: item.branchid || "",
                        brand: item.brand || "",
                        codigoitem: item.codigoitem || ""
                    });
                    setExistingImages(item.images || []);
                }
            } catch (error) {
                console.error("Error al cargar el ítem:", error);
            }
        };
        fetchData();
    }, [itemId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesRes = await getBranches();
                const categoriesRes = await getCategories(2);
                if (branchesRes.status === 200) setBranches(branchesRes.data);
                if (categoriesRes.status === 200) setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Error al cargar categorías o sucursales:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            if (!formData.branchId) return;
            try {
                const { status, data } = await getStores(formData.branchId);
                if (status === 200) setStores(data);
            } catch (error) {
                console.error("Error al cargar los almacenes:", error);
            }
        };
        fetchStores();
    }, [formData.branchId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validar el campo codigoitem (solo letras, números y guiones)
        if (name === "codigoitem") {
            const valid = /^[a-zA-Z0-9\-]*$/.test(value);
            if (!valid) return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "branchId") {
            setFormData((prev) => ({ ...prev, storeId: "" }));
        }
    };

    const handleDeleteImage = (url) => {
        setImagesToDelete((prev) => [...prev, url]);
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const handleRemoveImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Aplicar valores por defecto
        const cleanedFormData = {
            ...formData,
            model: formData.model?.trim() || "Sin Modelo",
            brand: formData.brand?.trim() || "Sin Marca",
            size: formData.size?.trim() || "N/A",
            serialNumber: formData.serialNumber?.trim() || "000000"
        };

        const data = new FormData();
        for (const key in cleanedFormData) {
            data.append(key, cleanedFormData[key]);
        }
        newImages.forEach((img) => data.append("images", img));
        data.append("imagesToDelete", JSON.stringify(imagesToDelete));

        try {
            const response = await updateItem(itemId, data);
            if (response.status === 200 || response.status === 204) {
                alert("Actualización exitosa");
                onItemUpdated();
                onClose();
            } else {
                alert("Error al actualizar el ítem: " + response.statusText);
            }
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            alert("Hubo un error al actualizar los datos.");
        }
    };
    const fieldLabels = {
        name: "Nombre",
        model: "Modelo",
        size: "Tamaño",
        serialNumber: "Número de serie",
        unitprice: "Precio unitario",
        brand: "Marca"
    };

    return (
        <div className="create-item-container">
            <h2 className="form-title">ACTUALIZAR ITEM</h2>
            <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Campo manual obligatorio para el código */}
                <div className="form-group">
                    <label className="form-label">
                        Código del ítem: <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="codigoitem"
                        value={formData.codigoitem}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                {Object.entries(formData).map(([key, value]) =>
                    !["categoryId", "storeId", "branchId", "codigoitem"].includes(key) ? (
                        <div className="form-group" key={key}>
                            <label className="form-label">{fieldLabels[key] || key}:</label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    ) : null
                )}

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
                    <label className="form-label">Almacén:</label>
                    <select name="storeId" value={formData.storeId} onChange={handleChange} className="form-input">
                        <option value="">Seleccione un almacén</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Imágenes actuales:</label>
                    <div className="image-preview-container">
                        {existingImages.map((url) => (
                            <div key={url} className="image-preview-item">
                                <img src={`https://v14m7300-4000.brs.devtunnels.ms${url}`} alt="img" className="preview-img" width="100" />
                                <button type="button" className="remove-image-button" onClick={() => handleDeleteImage(url)}>X</button>
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
                        onChange={(e) =>
                            setNewImages((prev) => [...prev, ...Array.from(e.target.files)])
                        }
                    />
                    <div className="image-preview-container">
                        {newImages.map((file, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="preview-img" width="100" />
                                <button type="button" className="remove-image-button" onClick={() => handleRemoveImage(index)}>X</button>
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

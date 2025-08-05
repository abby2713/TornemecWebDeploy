'use client'

import "../../styles/forms.css";

import React, { useState, useEffect } from "react";
import { getCategories, createMachine, getBranches } from "../../utils/api.js"; // Asegúrate de que la ruta sea correcta

export default function MachineRegistrationModal({ onClose, onMachineRegistered }) {
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
    branchId: "",
    categoryId: "",
    images: [], // Cambiamos a un array para múltiples imágenes
  });

  const [hasAddition, setHasAddition] = useState(false); // Estado para el campo "Aditamentos Extras"
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { status, data } = await getCategories(1); // Pasamos 1 como type
        if (status === 200) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBranches = async () => {
      try {
        const { status, data } = await getBranches();
        if (status === 200) {
          setBranches(data)
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchBranches();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === "" ? null : value, // Si el valor es "", se asigna null
    }));
  };


  // Manejar la selección de archivos (imágenes)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convierte FileList a un array
    const newImages = files.map(file => ({
      file, // Guarda el archivo
      url: URL.createObjectURL(file), // Crea una URL temporal para la previsualización
    }));
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...newImages], // Guarda ambos (archivo y URL)
    }));
  };

  // Eliminar una imagen
  const handleRemoveImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Agregar datos de la máquina
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        formDataToSend.append(key, value);
      }
    });

    // Agregar imágenes (solo los archivos)
    formData.images.forEach((image) => {
      formDataToSend.append("images", image.file); // Envía solo el archivo
    });

    try {
      const response = await createMachine(formDataToSend);
      if (response.status === 201) {
        alert("Registro exitoso");
        onMachineRegistered();
        onClose();
      } else {
        alert("Hubo un error al registrar la máquina.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos.");
    }
  };

  return (
    <div className="create-item-container">
      <h2 className="form-title">REGISTRO DE MÁQUINA</h2>
      <form className="form" onSubmit={handleSubmit}>
        {/* Campos de la máquina */}
        <div className="form-group">
          <label className="form-label">Nombre: <span className="required">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Marca: <span className="required">*</span></label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Modelo:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Número de serie:</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Año:</label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Estado de Máquina:</label>
          <select
            name="statusmachine"
            value={formData.statusmachine}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Seleccione un estado</option>
            <option value="Activo">Activo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Descompuesto">Descompuesto</option>
            <option value="Fuera de servicio">Fuera de servicio</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Voltaje:</label>
          <input
            type="text"
            name="voltage"
            value={formData.voltage}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Fases:</label>
          <input
            type="text"
            name="phases"
            value={formData.phases}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Potencia (kW):</label>
          <input
            type="number"
            name="powerKW"
            value={formData.powerKW}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Precio: <span className="required">*</span></label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría: <span className="required">*</span></label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sucursales: <span className="required">*</span></label>
          <select
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona una sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para saber si tiene aditamentos extras */}
        <div className="form-group">
          <label className="form-label">¿Tiene aditamentos extras?</label>
          <div>
            <label>
              <input
                type="radio"
                name="hasAddition"
                value="yes"
                checked={hasAddition === true}
                onChange={() => setHasAddition(true)}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="hasAddition"
                value="no"
                checked={hasAddition === false}
                onChange={() => setHasAddition(false)}
              />
              No
            </label>
          </div>
        </div>

        {/* Campo de descripción de aditamentos extras (solo si hasAddition es true) */}
        {hasAddition && (
          <div className="form-group">
            <label className="form-label">Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Imágenes:</label>
          <input
            type="file"
            name="images"
            className="form-input"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </div>


        {/* Preview de imágenes */}
        <div className="image-preview-container">
          {formData.images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={image.url} alt={`Preview ${index}`} className="image-preview" />
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

        {/* Botones del formulario */}
        <div className="form-buttons">
          <button type="submit" className="form-button form-button-primary">
            Registrar
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
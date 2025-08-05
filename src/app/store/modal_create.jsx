'use client'

import { createItem, getBranches, getCategories, getStores } from "@/utils/api";
import { useEffect, useState } from "react";
import "../../styles/forms.css";

export default function CreateItem({ onClose, onItemRegistered }) {
  const [formData, setFormData] = useState({
    name: "",
    codigoitem: "", // ← Añadido aquí
    stock: "0",
    model: "",
    size: "",
    serialNumber: "",
    unitprice: "",
    categoryId: "",
    storeId: "",
    branchId: "",
    brand: "",
    images: [],
  });


  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { status, data } = await getCategories(2);
        if (status === 200) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      } finally {
        setLoading(false)
      }
    };

    const fetchBranches = async () => {
      try {
        const { status, data } = await getBranches();
        if (status === 200) {
          setBranches(data);
        }
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      } finally {
        setLoading(false)
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
      [name]: value === "" ? (["stock", "categoryId", "storeId", "branchId"].includes(name) ? null : "") : value
    }));

    if (name === "branchId") {
      fetchStores(value);
      setFormData((prevData) => ({ ...prevData, storeId: "" }));
    }
  };

  const fetchStores = async (branchId) => {
    try {
      const { status, data } = await getStores(branchId);
      if (status === 200) {
        setStores(data);
      }
    } catch (error) {
      console.error("Error al cargar los almacenes:", error);
    }
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

  // Asignar valores por defecto a campos vacíos
  const cleanedFormData = {
    ...formData,
    model: formData.model?.trim() || "Sin Modelo",
    brand: formData.brand?.trim() || "Sin Marca",
    size: formData.size?.trim() || "N/A",
    serialNumber: formData.serialNumber?.trim() || "000000",
  };

  const formDataToSend = new FormData();

  Object.entries(cleanedFormData).forEach(([key, value]) => {
    if (key !== "images" && value !== null) {
      formDataToSend.append(key, value);
    }
  });

  formData.images.forEach((image) => {
    formDataToSend.append("images", image.file);
  });

  try {
    const response = await createItem(formDataToSend);
    if (response.status === 201) {
      alert("Registro exitoso");
      onItemRegistered();
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
      <h2 className="form-title">REGISTRO DE ITEM</h2>
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
          <label className="form-label">
            Código del Ítem: <span className="required">*</span>
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


        <div className="form-group">
          <label className="form-label">Precio Unitario: <span className="required">*</span></label>
          <input
            type="number"
            name="unitprice"
            value={formData.unitprice}
            onChange={handleChange}
            className="form-input"
            required
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
          <label className="form-label">Marca:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tamaño:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
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

        {formData.branchId && (
          <div className="form-group">
            <label className="form-label">Almacén: <span className="required">*</span></label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecciona un almacén</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
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

'use client';

import { createUser, getBranches, getRoles } from "@/utils/api";
import { useEffect, useState } from "react";
import "../../styles/forms.css";

export default function CreateUser({ onClose, onUserRegistered }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    secondlastname: "",
    image: null,
    rolId: "",
    branchId: "",
    phone: "",
    email: ""
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { status, data } = await getBranches();
        if (status === 200) setBranches(data);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const { status, data } = await getRoles();
        if (status === 200) setRoles(data);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };

    fetchBranches();
    fetchRoles();
  }, []);

  useEffect(() => {
    return () => {
      if (formData.image?.url) {
        URL.revokeObjectURL(formData.image.url);
      }
    };
  }, [formData.image]);

  const isTrabajador = () => {
    const selectedRole = roles.find(r => r.id === formData.rolId);
    return selectedRole?.name.toLowerCase() === "trabajador";
  };

  // Cuando cambia el rol, setea el email por defecto si es trabajador
  useEffect(() => {
    if (isTrabajador()) {
      setFormData(prev => ({
        ...prev,
        email: "trabajador@gmail.com"
      }));
    }
  }, [formData.rolId, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: {
          file,
          url: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.lastname || !formData.rolId || !formData.branchId) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!/^\d{8}$/.test(formData.phone)) {
      alert("El número de celular debe tener 8 dígitos.");
      return;
    }

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "image") {
        formDataToSend.append(key, value);
      }
    });

    if (formData.image) {
      formDataToSend.append("image", formData.image.file);
    }

    try {
      const response = await createUser(formDataToSend);
      if (response.status === 201) {
        alert("Registro exitoso ✅");
        onUserRegistered();
        onClose();
      } else {
        alert("Hubo un error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al enviar los datos.");
    }
  };

  return (
    <div className="create-item-container">
      <h2 className="form-title">REGISTRO DE USUARIO</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre: <span className="required">*</span></label>
          <input type="text" name="name" value={formData.name || ""} onChange={handleChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Primer Apellido: <span className="required">*</span></label>
          <input type="text" name="lastname" value={formData.lastname || ""} onChange={handleChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Segundo Apellido:</label>
          <input type="text" name="secondlastname" value={formData.secondlastname || ""} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Celular: <span className="required">*</span></label>
          <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="form-input" required />
        </div>

        { !isTrabajador() && (
          <div className="form-group">
            <label className="form-label">Gmail:</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="form-input" />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Rol: <span className="required">*</span></label>
          <select name="rolId" value={formData.rolId || ""} onChange={handleChange} className="form-select" required>
            <option value="">Selecciona un Rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sucursal: <span className="required">*</span></label>
          <select name="branchId" value={formData.branchId || ""} onChange={handleChange} className="form-select" required>
            <option value="">Selecciona una Sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Imagen:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" />
        </div>

        {formData.image && (
          <div className="image-preview-container">
            <div className="image-preview-item">
              <img src={formData.image.url} alt="Imagen seleccionada" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <button type="button" className="remove-image-button" onClick={handleRemoveImage}>X</button>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="form-button form-button-primary">Registrar</button>
          <button type="button" className="form-button form-button-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

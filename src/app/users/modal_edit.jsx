'use client';

import "../../styles/forms.css";

import { useEffect, useState } from 'react';
import { getUserById, updateUser, getBranches, getRoles } from '@/utils/api';

export default function UserEdit({ userId, onClose, onUserUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    secondlastname: '',
    username: '',
    phone: '',
    rolid: '',
    branchid: '',
    state: 1,
  });

  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserById(userId);

      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        lastname: user.lastname || user.lastName || '',
        secondlastname: user.secondlastname || '',
        username: user.username || user.userName || '',
        phone: user.phone || '',
        rolid: user.rolid || user.rolid || '',
        branchid: user.branchid || user.branchid || '',
        state: user.state || 1,
      }));

      if (user.image) {
        setExistingImages([{ url: `http://localhost:4000${user.image}`, id: user.image }]);
      } else if (Array.isArray(user.images)) {
        setExistingImages(
          user.images.map(imgUrl => ({
            url: `http://localhost:4000${imgUrl}`,
            id: imgUrl
          }))
        );
      }
    };

    const fetchDropdownData = async () => {
      const roleRes = await getRoles();
      setRoles(roleRes.data || []);
      const branchRes = await getBranches();
      setBranches(branchRes.data || []);
    };
    

    fetchData();
    fetchDropdownData();
  }, [userId]);

  const isTrabajador = () => {
    const role = roles.find(r => r.id === formData.rolid);
    return role?.name.toLowerCase() === 'trabajador';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const addedImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImages(prev => [...prev, ...addedImages]);
  };

  const handleRemoveExistingImage = (id) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formToSend.append(key, value);
      }
    });

    newImages.forEach(({ file }) => {
      formToSend.append('images', file);
    });

    const existingImageIds = existingImages.map(img => img.id);
    formToSend.append('existingImages', JSON.stringify(existingImageIds));

    try {
      const res = await updateUser(userId, formToSend);
      if (res.status === 200) {
        alert("Usuario actualizado correctamente");
        onUserUpdated();
        onClose();
      } else {
        alert("Error al actualizar usuario");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de red o del servidor");
    }
  };

  return (
    <div className="create-item-container">
      <h2 className="form-title">Editar Usuario</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Primer Apellido:</label>
          <input name="lastname" value={formData.lastname} onChange={handleChange} required className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Segundo Apellido:</label>
          <input name="secondlastname" value={formData.secondlastname} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Celular:</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required className="form-input" />
        </div>

        {/* Ocultar rol si es Trabajador */}
        {!isTrabajador() && (
          <div className="form-group">
            <label className="form-label">Rol:</label>
            <select name="rolid" value={formData.rolid} onChange={handleChange} className="form-input">
              <option value="">Rol</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Sucursal:</label>
          <select name="branchid" value={formData.branchid} onChange={handleChange} className="form-input">
            <option value="">Sucursal</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cambiar Foto:</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="form-input" />
        </div>

        <div className="preview-container">
          {newImages.map(({ url }, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`Preview ${index}`} className="preview-media" />
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveNewImage(index)}
              >
                X
              </button>
            </div>
          ))}

          {existingImages.map((img, index) => (
            <div key={img.id || index} className="preview-item">
              <img src={img.url} alt={`Imagen existente ${index}`} className="preview-media" />
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveExistingImage(img.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit" className="form-button form-button-primary">Actualizar</button>
          <button type="button" className="form-button form-button-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

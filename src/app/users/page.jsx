'use client';

import { useEffect, useState } from "react";

import UserCard from "@/components/user_card";
import UserCreate from './modal_create';
import UserEdit from './modal_edit';
import UserDelete from './modal_delete';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

import "../../styles/content_pages.css";

import { getUsers } from "@/utils/api";

import AuthenticatedLayout from '@/components/AuthenticatedLayout.jsx';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // 🔧 Nuevo estado para filtro por rol

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.data) {
        const sortedUsers = response.data.sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  // 🔍 Filtro combinado: texto y rol
  const filteredUsers = users.filter((user) => {
    const fullName = (user.name + ' ' + user.lastname).toLowerCase();
    const username = user.username.toLowerCase();
    const text = searchText.toLowerCase();

    const matchesText = fullName.includes(text) || username.includes(text);
    const matchesRole = selectedRole === '' || user.role === selectedRole;

    return matchesText && matchesRole;
  });

  // 🔧 Extraer roles únicos dinámicamente
  const uniqueRoles = [...new Set(users.map(u => u.role))];

  return (
    <AuthenticatedLayout>
      <div>
        <h1 className="titles">USUARIOS</h1>

        <div className="almacen-header">
          <button onClick={() => setIsModalOpen(true)} className="new-item-button">
            Nuevo Usuario
          </button>

          <div className="view-switch">
            <button
              className={`view-button ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Tarjetas
            </button>
            <button
              className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Tabla
            </button>
          </div>

          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* 🔧 Filtro por rol */}
          <div className="search-container" style={{ marginLeft: '10px' }}>
            <select
              className="search-bar"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Todos los Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modales */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsModalOpen(false)} className="close-button">×</button>
              <UserCreate onClose={() => setIsModalOpen(false)} onUserRegistered={fetchUsers} />
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsUpdateModalOpen(false)} className="close-button">×</button>
              <UserEdit userId={selectedUserId} onClose={() => setIsUpdateModalOpen(false)} onUserUpdated={fetchUsers} />
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsDeleteModalOpen(false)} className="close-button">×</button>
              <UserDelete userId={selectedUserId} onClose={() => setIsDeleteModalOpen(false)} onUserDeleted={fetchUsers} />
            </div>
          </div>
        )}

        <div className="outerContainer">
          {viewMode === 'cards' ? (
            <div className="innerContainer">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Nombre Usuario</th>
                    <th>Celular</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name} {user.lastname}</td>
                      <td>{user.username}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className='form-button-primary' style={{ minWidth: '100px', padding: '8px 12px', marginRight: '2px' }} onClick={() => handleEdit(user.id)}>
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </button>
                        <button className='form-button-primary' style={{ minWidth: '100px', padding: '8px 12px' }} onClick={() => handleDelete(user.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

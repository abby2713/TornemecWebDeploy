'use client'
import { useEffect, useState } from "react";
import ItemCard from '../../components/item_card';
import ItemRegister from './modal_create';
import ItemEdit from './modal_edit';
import ItemDelete from './modal_delete';
import ItemAsing from './modal_asing';
import ItemAdd from './modal_add';
import ItemReportModal from './modal_report'; // o la ruta correcta
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/content_pages.css";
import { getItems } from "@/utils/api";

import AuthenticatedLayout from '@/components/AuthenticatedLayout.jsx';

export default function Store() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAsingModalOpen, setIsAsingModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemStock, setSelectedItemStock] = useState(0); // 🔹 stock dinámico
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Para enviar el objeto completo
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);


  const fetchItems = async () => {
    try {
      const response = await getItems();
      if (response.data) {
        // Ordenar por última modificación o creación
        const sortedItems = response.data.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at);
          const dateB = new Date(b.updated_at || b.created_at);
          return dateB - dateA; // Más reciente primero
        });
        setItems(sortedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (itemId) => {
    setSelectedItemId(itemId);
    setIsUpdateModalOpen(true);
  };
  const handleDelete = (itemId) => {
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
  };
  const handleAssign = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItemId(itemId);
      setSelectedItemStock(item.stock); // 📦 capturamos el stock real
      setIsAsingModalOpen(true);
    }
  };
  const handleAdd = (item) => {
    setSelectedItem(item);
    setIsAddModalOpen(true);
  };
  const handleReport = (itemId) => {
    setSelectedItemId(itemId);
    setIsReportModalOpen(true);
  };


  return (
    <AuthenticatedLayout>
      <div>
        <div>
          <h1 className="titles">ITEMS</h1>
        </div>
        {/* Header */}
        <div className="almacen-header">
          <button onClick={() => setIsModalOpen(true)} className="new-item-button">
            Nuevo Item
          </button>
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Modal: Crear Item */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsModalOpen(false)} className="close-button">×</button>
              <ItemRegister
                onClose={() => setIsModalOpen(false)}
                onItemRegistered={fetchItems}
              />
            </div>
          </div>
        )}
        {/* Modal: Editar Item */}
        {isUpdateModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsUpdateModalOpen(false)} className="close-button">×</button>
              <ItemEdit
                itemId={selectedItemId}
                onClose={() => setIsUpdateModalOpen(false)}
                onItemUpdated={fetchItems}
              />
            </div>
          </div>
        )}
        {/* Modal: Asignar Item */}
        {isAsingModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsAsingModalOpen(false)} className="close-button">×</button>
              <ItemAsing
                item={items.find(i => i.id === selectedItemId)} // ← aquí pasamos el objeto completo
                onClose={() => setIsAsingModalOpen(false)}
                onItemAssigned={fetchItems}
              />
            </div>
          </div>
        )}
        {/* Modal: Eliminar Item */}
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsDeleteModalOpen(false)} className="close-button">×</button>
              <ItemDelete
                itemId={selectedItemId}
                onClose={() => setIsDeleteModalOpen(false)}
                onItemDeleted={fetchItems}
              />
            </div>
          </div>
        )}
        {/* Modal: Añadir Stock */}
        {isAddModalOpen && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsAddModalOpen(false)} className="close-button">×</button>
              <ItemAdd
                item={selectedItem}
                onClose={() => setIsAddModalOpen(false)}
                onItemUpdated={fetchItems}
              />
            </div>
          </div>
        )}
        {isReportModalOpen && selectedItemId && (
          <ItemReportModal
            itemId={selectedItemId}
            onClose={() => setIsReportModalOpen(false)}
          />
        )}

        {/* Lista de ítems */}
        <div className='outerContainer'>
          <div className='innerContainer'>
            {items
              .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.brand.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <ItemCard
                  key={item.id} // ✅ clave única para cada ítem
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAssign={handleAssign}
                  onAdd={handleAdd}
                  onReport={handleReport}
                />
              ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

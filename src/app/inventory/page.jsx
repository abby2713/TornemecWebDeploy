'use client'

import { useEffect, useState } from 'react';
import { getMachines } from "../../utils/api.js";

import ProductCard from '../../components/machine_card';

import MachineDetail from './modal_details.jsx'
import MachineResgister from './modal_create';
import MachineEdit from './modal_edit'
import MachineDelete from './modal_delete.jsx'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "../../styles/content_pages.css";

import AuthenticatedLayout from '@/components/AuthenticatedLayout.jsx';

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");  // <-- Estado para la búsqueda

  const fetchMachines = async () => {
    try {
      const response = await getMachines();
      if (response.data) {
        const sortedMachines = response.data.sort((a, b) => a.id - b.id);
        setMachines(sortedMachines);
      } else {
        setMachines([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDetail = (machineId) => {
    setSelectedMachineId(machineId);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (machineId) => {
    setSelectedMachineId(machineId);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (machineId) => {
    setSelectedMachineId(machineId);
    setIsDeleteModalOpen(true);
  };

  // Filtrar máquinas según el término de búsqueda (busca en nombre y marca, ajusta según campos)
  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthenticatedLayout>
      <div>
        <div>
          <h1 className="titles">MAQUINARIAS</h1>
        </div>
        {/* Header */}
        <div className="almacen-header">
          <button onClick={() => setIsModalOpen(true)} className="new-item-button">
            Nueva Maquina
          </button>

          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar..."
              value={searchTerm}  // <-- valor del input
              onChange={(e) => setSearchTerm(e.target.value)}  // <-- actualiza el estado
            />
          </div>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsModalOpen(false)} className="close-button">×</button>
              <MachineResgister
                onClose={() => setIsModalOpen(false)}
                onMachineRegistered={fetchMachines}
              />
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsUpdateModalOpen(false)} className="close-button">×</button>
              <MachineEdit
                machineId={selectedMachineId}
                onClose={() => setIsUpdateModalOpen(false)}
                onMachineUpdated={fetchMachines}
              />
            </div>
          </div>
        )}

        {isDetailModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsDetailModalOpen(false)} className="close-button">×</button>
              <MachineDetail
                machineId={selectedMachineId}
                onClose={() => setIsDetailModalOpen(false)}
              />
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsDeleteModalOpen(false)} className="close-button">×</button>
              <MachineDelete
                machineId={selectedMachineId}
                onClose={() => setIsDeleteModalOpen(false)}
                onMachineDeleted={fetchMachines}
              />
            </div>
          </div>
        )}

        {/* Lista filtrada */}
        <div className='outerContainer'>
          <div className='innerContainer'>
            {filteredMachines.map((machine) => (
              <ProductCard
                key={machine.id}
                machine={machine}
                onDetail={handleDetail}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

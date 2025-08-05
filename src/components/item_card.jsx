import '../styles/cards.css';
import { QRCodeCanvas } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUserPlus, faPlus, faQrcode, faFileAlt } from "@fortawesome/free-solid-svg-icons";

const ItemCard = ({ item, onEdit, onDelete, onAssign, onAdd, onReport }) => {
    const {
        id,
        name,
        stock,
        model,
        brand,
        unitprice,
        imageurl,
        codigoitem
    } = item;

    const downloadQRCode = () => {
        const canvas = document.getElementById(`qr-${id}`);
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `item-${codigoitem || name}-qr.png`;
        link.click();
    };

    return (
        <div className="card">
            <div className="imageContainer">
                <img src={`http://localhost:4000${imageurl}`} alt={name} className="item-image" />
            </div>

            <div className="details">
                <h3 className="title">{name}</h3>
                <p><strong>Código:</strong> {codigoitem}</p> {/* Nuevo campo visible */}

                <div className="row">
                    <p><strong>Stock:</strong> {stock}</p>
                    <p><strong>Precio Unitario:</strong> <span className="price">{unitprice} Bs</span></p>
                </div>
                <div className="row">
                    <p><strong>Modelo:</strong> {model}</p>
                    <p><strong>Marca:</strong> {brand}</p>
                </div>

                <div className="form-buttons-grid">
                    <div className="button-row">
                        <button className="button add-button" onClick={() => onAdd(item)}>
                            <FontAwesomeIcon icon={faPlus} /> Añadir
                        </button>
                        <button className="button edit-button" onClick={() => onEdit(id)}>
                            <FontAwesomeIcon icon={faEdit} /> Editar
                        </button>
                    </div>
                    <div className="button-row">
                        <button className="button assign-button" onClick={() => onAssign(id)}>
                            <FontAwesomeIcon icon={faUserPlus} /> Asignar
                        </button>
                        <button className="button delete-button" onClick={() => onDelete(id)}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                        </button>
                    </div>
                    <div className="button-row">
                        <button className="button report-button" onClick={() => onReport(id)}>
                            <FontAwesomeIcon icon={faFileAlt} /> Reportes
                        </button>
                    </div>
                </div>
            </div>

            <div className="qr-container">
                <QRCodeCanvas
                    id={`qr-${id}`}
                    value={codigoitem || `${id}`}
                    size={128}
                    style={{ display: 'none' }}
                />
                <button
                    className="button qr-button"
                    onClick={downloadQRCode}
                    title="Descargar código QR"
                >
                    <FontAwesomeIcon icon={faQrcode} /> Descargar QR
                </button>
            </div>
        </div>
    );
};

export default ItemCard;

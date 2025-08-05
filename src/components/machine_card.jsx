import '../styles/cards.css'; // Importa el CSS
import { QRCodeCanvas } from 'qrcode.react'; // Usamos QRCodeCanvas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faEdit, faTrashAlt, faQrcode } from "@fortawesome/free-solid-svg-icons";

const MachineCard = ({ machine, onDetail, onEdit, onDelete }) => {
  const { id, name, brand, price, model } = machine;

  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-${id}`);
    const imageUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `machine-${name}-qr.png`; // Nombre del archivo descargado
    link.click();
  };

  return (
    <div className={'card'}>
      <div className={'imageContainer'}>
        <img src={`https://v14m7300-4000.brs.devtunnels.ms${machine.imageurl}`} alt="Maquina" width="300" />
      </div>
      <div className={'details'}>
        <h3 className={'title'}>{name}</h3>
        <div className='row'>
          <p><strong>Marca: </strong>{brand}</p>
          <p><strong>Precio: </strong><span className='price'>{price} Bs</span></p>
          <p><strong>Modelo: </strong>{model}</p>
        </div>
        <div className='form-buttons'>
          <button className='form-button-primary' onClick={() => onDetail(id)}>
            <FontAwesomeIcon icon={faCircleInfo} /> Detalles
          </button>
          <button className='form-button-primary' onClick={() => onEdit(id)}>
            <FontAwesomeIcon icon={faEdit} /> Editar
          </button>
          <button className='form-button-primary' onClick={() => onDelete(id)}>
            <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
          </button>
        </div>
      </div>
      <div className="qr-container">
        <div className="product-data">
          <QRCodeCanvas id={`qr-${id}`} value={`${id}`} size={128} style={{ marginBottom: '10px', display: 'none' }} />
          <button className={'button'} onClick={downloadQRCode}>
            <FontAwesomeIcon icon={faQrcode} /> Descargar
          </button>
        </div>
      </div>

    </div>
  );
};

export default MachineCard;

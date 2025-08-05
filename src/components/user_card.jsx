import '../styles/cards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const UserCard = ({ user, onEdit, onDelete }) => {
    const { id, name, lastname, username, phone, role, image } = user;

    return (
        <div className={'card'}>
            <div className={'imageContainer'}>
                <img src={`http://localhost:4000${image}`} alt="Usuario" width="300" />
            </div>
            <div className={'details'}>
                <h3 className={'title'}>{name + " " + lastname}</h3>
                
                <div className='row'>
                    <p><strong>Usuario: </strong> {username}</p>
                    <p><strong>Celular: </strong> {phone}</p>
                    <p><strong>Rol: </strong> {role}</p> 
                </div>

                <div className='form-buttons' style={{ display: 'flex', gap: '5px', justifyContent: 'center', padding: '10px' }}>
                    <button className='form-button-primary' style={{ flex: 1, minWidth: '100px', padding: '8px 12px' }} onClick={() => onEdit(id)}>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                    </button>
                    <button className='form-button-primary' style={{ flex: 1, minWidth: '100px', padding: '8px 12px' }} onClick={() => onDelete(id)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

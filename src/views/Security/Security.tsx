import { PhotosBackend } from '../../components'
import './Security.css'

const SecurityView: React.FC = () => {
    

    return(
        <div className='securityView-container'>
        <h3>Security</h3>
        <div className="security-img">
            <div className="security-img-buttons">
                <button>Editar</button>
            </div>
            <PhotosBackend/>
        </div>
        </div>
    )
}


export default SecurityView 





import PhotoBackendEdit from '../../components/PhotoBackendEdit/PhotoBackendEdit'
import './Security.css'

const SecurityView: React.FC = () => {
    

    return(
        <div className='securityView-container'>
        <h3>Security</h3>
        <div className="security-img">
            
            <PhotoBackendEdit />
        </div>
        </div>
    )
}


export default SecurityView 




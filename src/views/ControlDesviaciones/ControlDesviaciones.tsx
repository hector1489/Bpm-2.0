import { DesviacionesTable } from '../../components'
import { useNavigate } from 'react-router-dom'
import logoFungi from '../../assets/img/logo.jpg'
import './ControlDesviaciones.css'


const ControlDesviaciones: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/home');
  };


  return (
    <div className="control-desviaciones-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3 className='m-4'>Control De Desviaciones</h3>
      <div className='control-desviaciones-table'>
        <DesviacionesTable />
      </div>
      <div className="buttons-desviaciones">
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default ControlDesviaciones



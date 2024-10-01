import './DefaultView.css'
import { useNavigate } from 'react-router-dom'
import logoFungi from '../../assets/img/logo.jpg'



const DefaultView: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="default-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3>DEFAULT !!</h3>
      <p>Perdon esta area aun se encuentra en construccion 🚜 !</p>
      <button onClick={handleGoToHome}>Home</button>
    </div>
  )
}


export default DefaultView


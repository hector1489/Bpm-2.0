import './DefaultView.css'
import { useNavigate } from 'react-router-dom'




const DefaultView: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="default-container">
      <h3>DEFAULT !!</h3>
      <p>Perdon esta area aun se encuentra en construccion 🚜 !</p>
      <button onClick={handleGoToHome}>Home</button>
    </div>
  )
}


export default DefaultView


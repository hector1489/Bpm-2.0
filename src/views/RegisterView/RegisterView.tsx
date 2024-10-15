import { RegisterForm } from '../../components'
import { useNavigate } from 'react-router-dom'
import './RegisterView.css'

const RegisterView: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/home')
  }

  return (

    <div className="register-view-container">
      <RegisterForm />

      <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>

    </div>
  )
}


export default RegisterView


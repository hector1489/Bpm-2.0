import './LoginForm.css'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/GlobalState'

const LoginForm: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { setState } = context;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !password) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    const isAuthenticated = name === 'admin' && password === 'admin';

    if (isAuthenticated) {

      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
      }));

      navigate('/');
    } else {
      setErrorMessage('Nombre de usuario o contraseña incorrectos.');
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Nombre de Usuario:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

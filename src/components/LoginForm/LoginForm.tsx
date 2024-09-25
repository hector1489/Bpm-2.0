import './LoginForm.css'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/GlobalState'

const loginUrl = 'https://bpm-backend.onrender.com/login'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !password) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si la autenticación fue exitosa
        setState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          userName: name,
        }));

        navigate('/');
      } else {
        // Si el backend devuelve un error
        setErrorMessage(data.message || 'Nombre de usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      setErrorMessage('Ocurrió un error al intentar iniciar sesión.');
    }
  };

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

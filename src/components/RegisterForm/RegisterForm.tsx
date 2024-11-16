import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterForm.css';

const registerUrl = 'https://bpm-backend.onrender.com/user/register';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log('Form data updated:', formData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      setErrorMessage('Por favor, complete todos los campos.');
      if (process.env.NODE_ENV === 'development') {
        console.log('Error: Campos vacíos', formData);
      }
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending request to:', registerUrl);
        console.log('Data being sent:', formData);
      }

      const response = await axios.post(registerUrl, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      });

      if (response.status === 200 || response.status === 201) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Registro exitoso', response.data);
        }
        navigate('/home');
      } else {
        setErrorMessage(response.data.message || 'Error en el registro.');
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error);
      setErrorMessage('Ocurrió un error al intentar registrar el usuario.');
    }
  };

  return (
    <div className="register-form-container">
      <h3>Registro de Usuario</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterForm;

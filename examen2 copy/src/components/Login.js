import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Eliminamos la autenticación: aceptamos cualquier entrada y creamos el usuario localmente.
    try {
      const generatedName = name && name.trim() !== '' ? name.trim() : (email && email.trim() !== '' ? email.trim() : 'user' + Math.floor(Math.random() * 9000 + 1000));
      const generatedEmail = email && email.trim() !== '' ? email.trim() : generatedName;
      const user = {
        _id: 'local-' + Math.floor(Math.random() * 100000),
        name: generatedName,
        email: generatedEmail
      };

      // Directamente accedemos a la app sin llamar al backend
      onLogin(user);
    } catch (err) {
      setError('Error procesando el formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🎶 MusicHub</h1>
        <h2>{isSignUp ? 'Crear Cuenta' : 'Inicia Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre completo (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // no required for signup: accept any input
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder={isSignUp ? 'Identificador (cualquier palabra)' : 'Correo electrónico'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!isSignUp}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder={isSignUp ? 'Contraseña (opcional)' : 'Contraseña'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isSignUp}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="toggle-auth">
          {isSignUp ? 'Ya tienes cuenta? ' : 'No tienes cuenta? '}
          <span onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}>
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

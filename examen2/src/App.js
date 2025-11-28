import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario guardado (no usamos token)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <>
      {isLoggedIn ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;

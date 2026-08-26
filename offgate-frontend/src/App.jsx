import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Ao abrir o app, verifica se já existe um crachá salvo
    const token = localStorage.getItem('@OffGate:token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard 
          onLogout={() => {
            localStorage.removeItem('@OffGate:token'); // Destrói o crachá
            setIsAuthenticated(false); // Volta pra tela de login
          }} 
        />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
      <Toaster position="bottom-right" />
    </>
  );
}
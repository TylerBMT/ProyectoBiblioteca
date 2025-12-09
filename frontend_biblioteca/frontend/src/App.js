// src/App.js
import React, { useEffect, useState } from 'react';
import { initializeCSRFToken } from './services/api';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LibrosPage from './pages/LibrosPage';
import PrestamosPage from './pages/PrestamosPage';
import ClientesPage from './pages/ClientesPage';

function App() {
  const [csrfStatus, setCsrfStatus] = useState('pendiente');
  const [user, setUser] = useState(null);          // aquí guardamos el usuario logueado
  const [currentView, setCurrentView] = useState('libros');  // libros | prestamos | clientes
  const [authView, setAuthView] = useState('login');         // login | register

  useEffect(() => {
    const init = async () => {
      try {
        await initializeCSRFToken();
        setCsrfStatus('ok');
      } catch (e) {
        console.error(e);
        setCsrfStatus('error');
      }
    };
    init();
  }, []);

  // Cuando el login tiene éxito
  const handleLoginSuccess = (data) => {
    setUser({
      username: data.username,
      roles: data.roles || [],
    });
    setCurrentView('libros');   // después de login, mostrar siempre la página de libros
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
    setCurrentView('libros');
  };

  // ===========================
  // SIN USUARIO: LOGIN / REGISTRO
  // ===========================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {/* ESTE ES EL CUADRADO CENTRADO */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-center text-indigo-700">
            Biblioteca Virtual
          </h1>

          {authView === 'login' ? (
            <>
              <LoginPage
                csrfStatus={csrfStatus}
                onLoginSuccess={handleLoginSuccess}
                onShowRegister={() => setAuthView('register')}
              />
            </>
          ) : (
            <>
              <RegisterPage onShowLogin={() => setAuthView('login')} />
            </>
          )}
        </div>
      </div>
    );
  }

  // ===========================
  // CON USUARIO: APP NORMAL
  // ===========================
  const isAdmin = user.roles.includes('Administrador');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Sistema de Biblioteca</h1>
            <p className="text-sm text-indigo-100">
              Bienvenido, <span className="font-bold">{user.username}</span> · Roles:{' '}
              {user.roles.join(', ')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-indigo-800 hover:bg-indigo-900 rounded-lg text-sm font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setCurrentView('libros')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'libros'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Buscar libros
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setCurrentView('prestamos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'prestamos'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Préstamos
              </button>

              <button
                onClick={() => setCurrentView('clientes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'clientes'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Añadir clientes
              </button>
            </>
          )}
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            {currentView === 'libros' && <LibrosPage user={user} />}
            {currentView === 'prestamos' && isAdmin && <PrestamosPage user={user} />}
            {currentView === 'clientes' && isAdmin && <ClientesPage user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

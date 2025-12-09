import React, { useState, useCallback } from 'react';
import api from '../services/api';

function LoginPage({ csrfStatus, onLoginSuccess, onShowRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const loginUrl = '/api/v1/login/';

    try {
      const response = await api.post(loginUrl, {
        username: username,
        password: password
      });

      if (response.status === 200) {
        setMessage('✅ Inicio de sesión exitoso.');
        onLoginSuccess && onLoginSuccess(response.data);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorStatus = error.response ? error.response.status : null;
      
      if (errorStatus === 403) {
        setMessage(`❌ Error 403: Fallo de verificación CSRF. Estado actual: ${csrfStatus}`);
      } else if (errorStatus === 401) {
        setMessage('❌ Credenciales inválidas. Intente de nuevo.');
      } else {
        setMessage(`❌ Error al conectar: ${error.message}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [username, password, csrfStatus, onLoginSuccess]);

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Escriba su usuario"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="••••••••"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white transition duration-200 
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
      >
        {loading ? 'Cargando...' : 'Entrar'}
      </button>

      {/* enlace para ir a la página de registro */}
      {onShowRegister && (
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onShowRegister}
            className="text-indigo-600 hover:underline font-medium"
          >
            Crear cuenta
          </button>
        </p>
      )}
      
      {message && (
        <div
          className={`p-3 rounded-lg text-center ${
            message.includes('exitoso') || message.includes('✅')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default LoginPage;

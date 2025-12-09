// src/pages/RegisterPage.js
import React, { useState } from 'react';
import api from '../services/api';

function RegisterPage({ onShowLogin }) {
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await api.post('/api/v1/registro/', {
        username,
        email,
        first_name: nombre,
        last_name: apellido,
        estado: 'Activo',
        password,
      });

      setMensaje('Registro exitoso. Ya puedes iniciar sesión.');
      setUsername('');
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setPassword2('');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        const msg = typeof data === 'string' ? data : JSON.stringify(data);
        setError(`Error al registrarse: ${msg}`);
      } else {
        setError('Error al registrarse. Intenta más tarde.');
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="usuario123"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Apellido"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="cliente@correo.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Contraseña"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Repetir contraseña</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Repite la contraseña"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
      >
        Crear cuenta
      </button>

      {mensaje && (
        <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm mt-2">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm mt-2">
          {error}
        </div>
      )}

      <p className="mt-2 text-sm text-center text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onShowLogin}
          className="text-indigo-600 hover:underline font-medium"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

export default RegisterPage;

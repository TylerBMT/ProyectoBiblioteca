// src/pages/ClientesPage.js
import React, { useState, useEffect } from 'react';
import { fetchClientes, crearCliente } from '../services/api';

function ClientesPage({ user }) {
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarClientes = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetchClientes();
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await crearCliente({
        username,
        email,
        first_name: nombre,
        last_name: apellido,
        estado: 'Activo',
        password, // se envía al backend y se guarda con set_password
      });
      setMensaje('Cliente registrado correctamente.');
      setUsername('');
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setPassword2('');
      await cargarClientes();
    } catch (err) {
      console.error(err);
      setError('Error al registrar el cliente.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Gestión de clientes (usuarios)</h2>
        <p className="text-sm text-gray-500">
          Solo administradores. Usuario: {user.username}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 items-end"
      >
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Contraseña del cliente"
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

        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition w-full md:w-auto"
          >
            Registrar cliente
          </button>
        </div>
      </form>

      {mensaje && (
        <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Clientes registrados</h3>
        {loading && <p className="text-sm text-gray-500">Cargando clientes...</p>}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Username</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Correo</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Roles</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.username}</td>
                  <td className="px-4 py-2">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.estado}</td>
                  <td className="px-4 py-2">
                    {(c.roles || []).join(', ')}
                  </td>
                </tr>
              ))}
              {!loading && clientes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientesPage;

// src/pages/PrestamosPage.js
import React, { useState, useEffect } from 'react';
import {
  fetchPrestamos,
  crearPrestamo,
  fetchLibros,
  fetchClientes,
  devolverPrestamo,
} from '../services/api';

function PrestamosPage({ user }) {
  const [clienteId, setClienteId] = useState('');
  const [libroId, setLibroId] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // ---------------------------
  // Cargar datos iniciales
  // ---------------------------
  const cargarDatos = async () => {
    setError('');
    try {
      const [prestamosRes, librosRes, clientesRes] = await Promise.all([
        fetchPrestamos(),
        fetchLibros(),
        fetchClientes(),
      ]);
      setPrestamos(prestamosRes.data);
      setLibros(librosRes.data);
      setClientes(clientesRes.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos de préstamos/libros/clientes.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ---------------------------
  // Registrar préstamo nuevo
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!clienteId || !libroId || !fechaDevolucion) {
      setError('Debe seleccionar cliente, libro y fecha de devolución.');
      return;
    }

    try {
      await crearPrestamo({
        cliente: Number(clienteId),
        libro: Number(libroId),
        fecha_devolucion_esperada: fechaDevolucion,
      });

      setMensaje('Préstamo registrado correctamente.');
      setClienteId('');
      setLibroId('');
      setFechaDevolucion('');
      await cargarDatos();
    } catch (err) {
      console.error('Error al registrar préstamo:', err.response?.data || err);
      setError('Error al registrar el préstamo.');
    }
  };

  // ---------------------------
  // Marcar préstamo como devuelto
  // ---------------------------
  const handleDevolver = async (id) => {
    setError('');
    setMensaje('');

    try {
      await devolverPrestamo(id);
      setMensaje('Préstamo marcado como devuelto.');
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError('Error al marcar el préstamo como devuelto.');
    }
  };

  // Helper para chip de estado
  const renderEstadoChip = (estado) => {
    let clases =
      'px-2 py-1 rounded-full text-xs font-semibold inline-block ';

    if (estado === 'Devuelto') {
      clases += 'bg-green-100 text-green-700';
    } else if (estado === 'Vencido') {
      clases += 'bg-red-100 text-red-700';
    } else {
      // Activo u otro
      clases += 'bg-yellow-100 text-yellow-700';
    }

    return <span className={clases}>{estado}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de préstamos
        </h2>
        <p className="text-sm text-gray-500">
          Solo disponible para administradores. Usuario: {user.username}
        </p>
      </div>

      {/* Formulario alta préstamo */}
      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 border border-gray-200 rounded-lg p-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.username} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Libro
          </label>
          <select
            value={libroId}
            onChange={(e) => setLibroId(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            required
          >
            <option value="">Seleccione un libro</option>
            {libros.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha devolución
          </label>
          <input
            type="date"
            value={fechaDevolucion}
            onChange={(e) => setFechaDevolucion(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition w-full md:w-auto"
          >
            Registrar préstamo
          </button>
        </div>
      </form>

      {/* Mensajes */}
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

      {/* Tabla préstamos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Préstamos activos / históricos
        </h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Cliente
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Libro
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Fecha devolución esperada
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {prestamos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    No hay préstamos registrados.
                  </td>
                </tr>
              )}

              {prestamos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    {p.cliente_nombre || p.cliente}
                  </td>
                  <td className="px-4 py-2">
                    {p.libro_titulo || p.libro}
                  </td>
                  <td className="px-4 py-2">
                    {p.fecha_devolucion_esperada}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {renderEstadoChip(p.estado)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {p.estado !== 'Devuelto' ? (
                      <button
                        onClick={() => handleDevolver(p.id)}
                        className="px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
                      >
                        Marcar devuelto
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Sin acciones
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrestamosPage;

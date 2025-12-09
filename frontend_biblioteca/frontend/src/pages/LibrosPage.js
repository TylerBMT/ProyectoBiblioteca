// src/pages/LibrosPage.js
import React, { useState, useEffect } from 'react';
import { fetchLibros } from '../services/api';

function LibrosPage({ user }) {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [autor, setAutor] = useState('');
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarLibros = async (filtros = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchLibros(filtros);
      setLibros(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar libros desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar todos los libros al entrar
    cargarLibros();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    const filtros = {
      q: search || undefined,
      autor: autor || undefined,
      categoria: categoria || undefined,
    };
    cargarLibros(filtros);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Búsqueda de libros</h2>
        <p className="text-sm text-gray-500">
          {user && `Conectado como ${user.username}.`} Busca libros por título, autor o categoría.
        </p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        onSubmit={handleBuscar}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título o palabras clave</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: Don Quijote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ej: Isabel Allende"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Todas</option>
            <option value="Novela">Novela</option>
            <option value="Infantil">Infantil</option>
            <option value="Clásico">Clásico</option>
          </select>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
          >
            Buscar
          </button>
        </div>
      </form>

      {loading && <p className="text-sm text-gray-500">Cargando libros...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Resultados</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Título</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Autor</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Categoría</th>
                <th className="px-4 py-2 text-center font-medium text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id} className="border-t">
                  <td className="px-4 py-2">{libro.titulo}</td>
                  <td className="px-4 py-2">{libro.autor}</td>
                  <td className="px-4 py-2">{libro.categoria}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        libro.estado === 'Prestado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {libro.estado || 'Disponible'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && libros.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                    No hay resultados para los filtros seleccionados.
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

export default LibrosPage;

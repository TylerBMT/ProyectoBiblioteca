import axios from 'axios';

const api = axios.create({
    baseURL: '/', 
    withCredentials: true, 
});

function getCSRFToken() {
    const token = document.cookie.match(/csrftoken=([^;]+)/);
    return token ? token[1] : null;
}

export async function initializeCSRFToken() {
    const csrfUrl = '/api/v1/csrf-token/'; 
    
    try {
        await api.get(csrfUrl); 
    } catch (error) {
        console.error("Error al intentar obtener el cookie CSRF de Django.", error);
    }

    const csrfToken = getCSRFToken();

    if (csrfToken) {
        api.defaults.headers.common['X-CSRFToken'] = csrfToken;
        console.log("Token CSRF configurado en Axios.");
    } else {
        console.warn("No se pudo obtener el token CSRF después de la inicialización.");
    }
}

// --- Helpers de API para la app ---

export function fetchLibros(params) {
  return api.get('/api/v1/libros/', { params });
}

export function fetchPrestamos() {
  return api.get('/api/v1/prestamos/');
}

export function crearPrestamo(data) {
  return api.post('/api/v1/prestamos/', data);
}

export function fetchClientes() {
  return api.get('/api/v1/clientes/');
}

export function crearCliente(data) {
  return api.post('/api/v1/clientes/', data);
}

export default api;

// Registro público de clientes
export function registrarClientePublico(data) {
  return api.post('/api/v1/registro/', data);
}

export const devolverPrestamo = (id) =>
  api.post(`/api/v1/prestamos/${id}/devolver/`);


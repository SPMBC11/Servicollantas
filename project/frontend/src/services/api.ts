// Servicio de API para conectar con el backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://servicollantas.onrender.com'';

// Función helper para hacer requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  try {
    const response = await fetch(url, config);
    
    // Manejar 304 como respuesta exitosa (No Modified)
    if (response.status === 304) {
      console.warn('Response 304 (Not Modified) - retornando array vacío');
      return [];
    }
    
    if (!response.ok) {
      // Si el token es inválido o ha expirado, cerramos la sesión
      if (response.status === 401 && !url.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(
          new Error('Sesión no autorizada o expirada. Por favor, inicie sesión de nuevo.')
        );
      }
      const errorData = await response
        .json()
        .catch(() => ({ message: `Error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Respuestas sin contenido (204)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Servicios de autenticación
export const authService = {
  async login(email: string, password: string) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

// Servicios de clientes
export const clientService = {
  async getAll() {
    return apiRequest('/api/clients');
  },
  async create(client: { name: string; phone: string; email: string }) {
    return apiRequest('/api/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },
  async update(id: string, client: { name: string; phone: string; email: string }) {
    return apiRequest(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },
  async delete(id: string) {
    return apiRequest(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicios de vehículos
export const vehicleService = {
  async getAll() {
    return apiRequest('/api/vehicles');
  },
  async getByClient(clientId: string) {
    return apiRequest(`/api/vehicles/client/${clientId}`);
  },
  async create(vehicle: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    client_id: string;
  }) {
    return apiRequest('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  },
  async update(id: string, vehicle: {
    make: string;
    model: string;
    year: number;
    license_plate: string;
    client_id: string;
  }) {
    return apiRequest(`/api/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle),
    });
  },
  async delete(id: string) {
    return apiRequest(`/api/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicios de servicios
export const serviceService = {
  async getAll() {
    try {
      const result = await apiRequest('/api/services');
      // Asegurar que siempre retorna un array
      if (!Array.isArray(result)) {
        console.warn('serviceService.getAll() no retornó un array:', result);
        return [];
      }
      return result;
    } catch (error) {
      console.error('Error en serviceService.getAll():', error);
      throw error;
    }
  },
  async create(service: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) {
    return apiRequest('/api/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  },
  async update(id: string, service: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) {
    return apiRequest(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  },
  async delete(id: string) {
    return apiRequest(`/api/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicios de citas/reservas
export const appointmentService = {
  async getAll() {
    return apiRequest('/api/bookings');
  },
  async create(appointment: {
    client_id: string;
    vehicle_id: string;
    service_id: string;
    date: string;
    time: string;
    notes?: string;
  }) {
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },
  async update(id: string, appointment: {
    status: string;
    notes?: string;
  }) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  },
  async delete(id: string) {
    return apiRequest(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicios de facturas
export const invoiceService = {
  async getAll() {
    return apiRequest('/api/invoices');
  },
  async getById(id: string) {
    return apiRequest(`/api/invoices/${id}`);
  },
  async create(invoice: {
    client_name: string;
    client_email: string;
    vehicle_info: string;
    services: Array<{ id: string; name: string; price: number; duration: number }>;
    total: number;
    status?: string;
  }) {
    return apiRequest('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  },
  async delete(id: string) {
    return apiRequest(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
  },
  async downloadPDF(id: string) {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/api/invoices/${id}/pdf`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error downloading PDF');
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `factura-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

// Servicio de salud
export const healthService = {
  async check() {
    return apiRequest('/api/health');
  },
};

// Exportar URL base para uso en componentes
export { API_BASE_URL };

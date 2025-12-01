// Servicio de API para conectar con el backend
const API_BASE_URL = '/api';

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
    
    if (!response.ok) {
      // Si el token es inválido o ha expirado, cerramos la sesión (excepto en la página de login).
      if (response.status === 401 && !url.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirige a la página de login
        return Promise.reject(new Error('Sesión no autorizada o expirada. Por favor, inicie sesión de nuevo.'));
      }
      
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle responses with no content (e.g., DELETE success)
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
    return apiRequest('/login', {
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
  }
};

// Servicios de clientes
export const clientService = {
  async getAll() {
    return apiRequest('/clients');
  },
  
  async create(client: { name: string; phone: string; email: string }) {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },
  
  async update(id: string, client: { name: string; phone: string; email: string }) {
    return apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/clients/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicios de vehículos
export const vehicleService = {
  async getAll() {
    return apiRequest('/vehicles');
  },
  
  async create(vehicle: { make: string; model: string; year: number; license_plate: string; client_id: string }) {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  },
  
  async update(id: string, vehicle: { make: string; model: string; year: number; license_plate: string; client_id: string }) {
    return apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicios de servicios
export const serviceService = {
  async getAll() {
    return apiRequest('/services');
  },
  
  async create(service: { name: string; description: string; price: number; duration: number }) {
    return apiRequest('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  },
  
  async update(id: string, service: { name: string; description: string; price: number; duration: number }) {
    return apiRequest(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/services/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicios de citas/reservas
export const appointmentService = {
  async getAll() {
    return apiRequest('/bookings');
  },
  
  async create(appointment: { 
    client_id: string; 
    vehicle_id: string; 
    service_id: string; 
    date: string; 
    time: string; 
    notes?: string; 
  }) {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  },
  
  async update(id: string, appointment: { 
    status: string; 
    notes?: string; 
  }) {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
};

// Servicios de facturas
export const invoiceService = {
  async getAll() {
    return apiRequest('/invoices');
  },
  
  async getById(id: string) {
    return apiRequest(`/invoices/${id}`);
  },
  
  async create(invoice: {
    client_name: string;
    client_email: string;
    vehicle_info: string;
    services: Array<{ id: string; name: string; price: number; duration: number }>;
    total: number;
    status?: string;
  }) {
    return apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },
  
  async downloadPDF(id: string) {
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/invoices/${id}/pdf`;
    
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
  }
};

// Servicio de salud
export const healthService = {
  async check() {
    return apiRequest('/health');
  }
};

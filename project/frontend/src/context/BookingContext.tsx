import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Appointment, Service, Vehicle, Client, AppointmentStatus } from '../types';
import { 
  clientService, 
  vehicleService, 
  serviceService, 
  appointmentService 
} from '../services/api';

interface BookingContextType {
  appointments: Appointment[];
  services: Service[];
  vehicles: Vehicle[];
  clients: Client[];
  selectedService: string | null;
  loading: boolean;
  error: string | null;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  selectService: (serviceId: string | null) => void;
  loadAppointments: () => Promise<void>;
  loadClients: () => Promise<void>;
  loadVehicles: () => Promise<void>;
  clearError: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales desde la API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener usuario actual
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      const userRole = user ? JSON.parse(user).role : null;

      // Cargar servicios (disponible para todos)
let servicesData: Service[] = [];
    try {
      servicesData = await serviceService.getAll();
      if (!Array.isArray(servicesData)) {
        console.warn('serviceService.getAll() no retornó un array:', servicesData);
        servicesData = [];
      }
    } catch (servErr) {
      console.error('Error cargando servicios:', servErr);
      servicesData = [];
    }
      let vehiclesData: Vehicle[] = [];
      let clientsData: Client[] = [];
      
      // Si hay usuario autenticado, obtener sus vehículos
      if (userId) {
        try {
          vehiclesData = await vehicleService.getByClient(userId);
        } catch (err) {
          console.warn('No se pudieron cargar vehículos del cliente:', err);
          vehiclesData = [];
        }
      }
      
      // Solo cargar clientes si el usuario es admin o mechanic
      if (userRole === 'admin' || userRole === 'mechanic') {
        try {
          clientsData = await clientService.getAll();
        } catch (err) {
          console.warn('No se pudieron cargar clientes:', err);
          clientsData = [];
        }
      }
      
      setServices(servicesData);
      setVehicles(vehiclesData);
      setClients(clientsData);

    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
      setError('Error cargando datos del servidor. Algunos datos pueden no mostrarse.');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const appointmentsData = await appointmentService.getAll();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error cargando citas:', err);
      setError('Error cargando citas');
    }
  };

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getAll();
      setClients(clientsData);
    } catch (err) {
      console.error('Error cargando clientes:', err);
      setError('Error cargando clientes');
    }
  };

  const loadVehicles = async () => {
    try {
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      
      if (userId) {
        const vehiclesData = await vehicleService.getByClient(userId);
        setVehicles(vehiclesData);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error('Error cargando vehículos:', err);
      setError('Error cargando vehículos');
    }
  };

  const addAppointment = async (appointment: Appointment) => {
    try {
      const newAppointment = await appointmentService.create({
        client_id: appointment.clientId,
        vehicle_id: appointment.vehicleId,
        service_id: appointment.serviceId || '',
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || ''
      });
      setAppointments((prev) => [...prev, newAppointment]);
    } catch (err) {
      console.error('Error creando cita:', err);
      setError('Error creando cita');
      throw err;
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await appointmentService.update(id, { status, notes: '' });
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error('Error actualizando cita:', err);
      setError('Error actualizando cita');
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await appointmentService.delete(id);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error('Error eliminando cita:', err);
      setError('Error eliminando cita');
      throw err;
    }
  };

  const addService = async (service: Service) => {
    try {
      const newService = await serviceService.create({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration
      });
      setServices((prev) => [...prev, newService]);
    } catch (err) {
      console.error('Error creando servicio:', err);
      setError('Error creando servicio');
      throw err;
    }
  };

  const addVehicle = async (vehicle: Vehicle) => {
    try {
      const newVehicle = await vehicleService.create({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license_plate: vehicle.license_plate,
        client_id: vehicle.clientId || ''
      });
      setVehicles((prev) => [...prev, newVehicle]);
    } catch (err) {
      console.error('Error creando vehículo:', err);
      setError('Error creando vehículo');
      throw err;
    }
  };

  const addClient = async (client: Client) => {
    try {
      const newClient = await clientService.create({
        name: client.name,
        phone: client.phone,
        email: client.email
      });
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      console.error('Error creando cliente:', err);
      setError('Error creando cliente');
      throw err;
    }
  };

  const selectService = (serviceId: string | null) => {
    setSelectedService(serviceId);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <BookingContext.Provider
      value={{
        appointments,
        services,
        vehicles,
        clients,
        selectedService,
        loading,
        error,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addService,
        addVehicle,
        addClient,
        selectService,
        loadAppointments,
        loadClients,
        loadVehicles,
        clearError,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

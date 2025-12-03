export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  clientId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating?: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "pendiente" | "pagada";
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  vehicle: string;
  date: string;
  services: Array<{ id: string; name: string; price: number; duration: number }>;
  total: number;
  status: "pendiente" | "pagada";
}
export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  vehicle: string;
  date: string;
  services: Array<{ id: string; name: string; price: number; duration: number }>;
  total: number;
}

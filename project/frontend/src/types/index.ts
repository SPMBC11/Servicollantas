// src/types/index.ts

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  clientId?: string; // Optional, if a vehicle belongs to a client
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  clientId: string;
  vehicleId: string;
  serviceId: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  serviceProviderId?: string; // Optional, if specific mechanic is chosen
  status: AppointmentStatus;
  notes?: string;
}

// For time slots, if we need to represent available times
export interface TimeSlot {
  time: string; // HH:MM
  available: boolean;
}

export interface Invoice {
  id: string; // FAC-2025-0001
  clientName: string;
  clientEmail: string;
  vehicle: string;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
  total: number;
  date: string; // ISO date
  status: "pendiente" | "pagada";
}
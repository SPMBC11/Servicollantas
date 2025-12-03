import { Service, Vehicle, Client, Appointment, TimeSlot } from '../types';

export const mockServices: Service[] = [
  {
    id: 'srv001',
    name: 'Cambio de Aceite',
    description: 'Cambio de aceite de motor y filtro.',
    price: 50.00,
    duration: 30,
  },
  {
    id: 'srv002',
    name: 'Rotación y Balanceo de Llantas',
    description: 'Rotación de llantas y balanceo de las cuatro ruedas.',
    price: 40.00,
    duration: 45,
  },
  {
    id: 'srv003',
    name: 'Alineación',
    description: 'Alineación de dirección.',
    price: 60.00,
    duration: 60,
  },
  {
    id: 'srv004',
    name: 'Revisión de Frenos',
    description: 'Inspección y ajuste de sistema de frenos.',
    price: 35.00,
    duration: 30,
  },
  // Services from Services.tsx
  {
    id: 'srv005',
    name: 'Cambio de Llantas',
    description: 'Instalación profesional de llantas nuevas y usadas con garantía de calidad.',
    price: 80.00, // Assuming a base price
    duration: 60,
  },
  {
    id: 'srv006',
    name: 'Alineación y Balanceo',
    description: 'Servicio completo de alineación computarizada y balanceo de precisión.',
    price: 45.00,
    duration: 60,
  },
  {
    id: 'srv007',
    name: 'Reparación de Llantas',
    description: 'Reparamos pinchazos, cortes laterales y daños menores en llantas.',
    price: 15.00,
    duration: 30,
  },
  {
    id: 'srv008',
    name: 'Mantenimiento General',
    description: 'Revisión completa del sistema de suspensión y dirección.',
    price: 60.00,
    duration: 90,
  },
  {
    id: 'srv009',
    name: 'Servicio a Domicilio',
    description: 'Llevamos nuestros servicios hasta donde te encuentres.',
    price: 0.00, // Price is "Consultar"
    duration: 120, // Placeholder duration
  },
  {
    id: 'srv010',
    name: 'Inspección Vehicular',
    description: 'Revisión técnico-mecánica y de emisiones contaminantes.',
    price: 120.00,
    duration: 90,
  },
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh001',
    make: 'Toyota',
    model: 'Corolla',
    year: 2018,
    license_plate: 'ABC-123',
    clientId: 'cli001',
  },
  {
    id: 'veh002',
    make: 'Honda',
    model: 'CRV',
    year: 2020,
    license_plate: 'DEF-456',
    clientId: 'cli002',
  },
  {
    id: 'veh003',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    license_plate: 'GHI-789',
    clientId: 'cli001',
  },
  {
    id: 'veh004',
    make: 'Mazda',
    model: '3',
    year: 2019,
    license_plate: 'JKL-101',
    clientId: 'cli002',
  },
  {
    id: 'veh005',
    make: 'Chevrolet',
    model: 'Spark',
    year: 2021,
    license_plate: 'MNO-212',
    clientId: 'cli001',
  },
  {
    id: 'veh006',
    make: 'Nissan',
    model: 'Versa',
    year: 2020,
    license_plate: 'PQR-323',
    clientId: 'cli002',
  },
  {
    id: 'veh007',
    make: 'Kia',
    model: 'Rio',
    year: 2023,
    license_plate: 'STU-434',
    clientId: 'cli001',
  },
  {
    id: 'veh008',
    make: 'Volkswagen',
    model: 'Jetta',
    year: 2021,
    license_plate: 'VWX-545',
    clientId: 'cli002',
  },
];

export const mockClients: Client[] = [
  {
    id: 'cli001',
    name: 'Juan Perez',
    phone: '555-1234',
    email: 'juan.perez@example.com',
  },
  {
    id: 'cli002',
    name: 'Maria Garcia',
    phone: '555-5678',
    email: 'maria.garcia@example.com',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'app001',
    clientId: 'cli001',
    vehicleId: 'veh001',
    serviceId: 'srv001',
    date: '2025-09-15',
    time: '10:00',
    status: 'pagada',
    notes: 'Cliente prefiere esperar en sala.',
  },
  {
    id: 'app002',
    clientId: 'cli002',
    vehicleId: 'veh002',
    serviceId: 'srv002',
    date: '2025-09-15',
    time: '11:00',
    status: 'pendiente',
    notes: '',
  },
];

// Example time slots for a day, assuming 30-minute intervals
export const mockTimeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: false }, // Booked by app001
  { time: '10:30', available: true },
  { time: '11:00', available: false }, // Booked by app002
  { time: '11:30', available: true },
  { time: '12:00', available: true },
  { time: '12:30', available: true },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
];
// src/types/Invoice.ts


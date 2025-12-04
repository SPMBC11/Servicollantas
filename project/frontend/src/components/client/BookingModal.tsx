import React, { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {  Appointment } from '../../types';
import { mockTimeSlots } from '../../data/mockData';
import LoadingSpinner from '../ui/LoadingSpinner';
import { vehicleService } from '../../services/api';

/**
 * @interface BookingModalProps
 * @property {boolean} isOpen - Controls if the modal is open or closed.
 * @property {() => void} onClose - Callback to close the modal.
 */
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId?: string | null;
}

/**
 * Extended booking type to include vehicle creation fields
 */
interface ExtendedBooking extends Partial<Appointment> {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleLicensePlate?: string;
}

/**
 * @component BookingModal
 *
 * Multi-step modal for clients to book an appointment.
 * Guides the user through selecting service, vehicle, date, time, and personal details.
 * Finally, generates a WhatsApp message and saves the appointment locally.
 */
const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedServiceId }) => {
  // States to control the modal flow
  const [step, setStep] = useState(1); // Current form step
  const [isLoading, setIsLoading] = useState(false); // Loading state for submission
  const [booking, setBooking] = useState<ExtendedBooking>({}); // In-progress booking data
  const [showAddVehicle, setShowAddVehicle] = useState(false); // Show add vehicle form

  // Hooks to access application contexts
  const { 
    appointments, 
    selectedService, 
    selectService, 
    services, 
    vehicles, 
    loading,
  } = useBooking();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const serviceId = selectedServiceId || selectedService;
      setBooking(prev => ({
        ...prev,
        serviceId: serviceId ?? undefined,
        vehicleLicensePlate: undefined // Ensure placa is cleared
      }));
      setStep(serviceId ? 2 : 1); // Solo salta al paso 2 si hay servicio seleccionado
      setIsLoading(false);
    } else {
      setStep(1);
      setBooking({});
      setIsLoading(false);
      selectService(null); // Clear selected service when modal closes
    }
  }, [isOpen, selectedService, selectService, selectedServiceId]);

  /**
   * Handles the final form submission.
   * Builds a message for WhatsApp and saves the appointment to the backend.
   */
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const selectedServiceInfo = services.find(s => s.id === booking.serviceId);
      
      if (!selectedServiceInfo || !booking.customerName || !booking.customerPhone) {
        alert('Por favor completa todos los campos requeridos.');
        setIsLoading(false);
        return;
      }

      // Datos del vehículo - puede ser uno existente o uno nuevo
      const vehicleInfo = booking.vehicleId 
        ? vehicles.find(v => v.id === booking.vehicleId)
        : {
            make: booking.vehicleMake || '',
            model: booking.vehicleModel || '',
            year: booking.vehicleYear || new Date().getFullYear(),
            license_plate: booking.vehicleLicensePlate || ''
          };

      if (!vehicleInfo?.make || !vehicleInfo?.model || !vehicleInfo?.license_plate) {
        alert('Por favor completa la información del vehículo');
        setIsLoading(false);
        return;
      }

      // Build the message for WhatsApp
      const message = `¡Hola! Me gustaría reservar una cita:\n\n📅 Fecha: ${booking.date}\n🕐 Hora: ${booking.time}\n🚗 Vehículo: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.license_plate})\n🛠️ Servicio: ${selectedServiceInfo.name}\n💰 Precio: $${(typeof selectedServiceInfo.price === 'string' ? parseFloat(selectedServiceInfo.price) : selectedServiceInfo.price).toFixed(2)}\n\n👤 Mis datos:\n• Nombre: ${booking.customerName}\n• Teléfono: ${booking.customerPhone}\n• Email: ${booking.customerEmail}\n\n¿Está disponible? ¡Gracias!`;
      
      // Assuming a default phone number for the service provider for WhatsApp
      const serviceProviderPhone = '573053113534'; // ServiCollantas phone
      const cleanPhone = serviceProviderPhone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Get or create client ID
      let clientId: string;
      const currentUser = localStorage.getItem('user');
      
      // Only use localStorage user if they're logged in as a CLIENT
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'client') {
          // Usuario autenticado como cliente
          clientId = user.id;
        } else {
          // Usuario es admin o mechanic - tratar como cliente anónimo
          clientId = `client-${booking.customerEmail}-${Date.now()}`;
        }
      } else {
        // Cliente anónimo - generar ID basado en email y timestamp
        clientId = `client-${booking.customerEmail}-${Date.now()}`;
      }

      // If it's a new vehicle (not selected from existing), create it first
      let vehicleId: string;
      if (!booking.vehicleId) {
        // Create new vehicle for this client
        try {
          const newVehicle = await vehicleService.create({
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            year: vehicleInfo.year,
            license_plate: vehicleInfo.license_plate,
            client_id: clientId
          });
          vehicleId = newVehicle.id;
        } catch (vehicleErr) {
          // If vehicle creation fails (e.g., duplicate plate), still continue with booking
          console.warn('Could not create vehicle:', vehicleErr);
          vehicleId = `veh-${Date.now()}`;
        }
      } else {
        vehicleId = booking.vehicleId;
      }

      // Call appointmentService directly with client data
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const res = await fetch(`${backendUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          client_id: clientId,
          vehicle_id: vehicleId,
          service_id: selectedServiceInfo.id,
          date: booking.date,
          time: booking.time,
          notes: '',
          client_name: booking.customerName,
          client_email: booking.customerEmail,
          client_phone: booking.customerPhone
        })
      });
      
      if (!res.ok) {
        throw new Error('Error al crear la cita');
      }

      alert('¡Cita reservada exitosamente!');
    } catch (err) {
      console.error('Error reservando cita:', err);
      alert('Error al reservar la cita. Intenta de nuevo.');
    }    // Reset and close the modal
    setIsLoading(false);
    onClose();
    setStep(1);
    setBooking({});
  };

  // Calculate available time slots, disabling already booked ones
  const getAvailableTimeSlots = (date: string) => {
    const bookedTimes = appointments
      .filter(app => app.date === date)
      .map(app => app.time);
    return mockTimeSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.time)
    }));
  };

  const availableSlots = getAvailableTimeSlots(booking.date || '');
  
  const selectedServiceInfo = services.find(s => s.id === booking.serviceId)
  const selectedVehicleInfo = vehicles.find(v => v.id === booking.vehicleId)


  if (!isOpen) return null;

  // Render the modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Reserva tu cita - PASO {step}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label="Cerrar" title="Cerrar">✕</button>
        </div>

        {/* Progress Bar (simplified for now) */}
        <div className="p-6">
          {/* You can add a progress bar here if needed */}
        </div>

        {/* Modal Body (steps) */}
        <div className="p-6 flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Step 1 - Select Service */}
              {step === 1 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Selecciona el servicio</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {services.map(service => (
                      <div
                        key={service.id}
                        onClick={() => {
                          setBooking(prev => ({ ...prev, serviceId: service.id }));
                          setStep(2);
                        }}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:shadow-lg ${booking.serviceId === service.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <p className="font-medium">{service.name}</p>
                        <p className="text-gray-500">${(typeof service.price === 'string' ? parseFloat(service.price) : service.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Step 2 - Vehicle Selection (with inline entry) */}
              {step === 2 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    {showAddVehicle ? 'Ingresa los datos del vehículo' : 'Selecciona tu vehículo'}
                  </h4>
                  
                  {/* Show existing vehicles only if not entering new vehicle data */}
                  {!showAddVehicle && vehicles.length > 0 && (
                    <>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {vehicles.map(vehicle => (
                          <div
                            key={vehicle.id}
                            onClick={() => {
                              setBooking(prev => ({ 
                                ...prev, 
                                vehicleId: vehicle.id,
                                vehicleMake: vehicle.make,
                                vehicleModel: vehicle.model,
                                vehicleYear: vehicle.year,
                                vehicleLicensePlate: vehicle.license_plate
                              }));
                            }}
                            className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:shadow-lg ${booking.vehicleId === vehicle.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                          >
                            <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                            <p className="text-sm text-gray-500">{vehicle.year}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 mb-4">
                        <button
                          onClick={() => setShowAddVehicle(true)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ↓ O ingresa un vehículo diferente
                        </button>
                      </div>
                    </>
                  )}
                  
                  {/* Show form when entering new vehicle or no existing vehicles */}
                  {(showAddVehicle || vehicles.length === 0) && (
                    <div className="space-y-4 mb-4">
                      <input
                        type="text"
                        placeholder="Marca (ej: Toyota)"
                        value={booking.vehicleMake || ''}
                        onChange={(e) => setBooking(prev => ({ ...prev, vehicleMake: e.target.value }))}
                        className="border rounded-lg p-3 w-full"
                      />
                      <input
                        type="text"
                        placeholder="Modelo (ej: Corolla)"
                        value={booking.vehicleModel || ''}
                        onChange={(e) => setBooking(prev => ({ ...prev, vehicleModel: e.target.value }))}
                        className="border rounded-lg p-3 w-full"
                      />
                      <input
                        type="number"
                        placeholder="Año"
                        value={booking.vehicleYear || ''}
                        onChange={(e) => setBooking(prev => ({ ...prev, vehicleYear: e.target.value ? parseInt(e.target.value) : undefined }))}
                        className="border rounded-lg p-3 w-full"
                      />
                      <input
                        type="text"
                        placeholder="Placa (ej: ABC-123)"
                        value={booking.vehicleLicensePlate || ''}
                        onChange={(e) => setBooking(prev => ({ ...prev, vehicleLicensePlate: e.target.value }))}
                        className="border rounded-lg p-3 w-full"
                      />
                      {showAddVehicle && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowAddVehicle(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Next button - disabled if no vehicle data */}
                  {(booking.vehicleId || (booking.vehicleMake && booking.vehicleModel && booking.vehicleYear)) && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Step 3 - License Plate */}
              {step === 3 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Ingresa la placa del vehículo</h4>
                  <p className="text-gray-600 text-sm mb-4">Esta es la placa actual del vehículo (del dueño actual)</p>
                  <input
                    type="text"
                    placeholder="Placa (ej: ABC-123)"
                    value={booking.vehicleLicensePlate || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, vehicleLicensePlate: e.target.value }))}
                    className="border rounded-lg p-3 w-full mb-4"
                  />
                  {booking.vehicleId && (
                    <p className="text-sm text-gray-600 mb-4">
                      Vehículo seleccionado: <strong>{vehicles.find(v => v.id === booking.vehicleId)?.make} {vehicles.find(v => v.id === booking.vehicleId)?.model}</strong>
                    </p>
                  )}
                  {!booking.vehicleId && (
                    <p className="text-sm text-gray-600 mb-4">
                      Vehículo a agregar: <strong>{booking.vehicleMake} {booking.vehicleModel} ({booking.vehicleYear})</strong>
                    </p>
                  )}
                </div>
              )}
              {/* Step 4 - Date and Time */}
              {step === 4 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Selecciona fecha y hora</h4>
                  <input
                    type="date"
                    className="border p-2 rounded w-full mb-6"
                    value={booking.date || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => setBooking(prev => ({ ...prev, time: slot.time }))}
                        disabled={!slot.available}
                        className={`px-3 py-2 border-2 rounded-lg transition-all ${booking.time === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-300'} ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5 - Personal Details */}
              {step === 5 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Tus datos</h4>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full border-2 p-2 rounded"
                    value={booking.customerName || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="w-full border-2 p-2 rounded"
                    value={booking.customerPhone || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full border-2 p-2 rounded"
                    value={booking.customerEmail || ''}
                    onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>
              )}
              {/* Step 6 - Confirmation */}
              {step === 6 && (
                <div>
                  <h3 className="text-xl mb-3">Confirma tu cita</h3>
                  {selectedServiceInfo && (
                    <p><strong>Servicio:</strong> {selectedServiceInfo.name}</p>
                  )}
                  {selectedVehicleInfo && (
                    <p><strong>Vehículo:</strong> {selectedVehicleInfo.make} {selectedVehicleInfo.model} ({selectedVehicleInfo.license_plate})</p>
                  )}
                  <p><strong>Fecha:</strong> {booking.date}</p>
                  <p><strong>Hora:</strong> {booking.time}</p>
                  <p><strong>Nombre:</strong> {booking.customerName}</p>
                  <p><strong>Teléfono:</strong> {booking.customerPhone}</p>
                  <p><strong>Email:</strong> {booking.customerEmail}</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Modal Footer (navigation buttons) */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 border rounded-lg bg-white">Anterior</button>
          )}
          <div className="ml-auto">
            {step < 6 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && !booking.serviceId) ||
                  (step === 2 && !(booking.vehicleId || (booking.vehicleMake && booking.vehicleModel && booking.vehicleYear))) ||
                  (step === 3 && !booking.vehicleLicensePlate) ||
                  (step === 4 && (!booking.date || !booking.time)) ||
                  (step === 5 && (!booking.customerName || !booking.customerPhone || !booking.customerEmail))
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2">
                {isLoading ? 'Confirmando...' : 'Confirmar y Enviar por WhatsApp'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;


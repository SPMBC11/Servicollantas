import React, { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import {  Appointment } from '../../types';
import { mockTimeSlots } from '../../data/mockData';

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
  const [booking, setBooking] = useState<Partial<Appointment & { customerName: string; customerPhone: string; customerEmail: string }>>({}); // In-progress booking data

  // Hooks to access application contexts
  const { 
    addAppointment, 
    appointments, 
    clients, 
    addClient, 
    selectedService, 
    selectService, 
    services, 
    vehicles, 
    loading, 
    error 
  } = useBooking();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const serviceId = selectedServiceId || selectedService;
      setBooking(prev => ({
        ...prev,
        serviceId: serviceId ?? undefined
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
   * Builds a message for WhatsApp and saves the appointment locally.
   */
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const selectedServiceInfo = services.find(s => s.id === booking.serviceId);
      const selectedVehicleInfo = vehicles.find(v => v.id === booking.vehicleId);

      if (selectedServiceInfo && selectedVehicleInfo && booking.customerName && booking.customerPhone) {
        // Check if client already exists, otherwise add new client
        let existingClient = clients.find(c => c.email === booking.customerEmail);
        if (!existingClient) {
          existingClient = {
            id: `cli${Date.now()}`,
            name: booking.customerName!,
            phone: booking.customerPhone!,
            email: booking.customerEmail!,
          };
          await addClient(existingClient);
        }

        // Build the message for WhatsApp
        const message = `¡Hola! Me gustaría reservar una cita:\n\n📅 Fecha: ${booking.date}\n🕐 Hora: ${booking.time}\n🚗 Vehículo: ${selectedVehicleInfo.make} ${selectedVehicleInfo.model} (${selectedVehicleInfo.license_plate})\n🛠️ Servicio: ${selectedServiceInfo.name}\n💰 Precio: $${selectedServiceInfo.price.toFixed(2)}\n\n👤 Mis datos:\n• Nombre: ${booking.customerName}\n• Teléfono: ${booking.customerPhone}\n• Email: ${booking.customerEmail}\n\n¿Está disponible? ¡Gracias!`;
        // Assuming a default phone number for the service provider for WhatsApp
        const serviceProviderPhone = '573001234567'; // Replace with actual service provider phone
        const cleanPhone = serviceProviderPhone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Save the appointment in the application state
        const newAppointment: Appointment = {
          id: `app${Date.now()}`,
          clientId: existingClient.id,
          vehicleId: selectedVehicleInfo.id,
          serviceId: selectedServiceInfo.id,
          date: booking.date!,
          time: booking.time!,
          status: 'pending',
          notes: '',
        };
        await addAppointment(newAppointment);

        alert('¡Cita reservada exitosamente!');
      } else {
        alert('Por favor completa todos los campos requeridos.');
      }
    } catch (err) {
      console.error('Error reservando cita:', err);
      alert('Error al reservar la cita. Intenta de nuevo.');
    }

    // Reset and close the modal
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

  if (!isOpen) return null;

  // Render the modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Reserva tu cita - PASO {step}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">✕</button>
        </div>

        {/* Progress Bar (simplified for now) */}
        <div className="p-6">
          {/* You can add a progress bar here if needed */}
        </div>

        {/* Modal Body (steps) */}
        <div className="p-6 flex-grow">
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
                    <p className="text-gray-500">${service.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Step 2 - Select Vehicle */}
          {step === 2 && (
            <div>
              <h4 className="text-lg font-medium mb-4">Selecciona tu vehículo</h4>
              <div className="grid grid-cols-2 gap-6">
                {vehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    onClick={() => setBooking(prev => ({ ...prev, vehicleId: vehicle.id }))}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:shadow-lg ${booking.vehicleId === vehicle.id ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                    <p className="text-gray-500">Placa: {vehicle.license_plate}</p>
                  </div>
                ))}
                {/* Option to add a new vehicle could go here */}
              </div>
            </div>
          )}
          {/* Step 3 - Date and Time */}
          {step === 3 && (
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

          {/* Step 4 - Personal Details */}
          {step === 4 && (
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
           {/* Step 5 - Confirmation */}
           {step === 5 && (
            <div>
              <h3 className="text-xl mb-3">Confirma tu cita</h3>
              {services.find(s => s.id === booking.serviceId) && (
                <p><strong>Servicio:</strong> {services.find(s => s.id === booking.serviceId)?.name}</p>
              )}
              {vehicles.find(v => v.id === booking.vehicleId) && (
                <p><strong>Vehículo:</strong> {vehicles.find(v => v.id === booking.vehicleId)?.make} {vehicles.find(v => v.id === booking.vehicleId)?.model} ({vehicles.find(v => v.id === booking.vehicleId)?.license_plate})</p>
              )}
              <p><strong>Fecha:</strong> {booking.date}</p>
              <p><strong>Hora:</strong> {booking.time}</p>
              <p><strong>Nombre:</strong> {booking.customerName}</p>
              <p><strong>Teléfono:</strong> {booking.customerPhone}</p>
              <p><strong>Email:</strong> {booking.customerEmail}</p>
            </div>
          )}
        </div>

        {/* Modal Footer (navigation buttons) */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 border rounded-lg bg-white">Anterior</button>
          )}
          <div className="ml-auto">
            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 1 && !booking.serviceId) ||
                  (step === 2 && !booking.vehicleId) ||
                  (step === 3 && (!booking.date || !booking.time)) ||
                  (step === 4 && (!booking.customerName || !booking.customerPhone || !booking.customerEmail))
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

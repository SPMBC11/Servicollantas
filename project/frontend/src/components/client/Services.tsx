import React, { useState, useEffect } from 'react';
import {
  Settings,
  RotateCcw,
  Zap,
  Wrench,
  Car,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface ServicesProps {
  openBookingModal: (serviceId: string) => void;
}

const serviceIcons: { [key: string]: React.ReactElement } = {
  'srv001': <Settings size={32} />,
  'srv002': <RotateCcw size={32} />,
  'srv003': <Settings size={32} />,
  'srv004': <Wrench size={32} />,
  'srv005': <RotateCcw size={32} />,
  'srv006': <Settings size={32} />,
  'srv007': <Zap size={32} />,
  'srv008': <Wrench size={32} />,
  'srv009': <Car size={32} />,
  'srv010': <CheckCircle size={32} />,
};

const Services: React.FC<ServicesProps> = ({ openBookingModal }) => {
  const { services, loading } = useBooking();

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalServices = services.length;

  // Determine servicesPerPage based on screen width
  const getServicesPerPage = () => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      return 3;
    } else if (window.innerWidth >= 640) { // sm breakpoint
      return 2;
    } else {
      return 1;
    }
  };

  const [servicesPerPage, setServicesPerPage] = useState(getServicesPerPage());

  useEffect(() => {
    const handleResize = () => {
      setServicesPerPage(getServicesPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - servicesPerPage + totalServices) % totalServices;
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + servicesPerPage) % totalServices;
      return newIndex;
    });
  };

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-600 rounded-full px-4 py-2 mb-4">
            <Settings size={16} className="mr-2" />
            <span className="text-sm font-medium">Nuestros Servicios</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Servicios <span className="text-red-600">Especializados</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios automotrices con tecnología de punta
            y personal altamente calificado para mantener tu vehículo en perfectas condiciones.
          </p>
        </div>

        {/* Services Carousel */}
        <div className="relative flex items-center justify-center mb-16">
          <button
            onClick={goToPrevious}
            className="absolute left-0 z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="w-full overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">Cargando servicios...</div>
              </div>
            ) : services.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">No hay servicios disponibles</div>
              </div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(currentIndex * (100 / servicesPerPage))}%)` }}
              >
                {services.map((service) => (
                <div key={service.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4"> {/* Responsive width */}
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full">
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-4 bg-red-100 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                          {serviceIcons[service.id]}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">${(typeof service.price === 'string' ? parseFloat(service.price) : service.price).toFixed(2)}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {service.duration} min
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>

                      <button
                        onClick={() => openBookingModal(service.id)}
                        className="w-full bg-gray-900 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        Solicitar Servicio
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">¿Necesitas un Servicio Urgente?</h3>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos ahora y te atendemos en el menor tiempo posible.
            Servicio de emergencia 24/7 disponible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Llamar Ahora: (300) 123-4567
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
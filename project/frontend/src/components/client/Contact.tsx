// src/components/Contact.tsx
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "5",
    review: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Simulación de envío del formulario
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contacto" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <MessageSquare size={14} className="mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium">Contacto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            ¿Necesitas Nuestros <span className="text-red-600">Servicios?</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos por cualquier medio o agenda
            una cita para recibir atención personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Información de Contacto
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Dirección
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Calle 45 #23-67 <br /> Bogotá, Colombia
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                  <Phone className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Teléfonos
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    (+57) 300 123 4567 <br /> (+57) 310 987 6543
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                  <Mail className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Email
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    info@servi-collantas.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                  <Clock className="text-red-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    Horarios
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Lunes - Viernes: 7:00am - 6:00pm <br />
                    Sábados: 7:00am - 4:00pm <br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Danos tu Calificación y Reseña
              </h3>

              {isSubmitted && (
                <div className="mb-4 sm:mb-6 bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle size={20} />
                  ¡Gracias por tu calificación!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="300 123 4567"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Calificación
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="5">★★★★★ (5 Estrellas)</option>
                      <option value="4">★★★★☆ (4 Estrellas)</option>
                      <option value="3">★★★☆☆ (3 Estrellas)</option>
                      <option value="2">★★☆☆☆ (2 Estrellas)</option>
                      <option value="1">★☆☆☆☆ (1 Estrella)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reseña
                  </label>
                  <textarea
                    id="review"
                    name="review"
                    rows={4}
                    value={formData.review}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Cuéntanos tu experiencia con nuestro servicio..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar Calificación
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 sm:mt-16">
          <div className="rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d990.9960052176112!2d-73.63656670244151!3d4.115727421343419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sco!4v1757953514818!5m2!1sen!2sco"
              width="100%"
              height="450"
              style={{ border: 0 }}
              title="Google Maps"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"> {/* Adjusted padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"> {/* Adjusted grid columns and gap */}
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
            <div>
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-lg sm:text-xl transform skew-x-[-10deg] w-fit"> {/* Adjusted padding and text size */}
                <span className="transform skew-x-[10deg] block">SERVI-COLLANTAS</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base"> {/* Adjusted text size */}
              Más de 15 años brindando servicios especializados en llantas,
              alineación, balanceo y mantenimiento automotriz con la mejor calidad y garantía.
            </p>
            <div className="flex space-x-3 sm:space-x-4"> {/* Adjusted spacing */}
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-1.5 sm:p-2 rounded-lg transition-colors"> {/* Adjusted padding */}
                <Facebook size={18} sm:size={20} /> {/* Adjusted icon size */}
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-1.5 sm:p-2 rounded-lg transition-colors"> {/* Adjusted padding */}
                <Instagram size={18} sm:size={20} /> {/* Adjusted icon size */}
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-1.5 sm:p-2 rounded-lg transition-colors"> {/* Adjusted padding */}
                <Twitter size={18} sm:size={20} /> {/* Adjusted icon size */}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Nuestros Servicios</h3> {/* Adjusted text sizes and margin */}
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base"> {/* Adjusted spacing and text size */}
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Cambio de Llantas
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Alineación y Balanceo
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Reparación de Llantas
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Mantenimiento General
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Servicio a Domicilio
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Inspección Vehicular
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Enlaces Rápidos</h3> {/* Adjusted text sizes and margin */}
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base"> {/* Adjusted spacing and text size */}
              <li>
                <a href="#inicio" className="hover:text-red-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-red-400 transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-red-400 transition-colors">
                  Galería
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-red-400 transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-red-400 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contacto</h3> {/* Adjusted text sizes and margin */}
            <div className="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base"> {/* Adjusted spacing and text size */}
              <div className="flex items-start space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
                <MapPin size={18} sm:size={20} className="text-red-400 mt-0.5 flex-shrink-0" /> {/* Adjusted icon size */}
                <span>Calle 45 #23-67<br />Bogotá, Colombia</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
                <Phone size={18} sm:size={20} className="text-red-400 flex-shrink-0" /> {/* Adjusted icon size */}
                <span>(+57) 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
                <Mail size={18} sm:size={20} className="text-red-400 flex-shrink-0" /> {/* Adjusted icon size */}
                <span>info@servi-collantas.com</span>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
                <Clock size={18} sm:size={20} className="text-red-400 mt-0.5 flex-shrink-0" /> {/* Adjusted icon size */}
                <div>
                  <div>Lun-Vie: 7:00am-6:00pm</div>
                  <div>Sáb: 7:00am-4:00pm</div>
                  <div>Dom: Cerrado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"> {/* Adjusted padding */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0"> {/* Adjusted spacing */}
            <div className="text-gray-400 text-xs sm:text-sm"> {/* Adjusted text size */}
              © 2025 Servi-Collantas. Todos los derechos reservados.
            </div>
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400"> {/* Adjusted spacing and text size */}
              <a href="#" className="hover:text-red-400 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import logoImg from "../../assets/servi-collantas-logo.png";

interface HeaderProps {
  openBookingModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openBookingModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Minimal Top Bar */}
      <div className="bg-black text-white py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 sm:gap-0"> {/* Added flex-col and sm:flex-row for stacking on small screens */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6"> {/* Adjusted for stacking */}
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>(+57) 300 123 4567</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Clock size={14} />
                <span>Lun-Vie: 7:00am-6:00pm</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <MapPin size={14} />
              <span>Calle 45 #23-67, Bogotá</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo with Image */}
            <div className="flex items-center gap-2 sm:gap-4"> {/* Adjusted gap for smaller screens */}
              <img src={logoImg} alt="Servi-Collantas Logo" className="h-10 sm:h-12 w-auto hover:scale-105 transition-transform duration-300" /> {/* Adjusted logo height */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SERVI-COLLANTAS</h1> {/* Adjusted text size */}
                <p className="text-xs text-gray-500 -mt-1">Expertos en Llantas</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#servicios" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group">
                Servicios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#galeria" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group">
                Galería
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#nosotros" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group">
                Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300 relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex">
              <button
                onClick={openBookingModal}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Agendar Cita
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              title={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
              <nav className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-4">
                  <a
                    href="#inicio"
                    className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </a>
                  <a
                    href="#servicios"
                    className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Servicios
                  </a>
                  <a
                    href="#galeria"
                    className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Galería
                  </a>
                  <a
                    href="#nosotros"
                    className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Nosotros
                  </a>
                  <a
                    href="#contacto"
                    className="text-gray-700 hover:text-red-600 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </a>
                  <button
                    onClick={() => { openBookingModal(); setIsMenuOpen(false); }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium w-fit mt-4 transition-all duration-300"
                  >
                    Agendar Cita
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
import React from 'react';
import { Camera, Eye, ArrowRight } from 'lucide-react';

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Cambio de Llantas Completo",
      category: "Llantas",
      image: "https://images.pexels.com/photos/13861/IMG_3496bbb.jpg"
    },
    {
      id: 2,
      title: "Alineación Computarizada",
      category: "Alineación",
      image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
    },
    {
      id: 3,
      title: "Taller Especializado",
      category: "Instalaciones",
      image: "https://images.pexels.com/photos/3806289/pexels-photo-3806289.jpeg"
    },
    {
      id: 4,
      title: "Reparación Profesional",
      category: "Reparaciones",
      image: "https://images.pexels.com/photos/3806290/pexels-photo-3806290.jpeg"
    },
    {
      id: 5,
      title: "Equipo de Balanceo",
      category: "Tecnología",
      image: "https://images.pexels.com/photos/3806291/pexels-photo-3806291.jpeg"
    },
    {
      id: 6,
      title: "Servicio a Domicilio",
      category: "Servicios",
      image: "https://images.pexels.com/photos/3806292/pexels-photo-3806292.jpeg"
    }
  ];

  return (
    <section id="galeria" className="py-16 sm:py-20 bg-white"> {/* Adjusted padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted padding */}
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16"> {/* Adjusted margin */}
          <div className="inline-flex items-center bg-red-100 text-red-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4"> {/* Adjusted padding and margin */}
            <Camera size={14} className="mr-1.5 sm:mr-2" /> {/* Adjusted icon size and margin */}
            <span className="text-xs sm:text-sm font-medium">Nuestra Galería</span> {/* Adjusted text size */}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"> {/* Adjusted text sizes and margin */}
            Trabajos <span className="text-red-600">Realizados</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto"> {/* Adjusted text size */}
            Conoce nuestras instalaciones y algunos de los trabajos que hemos realizado
            para nuestros clientes con la más alta calidad y profesionalismo.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12"> {/* Adjusted grid columns and gap */}
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"> {/* Adjusted padding */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-red-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{item.category}</div> {/* Adjusted text sizes and margin */}
                      <h3 className="text-white font-semibold text-base sm:text-lg">{item.title}</h3> {/* Adjusted text sizes */}
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-full text-white hover:bg-white hover:text-gray-900 transition-colors" aria-label="Ver detalle" title="Ver detalle">
                      <Eye size={18} sm:size={20} /> {/* Adjusted icon size */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 mx-auto"> {/* Adjusted padding, text size, and gap */}
            Ver Más Trabajos
            <ArrowRight size={18} sm:size={20} /> {/* Adjusted icon size */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

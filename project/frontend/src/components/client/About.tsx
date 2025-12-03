import React from 'react';
import { Award, Users, Shield, Star, Quote } from 'lucide-react';

const About = () => {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Cliente Regular",
      content: "Excelente servicio, muy profesionales y precios justos. Siempre vengo aquí para el mantenimiento de mi vehículo.",
      rating: 5
    },
    {
      name: "María González",
      role: "Empresa de Transporte",
      content: "Manejan toda nuestra flota de vehículos. Su trabajo es impecable y siempre cumplen con los tiempos acordados.",
      rating: 5
    },
    {
      name: "Roberto Silva",
      role: "Taxi Driver",
      content: "Los mejores en alineación y balanceo. Mi taxi nunca había funcionado tan bien. Totalmente recomendados.",
      rating: 5
    }
  ];

  const achievements = [
    { icon: <Award size={32} />, title: "15+ Años", subtitle: "De Experiencia" },
    { icon: <Users size={32} />, title: "5,000+", subtitle: "Clientes Atendidos" },
    { icon: <Shield size={32} />, title: "100%", subtitle: "Trabajos Garantizados" },
    { icon: <Star size={32} />, title: "4.9/5", subtitle: "Calificación Promedio" }
  ];

  return (
    <section id="nosotros" className="py-16 sm:py-20 bg-gray-50"> {/* Adjusted padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted padding */}
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16"> {/* Adjusted margin */}
          <div className="inline-flex items-center bg-red-100 text-red-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4"> {/* Adjusted padding and margin */}
            <Users size={14} className="mr-1.5 sm:mr-2" /> {/* Adjusted icon size and margin */}
            <span className="text-xs sm:text-sm font-medium">Sobre Nosotros</span> {/* Adjusted text size */}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"> {/* Adjusted text sizes and margin */}
            Conoce Nuestra <span className="text-red-600">Historia</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20"> {/* Adjusted gap and added grid-cols-1 for small screens */}
          {/* Content */}
          <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900"> {/* Adjusted text sizes */}
              Más de 15 años brindando confianza y calidad
            </h3>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed"> {/* Adjusted text sizes */}
              Fundada en 2009, Servi-Collantas nació con la visión de ofrecer servicios
              automotrices de la más alta calidad en la ciudad. Comenzamos como un pequeño
              taller familiar y hoy somos una de las servitecas más reconocidas de la zona.
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed"> {/* Adjusted text sizes */}
              Nuestro compromiso con la excelencia nos ha permitido construir relaciones
              duraderas con nuestros clientes, quienes confían en nosotros para mantener
              sus vehículos en perfecto estado.
            </p>

            <div className="space-y-3 sm:space-y-4"> {/* Adjusted spacing */}
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">Lo que nos hace únicos:</h4> {/* Adjusted text sizes */}
              <ul className="space-y-2 sm:space-y-3"> {/* Adjusted spacing */}
                <li className="flex items-start">
                  <div className="bg-red-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Tecnología de punta para diagnósticos precisos</span> {/* Adjusted text size */}
                </li>
                <li className="flex items-start">
                  <div className="bg-red-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Personal certificado y en constante capacitación</span> {/* Adjusted text size */}
                </li>
                <li className="flex items-start">
                  <div className="bg-red-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Garantía en todos nuestros trabajos</span> {/* Adjusted text size */}
                </li>
                <li className="flex items-start">
                  <div className="bg-red-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm sm:text-base">Atención personalizada y precios competitivos</span> {/* Adjusted text size */}
                </li>
              </ul>
            </div>
          </div>

          {/* Visual */}
          <div className="relative order-first lg:order-last"> {/* Added order-first for mobile, order-last for desktop */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg"
                alt="Equipo de trabajo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-red-600 text-white p-4 sm:p-6 rounded-2xl shadow-xl"> {/* Adjusted position and padding */}
              <div className="text-2xl sm:text-3xl font-bold">15+</div> {/* Adjusted text size */}
              <div className="text-xs sm:text-sm">Años de Experiencia</div> {/* Adjusted text size */}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-16 sm:mb-20"> {/* Adjusted gap and grid columns */}
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg"> {/* Adjusted padding */}
                <div className="text-red-600 flex justify-center mb-2 sm:mb-4"> {/* Adjusted margin */}
                  {React.cloneElement(achievement.icon, { size: 24 })} {/* Adjusted icon size */}
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2"> {/* Adjusted text sizes and margin */}
                  {achievement.title}
                </div>
                <div className="text-sm sm:text-base text-gray-600"> {/* Adjusted text size */}
                  {achievement.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-8 sm:mb-12"> {/* Adjusted margin */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4"> {/* Adjusted text sizes and margin */}
            Lo que dicen nuestros <span className="text-red-600">clientes</span>
          </h3>
          <p className="text-base sm:text-lg text-gray-600"> {/* Adjusted text size */}
            La satisfacción de nuestros clientes es nuestro mayor logro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"> {/* Adjusted gap and added grid-cols-1 for small screens */}
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"> {/* Adjusted padding */}
              <div className="flex items-center justify-between mb-3 sm:mb-4"> {/* Adjusted margin */}
                <Quote size={20} className="text-red-600" /> {/* Adjusted icon size */}
                <div className="flex space-x-0.5 sm:space-x-1"> {/* Adjusted spacing */}
                  {[...Array(testimonial.rating)].map((_, i) => {
                    return <Star key={i} size={14} className="text-yellow-500 fill-current" />; {/* Adjusted icon size */}
                  })}
                </div>
              </div>
              <p className="text-gray-700 mb-4 sm:mb-6 italic text-sm sm:text-base">"{testimonial.content}"</p> {/* Adjusted text size and margin */}
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div> {/* Adjusted text size */}
                <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div> {/* Adjusted text size */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

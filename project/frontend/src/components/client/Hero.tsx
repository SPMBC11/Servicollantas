import Button from "../ui/Button";
import Section from "../ui/Section";
import heroBg from "../../assets/bmw-m4.jpg";

interface HeroProps {
  openBookingModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ openBookingModal }) => {
  return (
    <Section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center py-0 overflow-hidden"
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Automotive Service Workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-automotive-black/80 via-automotive-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in px-4 sm:px-6 lg:px-8"> {/* Added padding for smaller screens */}

        {/* Contenido principal */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-8 text-white leading-tight tracking-tight"> {/* Adjusted text sizes and margin */}
          Tu Auto en las
          <span className="block text-primary drop-shadow-lg">Mejores Manos</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light"> {/* Adjusted text sizes and margin */}
          Más de 15 años brindando servicios especializados en llantas, alineación,
          balanceo y mantenimiento automotriz. Tu seguridad es nuestra prioridad.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"> {/* Adjusted gap for smaller screens */}
          <Button
            onClick={openBookingModal}
            className="border-2 border-red-600 bg-primary hover:bg-primary/90 text-white px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-medium rounded-full shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300 w-full sm:w-auto" // Added w-full for small screens
          >
            Agendar Cita Ahora
          </Button>
          <Button
            onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}
            className="border-2 border-white text-white hover:bg-red-500 hover:text-automotive-black px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-medium rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300 w-full sm:w-auto" // Added w-full for small screens
          >
            Ver Servicios
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-white/20"> {/* Adjusted gap and padding */}
          <div className="text-center group">
            <div className="text-red-600 text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"> {/* Adjusted text sizes and margin */}
              15+
            </div>
            <div className="text-white/80 text-base sm:text-lg">Años de Experiencia</div> {/* Adjusted text size */}
          </div>
          <div className="text-center group">
            <div className="text-red-600 text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"> {/* Adjusted text sizes and margin */}
              5000+
            </div>
            <div className="text-white/80 text-base sm:text-lg">Clientes Satisfechos</div> {/* Adjusted text size */}
          </div>
          <div className="text-center group">
            <div className="text-red-600 text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"> {/* Adjusted text sizes and margin */}
              100%
            </div>
            <div className="text-white/80 text-base sm:text-lg">Garantía</div> {/* Adjusted text size */}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;

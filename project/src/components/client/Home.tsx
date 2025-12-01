// src/components/client/Home.tsx
import { useEffect, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import Services from "./Services";
import Gallery from "./Gallery";
import Contact from "./Contact";
import Footer from "./Footer";
import BookingModal from "./BookingModal";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // 🔹 Estado de carga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carga inicial de datos (ej: servicios, galería, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // 🔹 Muestra el spinner con tu ícono de carro de fondo
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openBookingModal={() => setIsBookingOpen(true)} />

      <main>
        <Hero openBookingModal={() => setIsBookingOpen(true)} />
        <Services
          openBookingModal={(serviceId) => {
            setSelectedServiceId(serviceId);
            setIsBookingOpen(true);
          }}
        />
        <Gallery />
        <Contact />
      </main>

      <Footer />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedServiceId(null);
        }}
        selectedServiceId={selectedServiceId}
      />
    </div>
  );
}

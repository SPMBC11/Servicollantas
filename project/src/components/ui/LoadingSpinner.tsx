import React from "react";
import fleetIcon from "../../assest/fleet-supervisor.gif"; // 👈 ajusta la ruta según tu carpeta

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      {/* Icono animado */}
      <img
        src={fleetIcon}
        alt="Cargando..."
        className={`${sizeClasses[size]} animate-pulse`}
      />

        {/* Texto de carga */}
      <p className="mt-4 text-red-600 font-semibold">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;

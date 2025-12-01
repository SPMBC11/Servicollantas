// src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg?: string; // background para el icono
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, bg = "bg-gray-100", className }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-dark">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;

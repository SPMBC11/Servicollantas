import { Link } from "react-router-dom";
import logo from "../../assets/servi-collantas-logo.png"; // ajusta la ruta si es necesario

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      {/* Logo */}
      <img src={logo} alt="Servicollantas" className="w-24 mb-6" />

      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl text-gray-700 mt-2">
        Página no encontrada
      </p>
      <p className="text-gray-500 mb-6">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>

      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

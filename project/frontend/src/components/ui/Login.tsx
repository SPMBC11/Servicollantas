// src/components/auth/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/servi-collantas-logo.png"; // 👈 ojo, tu carpeta es "asset"
import LoadingSpinner from "../ui/LoadingSpinner"; // 👈 importamos el spinner
import { authService } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 estado para loading

  // No auto-redirect from login page
  // Let ProtectedRoute handle redirects for authenticated users
  // This allows users to logout and login again without issues

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      addNotification("Por favor completa todos los campos", "warning");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      // Guarda el token y datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      addNotification(`Bienvenido, ${data.user.name}!`, "success");
      
      // Small delay to show notification before navigation
      setTimeout(() => {
        // Navegar según el rol del usuario
        if (data.user.role === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else if (data.user.role === 'mechanic') {
          navigate("/mechanic/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 500);
    } catch (err: any) {
      addNotification(err.message || "Error de red. Intenta de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-600">
      <div className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[400px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Servi Collantas" className="w-28" />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-8">
          Bienvenido
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Correo
              </label>
              <input
                type="email"
                placeholder="admin@servicollantas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-black font-bold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
            >
              Ingresar
            </button>
          </form>
        )}

        {/* Extra */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Servi Collantas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;

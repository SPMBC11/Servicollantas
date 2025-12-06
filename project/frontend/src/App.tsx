import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext"; // Import the provider
import { BookingProvider } from "./context/BookingContext"; // Import the booking provider
import { NotificationProvider } from "./context/NotificationContext"; // Import the notification provider
import ToastNotification from "./components/ui/ToastNotification"; // Import toast notifications
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import protected route
import Login from "./components/ui/Login";
import NotFound from "./components/client/NotFound";

// 🔹 Admin
import AdminDashboard from "./components/admin/AdminDashboard";
// 🔹 Mechanic
import MechanicDashboard from "./components/mechanic/MechanicDashboard";
// 🔹 Cliente
import Home from "./components/client/Home";
// 🔹 Público
import RateMechanic from "./components/public/RateMechanic";

function App() {
  return (
    <SettingsProvider> {/* Wrap the app with the provider */}
      <BookingProvider> {/* Wrap the app with the booking provider */}
        <NotificationProvider> {/* Wrap the app with the notification provider */}
          <BrowserRouter>
            <ToastNotification /> {/* Toast notifications at the top */}
            <Routes>
              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* Cliente - Public */}
              <Route path="/" element={<Home />} />

              {/* Público - Rating */}
              <Route path="/rate/:token" element={<RateMechanic />} />

              {/* Admin - Protected */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Mechanic - Protected */}
              <Route 
                path="/mechanic/dashboard" 
                element={
                  <ProtectedRoute requiredRole="mechanic">
                    <MechanicDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </BookingProvider>
    </SettingsProvider>
  );
}

export default App;
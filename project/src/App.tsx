import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext"; // Import the provider
import { BookingProvider } from "./context/BookingContext"; // Import the booking provider
import Login from "./components/ui/Login";
import NotFound from "./components/client/NotFound";

// 🔹 Admin
import AdminDashboard from "./components/admin/AdminDashboard";
// 🔹 Mechanic
import MechanicDashboard from "./components/mechanic/MechanicDashboard";
// 🔹 Cliente
import Home from "./components/client/Home";

function App() {
  return (
    <SettingsProvider> {/* Wrap the app with the provider */}
      <BookingProvider> {/* Wrap the app with the booking provider */}
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Cliente */}
            <Route path="/" element={<Home />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Mechanic */}
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </SettingsProvider>
  );
}

export default App;

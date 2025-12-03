// src/components/admin/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, updateSetting } = useSettings();

  // Estado local sincronizado con settings global
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Render helper
  const renderInputField = (
    label: string,
    settingKey: keyof typeof settings,
    type: string = "text",
    placeholder: string = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={localSettings[settingKey] as string}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLocalSettings((prev) => ({
            ...prev,
            [settingKey]: e.target.value,
          }))
        }
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-blue-400 focus:ring focus:ring-blue-200 
                   focus:ring-opacity-50 p-2"
      />
    </div>
  );

  const handleSaveChanges = () => {
    for (const key in localSettings) {
      updateSetting(
        key as keyof typeof settings,
        localSettings[key as keyof typeof settings]
      );
    }
    alert("✅ Cambios guardados con éxito");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Configuración del Sistema
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {["general", "pagos", "notificaciones", "personalizacion"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenido dinámico */}
      <div className="space-y-6">
        {activeTab === "general" && (
          <div className="space-y-4">
            {renderInputField("Nombre del Taller", "shopName", "text", "ServiCollantas")}
            {renderInputField("Dirección", "address", "text", "Calle Falsa 123, Bogotá")}
            {renderInputField("Teléfono", "phone", "text", "+57 300 123 4567")}
            {renderInputField("Horario de Atención", "schedule", "text", "Lun - Vie: 8am - 6pm")}
            <button
              onClick={handleSaveChanges}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {activeTab === "pagos" && (
          <div className="space-y-4">
            {renderInputField("Número Nequi", "nequiNumber")}
            {renderInputField("Número Daviplata", "daviplataNumber")}
            {renderInputField("Otros Métodos", "otherPaymentMethods", "text", "Efectivo, Tarjeta, etc.")}
            <button onClick={handleSaveChanges} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Guardar Cambios
            </button>
          </div>
        )}

        {activeTab === "notificaciones" && (
          <div className="space-y-4">
            {renderInputField("Mensaje de Confirmación de Cita", "bookingConfirmationMessage", "text", "Tu cita ha sido confirmada...")}
            {renderInputField("Mensaje de Recordatorio de Cita", "appointmentReminderMessage", "text", "Recuerda tu cita mañana a las...")}
            <button onClick={handleSaveChanges} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Guardar Cambios
            </button>
          </div>
        )}

        {activeTab === "personalizacion" && (
          <div className="space-y-4">
            {renderInputField("URL del Logo", "logoUrl", "text", "/logo.png")}
            {renderInputField("Color Principal", "primaryColor", "color")}
            {renderInputField("Texto de Bienvenida", "welcomeText", "text", "Bienvenido a ServiCollantas")}
            <button onClick={handleSaveChanges} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Guardar Cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

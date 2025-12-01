
// src/context/SettingsContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the shape of your settings
interface AppSettings {
  shopName: string;
  address: string;
  phone: string;
  schedule: string;
  nequiNumber: string;
  daviplataNumber: string;
  otherPaymentMethods: string;
  bookingConfirmationMessage: string;
  appointmentReminderMessage: string;
  logoUrl: string;
  primaryColor: string;
  welcomeText: string;
}

// 2. Define the context shape
interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

// 3. Create the context with a default undefined value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// 4. Create the Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

const initialSettings: AppSettings = {
    shopName: "ServiCollantas",
    address: "Calle Falsa 123, Bogotá",
    phone: "+57 300 123 4567",
    schedule: "Lun - Vie: 8am - 6pm, Sáb: 9am - 2pm",
    nequiNumber: "",
    daviplataNumber: "",
    otherPaymentMethods: "Efectivo, Tarjeta de Crédito/Débito",
    bookingConfirmationMessage: "Tu cita en ServiCollantas ha sido confirmada. ¡Te esperamos!",
    appointmentReminderMessage: "Recordatorio: Tienes una cita en ServiCollantas mañana.",
    logoUrl: "/src/assest/servi-collantas-logo.png",
    primaryColor: "#3b82f6", // blue-500
    welcomeText: "Bienvenido a ServiCollantas",
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 5. Create the custom hook for easy consumption
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

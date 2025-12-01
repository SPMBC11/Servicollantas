import React from "react";
import { Bell, X } from "lucide-react";

/**
 * @interface NotificationsPanelProps
 * @property {string[]} notifications - Un array de mensajes de notificación.
 * @property {() => void} onClear - Callback para limpiar/cerrar todas las notificaciones.
 */
interface NotificationsPanelProps {
  notifications: string[];
  onClear: () => void;
}

/**
 * @component NotificationsPanel
 *
 * Muestra una lista de notificaciones en un card.
 * Si no hay notificaciones, muestra un mensaje de "sin notificaciones".
 *
 * @param {NotificationsPanelProps} props
 * @returns {JSX.Element | null}
 */
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Notificaciones
          </h2>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          <X className="w-4 h-4" /> Limpiar
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay notificaciones</p>
      ) : (
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {notifications.map((msg, i) => (
            <li
              key={i}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
            >
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;

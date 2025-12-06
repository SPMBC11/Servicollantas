import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification, NotificationType } from '../../context/NotificationContext';

const ToastNotification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 pt-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                pointer-events-auto
                transform transition-all duration-300 ease-in-out
                animate-slide-down
                ${getStyles(notification.type)}
                rounded-md shadow-lg
                border-l-4
                flex items-center justify-between
                py-2.5 px-3
                backdrop-blur-sm
                max-w-md
              `}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <p className="text-xs font-medium flex-1 truncate">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 flex-shrink-0 p-0.5 rounded-full hover:bg-black/20 transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;


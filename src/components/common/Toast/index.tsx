import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ErrorMessage {
  [key: string]: string[];
}

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string | ErrorMessage;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: ToastProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return `bg-green-50 border-green-500 text-green-800 dark:bg-green-900/50 dark:text-green-200`;
      case 'error':
        return `bg-red-50 border-red-500 text-red-800 dark:bg-red-900/50 dark:text-red-200`;
      case 'warning':
        return `bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200`;
      case 'info':
        return `bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200`;
      default:
        return '';
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50
      max-w-md w-full
      rounded-lg border-l-4 p-4
      ${getToastStyles()}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && (
            <div className="mt-1 text-sm opacity-90">
              {typeof message === 'string' ? (
                message
              ) : (
                <ul className="list-disc list-inside">
                  {Object.entries(message as ErrorMessage).map(([key, errors]) => (
                    <li key={key}>
                      {Array.isArray(errors) ? errors.join(', ') : String(errors)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 inline-flex shrink-0 rounded-md p-1.5 opacity-60 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 
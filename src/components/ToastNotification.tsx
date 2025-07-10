import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'miss' | 'celebration';
  isVisible: boolean;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        px-4 py-3 rounded-lg shadow-lg max-w-sm w-full mx-4
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        ${type === 'miss' 
          ? 'bg-red-500 text-white' 
          : 'bg-yellow-400 text-gray-800'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {type === 'miss' ? '❌' : '🎉'}
          </span>
          <span className="font-bold text-sm">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
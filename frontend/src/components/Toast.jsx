import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX, FiXCircle } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-xl" />;
      case 'error':
        return <FiXCircle className="text-xl" />;
      case 'warning':
        return <FiAlertTriangle className="text-xl" />;
      case 'info':
        return <FiInfo className="text-xl" />;
      default:
        return <FiCheckCircle className="text-xl" />;
    }
  };
  
  const getColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-green-100 border-green-200 text-green-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center w-full max-w-sm px-4 py-3 rounded-xl shadow-lg border ${getColor()} mb-3`}
    >
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <FiX />
      </button>
    </motion.div>
  );
};

// In Toast.jsx, update the ToastContainer component:
const ToastContainer = ({ toasts, removeToast, position = "top-right", autoClose = 5000 }) => {
  const getPositionClass = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      default:
        return "top-4 right-4";
    }
  };
  
  return (
    <div className={`fixed z-50 w-full max-w-sm md:max-w-md ${getPositionClass()}`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={autoClose} // Use autoClose prop as default duration
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for using toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const removeToast = (id) => {
    setToasts((currentToasts) => 
      currentToasts.filter((toast) => toast.id !== id)
    );
  };
  
  const addToast = (message, options = {}) => {
    const id = Date.now();
    const { type = 'success', duration = 5000 } = options;
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, message, type, duration }
    ]);
    
    return id;
  };
  
  const toast = {
    success: (message, options) => addToast(message, { ...options, type: 'success' }),
    error: (message, options) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options) => addToast(message, { ...options, type: 'info' }),
  };
  
  return { toasts, removeToast, toast };
};

export { ToastContainer, useToast };
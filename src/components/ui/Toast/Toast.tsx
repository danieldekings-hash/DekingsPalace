'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Inject keyframes animation
if (typeof document !== 'undefined' && !document.getElementById('toast-keyframes')) {
  const style = document.createElement('style');
  style.id = 'toast-keyframes';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, message, type]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const toastStyles: React.CSSProperties = {
    position: 'relative',
    minWidth: '300px',
    maxWidth: '500px',
    padding: '1rem 1.25rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease-out',
    backdropFilter: 'blur(10px)',
    background: type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: type === 'success' ? '1px solid #10b981' : 'none'
  };

  return (
    <div className={`toast toast-${type}`} style={toastStyles}>
      <div className="toast-icon" style={{ flexShrink: 0, display: 'flex' }}>{icons[type]}</div>
      <div className="toast-message" style={{ flex: 1, fontSize: '1rem', fontWeight: 500 }}>{message}</div>
      <button 
        className="toast-close" 
        onClick={onClose} 
        aria-label="Close"
        style={{ 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '0.25rem',
          display: 'flex',
          color: 'inherit'
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

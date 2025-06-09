import React from 'react';
import { AlertMessage, AlertType } from '../types';

interface AlertDisplayProps {
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

const AlertDisplay: React.FC<AlertDisplayProps> = ({ alerts, removeAlert }) => {
  if (alerts.length === 0) {
    return null;
  }

  const getAlertClass = (type: AlertType) => {
    switch (type) {
      case AlertType.SUCCESS:
        return 'alert-success';
      case AlertType.ERROR:
        return 'alert-error';
      case AlertType.INFO:
        return 'alert-info';
      case AlertType.WARNING:
        return 'alert-warning';
      default:
        return 'alert-neutral';
    }
  };
  
  const getIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.SUCCESS:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case AlertType.ERROR:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case AlertType.INFO:
         return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case AlertType.WARNING:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="toast toast-top toast-end z-[100]">
      {alerts.map(alert => (
        <div
          key={alert.id}
          role="alert"
          className={`alert ${getAlertClass(alert.type)} shadow-lg flex items-start`}
        >
          {getIcon(alert.type)}
          <span className="flex-grow text-sm sm:text-base">{alert.message}</span>
          <button onClick={() => removeAlert(alert.id)} className="btn btn-xs btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertDisplay;
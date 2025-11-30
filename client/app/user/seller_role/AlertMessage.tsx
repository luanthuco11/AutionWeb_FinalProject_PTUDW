import React from 'react';

interface AlertMessageProps {
  type: 'success' | 'error';
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  const alertConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800'
    }
  };

  const config = alertConfig[type];

  return (
    <div className={`mt-4 p-4 ${config.bg} border ${config.border} rounded-lg`}>
      <p className={config.text}>{message}</p>
    </div>
  );
};

export default AlertMessage;

import React from 'react';
import type { Alert as AlertType } from '../../types';

interface AlertProps {
  alert: AlertType;
}

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  const severityClasses = {
    high: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-700 dark:text-red-200',
      icon: 'fa-solid fa-triangle-exclamation text-red-500',
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-700 dark:text-yellow-200',
      icon: 'fa-solid fa-circle-exclamation text-yellow-500',
    },
    low: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-700 dark:text-blue-200',
      icon: 'fa-solid fa-circle-info text-blue-500',
    },
  };

  const classes = severityClasses[alert.severity];

  return (
    <div className={`p-4 rounded-lg flex items-start gap-4 ${classes.bg} ${classes.text}`}>
      <i className={`${classes.icon} mt-1`}></i>
      <div>
        <p className="font-bold capitalize">{alert.severity} Priority Alert</p>
        <p>{alert.message}</p>
        <p className="text-xs opacity-70 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

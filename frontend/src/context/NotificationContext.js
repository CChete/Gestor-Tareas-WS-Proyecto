import { createContext, useState, useEffect } from 'react';
import socket from '../services/socket';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Conectar solo si hay token
    if (localStorage.getItem('token')) {
      socket.connect();

      socket.on('taskNotification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
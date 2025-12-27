import { createContext, useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Notification = styled.div`
  background-color: ${props => 
    props.type === 'success' ? '#4caf50' :
    props.type === 'error' ? '#f44336' :
    props.type === 'warning' ? '#ff9800' :
    '#2196f3'
  };
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const NotificationMessage = styled.span`
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification) {
        notification.isClosing = true;
        setTimeout(() => {
          setNotifications(current => current.filter(n => n.id !== id));
        }, 300);
        return [...prev];
      }
      return prev;
    });
  };

  const success = (message, duration) => showNotification(message, 'success', duration);
  const error = (message, duration) => showNotification(message, 'error', duration);
  const warning = (message, duration) => showNotification(message, 'warning', duration);
  const info = (message, duration) => showNotification(message, 'info', duration);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            isClosing={notification.isClosing}
          >
            <NotificationMessage>{notification.message}</NotificationMessage>
            <CloseButton onClick={() => removeNotification(notification.id)}>
              ×
            </CloseButton>
          </Notification>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};


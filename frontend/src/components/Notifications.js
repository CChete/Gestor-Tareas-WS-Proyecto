import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="notifications">
      {notifications.map((notif, index) => (
        <div key={index} className={`notification ${notif.type}`}>
          <p>{notif.message}</p>
          <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
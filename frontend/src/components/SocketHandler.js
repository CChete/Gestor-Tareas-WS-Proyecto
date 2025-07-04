import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';

const SocketHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // Registrar usuario en el socket
      socket.emit('register', user.id);

      // Opcional: Ping/pong de prueba
      socket.on('pongTest', (msg) => {
        console.log(msg);
      });
    }

    return () => {
      socket.off('pongTest');
    };
  }, [user?.id]);

  return null; // Este componente no renderiza nada
};

export default SocketHandler;
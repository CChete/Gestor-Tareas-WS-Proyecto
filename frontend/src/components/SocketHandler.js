import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import socket from "../services/socket";

export default function SocketHandler() {
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("register", user.id);
    }

    socket.on("taskChanged", (data) => {
      addNotification(data.message);
    });

    return () => {
      socket.off("taskChanged");
      socket.disconnect();
    };
  }, [user, addNotification]);

  return null;
}
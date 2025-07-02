import { io } from "socket.io-client";

// Usa la URL del backend
const SOCKET_URL = "http://localhost:3000"; 

const socket = io(SOCKET_URL, {
  autoConnect: false, //conecta manualmente después del login
});

export default socket;
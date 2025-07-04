const { Server } = require("socket.io");

// Mapeo para saber qué usuario está conectado a qué socket
const connectedUsers = {};

// Creamos un objeto para almacenar las exportaciones
const socketExports = {};

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    // Evento de prueba
    socket.on("pingTest", (msg) => {
      console.log("Ping recibido del frontend:", msg);
      socket.emit("pongTest", "¡Pong desde backend!");
    });

    // Registro de usuario
    socket.on("register", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of Object.entries(connectedUsers)) {
        if (id === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });

  // Función para notificar cambios en tareas
  function notifyTaskChange(userId, notification) {
    if (connectedUsers[userId]) {
      io.to(connectedUsers[userId]).emit("taskNotification", notification);
      console.log(`Notificación enviada a usuario ${userId}`);
    }
  }

  // Asignamos las exportaciones
  socketExports.io = io;
  socketExports.connectedUsers = connectedUsers;
  socketExports.notifyTaskChange = notifyTaskChange;

  return io;
}

// Exportamos todo correctamente
module.exports = {
  setupSocket,
  ...socketExports
};
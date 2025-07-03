const { Server } = require("socket.io");

// Mapeo para saber qué usuario está conectado a qué socket
const connectedUsers = {};

module.exports = (server) => {
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

    // El frontend debe enviar el userId tras conectar
    socket.on("register", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Elimina usuario desconectado
      for (const [userId, id] of Object.entries(connectedUsers)) {
        if (id === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log("Cliente desconectado:", socket.id);
    });
  });

  // Permite emitir eventos desde otros módulos
  module.exports.io = io;
  module.exports.connectedUsers = connectedUsers;
};
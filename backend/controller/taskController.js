const TaskModel = require('../models/taskModel');//importacion del modelo de tarea
const { io, connectedUsers } = require('../websocket/socket');

const taskController = {
  async getAll(req, res) {
    try {
      const tasks = await TaskModel.getAll();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener tareas' });
    }
  },

  async getById(req, res) {
    try {
      const task = await TaskModel.getById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  },

  async create(req, res) {
    try {
      const newTask = await TaskModel.create(req.body);
      
       // Notificar a cada usuario asignado a la tarea (si los hay)
    if (newTask.assignedUsers && Array.isArray(newTask.assignedUsers)) {
      newTask.assignedUsers.forEach(userId => {
        const socketId = connectedUsers[userId];
        if (socketId && io) {
          io.to(socketId).emit("taskChanged", {
            message: "¡Se te ha asignado una nueva tarea!",
            task: newTask
          });
        }
      });
    }
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  },

  // Agregar update y delete según avances
};

module.exports = taskController;
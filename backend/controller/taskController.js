const TaskModel = require('../models/taskModel');//importacion del modelo de tarea
const { io, connectedUsers } = require('../websocket/socket');
const { notifyTaskChange } = require('../websocket/socket');

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
      
       // Notificar al usuario asignado
      if (newTask.AssignedTo) {
        notifyTaskChange(newTask.AssignedTo, {
          type: "taskAssigned",
          message: "Se te ha asignado una nueva tarea",
          task: newTask,
          timestamp: new Date()
        });
      }
      
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  },
async update(req, res) {
  try {
    const updatedTask = await TaskModel.update(req.params.id, req.body);
    console.log('Tarea actualizada:', updatedTask); // Log para depuración
    
    if (!updatedTask) return res.status(404).json({ error: 'Tarea no encontrada' });

   
    res.json(updatedTask);
  } catch (err) {
    console.error('Error detallado en update:', err); // Esto mostrará el error real
    res.status(500).json({ 
      error: 'Error al actualizar tarea',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
},

  async delete(req, res) {
    try {
      const deletedTask = await TaskModel.delete(req.params.id);
      if (!deletedTask) return res.status(404).json({ error: 'Tarea no encontrada' });

      

      res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
  }};

module.exports = taskController;
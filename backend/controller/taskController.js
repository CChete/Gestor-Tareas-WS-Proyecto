const TaskModel = require('../models/taskModel');

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
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear tarea' });
    }
  },

  // Agrega update y delete según avances
};

module.exports = taskController;
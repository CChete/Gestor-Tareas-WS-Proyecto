const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// CRUD básico
router.get('/', taskController.getAll);//ruta para mostrar todas las tareas creadas
router.get('/:id', taskController.getById);// ruta para mostrar una ruta especifica pasando el id
router.post('/', taskController.create);//ruta para crear una tarea


module.exports = router;
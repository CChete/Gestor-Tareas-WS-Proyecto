const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// CRUD básico
router.get('/', taskController.getAll);//ruta para mostrar todas las tareas creadas
router.get('/:id', taskController.getById);// ruta para mostrar una ruta especifica pasando el id
router.post('/', taskController.create);//ruta para crear una tarea
router.put('/:id', taskController.update); // Ruta para actualizar una tarea existente
router.delete('/:id', taskController.delete); // Ruta para eliminar una tarea


module.exports = router;


const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// CRUD básico
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
// router.put('/:id', ...);
// router.delete('/:id', ...);

module.exports = router;
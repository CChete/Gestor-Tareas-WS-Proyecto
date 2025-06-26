const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.get('/', projectController.getAll);//ruta para mostrar todos los proyectos creados
router.post('/', projectController.create);//ruta para crear proyectos

module.exports = router;
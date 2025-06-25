const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

router.get('/', projectController.getAll);
router.post('/', projectController.create);

module.exports = router;
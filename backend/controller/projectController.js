const ProjectModel = require('../models/projectModel');//importacion del modelo de Proyecto
const UserModel = require('../models/userModel');  //importacion del modelo de Usuario

const projectController = {
  async create(req, res) {
    try {
      const { OwnerID } = req.body;
      // Validar existencia de usuario
      const userExists = await UserModel.exists(OwnerID);
      if (!userExists) {
        return res.status(400).json({ error: `El usuario con ID ${OwnerID} no existe.` });
      }

      const newProject = await ProjectModel.create(req.body);
      res.status(201).json(newProject);
    } catch (err) {
      console.error('Error real:', err);
      res.status(500).json({ error: 'Error al crear proyecto' });
    }
  },

  async getAll(req, res) {
    try {
      const projects = await ProjectModel.getAll();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener proyectos' });
    }
  },
};

module.exports = projectController;
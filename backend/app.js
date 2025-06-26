const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');//importacion de las rutas de tareas
const projectRoutes = require('./routes/projectRoutes');//importacion de las rutas de proyectos

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('API gestor de tareas activo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
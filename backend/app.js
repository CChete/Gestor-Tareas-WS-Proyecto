const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/auth');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas (login, register, etc.)
app.use('/api', authRoutes);

// Rutas principales (requieren autenticación si así lo decides)
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('API gestor de tareas activo');
});

// Rutas de prueba protegidas
app.get('/api/protegido', authenticateToken, (req, res) => {
  res.json({ mensaje: "¡Acceso autorizado!", usuario: req.user });
});

app.get('/api/solo-admin', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.json({ mensaje: "¡Eres admin!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
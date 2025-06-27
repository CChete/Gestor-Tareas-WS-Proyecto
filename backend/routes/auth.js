const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Buscar usuario en la base de datos usando el pool global
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email AND IsActive = 1');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = result.recordset[0];

    // 2. Comparar password (Password Hasheado)
      if (user.PasswordHash.toString().startsWith('$2a$') || user.PasswordHash.toString().startsWith('$2b$')) {
          const match = await bcrypt.compare(password, user.PasswordHash.toString());
          if (!match) {
              return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
          }
      }

    // 3. Generar JWT
    const token = jwt.sign(
      { userId: user.UserID, role: user.Role, username: user.Username },
      SECRET,
      { expiresIn: '2h' }
    );

    // 4. Devolver datos y token
    res.json({
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        email: user.Email,
        role: user.Role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Lista de roles permitidos
const allowedRoles = ['user', 'manager'];

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validación de campos obligatorios
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  // Validación de rol permitido
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: `Rol no permitido. Roles válidos: ${allowedRoles.join(', ')}` });
  }

  try {
    const pool = await getConnection();

    // Verifica si el email ya existe
    const exists = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT UserID FROM Users WHERE Email = @email');

    if (exists.recordset.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Hashea la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Inserta el usuario
    await pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.VarChar, email)
      .input('hash', sql.VarChar, hash)
      .input('role', sql.VarChar, role)
      .input('isActive', sql.Bit, 1)
      .query(
        `INSERT INTO Users (Username, Email, PasswordHash, PasswordSalt, Role, IsActive)
         VALUES (@username, @email, @hash, @hash, @role, @isActive)`
      );

    // Opcional: crear token automáticamente tras registro
    const token = jwt.sign({ username, email, role }, SECRET, { expiresIn: '2h' });

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      token,
      user: { username, email, role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
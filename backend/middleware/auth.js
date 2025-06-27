const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "secreto123";

// Valida token y agrega user a req
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protege por rol: usage: (req, res, next) => authorizeRoles(['admin','manager'])(req, res, next)
function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  }
}

module.exports = { authenticateToken, authorizeRoles };
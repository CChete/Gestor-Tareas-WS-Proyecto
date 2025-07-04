require('dotenv').config();
const sql = require('mssql');

//conexion con la base de datos atravez del archivo .env en local usando variables de entorno
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
   port: parseInt(process.env.DB_PORT, 10), 
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    throw err;
  }
}

module.exports = { sql, getConnection };
const { getConnection, sql } = require('../database');

// Modelo de Tarea (solo ejemplos básicos)
const TaskModel = {
  async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Tasks');
    return result.recordset;
  },

  async getById(id) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Tasks WHERE TaskID = @id');
    return result.recordset[0];
  },

  async create(task) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('Title', sql.NVarChar, task.Title)
      .input('Description', sql.NVarChar, task.Description)
      .input('Status', sql.NVarChar, task.Status)
      .input('Priority', sql.NVarChar, task.Priority)
      .input('DueDate', sql.DateTime, task.DueDate)
      .input('CreatedBy', sql.Int, task.CreatedBy)
      .input('AssignedTo', sql.Int, task.AssignedTo)
      .input('ProjectID', sql.Int, task.ProjectID)
      .query(`
        INSERT INTO Tasks (Title, Description, Status, Priority, DueDate, CreatedBy, AssignedTo, ProjectID)
        VALUES (@Title, @Description, @Status, @Priority, @DueDate, @CreatedBy, @AssignedTo, @ProjectID);
        SELECT SCOPE_IDENTITY() AS TaskID;
      `);
    return result.recordset[0];
  },

  // Agregar métodos faltantes
};

module.exports = TaskModel;
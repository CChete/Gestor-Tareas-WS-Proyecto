const { getConnection, sql } = require('../database');

// Modelo de Tarea
const TaskModel = {
    //metodo para mostrar todas las tareas
  async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Tasks');
    return result.recordset;
  },
    //metodo para mostrar las tareas por id especifico de usuario asignado a la tarea
  async getById(id) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Tasks WHERE AssignedTo = @id');
    return result.recordset;
  },
    //metodo para crear una tarea nueva 
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
 // Método para actualizar una tarea existente
async update(id, taskData) {
  const pool = await getConnection();
  try {
    // Validar el Status si está presente
    if (taskData.Status) {
      const validStatuses = ['archived', 'completed', 'in-progress', 'pending'];
      if (!validStatuses.includes(taskData.Status.toLowerCase())) {
        throw new Error(`Status inválido. Valores permitidos: ${validStatuses.join(', ')}`);
      }
      // Asegurar minúsculas
      taskData.Status = taskData.Status.toLowerCase();
    }

    const result = await pool
      .request()
      .input('TaskID', sql.Int, id)
      .input('Title', sql.NVarChar, taskData.Title || null)
      .input('Description', sql.NVarChar, taskData.Description || null)
      .input('Status', sql.NVarChar, taskData.Status || null)
      .input('Priority', sql.NVarChar, taskData.Priority || null)
      .input('DueDate', sql.DateTime, taskData.DueDate || null)
      .input('AssignedTo', sql.Int, taskData.AssignedTo || null)
      .input('ProjectID', sql.Int, taskData.ProjectID || null)
      .query(`
        UPDATE Tasks SET
          Title = COALESCE(@Title, Title),
          Description = COALESCE(@Description, Description),
          Status = COALESCE(@Status, Status),
          Priority = COALESCE(@Priority, Priority),
          DueDate = COALESCE(@DueDate, DueDate),
          AssignedTo = COALESCE(@AssignedTo, AssignedTo),
          ProjectID = COALESCE(@ProjectID, ProjectID)
        WHERE TaskID = @TaskID;
        SELECT * FROM Tasks WHERE TaskID = @TaskID;
      `);
    
    if (!result.recordset.length) return null;
    return result.recordset[0];
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
},

  // Método para eliminar una tarea
  async delete(id) {
    const pool = await getConnection();
    
    // Primero obtenemos la tarea para retornar los datos después de eliminarla
    const taskToDelete = await pool
      .request()
      .input('TaskID', sql.Int, id)
      .query('SELECT * FROM Tasks WHERE TaskID = @TaskID');
    
    if (taskToDelete.recordset.length === 0) {
      return null;
    }
    
    await pool
      .request()
      .input('TaskID', sql.Int, id)
      .query('DELETE FROM Tasks WHERE TaskID = @TaskID');
    
    return taskToDelete.recordset[0];
  }
};


module.exports = TaskModel;
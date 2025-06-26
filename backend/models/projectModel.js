const { getConnection, sql } = require('../database');

//modelo de proyectos 
const ProjectModel = {
        //metodo para mostrar todos los projectos creados
  async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Projects');
    return result.recordset;
  },
  //metodo para crear proyectos
  async create(project) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('Name', sql.NVarChar, project.Name)
      .input('Description', sql.NVarChar, project.Description)
      .input('OwnerID', sql.Int, project.OwnerID)
      .input('StartDate', sql.Date, project.StartDate)
      .input('EndDate', sql.Date, project.EndDate)
      .query(`
        INSERT INTO Projects (Name, Description, OwnerID, StartDate, EndDate)
        VALUES (@Name, @Description, @OwnerID, @StartDate, @EndDate);
        SELECT SCOPE_IDENTITY() AS ProjectID;
      `);
    return result.recordset[0];
  },
};

module.exports = ProjectModel;
const { getConnection, sql } = require('../database');

const UserModel = {
  async exists(userId) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, userId)
      .query('SELECT 1 FROM Users WHERE UserID = @id');
    return result.recordset.length > 0;
  },
};

module.exports = UserModel;
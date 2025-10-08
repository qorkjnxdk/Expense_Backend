const pool = require('../db');

const getAllUsers = async () => {
  const result = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
  return result.rows;
};

const findUserbyUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows;
};

module.exports = {
    getAllUsers, findUserbyUsername
}
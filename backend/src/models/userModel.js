import { pool } from "../config/db.js";

export const UserModel = {
  async findById(id) {
    const [rows] = await pool.query("SELECT id, username, display_name, role FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async findByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
  },

  async create({ username, password_hash, display_name = null, role = "user" }) {
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, display_name, role) VALUES (?,?,?,?)",
      [username, password_hash, display_name, role]
    );
    return result.insertId;
  }
};

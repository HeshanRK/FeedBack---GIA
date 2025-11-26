import { pool } from "../config/db.js";

export const FormModel = {
  async create({ title, description, created_by }) {
    const [result] = await pool.query("INSERT INTO forms (title, description, created_by) VALUES (?,?,?)", [
      title,
      description,
      created_by || null
    ]);
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query("SELECT * FROM forms ORDER BY created_at DESC");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM forms WHERE id = ?", [id]);
    return rows[0];
  }
};

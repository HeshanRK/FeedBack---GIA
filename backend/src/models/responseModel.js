import { pool } from "../config/db.js";

export const ResponseModel = {
  async create({ form_id, visitor_id = null, submitted_by_user = null }) {
    const [result] = await pool.query(
      "INSERT INTO responses (form_id, visitor_id, submitted_by_user) VALUES (?,?,?)",
      [form_id, visitor_id, submitted_by_user]
    );
    return result.insertId;
  },

  async findByFormId(formId) {
    const [rows] = await pool.query("SELECT r.*, v.name as visitor_name, v.type as visitor_type FROM responses r LEFT JOIN visitors v ON r.visitor_id = v.id WHERE r.form_id = ? ORDER BY r.submitted_at DESC", [formId]);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT r.*, v.* FROM responses r LEFT JOIN visitors v ON r.visitor_id = v.id WHERE r.id = ?", [id]);
    return rows[0];
  }
};

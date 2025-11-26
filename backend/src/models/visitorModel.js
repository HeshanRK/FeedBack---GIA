import { pool } from "../config/db.js";

export const VisitorModel = {
  async create({ type, name, organization = null, id_number = null, purpose = null }) {
    const [result] = await pool.query(
      "INSERT INTO visitors (type, name, organization, id_number, purpose) VALUES (?,?,?,?,?)",
      [type, name, organization, id_number, purpose]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM visitors WHERE id = ?", [id]);
    return rows[0];
  }
};

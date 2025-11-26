import { pool } from "../config/db.js";

export const FormModel = {
  async create({ title, description, visitor_type = 'both', created_by }) {
    const [result] = await pool.query(
      "INSERT INTO forms (title, description, visitor_type, created_by) VALUES (?,?,?,?)", 
      [title, description, visitor_type, created_by || null]
    );
    return result.insertId;
  },

  async findAll(visitor_type = null) {
    let query = "SELECT * FROM forms";
    const params = [];
    
    // Filter by visitor_type if provided
    if (visitor_type) {
      query += " WHERE visitor_type = ? OR visitor_type = 'both'";
      params.push(visitor_type);
    }
    
    query += " ORDER BY created_at DESC";
    
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM forms WHERE id = ?", [id]);
    return rows[0];
  }
};
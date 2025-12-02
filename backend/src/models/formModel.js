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
  },

  async update(id, { title, description, visitor_type }) {
    await pool.query(
      "UPDATE forms SET title = ?, description = ?, visitor_type = ? WHERE id = ?",
      [title, description, visitor_type, id]
    );
  },

  async delete(id) {
    // Delete all questions first (cascade)
    await pool.query("DELETE FROM questions WHERE form_id = ?", [id]);
    // Delete all responses
    await pool.query("DELETE FROM responses WHERE form_id = ?", [id]);
    // Delete the form
    await pool.query("DELETE FROM forms WHERE id = ?", [id]);
  },

  // NEW: Set active form for guest visitors
  async setActiveGuest(formId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // First, deactivate all guest forms
      await connection.query("UPDATE forms SET is_active_guest = FALSE");
      
      // Then activate the selected form
      await connection.query("UPDATE forms SET is_active_guest = TRUE WHERE id = ?", [formId]);
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // NEW: Set active form for internal visitors
  async setActiveInternal(formId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // First, deactivate all internal forms
      await connection.query("UPDATE forms SET is_active_internal = FALSE");
      
      // Then activate the selected form
      await connection.query("UPDATE forms SET is_active_internal = TRUE WHERE id = ?", [formId]);
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // NEW: Get active form for a visitor type
  async getActiveForm(visitorType) {
    let query;
    if (visitorType === 'guest') {
      query = "SELECT * FROM forms WHERE is_active_guest = TRUE LIMIT 1";
    } else if (visitorType === 'internal') {
      query = "SELECT * FROM forms WHERE is_active_internal = TRUE LIMIT 1";
    } else {
      return null;
    }
    
    const [rows] = await pool.query(query);
    return rows[0] || null;
  }
};
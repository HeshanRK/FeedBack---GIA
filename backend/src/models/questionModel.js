import { pool } from "../config/db.js";

export const QuestionModel = {
  async create({ form_id, q_text, q_type, required = 0, order_index = 0, extra = null }) {
    const [result] = await pool.query(
      "INSERT INTO questions (form_id, q_text, q_type, required, order_index, extra) VALUES (?,?,?,?,?,?)",
      [form_id, q_text, q_type, required, order_index, extra ? JSON.stringify(extra) : null]
    );
    return result.insertId;
  },

  async update(id, { q_text, q_type, required, order_index, extra }) {
    await pool.query(
      "UPDATE questions SET q_text=?, q_type=?, required=?, order_index=?, extra=? WHERE id=?",
      [q_text, q_type, required, order_index, extra ? JSON.stringify(extra) : null, id]
    );
  },

  async delete(id) {
    await pool.query("DELETE FROM questions WHERE id=?", [id]);
  },

  async findByFormId(formId) {
  const [rows] = await pool.query("SELECT * FROM questions WHERE form_id=? ORDER BY order_index ASC", [formId]);
  // parse JSON only if it's a string
  return rows.map(r => ({ 
    ...r, 
    extra: r.extra && typeof r.extra === 'string' ? JSON.parse(r.extra) : r.extra 
  }));
},

  async findById(id) {
  const [rows] = await pool.query("SELECT * FROM questions WHERE id=?", [id]);
  const q = rows[0];
  if (!q) return null;
  return { ...q, extra: q.extra && typeof q.extra === 'string' ? JSON.parse(q.extra) : q.extra };
}
};

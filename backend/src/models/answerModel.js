import { pool } from "../config/db.js";

export const AnswerModel = {
  async create({ response_id, question_id, value = null, file_path = null }) {
    const [result] = await pool.query(
      "INSERT INTO answers (response_id, question_id, value, file_path) VALUES (?,?,?,?)",
      [response_id, question_id, value, file_path]
    );
    return result.insertId;
  },

  async findByResponseId(responseId) {
    const [rows] = await pool.query("SELECT a.*, q.q_text, q.q_type FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.response_id = ?", [responseId]);
    return rows.map(r => ({ ...r, value: r.value ? (() => {
      try { return JSON.parse(r.value); } catch(e){ return r.value; }
    })() : r.value }));
  }
};

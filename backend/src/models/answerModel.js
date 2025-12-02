import { pool } from "../config/db.js";

export class AnswerModel {

  static async create(data) {
    const { response_id, question_id, value, file_path } = data;
    const [result] = await pool.query(
      `INSERT INTO answers (response_id, question_id, value, file_path)
       VALUES (?, ?, ?, ?)`,
      [response_id, question_id, value, file_path]
    );

    return result.insertId;
  }

  static async findByResponseId(responseId) {
    const [rows] = await pool.query(
      `SELECT * FROM answers WHERE response_id = ?`,
      [responseId]
    );
    return rows;
  }

  // ⭐ NEW FIX — Fetch answers + question text
  static async findByResponseIdWithQuestions(responseId) {
  const [rows] = await pool.query(
    `SELECT 
        a.*, 
        q.q_text AS q_text
     FROM answers a
     LEFT JOIN questions q ON a.question_id = q.id
     WHERE a.response_id = ?`,
    [responseId]
  );

  return rows;
}

}

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

  // Fetch answers + question text + sub-question info (parent_question_id, sub_question_label)
  static async findByResponseIdWithQuestions(responseId) {
    const [rows] = await pool.query(
      `SELECT 
          a.*, 
          q.q_text AS q_text,
          q.parent_question_id AS parent_question_id,
          q.sub_question_label AS sub_question_label
       FROM answers a
       LEFT JOIN questions q ON a.question_id = q.id
       WHERE a.response_id = ?
       ORDER BY q.order_index ASC, q.parent_question_id ASC, q.id ASC`,
      [responseId]
    );

    return rows;
  }

}
import { pool } from "../config/db.js";

export const QuestionModel = {
  // Create a question (main or sub-question)
  async create({ form_id, q_text, q_type, required = 0, order_index = 0, extra = null, parent_question_id = null, sub_question_label = null }) {
    const [result] = await pool.query(
      "INSERT INTO questions (form_id, q_text, q_type, required, order_index, extra, parent_question_id, sub_question_label) VALUES (?,?,?,?,?,?,?,?)",
      [form_id, q_text, q_type, required, order_index, extra ? JSON.stringify(extra) : null, parent_question_id, sub_question_label]
    );
    return result.insertId;
  },

  // Update a question
  async update(id, { q_text, q_type, required, order_index, extra, parent_question_id, sub_question_label }) {
    await pool.query(
      "UPDATE questions SET q_text=?, q_type=?, required=?, order_index=?, extra=?, parent_question_id=?, sub_question_label=? WHERE id=?",
      [q_text, q_type, required, order_index, extra ? JSON.stringify(extra) : null, parent_question_id, sub_question_label, id]
    );
  },

  // Delete a question (will also delete sub-questions due to CASCADE)
  async delete(id) {
    await pool.query("DELETE FROM questions WHERE id=?", [id]);
  },

  // Find all questions for a form (including sub-questions, organized hierarchically)
  async findByFormId(formId) {
    const [rows] = await pool.query(
      "SELECT * FROM questions WHERE form_id=? ORDER BY order_index ASC, parent_question_id ASC, id ASC", 
      [formId]
    );
    
    // Parse extra field and organize into hierarchy
    const questions = rows.map(r => ({ 
      ...r, 
      extra: r.extra && typeof r.extra === 'string' ? JSON.parse(r.extra) : r.extra,
      subQuestions: [] // Initialize empty array for sub-questions
    }));

    // Separate main questions and sub-questions
    const mainQuestions = questions.filter(q => q.parent_question_id === null);
    const subQuestions = questions.filter(q => q.parent_question_id !== null);

    // Attach sub-questions to their parent questions
    subQuestions.forEach(subQ => {
      const parent = mainQuestions.find(mainQ => mainQ.id === subQ.parent_question_id);
      if (parent) {
        parent.subQuestions.push(subQ);
      }
    });

    return mainQuestions;
  },

  // Find a single question by ID
  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM questions WHERE id=?", [id]);
    const q = rows[0];
    if (!q) return null;
    
    // Get sub-questions if this is a parent question
    const [subRows] = await pool.query(
      "SELECT * FROM questions WHERE parent_question_id=? ORDER BY order_index ASC", 
      [id]
    );
    
    return { 
      ...q, 
      extra: q.extra && typeof q.extra === 'string' ? JSON.parse(q.extra) : q.extra,
      subQuestions: subRows.map(r => ({
        ...r,
        extra: r.extra && typeof r.extra === 'string' ? JSON.parse(r.extra) : r.extra
      }))
    };
  }
};
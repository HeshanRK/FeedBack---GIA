import { QuestionModel } from "../models/questionModel.js";

export const addQuestion = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    const { q_text, q_type, required = false, order_index = 0, extra = null } = req.body;
    if (!q_text || !q_type) return res.status(400).json({ message: "q_text and q_type required" });
    const id = await QuestionModel.create({ form_id: formId, q_text, q_type, required: required ? 1 : 0, order_index, extra });
    res.status(201).json({ questionId: id });
  } catch (err) {
    next(err);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { q_text, q_type, required = false, order_index = 0, extra = null } = req.body;
    await QuestionModel.update(id, { q_text, q_type, required: required ? 1 : 0, order_index, extra });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    await QuestionModel.delete(id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

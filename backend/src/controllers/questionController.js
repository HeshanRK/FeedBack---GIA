import { QuestionModel } from "../models/questionModel.js";

export const addQuestion = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    
    if (!formId || isNaN(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const { q_text, q_type, required = false, order_index = 0, extra = null, parent_question_id = null, sub_question_label = null } = req.body;
    
    if (!q_text || q_text.trim() === "") {
      return res.status(400).json({ message: "Question text is required" });
    }
    
    const validTypes = ["short", "paragraph", "radio", "checkbox", "dropdown", "rating"];
    if (!q_type || !validTypes.includes(q_type)) {
      return res.status(400).json({ message: "Invalid question type" });
    }
    
    // Validate that options exist for types that need them
    if (["radio", "checkbox", "dropdown"].includes(q_type)) {
      if (!extra?.options || !Array.isArray(extra.options) || extra.options.length === 0) {
        return res.status(400).json({ message: `${q_type} questions must have options` });
      }
    }
    
    const id = await QuestionModel.create({ 
      form_id: formId, 
      q_text: q_text.trim(), 
      q_type, 
      required: required ? 1 : 0, 
      order_index, 
      extra,
      parent_question_id,
      sub_question_label: sub_question_label?.trim() || null
    });
    
    res.status(201).json({ questionId: id });
  } catch (err) {
    console.error("Error adding question:", err);
    next(err);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    
    const { q_text, q_type, required = false, order_index = 0, extra = null, parent_question_id = null, sub_question_label = null } = req.body;
    
    if (q_text && q_text.trim() === "") {
      return res.status(400).json({ message: "Question text cannot be empty" });
    }
    
    const validTypes = ["short", "paragraph", "radio", "checkbox", "dropdown", "rating"];
    if (q_type && !validTypes.includes(q_type)) {
      return res.status(400).json({ message: "Invalid question type" });
    }
    
    await QuestionModel.update(id, { 
      q_text: q_text?.trim(), 
      q_type, 
      required: required ? 1 : 0, 
      order_index, 
      extra,
      parent_question_id,
      sub_question_label: sub_question_label?.trim() || null
    });
    
    res.json({ ok: true });
  } catch (err) {
    console.error("Error updating question:", err);
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    
    await QuestionModel.delete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting question:", err);
    next(err);
  }
};
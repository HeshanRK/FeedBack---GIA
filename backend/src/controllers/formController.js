import { FormModel } from "../models/formModel.js";
import { QuestionModel } from "../models/questionModel.js";

export const createForm = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "title required" });
    const created_by = req.user?.id || null;
    const id = await FormModel.create({ title, description, created_by });
    res.status(201).json({ formId: id });
  } catch (err) {
    next(err);
  }
};

export const getForms = async (req, res, next) => {
  try {
    const forms = await FormModel.findAll();
    res.json(forms);
  } catch (err) {
    next(err);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const form = await FormModel.findById(id);
    if (!form) return res.status(404).json({ message: "form not found" });
    const questions = await QuestionModel.findByFormId(id);
    res.json({ ...form, questions });
  } catch (err) {
    next(err);
  }
};

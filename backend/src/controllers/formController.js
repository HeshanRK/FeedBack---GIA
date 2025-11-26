import { FormModel } from "../models/formModel.js";
import { QuestionModel } from "../models/questionModel.js";

export const createForm = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    
    if (title.length > 255) {
      return res.status(400).json({ message: "title must be less than 255 characters" });
    }
    
    const created_by = req.user?.id || null;
    const id = await FormModel.create({ 
      title: title.trim(), 
      description: description?.trim() || null, 
      created_by 
    });
    
    res.status(201).json({ formId: id });
  } catch (err) {
    console.error("Error creating form:", err);
    next(err);
  }
};

export const getForms = async (req, res, next) => {
  try {
    const forms = await FormModel.findAll();
    res.json(forms);
  } catch (err) {
    console.error("Error fetching forms:", err);
    next(err);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const form = await FormModel.findById(id);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    const questions = await QuestionModel.findByFormId(id);
    res.json({ ...form, questions });
  } catch (err) {
    console.error("Error fetching form:", err);
    next(err);
  }
};
import { FormModel } from "../models/formModel.js";
import { QuestionModel } from "../models/questionModel.js";

export const createForm = async (req, res, next) => {
  try {
    const { title, description, visitor_type = 'both' } = req.body;
    
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    
    if (title.length > 255) {
      return res.status(400).json({ message: "title must be less than 255 characters" });
    }

    // Validate visitor_type
    const validTypes = ['guest', 'internal', 'both'];
    if (visitor_type && !validTypes.includes(visitor_type)) {
      return res.status(400).json({ message: "visitor_type must be 'guest', 'internal', or 'both'" });
    }
    
    const created_by = req.user?.id || null;
    const id = await FormModel.create({ 
      title: title.trim(), 
      description: description?.trim() || null,
      visitor_type: visitor_type || 'both',
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
    // Get visitor_type filter from query params
    const { visitor_type } = req.query;
    
    const forms = await FormModel.findAll(visitor_type);
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
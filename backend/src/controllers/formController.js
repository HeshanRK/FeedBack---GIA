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

export const updateForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const { title, description, visitor_type } = req.body;
    
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    
    if (title.length > 255) {
      return res.status(400).json({ message: "Title must be less than 255 characters" });
    }

    // Validate visitor_type
    const validTypes = ['guest', 'internal', 'both'];
    if (visitor_type && !validTypes.includes(visitor_type)) {
      return res.status(400).json({ message: "visitor_type must be 'guest', 'internal', or 'both'" });
    }
    
    await FormModel.update(id, {
      title: title.trim(),
      description: description?.trim() || null,
      visitor_type: visitor_type || 'both'
    });
    
    res.json({ ok: true, message: "Form updated successfully" });
  } catch (err) {
    console.error("Error updating form:", err);
    next(err);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    await FormModel.delete(id);
    res.json({ ok: true, message: "Form deleted successfully" });
  } catch (err) {
    console.error("Error deleting form:", err);
    next(err);
  }
};

// NEW: Set active form for guest visitors
export const setActiveGuest = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    // Check if form exists and is available for guests
    const form = await FormModel.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.visitor_type !== 'guest' && form.visitor_type !== 'both') {
      return res.status(400).json({ message: "This form is not available for guest visitors" });
    }

    await FormModel.setActiveGuest(id);
    res.json({ ok: true, message: "Active guest form set successfully" });
  } catch (err) {
    console.error("Error setting active guest form:", err);
    next(err);
  }
};

// NEW: Set active form for internal visitors
export const setActiveInternal = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    // Check if form exists and is available for internal visitors
    const form = await FormModel.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.visitor_type !== 'internal' && form.visitor_type !== 'both') {
      return res.status(400).json({ message: "This form is not available for internal visitors" });
    }

    await FormModel.setActiveInternal(id);
    res.json({ ok: true, message: "Active internal form set successfully" });
  } catch (err) {
    console.error("Error setting active internal form:", err);
    next(err);
  }
};

// NEW: Get active form for visitor type
export const getActiveForm = async (req, res, next) => {
  try {
    const { visitorType } = req.params;
    
    if (!visitorType || !['guest', 'internal'].includes(visitorType)) {
      return res.status(400).json({ message: "Invalid visitor type" });
    }

    const form = await FormModel.getActiveForm(visitorType);
    
    if (!form) {
      return res.status(404).json({ message: `No active form set for ${visitorType} visitors` });
    }

    const questions = await QuestionModel.findByFormId(form.id);
    res.json({ ...form, questions });
  } catch (err) {
    console.error("Error fetching active form:", err);
    next(err);
  }
};
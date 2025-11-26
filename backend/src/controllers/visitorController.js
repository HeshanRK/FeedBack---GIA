import { VisitorModel } from "../models/visitorModel.js";

export const guestLogin = async (req, res, next) => {
  try {
    const { name, organization = null, purpose = null } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }
    
    if (name.length > 100) {
      return res.status(400).json({ message: "Name must be less than 100 characters" });
    }
    
    if (organization && organization.length > 100) {
      return res.status(400).json({ message: "Organization must be less than 100 characters" });
    }
    
    if (purpose && purpose.length > 255) {
      return res.status(400).json({ message: "Purpose must be less than 255 characters" });
    }

    const id = await VisitorModel.create({ 
      type: "guest", 
      name: name.trim(), 
      organization: organization?.trim() || null, 
      purpose: purpose?.trim() || null 
    });
    
    res.status(201).json({ visitorId: id });
  } catch (err) {
    console.error("Error creating guest visitor:", err);
    next(err);
  }
};

export const internalLogin = async (req, res, next) => {
  try {
    const { id_number, name } = req.body;
    
    if (!id_number || id_number.trim() === "") {
      return res.status(400).json({ message: "ID number is required" });
    }
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }
    
    if (id_number.length > 50) {
      return res.status(400).json({ message: "ID number must be less than 50 characters" });
    }
    
    if (name.length > 100) {
      return res.status(400).json({ message: "Name must be less than 100 characters" });
    }

    const id = await VisitorModel.create({ 
      type: "internal", 
      name: name.trim(), 
      id_number: id_number.trim() 
    });
    
    res.status(201).json({ visitorId: id });
  } catch (err) {
    console.error("Error creating internal visitor:", err);
    next(err);
  }
};
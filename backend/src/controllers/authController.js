import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Validation helper
const validateInput = (data, rules) => {
  const errors = [];
  
  for (const [field, rule] of Object.entries(rules)) {
    if (rule.required && !data[field]) {
      errors.push(`${field} is required`);
    }
    if (data[field] && rule.minLength && data[field].length < rule.minLength) {
      errors.push(`${field} must be at least ${rule.minLength} characters`);
    }
    if (data[field] && rule.maxLength && data[field].length > rule.maxLength) {
      errors.push(`${field} must be less than ${rule.maxLength} characters`);
    }
  }
  
  return errors;
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const errors = validateInput({ username, password }, {
      username: { required: true, minLength: 3, maxLength: 50 },
      password: { required: true, minLength: 6 }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const user = await UserModel.findByUsername(username.trim());
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    res.json({ token, user: { id: user.id, username: user.username, display_name: user.display_name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, password, display_name, role } = req.body;
    
    // Validate input
    const errors = validateInput({ username, password }, {
      username: { required: true, minLength: 3, maxLength: 50 },
      password: { required: true, minLength: 6, maxLength: 100 }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const exists = await UserModel.findByUsername(username.trim());
    if (exists) return res.status(400).json({ message: "username already exists" });

    const hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ 
      username: username.trim(), 
      password_hash: hash, 
      display_name: display_name?.trim() || null, 
      role: role || "user" 
    });

    res.status(201).json({ id, username: username.trim(), display_name: display_name?.trim() || null, role: role || "user" });
  } catch (err) {
    next(err);
  }
};
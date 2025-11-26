import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "username and password required" });

    const user = await UserModel.findByUsername(username);
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
    if (!username || !password) return res.status(400).json({ message: "username and password required" });

    const exists = await UserModel.findByUsername(username);
    if (exists) return res.status(400).json({ message: "username already exists" });

    const hash = await bcrypt.hash(password, 10);
    const id = await UserModel.create({ username, password_hash: hash, display_name, role: role || "user" });

    res.status(201).json({ id, username, display_name, role: role || "user" });
  } catch (err) {
    next(err);
  }
};

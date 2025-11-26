import { VisitorModel } from "../models/visitorModel.js";

export const guestLogin = async (req, res, next) => {
  try {
    const { name, organization = null, purpose = null } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const id = await VisitorModel.create({ type: "guest", name, organization, purpose });
    res.status(201).json({ visitorId: id });
  } catch (err) {
    next(err);
  }
};

export const internalLogin = async (req, res, next) => {
  try {
    const { id_number, name } = req.body;
    if (!id_number || !name) return res.status(400).json({ message: "id_number and name are required" });

    const id = await VisitorModel.create({ type: "internal", name, id_number });
    res.status(201).json({ visitorId: id });
  } catch (err) {
    next(err);
  }
};

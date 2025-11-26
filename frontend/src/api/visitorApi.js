import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/visitor`;

export const guestLogin = async (details) => {
  const res = await axios.post(`${API}/guest`, details);
  return res.data;
};

export const internalLogin = async (details) => {
  const res = await axios.post(`${API}/internal`, details);
  return res.data;
};
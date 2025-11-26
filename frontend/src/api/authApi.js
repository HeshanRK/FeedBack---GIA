import axios from "axios";
import { getToken } from "../utils/storage";

const API = "http://localhost:5000/api/auth";

export const loginAdmin = async (username, password) => {
  const res = await axios.post(`${API}/login`, { username, password });
  return res.data;
};

export const registerUser = async (data) => {
  return axios.post(`${API}/register`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

import axios from "axios";
import { getToken } from "../utils/storage";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/auth`;

export const loginAdmin = async (username, password) => {
  const res = await axios.post(`${API}/login`, { username, password });
  return res.data;
};

export const registerUser = async (data) => {
  return axios.post(`${API}/register`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
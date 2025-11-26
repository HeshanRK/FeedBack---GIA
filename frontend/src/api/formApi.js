import axios from "axios";
import { getToken } from "../utils/storage";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/forms`;

export const createForm = async (data) => {
  return axios.post(API, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const getForms = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getFormById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};
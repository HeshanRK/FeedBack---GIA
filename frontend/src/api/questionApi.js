import axios from "axios";
import { getToken } from "../utils/storage";

const API = "http://localhost:5000/api/questions";

export const addQuestion = async (formId, data) =>
  axios.post(`${API}/${formId}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateQuestion = async (id, data) =>
  axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteQuestion = async (id) =>
  axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

import axios from "axios";
import { getToken } from "../utils/storage";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/questions`;

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
import axios from "axios";
import { getToken } from "../utils/storage";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/responses`;

export const submitResponse = async (formId, data) =>
  axios.post(`${API}/${formId}`, data);

export const getResponses = async (formId) =>
  axios.get(`${API}/${formId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const downloadPdf = async (responseId) =>
  axios.get(`${API}/pdf/${responseId}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
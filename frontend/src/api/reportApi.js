import axios from "axios";
import { getToken } from "../utils/storage";
import { API_BASE_URL } from "../config/api";

const API = `${API_BASE_URL}/api/responses`;

export const downloadAllResponses = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.formId) params.append('formId', filters.formId);
  
  return axios.get(`${API}/download/all?${params.toString()}`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
};
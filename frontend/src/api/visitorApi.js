import axios from "axios";

const API = "http://localhost:5000/api/visitor";

export const guestLogin = async (details) => {
  const res = await axios.post(`${API}/guest`, details);
  return res.data;
};

export const internalLogin = async (details) => {
  const res = await axios.post(`${API}/internal`, details);
  return res.data;
};

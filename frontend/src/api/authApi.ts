import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/auth";

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  return response.data;
};

export const register = async (userData: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

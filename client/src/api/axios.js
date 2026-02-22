import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // or thin on local : http://localhost:5000/api
  withCredentials: true
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://insightdrive.onrender.com/api",
  withCredentials: true
});

export default api;

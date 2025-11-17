import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081", // your backend URL
});

export default axiosClient;

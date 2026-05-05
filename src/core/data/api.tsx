import axios, {
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosHeaders,
} from "axios";

// Create an Axios instance
const api: AxiosInstance = axios.create({
  //  baseURL: "https://api.ikidzschools.com/",
  baseURL:'http://13.235.172.170:3001',
  //  baseURL: "http://localhost:4000",
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

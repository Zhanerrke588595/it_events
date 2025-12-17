import axios from "axios"
import { MOCKAPI_BASE_URL } from "../config/api"

const api = axios.create({
  baseURL: MOCKAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("[v0] API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default api

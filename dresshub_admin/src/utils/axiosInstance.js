import axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
        baseURL,
        timeout: 30000, // 30 seconds timeout
        headers: {
                "Content-Type": "application/json",
        },
});

// Request interceptor - attach token to all requests
axiosInstance.interceptors.request.use(
        (config) => {
                const token = localStorage.getItem("jwttoken");
                if (token) {
                        config.headers["x-access-token"] = token;
                }
                return config;
        },
        (error) => {
                console.error("Request error:", error);
                return Promise.reject(error);
        }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
        (response) => {
                // Return successful response
                return response;
        },
        (error) => {
                // Handle different error scenarios
                if (error.response) {
                        // Server responded with error status
                        const { status, data } = error.response;

                        switch (status) {
                                case 401:
                                        // Unauthorized - token expired or invalid
                                        toast.error("Session expired. Please login again.");
                                        localStorage.removeItem("jwttoken");
                                        localStorage.removeItem("userid");
                                        localStorage.removeItem("usertype");
                                        // Redirect to login after a short delay
                                        setTimeout(() => {
                                                window.location.href = "/login";
                                        }, 1500);
                                        break;

                                case 403:
                                        // Forbidden - insufficient permissions
                                        toast.error("You don't have permission to perform this action.");
                                        break;

                                case 404:
                                        // Not found
                                        toast.error(data?.message || "Resource not found.");
                                        break;

                                case 500:
                                        // Server error
                                        toast.error("Server error. Please try again later.");
                                        break;

                                default:
                                        // Other errors
                                        toast.error(data?.message || "An error occurred.");
                        }
                } else if (error.request) {
                        // Request made but no response received
                        toast.error("Network error. Please check your connection.");
                } else {
                        // Something else happened
                        toast.error("An unexpected error occurred.");
                }

                return Promise.reject(error);
        }
);

export default axiosInstance;
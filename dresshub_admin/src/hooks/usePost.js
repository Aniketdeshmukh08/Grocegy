import { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

/**
 * Custom hook for POST requests
 * @param {string} url - API endpoint URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show success toast (default: true)
 * @param {boolean} options.showErrorToast - Show error toast (default: true)
 * @param {string} options.successMessage - Custom success message
 * @returns {Object} { postData, data, loading, error }
 */
const usePost = (url, options = {}) => {
        const {
                showSuccessToast = true,
                showErrorToast = true,
                successMessage = "Data added successfully",
        } = options;

        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const isMounted = useRef(true);

        const postData = async (body) => {
                if (!url) {
                        const errorMsg = "URL is required";
                        setError(errorMsg);
                        if (showErrorToast) toast.error(errorMsg);
                        throw new Error(errorMsg);
                }

                setLoading(true);
                setError(null);

                try {
                        const response = await axiosInstance.post(url, body);

                        if (isMounted.current) {
                                setData(response.data);
                                setError(null);
                        }

                        if (showSuccessToast) {
                                toast.success(successMessage);
                        }

                        return response.data;
                } catch (err) {
                        const errorMessage =
                                err?.response?.data?.message || err.message || "Request failed";

                        if (isMounted.current) {
                                setError(errorMessage);
                        }

                        if (showErrorToast) {
                                toast.error("Failed to add data");
                        }

                        throw err;
                } finally {
                        if (isMounted.current) {
                                setLoading(false);
                        }
                }
        };

        return { postData, data, loading, error };
};

export default usePost;
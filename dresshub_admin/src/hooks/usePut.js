import { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

/**
 * Custom hook for PUT requests
 * @param {string} url - API endpoint URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show success toast (default: true)
 * @param {boolean} options.showErrorToast - Show error toast (default: true)
 * @param {string} options.successMessage - Custom success message
 * @returns {Object} { updateData, data, loading, error }
 */
const usePut = (url, options = {}) => {
        const {
                showSuccessToast = true,
                showErrorToast = true,
                successMessage = "Data updated successfully",
        } = options;

        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const isMounted = useRef(true);

        const updateData = async (body) => {
                if (!url) {
                        const errorMsg = "URL is required";
                        setError(errorMsg);
                        if (showErrorToast) toast.error(errorMsg);
                        throw new Error(errorMsg);
                }

                setLoading(true);
                setError(null);

                try {
                        const response = await axiosInstance.put(url, body);

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
                                err?.response?.data?.message || err.message || "Update failed";

                        if (isMounted.current) {
                                setError(errorMessage);
                        }

                        if (showErrorToast) {
                                toast.error("Failed to update data");
                        }

                        throw err;
                } finally {
                        if (isMounted.current) {
                                setLoading(false);
                        }
                }
        };

        return { updateData, data, loading, error };
};

export default usePut;
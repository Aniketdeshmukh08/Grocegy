import { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

/**
 * Custom hook for DELETE requests
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show success toast (default: true)
 * @param {boolean} options.showErrorToast - Show error toast (default: true)
 * @param {string} options.successMessage - Custom success message
 * @returns {Object} { deleteData, loading, error }
 */
const useDelete = (options = {}) => {
        const {
                showSuccessToast = true,
                showErrorToast = true,
                successMessage = "Data deleted successfully",
        } = options;

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const isMounted = useRef(true);

        const deleteData = async (url) => {
                if (!url) {
                        const errorMsg = "URL is required";
                        setError(errorMsg);
                        if (showErrorToast) toast.error(errorMsg);
                        throw new Error(errorMsg);
                }

                setLoading(true);
                setError(null);

                try {
                        const response = await axiosInstance.delete(url);

                        if (isMounted.current) {
                                setError(null);
                        }

                        if (showSuccessToast) {
                                toast.success(successMessage);
                        }

                        return response.data;
                } catch (err) {
                        const errorMessage =
                                err?.response?.data?.message || err.message || "Delete failed";

                        if (isMounted.current) {
                                setError(errorMessage);
                        }

                        if (showErrorToast) {
                                toast.error("Failed to delete data");
                        }

                        throw err;
                } finally {
                        if (isMounted.current) {
                                setLoading(false);
                        }
                }
        };

        return { deleteData, loading, error };
};

export default useDelete;
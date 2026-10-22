import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

/**
 * Custom hook for fetching data with GET requests
 * @param {string} url - API endpoint URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether to fetch automatically (default: true)
 * @param {number} options.retries - Number of retry attempts on failure (default: 1)
 * @returns {Object} { data, loading, error, refetch }
 */
const useFetch = (url, options = {}) => {
        const { enabled = true, retries = 1 } = options;

        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const retryCount = useRef(0);
        const isMounted = useRef(true);

        const fetchData = useCallback(async () => {
                if (!url) {
                        setError("URL is required");
                        return;
                }

                setLoading(true);
                setError(null);
                retryCount.current = 0;

                const execute = async () => {
                        try {
                                const response = await axiosInstance.get(url);

                                if (isMounted.current) {
                                        setData(response.data);
                                        setError(null);
                                }
                        } catch (err) {
                                if (retryCount.current < retries) {
                                        retryCount.current += 1;
                                        await execute();
                                } else {
                                        if (isMounted.current) {
                                                setError(
                                                        err?.response?.data?.message ||
                                                        err.message ||
                                                        "Something went wrong"
                                                );
                                        }
                                }
                        } finally {
                                if (isMounted.current) {
                                        setLoading(false);
                                }
                        }
                };

                await execute();
        }, [url, retries]);

        useEffect(() => {
                isMounted.current = true;

                if (enabled) {
                        fetchData();
                }

                return () => {
                        isMounted.current = false;
                };
        }, [fetchData, enabled]);

        return {
                data,
                loading,
                error,
                refetch: fetchData,
        };
};

export default useFetch;
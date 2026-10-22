import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useFetch = (url, options = {}) => {
    const { enabled = true, retries = 1 } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const retryCount = useRef(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        retryCount.current = 0;

        const execute = async () => {
            try {
                const response = await axiosInstance.get(url);
                setData(response.data);
            } catch (err) {
                if (retryCount.current < retries) {
                    retryCount.current += 1;
                    await execute();
                } else {
                    setError(
                        err?.response?.data?.message ||
                        err.message ||
                        "Something went wrong"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        await execute();
    }, [url, retries]);

    useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [fetchData, enabled]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useFetch;

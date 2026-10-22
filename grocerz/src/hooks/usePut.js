import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const usePut = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateData = async (body) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.put(url, body);
            setData(response.data);
            console.log("Success! Data:", response.data);
            toast.success("Data Updated Successfully");
            return response.data;
        } catch (err) {
            toast.error("Failed to update data");
            setError(
                err?.response?.data?.message ||
                err.message ||
                "Update failed"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateData, data, loading, error };
};

export default usePut;

// hooks/useCRUDOperations.js
import { useState } from 'react';
import axios from 'axios';

const useCRUDOperations = (apiUrl) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setErrorState = (errorMessage) => {
        setError(errorMessage);
    };

    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    };

    const add = async (data, onSuccess, onError) => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}`, data);
            onSuccess(response.data);
        } catch (error) {
            setError(error.message);
            onError && onError();
        } finally {
            setLoading(false);
            setError("");
        }
    };

    const update = async (data, onSuccess, onError) => {
        setLoading(true);
        try {
            const response = await axios.put(`${apiUrl}`, data);
            onSuccess(response.data);
        } catch (error) {
            setError(error.message);
            onError && onError();
        } finally {
            setLoading(false);
            setError("");
        }
    };

    const remove = async (id, onSuccess, onError) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/?id=${id}`);
            onSuccess(response.data);
        } catch (error) {
            setError(error.message);
            onError && onError();
        } finally {
            setLoading(false);
            setError("");
        }
    };

    return { add, update, remove, loading, error, setErrorState, setLoadingState };
};

export default useCRUDOperations;

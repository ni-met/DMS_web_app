import React, {useState} from 'react';
import axios from '../../axiosConfig';
import {AxiosError, AxiosResponse} from "axios";

interface UseDeleteProps {
    deleteUrl: string;
    setLoading: any;
    onSuccess: (response: AxiosResponse) => void;
    onError: (error: AxiosError) => void;
}

const useDeleteData = ({deleteUrl, setLoading, onSuccess, onError}: UseDeleteProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        setLoading(true);

        axios.delete(deleteUrl)
            .then(response => {
                if (onSuccess) {
                    alert('Успешно изтриване на данни!');
                    onSuccess(response);
                }
            })
            .catch((error: AxiosError) => {
                setError(error.message);
                if (onError) {
                    onError(error);
                }
                alert('Неуспешно изтриване на данни.');
            }).finally(() => {
            setLoading(false);
        });
    };

    return { handleDelete, error };
};

export default useDeleteData;
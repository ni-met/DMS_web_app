import React, {useState} from 'react';
import axios from '../../axiosConfig';
import {AxiosError, AxiosResponse} from "axios";
import isEqual from 'lodash/isEqual';

interface UseUpdateProps<T> {
    updateUrl: string;
    postData: T | null;
    params?: Record<string, any>;
    initialData: any;
    newData: any;
    setLoading: any;
    onSuccess?: (response: AxiosResponse) => void;
    onError?: (error: AxiosError) => void;
}

const useUpdateData = <T, >({
                                updateUrl, postData = null, setLoading, params, initialData,
                                newData, onSuccess, onError
                            }: UseUpdateProps<T>) => {
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = () => {
        const dataHasChanged = !isEqual(newData, initialData)

        if (!dataHasChanged) {
            alert('Няма въведени нови данни за запазване.');
            return;
        }

        setLoading(true);

        axios.put(updateUrl, postData, {params})
            .then(response => {
                if (onSuccess) {
                    alert('Промените са направени успешно!');
                    onSuccess(response);
                }
            })
            .catch((error: AxiosError) => {
                setError(error.message);
                if (onError) {
                    onError(error);
                }
                alert('Неуспешно обновяване на данни.');
            }).finally(() => {
            setLoading(false);
        });
    };

    return {handleUpdate, error};
};

export default useUpdateData;
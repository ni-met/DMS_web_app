import React, {useEffect, useRef, useState} from 'react';
import axios from '../../axiosConfig';

interface UseSearchProps<T> {
    searchParams: T;
    searchUrl: string;
    handleResponse: (data: any) => void;
}

const useSearch = <T,>({searchParams, searchUrl, handleResponse}: UseSearchProps<T>) => {
    const [params, setParams] = useState<T>(searchParams);
    const abortControllerRef = useRef<AbortController | null>(null);
    useEffect(() => {
        const handleSearch = async (params: T, searchUrl: string, handleResponse: any) => {
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                const response = await axios.get(searchUrl, {
                    params,
                    signal: abortController.signal
                });
                handleResponse(response.data);

            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Request canceled', error.message);
                } else {
                    console.error('Error searching', error);
                }
            }
        };

        const handler = setTimeout(() => {
            const dataInform = Object.values(params as any).some((value) => value)

            if (dataInform) {
                handleSearch(params, searchUrl, handleResponse).then(console.log);
            }
        }, 500);

        return () => {
            clearTimeout(handler);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [params, searchUrl]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setParams(prevParams => ({...prevParams, [name]: value}));
    };

    return {
        params,
        handleSearchChange
    };
};

export default useSearch;
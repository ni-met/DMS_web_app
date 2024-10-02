import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
});

export const setAuthHeader = (email: string, password: string) => {
    instance.defaults.headers.common['Authorization'] = `Basic ${btoa(`${email}:${password}`)}`;
};

export default instance;
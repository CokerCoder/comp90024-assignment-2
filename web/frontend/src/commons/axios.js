import _axios from 'axios';

const axios = baseUrl => {
    const instance = _axios.create({
        baseURL: baseUrl || 'http://localhost:8000',
        timeout: 20000,
    });
    return instance;
};

export {axios};

export default axios();
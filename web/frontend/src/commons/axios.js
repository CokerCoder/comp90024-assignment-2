import _axios from 'axios';

const devEnvironment = process.env.REACT_APP_ENDPOINT;

const axios = baseUrl => {
    const instance = _axios.create({
        baseURL: devEnvironment,
        timeout: 20000,
    });
    return instance;
};

export {axios};

export default axios();
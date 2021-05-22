import _axios from 'axios';

const devEnvironment = process.env.REACT_APP_ENDPOINT;

const axios = baseUrl => {
    const instance = _axios.create({
        baseURL: devEnvironment
    });
    return instance;
};

export {axios};

export default axios();
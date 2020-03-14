import axios from 'axios';

const fetch = (method, path, data, params) => {
    if (!method) throw new Error('Method is a required field.');
    if (!path) throw new Error('Path is a required field.');

    const options = {
        method: method.toUpperCase(),
        baseURL: process.env.BASEURL_DEV,
        url: path,
        data: data || {},
        params: params || {}
    };

    return axios(options);
};

export default fetch;

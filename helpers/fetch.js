import axios from 'axios';
axios.defaults.withCredentials = true

const fetch = (method, path, data, params, headers) => {
    if (!method) throw new Error('Method is a required field.');
    if (!path) throw new Error('Path is a required field.');

    const options = {
        method: method.toUpperCase(),
        baseURL: process.env.BASEURL_DEV,
        url: path,
        headers: headers || {},
        data: data || {},
        params: params || {},
        auth: {
            username: 'admin',
            password: process.env.BASIC_AUTH_PASS
        },
        withCredentials: true,
        credentials: 'include'
    };

    return axios(options);
};

export default fetch;

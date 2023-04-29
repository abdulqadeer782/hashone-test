import axios from 'axios';

export const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
apiClient.interceptors.response.use(function (response) {

    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
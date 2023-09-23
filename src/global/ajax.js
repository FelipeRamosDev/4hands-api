const axios = require('axios');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = (url, data) => {
    return {
        get: async (config, getAxiosResponse) => {
            try {
                const response = await axios.get(url, {
                    ...config,
                    data,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                const errorResponse =   err.response;
                const errorData = errorResponse && errorResponse.data;
                throw new Error.Log(errorData);
            }
        }, 
        post: async (config, getAxiosResponse) => {
            try {
                const response = await axios.post(url, data, {
                    ...config,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                const errorResponse = err.response;
                const errorData = errorResponse && errorResponse.data;
                throw new Error.Log({
                    status: errorResponse.status,
                    name: errorResponse.statusText,
                    message: errorData.errorMessages && errorData.errorMessages.join('\n')
                });
            }
        },
        put: async (config, getAxiosResponse) => {
            try {
                const response = await axios.put(url, data, {
                    ...config,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return response;
            } catch(err) {
                const errorResponse = err.response;
                const errorData = errorResponse && errorResponse.data;
                throw new Error.Log({
                    status: errorResponse.status,
                    name: errorResponse.statusText,
                    message: errorData.errorMessages.join('\n')
                });
            }
        },
        delete: async (config, getAxiosResponse) => {
            try {
                const response = await axios.delete(url, {
                    ...config,
                    data,
                    httpsAgent: agent
                });

                if (!getAxiosResponse) {
                    return response.data;
                }

                return new Error.Log(response);
            } catch(err) {
                const errorResponse = err.response;
                const errorData = errorResponse && errorResponse.data;
                throw new Error.Log({
                    status: errorResponse.status,
                    name: errorResponse.statusText,
                    message: errorData.errorMessages.join('\n')
                });
            }
        }
    }
};

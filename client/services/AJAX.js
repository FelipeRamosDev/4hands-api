const axios = require('axios');
const https = require('https');
const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV;

/**
 * Class representing AJAX requests.
 */
class AJAX {
   /**
    * Create an AJAX instance.
    * @param {Object} setup - The setup object.
    * @param {string} setup.rootURL - The root URL for the API.
    * @param {boolean} [setup.rejectUnauthorized=false] - Whether to reject unauthorized SSL certificates.
    * @param {Object} mainInstance - The main instance object.
    */
   constructor(setup, mainInstance) {
      const {
         rootURL,
         rejectUnauthorized = false
      } = Object(setup);

      this._mainInstance = () => mainInstance;
      this._rejectUnauthorized = rejectUnauthorized || (NODE_ENV === 'production') ? true : false;

      if (!this._rejectUnauthorized) {
         const insecureAgent = new https.Agent({
            rejectUnauthorized: false
         });

         this.httpAgent = insecureAgent;
         this.httpsAgent = insecureAgent;
      }
      
      this.rootURL = rootURL || this.mainInstance.apiURL;
   }

   /**
    * Get the main instance.
    * @returns {Object} The main instance.
    */
   get mainInstance() {
      return this._mainInstance();
   }

   /**
    * Construct the full URL for an endpoint.
    * @param {string} [endpoint='/'] - The API endpoint.
    * @returns {string} The full URL.
    */
   url(endpoint = '/') {
      if (endpoint[0] === '/') {
         return `${this.rootURL}${endpoint}`;
      } else {
         return `${this.rootURL}/${endpoint}`;
      }
   }

   async getCookie(name) {
      if (typeof window !== 'undefined') {
         const cookie = await cookieStore.get(name);
         return cookie?.value;
      }
   }

   /**
    * Perform a GET request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} [body={}] - The request parameters.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async get(endpoint, body = {}, options = {}) {
      const { isAuth, headers } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const response = await axios.get(this.url(endpoint), {
            ...options,
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent,
            headers: toHeaders,
            params: body
         });

         return response.data;
      } catch(err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform a POST request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} [body={}] - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async post(endpoint, body = {}, options = {}) {
      const { isAuth, headers } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const response =  await axios.post(this.url(endpoint), body, {
            ...options,
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent,
            headers: toHeaders,
         });

         return response.data;
      } catch(err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform a PUT request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} [body={}] - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async put(endpoint, body = {}, options = {}) {
      const { isAuth, headers } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const response = await axios.put(this.url(endpoint), body, {
            ...options,
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent,
            headers: toHeaders,
         });

         return response.data;
      } catch(err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform a PATCH request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} [body={}] - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async patch(endpoint, body = {}, options = {}) {
      const { isAuth, headers } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const response = await axios.patch(this.url(endpoint), body, {
            ...options,
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent,
            headers: toHeaders,
         });

         return response.data;
      } catch(err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform a DELETE request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} [body={}] - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async delete(endpoint, body = {}, options = {}) {
      const { isAuth, headers } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const response = await axios.delete(this.url(endpoint), {
            ...options,
            httpsAgent: this.httpsAgent,
            headers: toHeaders,
            httpAgent: this.httpAgent,
            data: body
         });

         return response.data;
      } catch(err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform an authenticated GET request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request parameters.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authGet(endpoint, body, options = {}) {
      const response = await this.get(endpoint, body, {
         ...options,
         isAuth: true
      });

      return response;
   }

   /**
    * Perform an authenticated POST request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authPost(endpoint, body, options = {}) {
      const response = await this.post(endpoint, body, {
         ...options,
         isAuth: true
      });

      return response;
   }

   /**
    * Perform an authenticated PUT request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authPut(endpoint, body, options = {}) {
      const response =  await this.put(endpoint, body, {
         ...options,
         isAuth: true
      })

      return response;
   }

   /**
    * Perform an authenticated PATCH request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authPatch(endpoint, body, options = {}) {
      const response = await this.patch(endpoint, body, {
         ...options,
         isAuth: true
      });

      return response;
   }

   /**
    * Perform an authenticated DELETE request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authDelete(endpoint, body, options = {}) {
      const response = await this.delete(endpoint, body, {
         ...options,
         isAuth: true
      });

      return response;
   }

   /**
    * Perform a file upload POST request using multipart/form-data.
    * @param {string} endpoint - The API endpoint.
    * @param {File|Blob} file - The file to upload.
    * @param {Object} [fields={}] - Additional form fields (e.g. { bucket: 'avatars' }).
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data (FileMetadata).
    */
   async upload(endpoint, file, fields = {}, options = {}) {
      const { isAuth, headers, onUploadProgress } = options;
      let toHeaders = { ...headers };

      try {
         if (isAuth) {
            options.withCredentials = true;
         }

         const formData = new FormData();
         formData.append('file', file);

         Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
         });

         const response = await axios.post(this.url(endpoint), formData, {
            ...options,
            httpsAgent: this.httpsAgent,
            httpAgent: this.httpAgent,
            headers: {
               ...toHeaders,
               'Content-Type': 'multipart/form-data'
            },
            onUploadProgress
         });

         return response.data;
      } catch (err) {
         throw this.toError(err);
      }
   }

   /**
    * Perform an authenticated file upload POST request.
    * @param {string} endpoint - The API endpoint.
    * @param {File|Blob} file - The file to upload.
    * @param {Object} [fields={}] - Additional form fields (e.g. { bucket: 'avatars' }).
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data (FileMetadata).
    */
   async authUpload(endpoint, file, fields = {}, options = {}) {
      return this.upload(endpoint, file, fields, { ...options, isAuth: true });
   }

   /**
    * Convert an error to a standardized error object.
    * @param {Object} err - The error object.
    * @returns {Object} The standardized error object.
    */
   toError(err) {
      return {
         error: true,
         name: err?.response?.data?.name,
         message: err?.response?.data?.message,
         stack: err?.stack
      }
   }
}

module.exports = AJAX;

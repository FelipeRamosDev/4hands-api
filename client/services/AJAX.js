const axios = require('axios');
const https = require('https');

/**
 * Class representing AJAX requests.
 */
class AJAX {
   /**
    * Create an AJAX instance.
    * @param {Object} setup - The setup object.
    * @param {string} setup.rootURL - The root URL for the API.
    * @param {string} [setup.cookiesTokenPropName='token'] - The name of the token property in cookies.
    * @param {boolean} [setup.rejectUnauthorized=true] - Whether to reject unauthorized SSL certificates.
    * @param {Object} mainInstance - The main instance object.
    */
   constructor(setup, mainInstance) {
      const {
         rootURL,
         cookiesTokenPropName = 'token',
         rejectUnauthorized = true
      } = Object(setup);

      this._mainInstance = () => mainInstance;
      this._cookiesTokenPropName = cookiesTokenPropName;
      this._rejectUnauthorized = rejectUnauthorized;

      if (!this._rejectUnauthorized) {
         this.httpAgent = new https.Agent({
            rejectUnauthorized: false
         });
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

   /**
    * Get the token from cookies.
    * @returns {Promise<string>} The token.
    */
   async getToken() {
      if (typeof window !== 'undefined') {
         const token = await cookieStore.get(this._cookiesTokenPropName);
         return token?.value;
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
            toHeaders = await this.addToken(toHeaders);
         }

         return await axios.get(this.url(endpoint), {
            ...options,
            httpAgent: this.httpAgent,
            headers: toHeaders,
            params: body
         });
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
            toHeaders = await this.addToken(toHeaders);
         }

         return await axios.post(this.url(endpoint), body, {
            ...options,
            httpAgent: this.httpAgent,
            headers: toHeaders,
         });
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
            toHeaders = await this.addToken(toHeaders);
         }

         return await axios.put(this.url(endpoint), body, {
            ...options,
            httpAgent: this.httpAgent,
            headers: toHeaders,
         });
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
            toHeaders = await this.addToken(toHeaders);
         }

         return await axios.delete(this.url(endpoint), {
            ...options,
            headers: toHeaders,
            httpAgent: this.httpAgent,
            data: body
         });
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
      return await this.get(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   /**
    * Perform an authenticated POST request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authPost(endpoint, body, options = {}) {
      return await this.post(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   /**
    * Perform an authenticated PUT request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authPut(endpoint, body, options = {}) {
      return await this.put(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   /**
    * Perform an authenticated DELETE request.
    * @param {string} endpoint - The API endpoint.
    * @param {Object} body - The request body.
    * @param {Object} [options={}] - The request options.
    * @returns {Promise<Object>} The response data.
    */
   async authDelete(endpoint, body, options = {}) {
      return await this.delete(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   /**
    * Add token to the headers.
    * @param {Object} headers - The request headers.
    * @returns {Promise<Object>} The headers with the token.
    */
   async addToken(headers) {
      const token = await this.getToken();

      if (!token) {
         // If the token is not stored in the browser's cookies, it will throw an error.
         return this.toError({
            name: 'TOKEN_REQUIRED',
            message: 'To send an authenticated HTTP request, the user token is required!'
         });
      }

      headers.token = token;
      return headers;
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

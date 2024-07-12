const axios = require('axios');
const https = require('https');

class AJAX {
   constructor (setup, mainInstance) {
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

   get mainInstance() {
      return this._mainInstance();
   }

   url(endpoint = '/') {
      if (endpoint[0] === '/') {
         return `${this.rootURL}${endpoint}`;
      } else {
         return `${this.rootURL}/${endpoint}`;
      }
   }

   async getToken() {
      if (typeof window !== 'undefined') {
         const token = await cookieStore.get(this._cookiesTokenPropName);
         return token?.value;
      }
   }

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

   async authGet(endpoint, body, options = {}) {
      return await this.get(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   async authPost(endpoint, body, options = {}) {
      return await this.post(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   async authPut(endpoint, body, options = {}) {
      return await this.put(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   async authDelete(endpoint, body, options = {}) {
      return await this.delete(endpoint, body, {
         ...options,
         isAuth: true
      });
   }

   async addToken(headers) {
      const token = await this.getToken();

      if (!token) {
         // If the token is not stored on the browser's cookies, it will throw an error.
         return this.toError({
            name: 'TOKEN_REQUIRED',
            message: 'To send an authenticated HTTP request, the user token is required!'
         });
      }

      headers.token = token;
      return headers;
   }

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

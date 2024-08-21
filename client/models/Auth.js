const config = require('../config.json');

/**
 * The Auth service with some methods on it to handle authentication and user matters.
 * @class Auth
 */
class Auth {
   /**
    * Creates an instance of the Auth class.
    * @param {Object} instance - The instance of the application or service using this Auth class.
    */
   constructor (instance) {
      this._instance = () => instance;
   }

   /**
    * Returns the current instance.
    * @returns {Object} - The instance of the application or service.
    */
   get instance() {
      return this._instance();
   }

   /**
    * Calculates and returns the cookie expiration age.
    * @returns {number} - The expiration time for the session cookie in milliseconds.
    */
   get cookieAge() {
      return Date.now() + config.session.cookieAge;
   }

   /**
    * Checks whether the user is authorized.
    * @returns {Promise<Object>} - An object indicating whether the user is logged in.
    * @throws {Error} - If there is an error other than user not being authorized.
    */
   async checkUser() {
      try {
         return await this.instance.ajax.authGet('/auth/auth-check');
      } catch (err) {
         if (err?.name === 'USER_NOT_AUTHORIZED') {
            return { isLogged: false };
         } else {
            throw err;
         }
      }
   }

   /**
    * Logs in the user with the provided email and password.
    * @param {string} email - The user's email address.
    * @param {string} password - The user's password.
    * @returns {Promise<Object>} - An object containing the login result or an error.
    * @throws {Error} - If email or password is missing, or if another error occurs.
    */
   async login(email, password) {
      if (!email || !password) {
         throw new Error('The params "email" and "password" are required!');
      }

      const logged = await this.instance.ajax.authPost('/auth/login', { email, password });
      const cookieAge = this.cookieAge;

      if (logged && !logged.error) {
         cookieStore.set({ name: 'token', value: logged.token, expires: cookieAge });
         return logged;
      } else if (logged.error) {
         return toError(logged);
      } else {
         return { success: false };
      }
   }

   /**
    * Registers a new user with the provided data.
    * @param {Object} data - The data required for user registration.
    * @returns {Promise<Object>} - An object containing the registration result.
    * @throws {Error} - If registration fails.
    */
   async register(data) {
      try {
         const created = await this.instance.ajax.post('/auth/register', data);
         const age = this.cookieAge;

         cookieStore.set({ name: 'token', value: created.token, expires: age });
         return created;
      } catch (err) {
         throw err;
      }
   }

   /**
    * Signs out the current user.
    * @returns {Promise<Object>} - An object indicating whether the sign-out was successful.
    * @throws {Error} - If sign-out fails.
    */
   async signOut() {
      try {
         return await this.instance.ajax.authPost('/auth/signout');
      } catch (err) {
         if (err?.name === 'USER_NOT_AUTHORIZED') {
            return { isLogged: false };
         } else {
            throw err;
         }
      }
   }
}

module.exports = Auth;

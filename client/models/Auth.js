const config = require('../config.json');

module.exports = class Auth {
   constructor (instance) {
      this._instance = () => instance;
   }

   get instance() {
      return this._instance();
   }

   get cookieAge() {
      return Date.now() + config.session.cookieAge;
   }

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

   async signOut() {
      try {
         return await this.instance.ajax.authPost('/auth/signout');
      } catch (err) {
         throw err;
      }
   }
}

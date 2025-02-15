class ErrorLog {
   constructor(err, merge = {}) {
      this.error = true;

      if (!err) {
         this.name = 'UNKNOWN_ERROR';
         this.message = 'An unknow error was caught!'
      }

      if (typeof err === 'string') {
         const rsc = Resource.error(err);

         if (rsc) {
            this.name = rsc.name;
            this.message = rsc.message;
         } else {
            this.message = err;
         }
      }

      if (typeof err === 'object' && !Array.isArray(err)) {
         const { code, name, message, msg, type, stack } = Object(err);

         if (code) this.code = code;
         if (name) this.name = name;
         if (message || msg) this.message = message || msg;
         if (type) this.type = type;
         if (stack) this.stack = stack;
      }

      if (!this.stack) {
         this.stack = new Error().stack
      }

      if (!Array.isArray(merge) && typeof merge === 'object') {
         Object.keys(merge).map(key => {
            this[key] = merge[key];
         });
      }
   }

   get stackArray() {
      const array = this.stack.split('\n');

      array.splice(0, 1);
      return array.map(item => item.replace('    at ', ''));
   }

   stackTemplate() {
      const date = new Date();
      const msg = this.message || this.msg;
      let out = `\n[${date.toLocaleDateString()} - ${date.toLocaleTimeString()}]\n`;

      if (this.name || msg) out += `${this.name || 'Error'}: ${msg ? msg : ''}\n`;
      if (this.stack) out += 'Stack: ' + this.stackArray.join('\n    ');
      out += '\n--------------------------------------------------------------------------------------------------------------------------------\n\n';

      return out;
   }

   toObject() {
      return { ...this };
   }

   print() {
      console.error(this.stackTemplate(), '\n');
   }

   printWarn() {
      console.warn(this.stackTemplate(), '\n');
   }

   append() { }

   static logError(err) {
      const error = new ErrorLog(err);

      console.error(error.stackTemplate());
      return error;
   }

   static toError(err) {
      return new ErrorLog(err);
   }
}

module.exports = ErrorLog;

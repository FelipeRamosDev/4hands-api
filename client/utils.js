class Utils {
   static validateInteger(value) {
      if (isNaN(value)) {
         throw new Error('The value provided should be a valid number.');
      }

      const number = Number(value);
      if (number % 1) {
         throw new Error('The value provided should be a valid integer but received a double.');
      }

      return number;
   }
}

module.exports = Utils;

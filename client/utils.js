/**
 * Utility class providing various helper functions.
 */
class Utils {
   /**
    * Validates that the given value is an integer.
    * @param {any} value - The value to validate.
    * @returns {number} The validated integer.
    * @throws {Error} If the value is not a valid number or integer.
    */
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

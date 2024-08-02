const schedule = require('node-schedule');

const INVALID_DATE_ERROR = {
   name: 'INVALID_DATE',
   message: 'Invalid date format provided on ScheduleCron constructor!'
};

class ScheduleCron {
   /**
    * Creates an instance of ScheduleCron.
    * @param {Object} setup - The setup object for scheduling.
    * @param {Array} [setup.oneTimeDate] - An array to construct a one-time date.
    * @param {number} [setup.timeout=0] - Timeout in milliseconds.
    * @param {number} [setup.second=0] - Second(s) for scheduling.
    * @param {number} [setup.minute=0] - Minute(s) for scheduling.
    * @param {number} [setup.hour=0] - Hour(s) for scheduling.
    * @param {number} [setup.day=0] - Day(s) for scheduling.
    * @param {number} [setup.week=0] - Week(s) for scheduling.
    * @param {number} [setup.month=0] - Month(s) for scheduling.
    */
   constructor (setup) {
      const {
         oneTimeDate,
         timeout = 0,
         second = 0,
         minute = 0,
         hour = 0,
         day = 0,
         week = 0,
         month = 0
      } = Object(setup);

      this.timeout = timeout;
      this.second = second;
      this.minute = minute;
      this.hour = hour;
      this.day = day;
      this.week = week;
      this.month = month;
      this.timeset;

      try {
         if (this.timeout) {
            this.oneTimeDate = new Date(Date.now() + this.timeout);
         } else if (Array.isArray(oneTimeDate)) {
            this.oneTimeDate = new Date(...oneTimeDate);
         } else if (oneTimeDate) {
            this.oneTimeDate = new Date(oneTimeDate);
         }
      } catch (err) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   get localeStringTimeset() {
      if (typeof this.timeset === 'string') {
         return this.timeset;
      }

      return new Date(this.timeset).toLocaleString();
   }

   /**
    * Gets the time in milliseconds for the second(s) set.
    * @returns {number} The time in milliseconds.
    */
   get _second() {
      if (typeof this.second === 'number') {
         return this.second * 1000;
      }

      return 0;
   }

   /**
    * Gets the time in milliseconds for the minute(s) set.
    * @returns {number} The time in milliseconds.
    */
   get _minute() {
      if (typeof this.minute === 'number') {
         return this.minute * 60 * 1000;
      }

      return 0;
   }

   /**
    * Gets the time in milliseconds for the hour(s) set.
    * @returns {number} The time in milliseconds.
    */
   get _hour() {
      if (typeof this.hour === 'number') {
         return this.hour * 60 * 60 * 1000;
      }

      return 0;
   }

   /**
    * Gets the time in milliseconds for the day(s) set.
    * @returns {number} The time in milliseconds.
    */
   get _day() {
      if (typeof this.day === 'number') {
         return this.day * 24 * 60 * 60 * 1000;
      }

      return 0;
   }

   /**
    * Retrieve a simple object with only the class properties.
    * @returns {Object}
    */
   toObject() {
      return JSON.parse(JSON.stringify({ ...this }));
   }

   /**
    * Schedules a job at the specified time with the provided callback.
    * @param {Date|string|number} timeset - The time to schedule the job.
    * @param {Function} callback - The callback function to execute.
    * @throws {Error} If the date format is invalid.
    */
   scheduleJob(timeset, callback) {
      if (typeof callback !== 'function') {
         return;
      }

      try {
         const toDate = typeof timeset !== 'string' ? new Date(timeset) : timeset;

         this.timeset = toDate;
         schedule.scheduleJob(toDate, callback.bind(this));
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   /**
    * Schedules a job at the one-time date set in the constructor.
    * @throws {Error} If the one-time date is not provided.
    */
   scheduleDate(callback) {
      if (!this.oneTimeDate) {
         throw logError({
            name: 'BAD_PARAM',
            message: 'The param "oneTimeDate" should be provided at ScheduleCron construction to be able to use "scheduleDate" method!'
         });
      }

      this.scheduleJob(this.oneTimeDate, callback);
   }

   /**
    * Schedules a job to run after a timeout period.
    * @param {Function} callback - The callback function to execute.
    * @throws {Error} If the timeout or one-time date is not provided.
    */
   toTimeout(callback) {
      if (!this.oneTimeDate?.getDate) {
         throw logError({
            name: 'BAD_PARAM',
            message: 'The param "timeout" or "oneTimeDate" should be provided at ScheduleCron construction to be able to use "toTimeout" method!'
         });
      }

      this.scheduleJob(this.oneTimeDate, callback);
   }

   /**
    * Schedules a job to run at the next time interval based on the provided seconds, minutes, hours, and days.
    * @param {Function} callback - The callback function to execute.
    * @throws {Error} If the date format is invalid.
    */
   nextTime(callback) {
      let nextTime = 0;

      nextTime += this._second;
      nextTime += this._minute;
      nextTime += this._hour;
      nextTime += this._day;

      if (!nextTime) {
         return;
      }

      try {
         const nextDate = new Date(Date.now() + nextTime);
         this.scheduleJob(nextDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   /**
    * Schedules a job to run in the next 24 hours.
    * @throws {Error} If the date format is invalid.
    */
   next24H() {
      try {
         const nextTime = Date.now() + (24 * 60 * 60 * 1000);
         const nextDate = new Date(nextTime);

         this.scheduleJob(nextDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   /**
    * Schedules a job to run the next day at the specified hour, minute, and second.
    * @param {Function} callback - The callback function to execute.
    * @throws {Error} If the date format is invalid.
    */
   nextDay(callback) {
      try {
         const nextDate = new Date(Date.now() + (24 * 60 * 60 * 1000));
         const year = nextDate.getFullYear();
         const month = nextDate.getMonth();
         const day = nextDate.getDate();
         const hour = this.hour;
         const minute = this.minute;
         const second = this.second;
         const scheduleDate = new Date(year, month, day, hour, minute, second);

         this.scheduleJob(scheduleDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   /**
    * Schedules a job to run the next month at the specified day, hour, minute, and second.
    * @param {Function} callback - The callback function to execute.
    * @throws {Error} If the date format is invalid.
    */
   nextMonth(callback) {
      try {
         const nextDate = new Date(Date.now() + (31 * 24 * 60 * 60 * 1000));
         const year = nextDate.getFullYear();
         const month = nextDate.getMonth();
         const day = this.day || 1;
         const hour = this.hour;
         const minute = this.minute;
         const second = this.second;
         const scheduleDate = new Date(year, month, day, hour, minute, second);

         this.scheduleJob(scheduleDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   /**
    * Schedules a job to run every second.
    * @param {Function} callback - The callback function to execute.
    */
   everySecond(callback) {
      this.scheduleJob(`${this.second} * * * * *`, callback);
   }

   /**
    * Schedules a job to run every minute.
    * @param {Function} callback - The callback function to execute.
    */
   everyMinute(callback) {
      this.scheduleJob(`* ${this.minute} * * * *`, callback);
   }

   /**
    * Schedules a job to run every hour.
    * @param {Function} callback - The callback function to execute.
    */
   everyHour(callback) {
      this.scheduleJob(`* * ${this.hour} * * *`, callback);
   }

   /**
    * Schedules a job to run every day.
    * @param {Function} callback - The callback function to execute.
    */
   everyDay(callback) {
      this.scheduleJob(`* * * ${this.day} * *`, callback);
   }

   /**
    * Schedules a job to run every week.
    * @param {Function} callback - The callback function to execute.
    */
   everyWeek(callback) {
      this.scheduleJob(`* * * * ${this.week} *`, callback);
   }

   /**
    * Schedules a job to run every month.
    * @param {Function} callback - The callback function to execute.
    */
   everyMonth(callback) {
      this.scheduleJob(`* * * * * ${this.month}`, callback);
   }
}

module.exports = ScheduleCron;

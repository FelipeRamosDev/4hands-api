const schedule = require('node-schedule');

const INVALID_DATE_ERROR = {
   name: 'INVALID_DATE',
   message: 'Invalid date format provided on ScheduleCron constructor!'
};

class ScheduleCron {
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
      this._timeSet;

      try {
         if (this.timeout) {
            this.oneTimeDate = new Date(Date.now() + this.timeout);
         } else if (Array.isArray(oneTimeDate)) {
            this.oneTimeDate = new Date(...oneTimeDate);
         }
      } catch (err) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   get timestamp() {
      return this._timeSet;
   }

   get timestampDate() {
      try {
         return new Date(this.timestamp);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   get _second() {
      if (typeof this.second === 'number') {
         return this.second * 1000;
      }

      return 0;
   }

   get _minute() {
      if (typeof this.minute === 'number') {
         return this.minute * 60 * 1000;
      }

      return 0;
   }

   get _hour() {
      if (typeof this.hour === 'number') {
         return this.hour * 60 * 60 * 1000;
      }

      return 0;
   }

   get _day() {
      if (typeof this.day === 'number') {
         return this.day * 24 * 60 * 60 * 1000;
      }

      return 0;
   }

   scheduleJob(timeSet, callback) {
      if (typeof callback !== 'function') {
         return;
      }

      try {
         const toDate = typeof timeSet !== 'string' ? new Date(timeSet) : timeSet;

         this._timeSet = timeSet;
         schedule.scheduleJob(toDate, callback.bind(this));
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   scheduleDate() {
      if (!this.oneTimeDate?.getDate) {
         throw logError({
            name: 'BAD_PARAM',
            message: 'The param "oneTimeDate" should be provided at ScheduleCron construction to be able to use "scheduleDate" method!'
         });
      }

      schedule.scheduleJob(this.oneTimeDate, callback.bind(this));
   }

   toTimeout(callback) {
      if (!this.oneTimeDate?.getDate) {
         throw logError({
            name: 'BAD_PARAM',
            message: 'The param "timeout" or "oneTimeDate" should be provided at ScheduleCron construction to be able to use "toTimeout" method!'
         });
      }

      this.scheduleJob(this.oneTimeDate, callback);
   }

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

   next24H() {
      try {
         const nextTime = Date.now() + (24 * 60 * 60 * 1000);
         const nextDate = new Date(nextTime);

         this.scheduleJob(nextDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

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

   nextMonth(callback) {
      try {
         const nextDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
         const year = nextDate.getFullYear();
         const month = nextDate.getMonth();
         const day = this.day;
         const hour = this.hour;
         const minute = this.minute;
         const second = this.second;
         const scheduleDate = new Date(year, month, day, hour, minute, second);

         this.scheduleJob(scheduleDate, callback);
      } catch (error) {
         throw logError(INVALID_DATE_ERROR);
      }
   }

   everySecond(callback) {
      this.scheduleJob(`${this.second} * * * * *`, callback);
   }

   everyMinute(callback) {
      this.scheduleJob(`* ${this.minute} * * * *`, callback);
   }

   everyHour(callback) {
      this.scheduleJob(`* * ${this.hour} * * *`, callback);
   }

   everyDay(callback) {
      this.scheduleJob(`* * * ${this.day} * *`, callback);
   }

   everyWeek(callback) {
      this.scheduleJob(`* * * * ${this.week} *`, callback);
   }

   everyMonth(callback) {
      this.scheduleJob(`* * * * * ${this.month}`, callback);
   }
}

module.exports = ScheduleCron;

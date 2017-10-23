const moment = require('moment');

class DueDateCalculator {
  constructor(submitDate, turnaroundTime) {
    this.submitDate = this.validateDate(submitDate);
    this.turnaroundTime = this.validateNumber(turnaroundTime);
  }



  /**
  * Returns a Date object when the param is a date string.
  * If not or empty, returns an error message.
  * @param {string | date} inputDate
  *     examples:
  *       - '2017-10-22' (string)
  *       - '2017.10.22' (string)
  *       - any Date object
  */
  validateDate(inputDate) {
    if (inputDate instanceof Date) {
      return inputDate;
    }

    if (!inputDate) {
      return 'Empty date';
    }

    if (typeof inputDate === 'number') {
      return 'Invalid date format';
    }

    if (!inputDate.includes('.') && !inputDate.includes('-')) {
      return 'Invalid date format';
    }

    if ( isNaN( (new Date(inputDate)).getTime()) ) {
      return 'Invalid date format';
    }

    return new Date(inputDate);
  }



  /**
  * Returns a number when the param is a number.
  * If not or empty, returns an error message.
  * @param {string | number} number
  *     examples:
  *      - any string that can be converted to positive Integer
  *      - any number
  */
  validateNumber(number) {
    if (!number && number !== 0) {
      return 'Empty time';
    }

    if (isNaN(number)) {
      return 'Invalid time format';
    }

    if (number < 0) {
      return "Time should be positive or 0";
    }

    return parseInt(number);
  }



  /**
  * Returns the name of the day based on the day's number in the week.
  * If the param is not a Date object, returns an error message.
  * @param {string | date} inputDate
  *     examples:
  *       - '2017-10-22' (string)
  *       - '2017.10.22' (string)
  *       - any Date object
  */
  getDayNameFromDate(inputDate) {
    if (!inputDate) {
      return 'No day input';
    }

    const day = this.validateDate(inputDate);
    if ( !(day instanceof Date) ) {
      return 'Invalid date format';
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[day.getDay()];
  }


  /**
  * Returns the input Date param object with the added hours from the first param.
  * Hours is required and must be number.
  * Input date is required and must be a Date object.
  * Otherwise it returns an error message.
  * @param {string | number} hours
  * @param {string | date} inputDate
  */
  addHoursToDate(hours, inputDate) {
    if (!hours) {
      return 'No hours input';
    }

    const hoursToAdd = this.validateNumber(hours);
    if (typeof hoursToAdd !== 'number') {
      return 'Invalid hours format';
    }

    if (!inputDate) {
      return 'No date input';
    }

    const date = this.validateDate(inputDate)
    if ( !(date instanceof Date) ) {
      return 'Invalid date format';
    }

    return moment(date).add(hoursToAdd,'hours')._d;
  }



  /**
  * Calculates the due date from the submitDate (Date) and the turnaroundTime (number and measured in hours)
  * The function does not deal with weekends or hours outside of working hours (9:00 - 17:00)
  */
  calculateDueDate() {
    const submitDate = this.submitDate;
    const turnaroundTime = this.turnaroundTime;

    const submitDateError = (submitDate === 'Invalid Date');
    const turnaroundTimeError = (turnaroundTime === 'Empty time' || turnaroundTime === 'Invalid time format' || turnaroundTime === 'Time should be positive or 0');

    if (submitDateError || turnaroundTimeError) {
      return false;
    }


    let dueDate = moment(submitDate);

    for (let i = 1; i <= turnaroundTime; i++) {

      // check every hour if it's in working hours
      let nextHour = moment(this.addHoursToDate(1, dueDate._d));
      let isNextWorkingHour = (nextHour.hour() === 17 && nextHour.minutes() > 0 || nextHour.hour() > 17);

      // if it exceed's the current day, then move it to the next day
      let hoursToAdd = (isNextWorkingHour) ? 17 : 1;
      dueDate = moment(this.addHoursToDate(hoursToAdd, dueDate._d));


      // check if the next day is weekend, if the due day has to be moved to the next day
      if (isNextWorkingHour) {
        let currentDayName = this.getDayNameFromDate(dueDate._d);

        // if it's weekend, move it to the next Monday
        if (currentDayName === 'Saturday') {
          dueDate.add(2,'days');
          // BUG: Lost Timezone info ??
          // dueDate.add(48,'hours');
          // dueDate = moment(this.addHoursToDate(48, dueDate._d));
        }
      }
    }

    return dueDate._d;
  }
}

module.exports = DueDateCalculator;

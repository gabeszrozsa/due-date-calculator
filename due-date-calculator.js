const moment = require('moment');

class DueDateCalculator {
  constructor(submitDate, turnaroundTime) {
    this.submitDate = this.validateDate(submitDate);
    this.turnaroundTime = this.validateNumber(turnaroundTime);
  }

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
      let nextHour = moment(this.addHoursToDate(1, dueDate._d));

      let isNextWorkingHour = (nextHour.hour() === 17 && nextHour.minutes() > 0 || nextHour.hour() > 17);
      let hoursToAdd = (isNextWorkingHour) ? 17 : 1;

      dueDate = moment(this.addHoursToDate(hoursToAdd, dueDate._d));

      if (isNextWorkingHour) {
        let currentDayName = this.getDayNameFromDate(dueDate._d);
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

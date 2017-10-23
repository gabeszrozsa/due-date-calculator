const DueDateCalculator = require('./due-date-calculator.js');
const moment = require('moment');

/**
* Validates the first and second CLI parameters, if they can be converted
* to date or not.
*/
if (!process.argv[2] || !process.argv[3] || !process.argv[3].includes(':')) {
  console.log("Invalid date format, supported format: YYYY-MM-DD HH:mm");
  console.log("(Example: 2013-02-08 09:30)");
  return false;
}
const inputDate = moment(`${process.argv[2]} ${process.argv[3]}`)._d;

/**
* Validates the third CLI parameter, if it can be converted
* to number or not.
*/
const inputTime = process.argv[4];
if (!inputTime || isNaN(inputTime) || inputTime < 0) {
  console.log("No turnaroundTime input, please enter a positive Integer after the date!");
  return false;
}

const calculator = new DueDateCalculator(inputDate, inputTime);

// Result
const dueDate = calculator.calculateDueDate();
const dueDateName = calculator.getDayNameFromDate(dueDate);

console.log(dueDateName, moment(dueDate).format('YYYY-MM-DD HH:mm'));

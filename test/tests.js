const assert = require('chai').assert;
const DueDateCalculator = require('../due-date-calculator.js');


describe('validateDate()', function() {

  describe('Invalid inputs', function() {
    it('should return "Empty date" when submitDate is empty', function() {
      const submitDate = new DueDateCalculator().submitDate;
      assert.equal(submitDate, 'Empty date');
    });
    it('should return "Invalid date format" when submitDate is a number', function() {
      const submitDate = new DueDateCalculator(1).submitDate;
      assert.equal(submitDate, 'Invalid date format');
    });
    it('should return "Invalid date format" when submitDate is an invalid string', function() {
      const submitDate = new DueDateCalculator('a').submitDate;
      assert.equal(submitDate, 'Invalid date format');
    });
  });

  describe('Valid inputs', function() {
    it('should return Date type with hyphen input', function() {
      const submitDate = new DueDateCalculator('2017-10-22').submitDate;
      assert.typeOf(submitDate, 'date');
    });
    it('should return Date type with dot input', function() {
      const submitDate = new DueDateCalculator('2017.10.22').submitDate;
      assert.typeOf(submitDate, 'date');
    });
    it('should return the correct date', function() {
      const submitDate = new DueDateCalculator('2017.10.22').submitDate;
      const otherDate = new Date('2017.10.22');
      assert.equal(submitDate.getTime(), otherDate.getTime());
    });
  });

});

describe('validateNumber()', function() {

  describe('Invalid inputs', function() {
    it('should return "Empty time" when turnaroundTime is empty', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22').turnaroundTime;
      assert.equal(turnaroundTime, 'Empty time');
    });
    it('should return "Invalid time format" when turnaroundTime is not a number', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22','a').turnaroundTime;
      assert.equal(turnaroundTime, 'Invalid time format');
    });
    it('should return "Time should be positive or 0" when time is negative', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22',-1).turnaroundTime;
      assert.equal(turnaroundTime, 'Time should be positive or 0');
    });
  });

  describe('Valid inputs', function() {
    it('should return a number', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22',0).turnaroundTime;
      assert.typeOf(turnaroundTime, 'number');
    });
    it('should return a positive number', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22',1).turnaroundTime;
      assert.isAbove(turnaroundTime, 0);
    });
    it('should return an Integer with Float input', function() {
      const turnaroundTime = new DueDateCalculator('2017-10-22',1.1).turnaroundTime;
      assert.equal(turnaroundTime, 1);
    });
  });

});

describe('getDayNameFromDate()', function() {
  describe('Invalid inputs', function() {
    it('should require a parameter', function() {
      const calculator = new DueDateCalculator('2017-10-22',1);
      const name = calculator.getDayNameFromDate();
      assert.equal(name, 'No day input');
    });
    it('should require a date parameter', function() {
      const calculator = new DueDateCalculator('2017-10-22',1);
      const name = calculator.getDayNameFromDate('a');
      assert.equal(name, 'Invalid date format');
    });
  });

  describe('Valid inputs', function() {
    it('should return a string', function() {
      const calculator = new DueDateCalculator('2017-10-22',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.typeOf(name, 'string');
    });
    it('should return "Sunday"', function() {
      const calculator = new DueDateCalculator('2017-10-22',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Sunday");
    });
    it('should return "Monday"', function() {
      const calculator = new DueDateCalculator('2017-10-23',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Monday");
    });
    it('should return "Tuesday"', function() {
      const calculator = new DueDateCalculator('2017-10-24',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Tuesday");
    });
    it('should return "Wednesday"', function() {
      const calculator = new DueDateCalculator('2017-10-25',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Wednesday");
    });
    it('should return "Thursday"', function() {
      const calculator = new DueDateCalculator('2017-10-26',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Thursday");
    });
    it('should return "Friday"', function() {
      const calculator = new DueDateCalculator('2017-10-27',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Friday");
    });
    it('should return "Saturday"', function() {
      const calculator = new DueDateCalculator('2017-10-28',1);
      const submitDate = calculator.submitDate;
      const name = calculator.getDayNameFromDate(submitDate);
      assert.equal(name, "Saturday");
    });
  });
});

describe('addHoursToDate()', function() {
  const calculator = new DueDateCalculator('2017-10-22',1);
  const submitDate = calculator.submitDate;
  const hoursToAdd = 1;

  describe('Invalid inputs', function() {
    it('should require a parameter', function() {
      const otherDate = calculator.addHoursToDate();
      assert.equal(otherDate, 'No hours input');
    });
    it('should require a number parameter first', function() {
      const otherDate = calculator.addHoursToDate("a");
      assert.equal(otherDate, 'Invalid hours format');
    });
    it('should require 2 parameters', function() {
      const otherDate = calculator.addHoursToDate(1);
      assert.equal(otherDate, 'No date input');
    });
    it('should require a number with a Date', function() {
      const otherDate = calculator.addHoursToDate(1,1);
      assert.equal(otherDate, 'Invalid date format');
    });
  });

  describe('Valid inputs', function() {
    it('should return a Date', function() {
      const otherDate = calculator.addHoursToDate(1, submitDate);
      assert.typeOf(otherDate, 'date');
    });
  });
});

describe('calculateDueDate()', function() {
  describe('Invalid inputs', function() {
    it('should have a submitDate', function() {
      const calculator = new DueDateCalculator();
      const dueDate = calculator.calculateDueDate();
      assert.equal(dueDate, false);
    });
    it('should have a valid submitDate (Date type)', function() {
      const calculator = new DueDateCalculator('a');
      const dueDate = calculator.calculateDueDate();
      assert.equal(dueDate, false);
    });
    it('should have a turnaroundTime', function() {
      const calculator = new DueDateCalculator('2017-10-22');
      const dueDate = calculator.calculateDueDate();
      assert.equal(dueDate, false);
    });
    it('should have a valid turnaroundTime (Integer)', function() {
      const calculator = new DueDateCalculator('2017-10-22','a');
      const dueDate = calculator.calculateDueDate();
      assert.equal(dueDate, false);
    });
    it('should have a valid turnaroundTime (positive Integer)', function() {
      const calculator = new DueDateCalculator('2017-10-22', -1);
      const dueDate = calculator.calculateDueDate();
      assert.equal(dueDate, false);
    });
  });

  describe('Valid inputs', function() {
    it('should return Date type', function() {
      const calculator = new DueDateCalculator('2017-10-27T13:30:00Z', 8);
      const dueDate = calculator.calculateDueDate();
      assert.typeOf(dueDate, 'date');
    });
    it('should display the same day name with 0 hour', function() {
      const calculator = new DueDateCalculator('2017-10-27T14:30:00Z', 0);
      const dueDate = calculator.calculateDueDate();
      const dueDateName = calculator.getDayNameFromDate(dueDate);
      const sameDayName = calculator.getDayNameFromDate(new Date('2017-10-27T14:30:00Z'));
      assert.equal(dueDateName, sameDayName);
    });
    it('should display the same day name with 1 hour', function() {
      const calculator = new DueDateCalculator('2017-10-27T13:30:00Z', 1);
      const dueDate = calculator.calculateDueDate();
      const dueDateName = calculator.getDayNameFromDate(dueDate);
      const sameDayName = calculator.getDayNameFromDate(new Date('2017-10-27T13:30:00Z'));
      assert.equal(dueDateName, sameDayName);
    });
    it('should display the next working day name with 8 hours', function() {
      const calculator = new DueDateCalculator('2017-10-27T13:30:00Z', 8);
      const dueDate = calculator.calculateDueDate();
      const dueDateName = calculator.getDayNameFromDate(dueDate);
      const sameDayName = calculator.getDayNameFromDate(new Date('2017-10-30'));
      assert.equal(dueDateName, sameDayName);
    });
  });

});

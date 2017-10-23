$(function () {
  // Init DateTimePicker
  $('#submit-date').datetimepicker({
    format: 'YYYY-MM-DD HH:mm'
  });

  // Only working hours are allowed in the DateTimePicker
  const enabledHours = [9, 10, 11, 12, 13, 14, 15, 16];
  $('#submit-date').data('DateTimePicker').enabledHours(enabledHours);

  // Only weekdays are allowed in the DateTimePicker
  const disabledDays = [0, 6];
  $('#submit-date').data('DateTimePicker').daysOfWeekDisabled(disabledDays);
});



$('#input-form').submit(event => {
  event.preventDefault();

  // Validate input parameters
  const turnaroundTime = parseInt($('#turnaround-time').val());
  if (isNaN(turnaroundTime) || turnaroundTime < 0) {
    alert('Please enter a valid number!');
    return false;
  }

  const submitDate = $('#submit-date').data('DateTimePicker').date();

  // Calculate and format Due Date
  const dueDate = calculateDueDate(submitDate, turnaroundTime);
  const formattedDueDate = `${dueDate.format('dddd')}, ${dueDate.format('YYYY-MM-DD HH:mm')}`;

  // Display result to user
  $('#due-date').text(formattedDueDate);
});

/**
* Calculates the due date from the submitDate (Date) and the turnaroundTime (number and measured in hours)
* The function does not deal with weekends or hours outside of working hours (9:00 - 17:00)
*/
function calculateDueDate(submitDate, turnaroundTime) {
  let dueDate = submitDate;

  for (let i = 1; i <= turnaroundTime; i++) {

    // check every hour if it's in working hours
    let nextHour = moment(dueDate).add(1, 'hours');
    let isNextWorkingHour = (nextHour.hour() === 17 && nextHour.minutes() > 0 || nextHour.hour() > 17);

    // if it exceed's the current day, then move it to the next day
    let hoursToAdd = (isNextWorkingHour) ? 17 : 1;
    dueDate.add(hoursToAdd, 'hours');


    // check if the next day is weekend, if the due day has to be moved to the next day
    if (isNextWorkingHour) {

      // if it's weekend, move it to the next Monday
      let currentDayName = dueDate.format('dddd');
      if (currentDayName === 'Saturday') {

        dueDate.add(2,'days');
      }
    }
  }

  return dueDate;
}

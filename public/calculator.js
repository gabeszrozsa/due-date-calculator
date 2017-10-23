$(function () {
  $('#submit-date').datetimepicker({
    format: 'YYYY-MM-DD HH:mm'
  });

  const enabledHours = [9, 10, 11, 12, 13, 14, 15, 16];
  $('#submit-date').data('DateTimePicker').enabledHours(enabledHours);

  const disabledDays = [0, 6];
  $('#submit-date').data('DateTimePicker').daysOfWeekDisabled(disabledDays);
});



$('#input-form').submit(event => {
  event.preventDefault();

  const turnaroundTime = parseInt($('#turnaround-time').val());
  if (isNaN(turnaroundTime) || turnaroundTime < 0) {
    alert('Please enter a valid number!');
    return false;
  }

  const submitDate = $('#submit-date').data('DateTimePicker').date();
  const dueDate = calculateDueDate(submitDate, turnaroundTime);
  const formattedDueDate = `${dueDate.format('dddd')}, ${dueDate.format('YYYY-MM-DD HH:mm')}`;
  $('#due-date').text(formattedDueDate);
});


function calculateDueDate(submitDate, turnaroundTime) {
  let dueDate = submitDate;

  for (let i = 1; i <= turnaroundTime; i++) {
    let nextHour = moment(dueDate).add(1, 'hours');

    let isNextWorkingHour = (nextHour.hour() === 17 && nextHour.minutes() > 0 || nextHour.hour() > 17);
    let hoursToAdd = (isNextWorkingHour) ? 17 : 1;

    dueDate.add(hoursToAdd, 'hours');

    if (isNextWorkingHour) {
      let currentDayName = dueDate.format('dddd');
      if (currentDayName === 'Saturday') {

        dueDate.add(2,'days');
      }
    }
  }

  return dueDate;
}

import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector('button[data-start]');
  const datePicker = document.querySelector('#datetime-picker');
  const timerFields = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  };

  if (!startButton || !datePicker || Object.values(timerFields).some(field => field === null)) {
    
    return;
  }

  let userSelectedDate = null;
  startButton.disabled = true;
  let timerInterval;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate < new Date()) {
        iziToast.error({
          title: "Error",
          message: "Please choose a date in the future",
        });
        startButton.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    },
  };

  flatpickr(datePicker, options);

  startButton.addEventListener("click", () => {
    if (!userSelectedDate) return;

    const startTime = new Date();
    const endTime = userSelectedDate.getTime();

    startButton.disabled = true;
    datePicker.disabled = true;

    function updateTimer() {
      const currentTime = new Date();
      const timeRemaining = endTime - currentTime.getTime();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        datePicker.disabled = false;
        timerFields.days.textContent = '00';
        timerFields.hours.textContent = '00';
        timerFields.minutes.textContent = '00';
        timerFields.seconds.textContent = '00';
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeRemaining);

      timerFields.days.textContent = addLeadingZero(days.toString());
      timerFields.hours.textContent = addLeadingZero(hours.toString());
      timerFields.minutes.textContent = addLeadingZero(minutes.toString());
      timerFields.seconds.textContent = addLeadingZero(seconds.toString());
    }

    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); 
  });

  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  function addLeadingZero(value) {
    return value.padStart(2, '0');
  }
}); 
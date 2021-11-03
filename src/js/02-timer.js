import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  btnStart: document.querySelector('[data-start]'),
  timer: document.querySelector('.timer'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
let isActive = false;
let nullTime = null;

refs.btnStart.setAttribute('disabled', true);

refs.btnStart.addEventListener('click', onStartTimer);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    nullTime = selectedDates[0].getTime();
    if (nullTime <= Date.now()) {
      window.alert('Please choose a date in the future');
      return;
    }
    refs.btnStart.removeAttribute('disabled');
    const timer = convertMs(nullTime - Date.now());
    updateFaceTime(timer);
  },
};

flatpickr('input#datetime-picker', options);

function onStartTimer() {
  if (isActive) {
    return;
  }

  isActive = true;

  const intervalId = setInterval(() => {
    if (nullTime <= Date.now()) {
      clearInterval(intervalId);
      refs.btnStart.setAttribute('disabled', true);
      return;
    }

    const time = convertMs(nullTime - Date.now());
    updateFaceTime(time);
  }, 1000);
  refs.btnStart.setAttribute('disabled', true);
}

function updateFaceTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

// // function updateClockface({ days, hours, minutes, seconds }) {
// //   refs.field.value.textContent = `${days}:${hours}:${minutes}:${seconds}`;
// // }

// // console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// // console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// // console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

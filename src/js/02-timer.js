import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const options = {
  enableTime: true, // Включает сборщик времени
  time_24hr: true, // Отображает указатель времени в 24-часовом режиме без выбора AM / PM, когда он включен.
  defaultDate: new Date(), // Устанавливает начальную выбранную дату (даты). Если вы используете режим «несколько» или календарь диапазона, предоставьте массив объектов даты или массив строк даты, которые следуют за вашим dateFormat. В противном случае вы можете указать один объект Date или строку даты.
  minuteIncrement: 1, // Регулирует шаг ввода минут (включая прокрутку)
  onClose(selectedDates) {
    //массив объектов Date, выбранных пользователем. Если даты не выбраны, массив пуст.
    console.log(selectedDates[0]);
  },
};

flatpickr('input#datetime-picker', options);

const refs = {
  input: document.querySelector('#date-selector'),
  btnStart: document.querySelector('[data-start]'),
  timer: document.querySelector('.timer'),
  field: document.querySelectorAll('.field'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let intervalId = null;

refs.btnStart.setAttribute('disabled', true);

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
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateClockface({ days, hours, minutes, seconds }) {
  refs.field.textContent = `${days}:${hours}:${minutes}:${seconds}`;
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;

    this.init();
  }

  init() {
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  start() {
    if (this.isActive) {
      return;
    }

    const startTime = Date.now();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const time = this.getTimeComponents(deltaTime);

      this.onTick(time);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  /*
   * - Принимает время в миллисекундах
   * - Высчитывает сколько в них вмещается часов/минут/секунд
   * - Возвращает обьект со свойствами hours, mins, secs
   * - Адская копипаста со стека 💩
   */
  getTimeComponents(ms) {
    //   const hours = this.pad(
    //     Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    //   );
    //   const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    //   const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    //   return { hours, mins, secs };
    // }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.pad(Math.floor(ms / day));
    // Remaining hours
    const hours = this.pad(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
    // Remaining seconds
    const seconds = this.pad(Math.floor((((ms % day) % hour) % minute) / second));

    return { days, hours, minutes, seconds };
  }

  /*
   * Принимает число, приводит к строке и добавляет в начало 0 если число меньше 2-х знаков
   */
  pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateClockface,
});

refs.startBtn.addEventListener('click', timer.start.bind(timer));
refs.stopBtn.addEventListener('click', timer.stop.bind(timer));

/*
 * - Принимает время в миллисекундах
 * - Высчитывает сколько в них вмещается часов/минут/секунд
 * - Рисует интерфейс
 */
function updateClockface({ days, hours, minutes, seconds }) {
  refs.clockface.textContent = `${days}:${hours}:${minutes}:${seconds}`;
}

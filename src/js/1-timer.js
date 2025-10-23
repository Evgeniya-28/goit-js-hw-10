import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let selectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

const fp = flatpickr('#datetime-picker', {
  ...options,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) return;
    if (picked <= new Date()) {
      refs.startBtn.disabled = true;
      iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
      selectedDate = null;
      return;
    }
    selectedDate = picked;
    refs.startBtn.disabled = false;
  },
});

refs.startBtn.addEventListener('click', () => {
  if (!selectedDate) return;
  if (timerId) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const diff = selectedDate - new Date();
    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateDisplay(0);
      refs.input.disabled = false;
      return;
    }
    updateDisplay(diff);
  }, 1000);
});

function updateDisplay(ms) {
  const time = convertMs(ms);
  refs.days.textContent = addLeadingZero(time.days);
  refs.hours.textContent = addLeadingZero(time.hours);
  refs.minutes.textContent = addLeadingZero(time.minutes);
  refs.seconds.textContent = addLeadingZero(time.seconds);
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

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

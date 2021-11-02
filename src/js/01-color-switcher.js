function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// <button type="button" data-start>Start</button>
// <button type="button" data-stop>Stop</button>

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const bodyElem = document.querySelector('body');

startBtn.addEventListener('click', changeColor);

let timerId = null;

function changeColor() {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  timerId = setInterval(() => {
    const color = getRandomHexColor();
    bodyElem.style.backgroundColor = color;
  }, 1000);
}

stopBtn.addEventListener('click', () => {
  clearInterval(timerId);
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

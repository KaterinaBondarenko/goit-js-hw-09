const refs = {
  formEl: document.querySelector('.form'),
  delayEl: document.querySelector('input[name="delay"]'),
  stepEl: document.querySelector('input[name="step"]'),
  amountEl: document.querySelector('input[name="amount"]'),
};

refs.formEl.addEventListener('submit', onCreatePromises);

function onCreatePromises(event) {
  event.preventDefault();
  let delay = Number(refs.delayEl.value);
  const step = Number(refs.stepEl.value);
  const amount = Number(refs.amountEl.value);

  const promises = [];

  for (let i = 1; i <= amount; i += 1) {
    promises.push(createPromise(i, delay));
    delay += step;
  }
  promises.forEach(promise => {
    promise
      .then(({ position, delay }) => {
        console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        console.log(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  });
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay }); // Fulfill
      } else {
        reject({ position, delay }); // Reject
      }
    }, delay);
  });
}

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const delayValue = Number(formData.get('delay'));
  const state = formData.get('state');

  if (!delayValue || delayValue < 0) {
    iziToast.error({
      position: 'topRight',
      message: 'Please enter a valid delay (ms)',
    });
    return;
  }

  createSnackbarPromise(delayValue, state)
    .then(delay => {
      iziToast.success({
        position: 'topRight',
        message: `Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        position: 'topRight',
        message: `Rejected promise in ${delay}ms`,
      });
    });

  form.reset();
});

function createSnackbarPromise(delayMs, desiredState) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (desiredState === 'fulfilled') {
        resolve(delayMs);
      } else {
        reject(delayMs);
      }
    }, delayMs);
  });
}

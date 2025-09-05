// Курсы валют (глобальные переменные)
let rateUSD = null;
let rateRUB = null;

// Загружаем курсы с API НБРБ
async function loadRates() {
  try {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates');
    const data = await response.json();

    // Ищем USD (Cur_ID=145) и RUB (Cur_ID=298)
    const usd = data.find(item => item.Cur_ID === 145);
    const rub = data.find(item => item.Cur_ID === 298);

    if (usd && rub) {
      rateUSD = usd.Cur_OfficialRate;
      rateRUB = rub.Cur_OfficialRate / 100; // за 1 рубль

      document.getElementById('rate-usd').textContent = `1 USD = ${rateUSD} BYN`;
      document.getElementById('rate-rub').textContent = `1 RUB = ${rateRUB.toFixed(4)} BYN`;
    } else {
      throw new Error('Не удалось загрузить курсы');
    }
  } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    alert('Не удалось загрузить курсы валют. Проверьте подключение.');
  }
}

// Функция пересчёта
function convert() {
  const blrInput = document.getElementById('blr');
  const usdInput = document.getElementById('usd');
  const rubInput = document.getElementById('rub');

  let isBLR = blrInput === document.activeElement;
  let isUSD = usdInput === document.activeElement;
  let isRUB = rubInput === document.activeElement;

  const blr = parseFloat(blrInput.value) || 0;
  const usd = parseFloat(usdInput.value) || 0;
  const rub = parseFloat(rubInput.value) || 0;

  if (!rateUSD || !rateRUB) return;

  if (isBLR) {
    usdInput.value = (blr / rateUSD).toFixed(2);
    rubInput.value = (blr / rateRUB).toFixed(2);
  } else if (isUSD) {
    blrInput.value = (usd * rateUSD).toFixed(2);
    rubInput.value = (usd * rateUSD / rateRUB).toFixed(2);
  } else if (isRUB) {
    blrInput.value = (rub * rateRUB).toFixed(2);
    usdInput.value = (rub * rateRUB / rateUSD).toFixed(2);
  }
}

// Назначаем события
window.onload = function () {
  loadRates().then(() => {
    const inputs = ['blr', 'usd', 'rub'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', convert);
    });
  });
};

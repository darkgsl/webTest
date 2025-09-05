let rateUSD = null;
let rateRUB = null;

async function loadRates() {
  try {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates');
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log('Данные с НБРБ:', data); // Показываем в консоли

    const usd = data.find(item => item.Cur_ID === 145);
    const rub = data.find(item => item.Cur_ID === 298);

    if (!usd) {
      throw new Error('USD (145) не найден в данных');
    }
    if (!rub) {
      throw new Error('RUB (298) не найден в данных');
    }

    rateUSD = usd.Cur_OfficialRate;
    rateRUB = rub.Cur_OfficialRate / 100; // за 1 рубль

    document.getElementById('rate-usd').textContent = `1 USD = ${rateUSD.toFixed(2)} BYN`;
    document.getElementById('rate-rub').textContent = `1 RUB = ${rateRUB.toFixed(4)} BYN`;

    // Пересчитать, если уже есть значения
    convert();
  } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    document.getElementById('rate-usd').textContent = 'Ошибка загрузки курсов USD';
    document.getElementById('rate-rub').textContent = err.message || 'Неизвестная ошибка';
  }
}

function convert() {
  const blrInput = document.getElementById('blr');
  const usdInput = document.getElementById('usd');
  const rubInput = document.getElementById('rub');

  const blr = parseFloat(blrInput.value) || 0;
  const usd = parseFloat(usdInput.value) || 0;
  const rub = parseFloat(rubInput.value) || 0;

  const activeElement = document.activeElement;

  if (!rateUSD || !rateRUB) return;

  if (activeElement.id === 'blr') {
    usdInput.value = (blr / rateUSD).toFixed(2);
    rubInput.value = (blr / rateRUB).toFixed(2);
  } else if (activeElement.id === 'usd') {
    blrInput.value = (usd * rateUSD).toFixed(2);
    rubInput.value = (usd * rateUSD / rateRUB).toFixed(2);
  } else if (activeElement.id === 'rub') {
    blrInput.value = (rub * rateRUB).toFixed(2);
    usdInput.value = (rub * rateRUB / rateUSD).toFixed(2);
  }
}

function onInputChange() {
  convert();
}

window.onload = function () {
  loadRates();

  ['blr', 'usd', 'rub'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', onInputChange);
  });
};

let rateUSD = null;
let rateRUB = null;

// Загружаем курсы по ID
async function loadRates() {
  try {
    // Параллельно загружаем USD и RUB
    const [responseUSD, responseRUB] = await Promise.all([
      fetch('https://www.nbrb.by/api/exrates/rates/145'), // USD к BYN
      fetch('https://www.nbrb.by/api/exrates/rates/298')  // RUB к BYN (за 100 рублей)
    ]);

    if (!responseUSD.ok) throw new Error(`Ошибка загрузки USD: ${responseUSD.status}`);
    if (!responseRUB.ok) throw new Error(`Ошибка загрузки RUB: ${responseRUB.status}`);

    const dataUSD = await responseUSD.json();
    const dataRUB = await responseRUB.json();

    rateUSD = dataUSD.Cur_OfficialRate;
    rateRUB = dataRUB.Cur_OfficialRate / 100; // переводим с 100 рублей на 1 рубль

    // Показываем курсы на странице
    document.getElementById('rate-usd').textContent = `1 USD = ${rateUSD.toFixed(2)} BYN`;
    document.getElementById('rate-rub').textContent = `1 RUB = ${rateRUB.toFixed(4)} BYN`;

    // Пересчитываем, если уже есть значения
    convert();
  } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    document.getElementById('rate-usd').textContent = 'Ошибка: не удалось загрузить USD';
    document.getElementById('rate-rub').textContent = err.message || 'Проверьте подключение';
  }
}

// Пересчёт валют
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

// Обработчик ввода
function onInputChange() {
  convert();
}

// При загрузке страницы
window.onload = function () {
  loadRates(); // Загружаем курсы

  // Назначаем события на поля ввода
  ['blr', 'usd', 'rub'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', onInputChange);
  });
};

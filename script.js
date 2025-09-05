// Курсы валют
let rateUSD = null;  // курс USD к BYN
let rateRUB = null;  // курс 1 RUB к BYN (в BYN за 1 рубль)

// Загружаем курсы с API НБРБ
async function loadRates() {
  try {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates');
    const data = await response.json();

    const usd = data.find(item => item.Cur_ID === 145); // USD
    const rub = data.find(item => item.Cur_ID === 298); // RUB (на 100 рублей)

    if (usd && rub) {
      rateUSD = usd.Cur_OfficialRate;
      rateRUB = rub.Cur_OfficialRate / 100; // за 1 рубль

      // Показываем курсы
      document.getElementById('rate-usd').textContent = `1 USD = ${rateUSD.toFixed(2)} BYN`;
      document.getElementById('rate-rub').textContent = `1 RUB = ${rateRUB.toFixed(4)} BYN`;

      // Пересчитываем при загрузке (если уже есть значение)
      convert();
    } else {
      throw new Error('Не удалось найти курсы');
    }
  } catch (err) {
    console.error('Ошибка загрузки курсов:', err);
    document.getElementById('rate-usd').textContent = 'Ошибка загрузки курсов USD';
    document.getElementById('rate-rub').textContent = 'Проверьте подключение';
  }
}

// Основная функция конвертации
function convert() {
  const blrInput = document.getElementById('blr');
  const usdInput = document.getElementById('usd');
  const rubInput = document.getElementById('rub');

  // Получаем значения
  const blr = parseFloat(blrInput.value) || 0;
  const usd = parseFloat(usdInput.value) || 0;
  const rub = parseFloat(rubInput.value) || 0;

  // Проверяем, какое поле активно (в фокусе)
  const activeElement = document.activeElement;

  // Если курсов ещё нет — выходим
  if (!rateUSD || !rateRUB) return;

  // Пересчёт зависит от того, в какое поле вводит пользователь
  if (activeElement.id === 'blr') {
    // Вводим в BYN
    usdInput.value = (blr / rateUSD).toFixed(2);
    rubInput.value = (blr / rateRUB).toFixed(2);
  } else if (activeElement.id === 'usd') {
    // Вводим в USD
    blrInput.value = (usd * rateUSD).toFixed(2);
    rubInput.value = (usd * rateUSD / rateRUB).toFixed(2);
  } else if (activeElement.id === 'rub') {
    // Вводим в RUB
    blrInput.value = (rub * rateRUB).toFixed(2);
    usdInput.value = (rub * rateRUB / rateUSD).toFixed(2);
  }
}

// Дополнительно: пересчитывать при изменении (на всякий случай)
function onInputChange() {
  // Имитируем фокус — вызываем convert
  convert();
}

// При загрузке страницы
window.onload = function () {
  loadRates(); // Загружаем курсы

  // Назначаем события на ввод
  ['blr', 'usd', 'rub'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', onInputChange);
    input.addEventListener('focus', onInputChange); // при фокусе
  });
};

// Инициализация баллов для всех школ магии
const magicTypes = [
  "огонь", "вода", "земля", "воздух",
  "свет", "тьма", "пространство", "время",
  "жизнь", "тень", "некромантия", "предсказательства",
  "ментальная", "природа", "кровь", "истинность", "иллюзия"
];

// Если это первый вопрос — очищаем результат
if (window.location.pathname.includes("question1.html")) {
  localStorage.clear();
  magicTypes.forEach(type => localStorage.setItem(type, "0"));
}

// Начислить баллы по типам магии
function answerQuestion(updates, nextPage) {
  updates.forEach(update => {
    const [type, value] = update;
    const current = parseInt(localStorage.getItem(type) || "0");
    localStorage.setItem(type, current + value);
  });

  window.location.href = nextPage;
}

let pendingAnswer = null;

function confirmAnswer(updates, nextPage, answerNumber) {
  pendingAnswer = { updates, nextPage };
  const text = `Подтвердите выбор ответа №${answerNumber}`;
  document.getElementById("confirmationText").innerText = text;
  document.getElementById("confirmationModal").classList.remove("hidden");
}


function closeModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  pendingAnswer = null;
}

document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (pendingAnswer) {
        const { updates, nextPage } = pendingAnswer;
        updates.forEach(update => {
          const [type, value] = update;
          const current = parseInt(localStorage.getItem(type) || "0");
          localStorage.setItem(type, current + value);
        });
        window.location.href = nextPage;
      }
    });
  }
});

// Получить топ-3 школы магии
function calculateTopMagic() {
  const scores = magicTypes.map(type => ({
    type,
    value: parseInt(localStorage.getItem(type) || "0")
  }));

  scores.sort((a, b) => b.value - a.value);
  return scores.slice(0, 3);
}

function showResult() {
  const scores = magicTypes.map(type => ({
    type,
    value: parseInt(localStorage.getItem(type) || "0")
  }));

  // Сортируем по убыванию баллов
  scores.sort((a, b) => b.value - a.value);

  const top1 = scores[0];
  const top2 = scores[1];
  const top3 = scores[2];
  const container = document.getElementById("result");
  if (!container) return;

  const maxScore = top1.value;
  const topTypes = scores.filter(item => item.value === maxScore);

  let resultText = "";

  if (topTypes.length >= 3) {
    // Три и более типа с одинаковым наивысшим баллом
    resultText = `Вы обладаете <b>смешанным типом магии</b>: ${topTypes.map(t => t.type.toUpperCase()).join(", ")}`;
  } else if (topTypes.length === 2) {
    // Два лидера с равными баллами
    resultText = `Вы склонны к магии <b>${topTypes[0].type.toUpperCase()}</b> / <b>${topTypes[1].type.toUpperCase()}</b>`;
  } else {
    // Один лидер, проверяем разницу
    const secondPlaceValue = top2.value;
    const diff = maxScore - secondPlaceValue;

    const nearSecondPlace = scores.filter(item =>
      item !== top1 && (maxScore - item.value) <= 1
    );

    if (diff <= 1 && nearSecondPlace.length === 1) {
      // Два близких лидера
      resultText = `Вы склонны к магии <b>${top1.type.toUpperCase()}</b> / <b>${top2.type.toUpperCase()}</b>`;
    } else if (nearSecondPlace.length >= 2) {
      // Один лидер, но два и более типов отстают на 1 очко
      resultText = `Вы обладаете <b>смешанным типом магии</b>: ${[top1, ...nearSecondPlace].map(t => t.type.toUpperCase()).join(", ")}`;
    } else {
      // Явный лидер
      resultText = `Ваша магия — <b>${top1.type.toUpperCase()}</b>`;
    }
  }

  // Выводим результат
  container.innerHTML = resultText;

  // Добавим список с баллами
  container.innerHTML += "<br><br><small>Полный рейтинг:</small><ul>";
  scores.forEach(entry => {
    container.innerHTML += `<li>${entry.type}: ${entry.value}</li>`;
  });
  container.innerHTML += "</ul>";

}

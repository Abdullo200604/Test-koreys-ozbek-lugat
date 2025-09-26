// ==== Web Speech API sozlash ==== //
function speakKorean(text) {
  if (!("speechSynthesis" in window)) {
    alert("Sizning brauzeringiz ovozli o‘qishni qo‘llab-quvvatlamaydi!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR"; // Koreyscha talaffuz
  utterance.rate = 1;       // Ovoz tezligi
  utterance.pitch = 1;      // Ovoz balandligi
  speechSynthesis.speak(utterance);
}

// ==== Karta ustiga bosilganda ovoz chiqarish ==== //
document.addEventListener("DOMContentLoaded", () => {
  const soundButtons = document.querySelectorAll(".card-sound-btn");

  soundButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const word = btn.getAttribute("data-word");
      speakKorean(word);
    });
  });
});

// ==== Keyinchalik testlar uchun tayyor funksiya ==== //
function startTest() {
  alert("Test hali qo‘shilmagan. Keyinroq tayyor bo‘ladi 😊");
}

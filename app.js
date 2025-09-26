// ===== Boshlang'ich ma'lumotlar =====
// Agar brauzer xotirasi bo'sh bo'lsa, dastlabki so'zlar shu yerdan olinadi.
const initialData = {
    lesson1: [
        { korean: "거리", uzbek: "ko'cha", imageUrl: "https://storage.googleapis.com/proudcity/mebanenc/uploads/2020/07/street-downtown-mebane.jpg" },
        { korean: "다리", uzbek: "oyoq, ko'prik", imageUrl: "https://i.natgeofe.com/n/29097735-2a21-44a6-9607-dd8309a101a2/golden-gate-bridge-san-francisco_16x9.jpg" },
        { korean: "얼마", uzbek: "qancha", imageUrl: "" },
        { korean: "일어나다", uzbek: "turmoq", imageUrl: "https://st.depositphotos.com/1000507/4802/i/450/depositphotos_48021971-stock-photo-woman-waking-up.jpg" },
        { korean: "빨리", uzbek: "tez", imageUrl: "https://www.topgear.com/sites/default/files/2022/07/13.jpg" }
    ],
    lesson2: [
        { korean: "몰라요", uzbek: "bilmayman", imageUrl: "" },
        { korean: "알아요", uzbek: "bilaman", imageUrl: "" },
        { korean: "우리", uzbek: "biz", imageUrl: "https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15773.jpg" },
        { korean: "나라", uzbek: "davlat", imageUrl: "https://cdn.britannica.com/46/194146-050-B776654A/World-map-countries-flags-2016.jpg" },
        { korean: "오리", uzbek: "o'rdak", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Mallard_drake_in_flight.jpg" }
    ]
};


// ===== Asosiy Funksiyalar (Ma'lumotlar bazasi bilan ishlash) =====

// Dastur ilk bor ishga tushganda brauzer xotirasini (localStorage) tekshiradi.
function initializeDB() {
    if (!localStorage.getItem('koreanVocabulary')) {
        localStorage.setItem('koreanVocabulary', JSON.stringify(initialData));
    }
}

// Barcha lug'atlarni xotiradan olish funksiyasi.
function getVocabulary() {
    return JSON.parse(localStorage.getItem('koreanVocabulary'));
}

// Lug'atlarni xotiraga saqlash funksiyasi.
function saveVocabulary(data) {
    localStorage.setItem('koreanVocabulary', JSON.stringify(data));
}

// Foydalanuvchi admin rejimida ekanligini tekshirish.
function isAdmin() {
    return sessionStorage.getItem('isAdmin') === 'true';
}


// ===== Admin rejimiga kirish logikasi (index.html uchun) =====

// Sahifa to'liq yuklangandan so'ng ishga tushadi.
document.addEventListener('DOMContentLoaded', () => {
    // Ma'lumotlar bazasini ishga tushirish
    initializeDB();

    const adminTrigger = document.getElementById('admin-trigger');
    if (adminTrigger) {
        let clickCount = 0;
        let clickTimer = null;

        adminTrigger.addEventListener('click', () => {
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);

            // Agar 2 soniya ichida bosilmasa, hisobni yana noldan boshlaydi.
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 2000);

            // Agar 3 marta bosilsa, parol so'raydi.
            if (clickCount === 3) {
                clickCount = 0;
                const password = prompt("Admin rejimiga kirish uchun parolni kiriting:");
                if (password === "1234") { // Parolni shu yerdan o'zgartirishingiz mumkin
                    sessionStorage.setItem('isAdmin', 'true');
                    alert("✅ Admin rejimi muvaffaqiyatli yoqildi!");
                } else if (password) {
                    alert("❌ Parol noto'g'ri!");
                }
            }
        });
    }
});


// ===== Lug'at sahifasi uchun funksiyalar (vocabulary.html) =====

// So'zlarni sahifaga chizish (render qilish).
function renderVocabulary(lessonId) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    const words = db[lessonKey] || [];
    const listContainer = document.getElementById('vocabulary-list');
    listContainer.innerHTML = '';

    words.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'word-item';
        
        const imagePreview = word.imageUrl ? `<img src="${word.imageUrl}" class="word-preview-img" alt="rasm">` : '';

        item.innerHTML = `
            ${imagePreview}
            <div class="word-pair">
                <span class="korean">${word.korean}</span>
                <span class="uzbek">${word.uzbek}</span>
            </div>
            ${isAdmin() ? `
            <div class="admin-controls">
                <button class="edit-btn" onclick="editWord('${lessonId}', ${index})">✏️</button>
                <button class="delete-btn" onclick="deleteWord('${lessonId}', ${index})">❌</button>
            </div>
            ` : ''}
        `;

        item.querySelector('.word-pair').addEventListener('click', () => {
            item.classList.toggle('zoomed');
        });
        
        listContainer.appendChild(item);
    });
}

// Yangi so'z qo'shish.
function addWord(lessonId, newWord) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    if (!db[lessonKey]) {
        db[lessonKey] = [];
    }
    db[lessonKey].push(newWord);
    saveVocabulary(db);
}

// Mavjud so'zni tahrirlash.
function editWord(lessonId, index) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    const word = db[lessonKey][index];
    
    const newKorean = prompt("Koreyscha so'zni tahrirlang:", word.korean);
    if (newKorean === null || newKorean.trim() === '') return;

    const newUzbek = prompt("O'zbekcha tarjimani tahrirlang:", word.uzbek);
    if (newUzbek === null || newUzbek.trim() === '') return;
    
    const newImageUrl = prompt("Rasm manzilini (URL) kiriting:", word.imageUrl || '');

    db[lessonKey][index] = { 
        korean: newKorean.trim(), 
        uzbek: newUzbek.trim(), 
        imageUrl: newImageUrl ? newImageUrl.trim() : ''
    };
    saveVocabulary(db);
    renderVocabulary(lessonId);
}

// So'zni o'chirish.
function deleteWord(lessonId, index) {
    if (confirm("Haqiqatan ham bu so'zni o'chirmoqchimisiz?")) {
        const db = getVocabulary();
        const lessonKey = `lesson${lessonId}`;
        db[lessonKey].splice(index, 1);
        saveVocabulary(db);
        renderVocabulary(lessonId);
    }
}

// So'z qo'shish (rasm bilan)
function addWord(lessonId, newWord) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    if (!db[lessonKey]) {
        db[lessonKey] = [];
    }
    // Agar rasm kiritilmagan bo‘lsa, bo‘sh satr qo‘shamiz
    db[lessonKey].push({ 
        korean: newWord.korean, 
        uzbek: newWord.uzbek, 
        imageUrl: newWord.imageUrl || '' 
    });
    saveVocabulary(db);
}

// So'zni tahrirlash (rasm bilan)
function editWord(lessonId, index) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    const word = db[lessonKey][index];
    
    const newKorean = prompt("Koreyscha so'zni tahrirlang:", word.korean);
    if (newKorean === null || newKorean.trim() === '') return;

    const newUzbek = prompt("O'zbekcha tarjimani tahrirlang:", word.uzbek);
    if (newUzbek === null || newUzbek.trim() === '') return;
    
    // Rasm URL'ini so'raymiz
    const newImageUrl = prompt("Rasm manzilini (URL) kiriting:", word.imageUrl || '');

    db[lessonKey][index] = { 
        korean: newKorean, 
        uzbek: newUzbek, 
        imageUrl: newImageUrl || '' 
    };
    saveVocabulary(db);
    renderVocabulary(lessonId); // Sahifani yangilash
}

// So'zlarni sahifaga chizish (rasm bilan)
function renderVocabulary(lessonId) {
    const db = getVocabulary();
    const lessonKey = `lesson${lessonId}`;
    const words = db[lessonKey] || [];
    const listContainer = document.getElementById('vocabulary-list');
    listContainer.innerHTML = ''; 

    words.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'word-item';
        
        // Rasm mavjud bo‘lsa, ko‘rsatamiz
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

        // Zoom funksiyasi
        item.querySelector('.word-pair').addEventListener('click', () => {
            item.classList.toggle('zoomed');
        });

        listContainer.appendChild(item);
    });
}

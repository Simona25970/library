let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
let currentWordIndex = null;

// Načteme knihovnu hned po spuštění
updateLibraryTable();

function addWord() {
     const foreign = document.getElementById('foreignWord').value.trim();
     const czech = document.getElementById('czechWord').value.trim();

     if (!foreign || !czech) return alert('Musíš vyplnit obě políčka!');

     vocabulary.push({ foreign, czech });
     saveData();
     updateLibraryTable();

     document.getElementById('foreignWord').value = '';
     document.getElementById('czechWord').value = '';
     document.getElementById('foreignWord').focus();
}

function deleteWord(index) {
     vocabulary.splice(index, 1);
     saveData();
     updateLibraryTable();
     endTest();
}

function saveData() {
     localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
}

// Vykreslení knihovny do přehledné tabulky
function updateLibraryTable() {
     const tbody = document.getElementById('vocabTableBody');
     if (vocabulary.length === 0) {
          tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#94a3b8;">Knihovna je prázdná. Přidej první slovíčka!</td></tr>`;
          return;
     }

     tbody.innerHTML = vocabulary.map((word, index) => `
                <tr>
                    <td><strong>${word.foreign}</strong></td>
                    <td>${word.czech}</td>
                    <td><button class="delete-btn" onclick="deleteWord(${index})">Smazat</button></td>
                </tr>
            `).join('');
}

// LOGIKA TESTU
function startTest() {
     if (vocabulary.length === 0) return alert('Nejprve přidej slovíčka do knihovny!');

     // tento řádek skryje knihovnu při startu testu
     document.getElementById('libraryBox').classList.add('hidden');

     document.getElementById('testArea').classList.remove('hidden');
     document.getElementById('feedback').classList.add('hidden');
     document.getElementById('nextBtn').classList.add('hidden');

     const answerInput = document.getElementById('userAnswer');
     answerInput.value = '';
     answerInput.disabled = false;
     document.getElementById('checkBtn').disabled = false;
     answerInput.focus();

     // Výběr náhodného slova z celé knihovny
     currentWordIndex = Math.floor(Math.random() * vocabulary.length);
     document.getElementById('wordToTranslate').innerText = vocabulary[currentWordIndex].foreign;
}

function checkAnswer() {
     if (currentWordIndex === null) return;

     const userAnswer = document.getElementById('userAnswer').value.trim().toLowerCase();
     const correctAnswer = vocabulary[currentWordIndex].czech.toLowerCase();
     const feedback = document.getElementById('feedback');

     feedback.classList.remove('hidden', 'correct', 'wrong');

     // Zamkneme vstupy, dokud uživatel neodklikne další slovo
     document.getElementById('userAnswer').disabled = true;
     document.getElementById('checkBtn').disabled = true;

     if (userAnswer === correctAnswer) {
          feedback.innerText = 'Správně! 🎉';
          feedback.classList.add('correct');
     } else {
          feedback.innerText = `Chyba. Správný překlad je: ${vocabulary[currentWordIndex].czech}`;
          feedback.classList.add('wrong');
     }

     // Ukážeme tlačítko pro pokračování na další náhodné slovo
     document.getElementById('nextBtn').classList.remove('hidden');
     document.getElementById('nextBtn').focus();
}

function endTest() {
     document.getElementById('testArea').classList.add('hidden');

     // tento řádek ukáže knihovnu, pokud se test ukončí
     document.getElementById('libraryBox').classList.remove('hidden');

     currentWordIndex = null;
}
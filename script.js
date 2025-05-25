document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const studyModes = document.getElementById('studyModes');
    const timerContainer = document.getElementById('timerContainer');
    const backBtn = document.getElementById('backBtn');
    const container = document.querySelector('.container');
    const studySession = document.getElementById('studySession');
    const landingPage = document.getElementById('landingPage');

    // Session UI elements
    const backHomeBtn = document.getElementById('backHomeBtn');
    const sessionModeEmoji = document.getElementById('sessionModeEmoji');
    const sessionModeName = document.getElementById('sessionModeName');
    const sessionSubtitle = document.getElementById('sessionSubtitle');
    const sessionCount = document.getElementById('sessionCount');
    const sessionTotal = document.getElementById('sessionTotal');
    const sessionTimerDisplay = document.getElementById('sessionTimerDisplay');
    const timerState = document.getElementById('timerState');
    const timerEmoji = document.getElementById('timerEmoji');
    const sessionStartBtn = document.getElementById('sessionStartBtn');
    const sessionResetBtn = document.getElementById('sessionResetBtn');
    const detailsStudy = document.getElementById('detailsStudy');
    const detailsBreak = document.getElementById('detailsBreak');
    // Tasks
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addFirstTaskBtn = document.getElementById('addFirstTaskBtn');
    const tasksList = document.getElementById('tasksList');
    const noTasksMsg = document.getElementById('noTasksMsg');

    // --- Mode Data ---
    const MODES = {
        cat: {
            name: 'Sleepy Cat Mode',
            emoji: '😴',
            subtitle: '😴 Study Time - You got this! ✨',
            study: 25 * 60,
            break: 15 * 60,
            color: '#f7b6d6',
            breakEmoji: '💤',
            focusEmoji: '😴',
        },
        bunny: {
            name: 'Happy Bunny Mode',
            emoji: '🌸',
            subtitle: '🌸 Study Time - Hop to it! ✨',
            study: 45 * 60,
            break: 10 * 60,
            color: '#c7b6f7',
            breakEmoji: '🌷',
            focusEmoji: '🐰',
        },
        panda: {
            name: 'Power Panda Mode',
            emoji: '⚡️',
            subtitle: '⚡️ Study Time - Bamboo power! ✨',
            study: 90 * 60,
            break: 20 * 60,
            color: '#b6f7d4',
            breakEmoji: '🎋',
            focusEmoji: '🐼',
        }
    };

    // --- State ---
    let currentMode = null;
    let timer = null;
    let isRunning = false;
    let isBreak = false;
    let timeLeft = 0;
    let sessionsCompleted = 0;
    let sessionGoal = 0;
    let tasks = [];

    // --- Navigation ---
    function showModeSelection() {
        landingPage.style.display = '';
        studySession.style.display = 'none';
    }
    function showSessionUI() {
        landingPage.style.display = 'none';
        studySession.style.display = 'block';
    }

    // --- Mode Selection ---
    document.querySelectorAll('.mode-box').forEach(box => {
        box.addEventListener('click', () => {
            const mode = box.dataset.mode;
            currentMode = mode;
            setupSessionUI(mode);
            showSessionUI();
        });
    });

    // --- Back Home ---
    backHomeBtn.addEventListener('click', () => {
        stopTimer();
        showModeSelection();
    });

    // --- Session UI Setup ---
    function setupSessionUI(mode) {
        const m = MODES[mode];
        sessionModeEmoji.textContent = m.emoji;
        sessionModeName.textContent = m.name;
        sessionSubtitle.textContent = m.subtitle;
        detailsStudy.textContent = `${m.study / 60} min`;
        detailsBreak.textContent = `${m.break / 60} min`;
        sessionTotal.textContent = 0;
        sessionCount.textContent = 0;
        isBreak = false;
        timeLeft = m.study;
        updateSessionTimerDisplay();
        timerState.textContent = 'Focus 🎯';
        timerEmoji.textContent = m.focusEmoji;
        // Reset tasks
        renderTasks();
    }

    // --- Timer Logic ---
    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        sessionStartBtn.textContent = '⏸ Pause';
        timer = setInterval(() => {
            timeLeft--;
            updateSessionTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                if (!isBreak) {
                    // Finished study session
                    sessionsCompleted++;
                    sessionCount.textContent = sessionsCompleted;
                    isBreak = true;
                    timeLeft = MODES[currentMode].break;
                    timerState.textContent = 'Break Time ☕️';
                    timerEmoji.textContent = MODES[currentMode].breakEmoji;
                    sessionStartBtn.textContent = '▶️ Start';
                    alert('Study session complete! Time for a break!');
                } else {
                    // Finished break
                    isBreak = false;
                    timeLeft = MODES[currentMode].study;
                    timerState.textContent = 'Focus 🎯';
                    timerEmoji.textContent = MODES[currentMode].focusEmoji;
                    sessionStartBtn.textContent = '▶️ Start';
                    alert('Break over! Ready to focus again?');
                }
                updateSessionTimerDisplay();
            }
        }, 1000);
    }
    function stopTimer() {
        isRunning = false;
        clearInterval(timer);
        sessionStartBtn.textContent = '▶️ Start';
    }
    function resetTimer() {
        stopTimer();
        if (isBreak) {
            timeLeft = MODES[currentMode].break;
            timerState.textContent = 'Break Time ☕️';
            timerEmoji.textContent = MODES[currentMode].breakEmoji;
        } else {
            timeLeft = MODES[currentMode].study;
            timerState.textContent = 'Focus 🎯';
            timerEmoji.textContent = MODES[currentMode].focusEmoji;
        }
        updateSessionTimerDisplay();
    }
    function updateSessionTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        sessionTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    sessionStartBtn.addEventListener('click', () => {
        if (!isRunning) {
            startTimer();
        } else {
            stopTimer();
        }
    });
    sessionResetBtn.addEventListener('click', resetTimer);

    // --- Tasks Logic ---
    function renderTasks() {
        tasksList.innerHTML = '';
        if (tasks.length === 0) {
            noTasksMsg.style.display = 'flex';
            tasksList.style.display = 'none';
        } else {
            noTasksMsg.style.display = 'none';
            tasksList.style.display = 'block';
            tasks.forEach((task, idx) => {
                const li = document.createElement('li');
                li.className = 'task-item' + (task.completed ? ' completed' : '');
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div class="task-actions">
                        <button class="complete-task-btn">✔️</button>
                        <button class="delete-task-btn">🗑️</button>
                    </div>
                `;
                // Complete
                li.querySelector('.complete-task-btn').onclick = () => {
                    task.completed = !task.completed;
                    updateTaskSessionCount();
                    renderTasks();
                };
                // Delete
                li.querySelector('.delete-task-btn').onclick = () => {
                    tasks.splice(idx, 1);
                    updateTaskSessionCount();
                    renderTasks();
                };
                tasksList.appendChild(li);
            });
        }
        updateTaskSessionCount();
    }
    function updateTaskSessionCount() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        sessionTotal.textContent = total;
        sessionCount.textContent = completed;
    }
    function addTask() {
        const text = prompt('Enter your study task:');
        if (text && text.trim()) {
            tasks.push({ text: text.trim(), completed: false });
            renderTasks();
            updateTaskSessionCount();
        }
    }
    addTaskBtn.addEventListener('click', addTask);
    addFirstTaskBtn.addEventListener('click', addTask);

    // --- Init ---
    showModeSelection();
}); 
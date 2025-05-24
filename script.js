document.addEventListener('DOMContentLoaded', () => {
    const studyModes = document.getElementById('studyModes');
    const timerContainer = document.getElementById('timerContainer');
    const timerDisplay = document.getElementById('timerDisplay');
    const startStopBtn = document.getElementById('startStopBtn');
    const backBtn = document.getElementById('backBtn');

    let timer;
    let timeLeft;
    let isRunning = false;
    let currentMode = null;

    const modeTimes = {
        chill: 25 * 60, // 25 minutes
        regular: 45 * 60, // 45 minutes
        intense: 60 * 60 // 60 minutes
    };

    // Add click event listeners to mode boxes
    document.querySelectorAll('.mode-box').forEach(box => {
        box.addEventListener('click', () => {
            const mode = box.dataset.mode;
            currentMode = mode;
            timeLeft = modeTimes[mode];
            updateTimerDisplay();
            studyModes.style.display = 'none';
            timerContainer.style.display = 'block';
        });
    });

    // Back button functionality
    backBtn.addEventListener('click', () => {
        stopTimer();
        studyModes.style.display = 'grid';
        timerContainer.style.display = 'none';
        currentMode = null;
    });

    // Start/Stop button functionality
    startStopBtn.addEventListener('click', () => {
        if (!isRunning) {
            startTimer();
        } else {
            stopTimer();
        }
    });

    function startTimer() {
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.add('stop');
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Time\'s up! Take a break!');
                resetTimer();
            }
        }, 1000);
    }

    function stopTimer() {
        isRunning = false;
        clearInterval(timer);
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('stop');
    }

    function resetTimer() {
        stopTimer();
        timeLeft = modeTimes[currentMode];
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}); 
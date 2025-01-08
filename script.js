class Stopwatch {
    constructor(displayElement, lapTimesElement) {
        // Core UI Elements
        this.displayElement = displayElement;
        this.lapTimesElement = lapTimesElement;

        // Button References
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');

        // Timer State Management
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.lapTimes = [];
        this.isRunning = false;

        // Initialize Event Listeners and Button States
        this.initializeEventListeners();
        this.updateButtonStates();
    }

    // Precise Time Formatting
    formatTime(milliseconds) {
        const pad = (num) => num.toString().padStart(2, '0');
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = pad(Math.floor(totalSeconds / 3600));
        const minutes = pad(Math.floor((totalSeconds % 3600) / 60));
        const seconds = pad(totalSeconds % 60);
        const centiseconds = pad(Math.floor((milliseconds % 1000) / 10));

        return `${hours}:${minutes}:${seconds}.${centiseconds}`;
    }

    // Start Timer Mechanism
    startTimer() {
        if (this.isRunning) return;

        this.startTime = Date.now() - this.elapsedTime;
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.displayElement.textContent = this.formatTime(this.elapsedTime);
        }, 10);

        this.isRunning = true;
        this.updateButtonStates();
    }

    // Stop Timer Mechanism
    stopTimer() {
        if (!this.isRunning) return;

        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isRunning = false;
        this.updateButtonStates();
    }

    // Reset Timer and Lap Times
    resetTimer() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.displayElement.textContent = '00:00:00.00';
        this.lapTimes = [];
        this.lapTimesElement.innerHTML = '';
        this.updateButtonStates();
    }

    // Record Lap Times
    recordLap() {
        if (!this.isRunning) return;

        const lapTime = this.formatTime(this.elapsedTime);
        this.lapTimes.push(lapTime);

        const lapElement = document.createElement('div');
        lapElement.classList.add('lap-time-item');
        lapElement.innerHTML = `
    <span>Lap ${this.lapTimes.length}</span>
    <span>${lapTime}</span>
`;

        this.lapTimesElement.insertBefore(lapElement, this.lapTimesElement.firstChild);
        this.lapTimesElement.scrollTop = 0;
    }

    // Dynamic Button State Management
    updateButtonStates() {
        this.startBtn.disabled = this.isRunning;
        this.stopBtn.disabled = !this.isRunning;
        this.resetBtn.disabled = this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
    }

    // Event Listener Configuration
    initializeEventListeners() {
        // Touch and Click Support
        const addTouchClick = (element, handler) => {
            element.addEventListener('click', handler);
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handler();
            }, { passive: false });
        };

        addTouchClick(this.startBtn, () => this.startTimer());
        addTouchClick(this.stopBtn, () => this.stopTimer());
        addTouchClick(this.resetBtn, () => this.resetTimer());
        addTouchClick(this.lapBtn, () => this.recordLap());
    }
}

// Initialize Stopwatch on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('timeDisplay');
    const lapTimes = document.getElementById('lapTimes');
    new Stopwatch(timeDisplay, lapTimes);
});
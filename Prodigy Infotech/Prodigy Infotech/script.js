document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapTimesContainer = document.getElementById('lapTimes');
    
    // Variables
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapCount = 0;
    
    // Format time as HH:MM:SS.MS
    function formatTime(timeInMs) {
        const ms = String(Math.floor((timeInMs % 1000) / 10)).padStart(2, '0');
        const seconds = String(Math.floor((timeInMs / 1000) % 60)).padStart(2, '0');
        const minutes = String(Math.floor((timeInMs / (1000 * 60)) % 60)).padStart(2, '0');
        const hours = String(Math.floor(timeInMs / (1000 * 60 * 60))).padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }
    
    // Update display
    function updateDisplay() {
        const currentTime = Date.now() - startTime + elapsedTime;
        display.textContent = formatTime(currentTime);
    }
    
    // Start timer
    function startTimer() {
        if (!isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            
            startTime = Date.now();
            timerInterval = setInterval(updateDisplay, 10);
            isRunning = true;
            
            // Add pulse animation to display
            display.classList.add('pulse');
            
            // Change start button to lap button
            startBtn.textContent = 'Lap';
            startBtn.classList.remove('start');
            startBtn.classList.add('lap');
            startBtn.disabled = false;
            
            // Change start button functionality to record lap
            startBtn.removeEventListener('click', startTimer);
            startBtn.addEventListener('click', recordLap);
        }
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        isRunning = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Remove pulse animation
        display.classList.remove('pulse');
        
        // Change lap button back to start
        startBtn.textContent = 'Resume';
        
        // Change lap button functionality back to start
        startBtn.removeEventListener('click', recordLap);
        startBtn.addEventListener('click', startTimer);
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        
        display.textContent = '00:00:00.00';
        lapTimesContainer.innerHTML = '';
        lapCount = 0;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        
        // Remove pulse animation
        display.classList.remove('pulse');
        
        // Change lap button back to start
        startBtn.textContent = 'Start';
        startBtn.classList.remove('lap');
        startBtn.classList.add('start');
        
        // Change lap button functionality back to start
        startBtn.removeEventListener('click', recordLap);
        startBtn.addEventListener('click', startTimer);
    }
    
    // Record lap time
    function recordLap() {
        if (isRunning) {
            const currentTime = Date.now() - startTime + elapsedTime;
            const formatted = formatTime(currentTime);
            
            // Create lap element
            lapCount++;
            const lapElement = document.createElement('div');
            lapElement.classList.add('lap-time', 'new');
            
            const lapNumber = document.createElement('span');
            lapNumber.textContent = `Lap ${lapCount}`;
            
            const lapTime = document.createElement('span');
            lapTime.textContent = formatted;
            
            lapElement.appendChild(lapNumber);
            lapElement.appendChild(lapTime);
            
            // Add to container at the top
            lapTimesContainer.insertBefore(lapElement, lapTimesContainer.firstChild);
            
            // Apply highlight animation
            setTimeout(() => {
                lapElement.classList.remove('new');
            }, 1000);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Button press effects
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95) translateY(2px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});
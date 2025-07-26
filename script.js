// Timer variables
let minutes = 1;
let seconds = 0;
let timerId;
let isRunning = false;

// Session counters
let workSessions = 0;       // Tracks number of Pomodoro work sessions
let shortBreaks = 0;        // Tracks short breaks taken
let longBreaks = 0;         // Tracks long breaks taken

/******************************TIMER DISPLAY******************************/
function displayTimer (){
    // (seconds < 10 ? '0' : '') + seconds => if the second goes down 10 like 7 this is gone add 0 infront resulting 07
    document.querySelector("#time").textContent = `${(minutes < 10 ? '0' : '') + minutes} : ${(seconds < 10 ? '0' : '') + seconds}`;
}

/*******************************SESSION DISPLAY*******************************/
// Updates the on-screen counter showing sessions and breaks taken
function updateSessionDisplay() {
    document.getElementById('session-info').textContent =
    `Sessions: ${workSessions} | Short Breaks: ${shortBreaks} | Long Breaks: ${longBreaks}`;
}

/*******************************COUNTDOWN*******************************/
// This function decreases the timer every second, updating seconds and minutes accordingly. 
// When seconds reach 0, it decreases the minutes by 1 and resets seconds to 59. 
// It continues until both minutes and seconds reach 0.
function decreaseTime(){
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timerId);            
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
        console.log(seconds);
    }
}

/************Toggle between START and PAUSE on the same button************/
const startPomodoro = document.getElementById('start');
startPomodoro.addEventListener('click', () => {
    if(!isRunning){
         isRunning = true;
         startPomodoro.textContent= 'Pause';
         console.log(`before start`);
         startTimer();         
    }else {
        isRunning = false;
        startPomodoro.textContent= 'Start';
        pauseTimer();
    }
});

/*******************************START*******************************/
function startTimer(){
    clearInterval(timerId); // Always clear first to avoid double intervals
    // Start the timer and run this function every 1000 milliseconds (1 second) 
    timerId = setInterval( () => {
        decreaseTime();   // Decrease the timer by 1 second
        displayTimer();   // Update the timer display on the screen
        // If the timer reaches 0 minutes and 0 seconds, stop the timer
        if (minutes === 0 && seconds === 0) {
            clearInterval(timerId); // Stop the interval loop (timer)
            isRunning =false; // Update status to show timer is no longer running
            startPomodoro.textContent = 'Start';// Change button text back to "Start"
            workSessions++;
            updateSessionDisplay();
        }
    }, 1000); // This function runs once per second    
}

/*******************************PAUSE*******************************/
// Function to pause the timer
function pauseTimer(){  
        clearInterval(timerId); // Stop the interval loop (pause the timer)      
    }

/*******************************RESET*******************************/
//Claire: I actually think it's fine to always reset back to 25 (and not 5 or 15 during breaks)? Like it makes more sense?
const resetPomodoro = document.getElementById('reset');
resetPomodoro.addEventListener('click', () => {    
        startPomodoro.textContent = 'Start';// Change button text back to "Start"        
        clearInterval(timerId); //stops the timer loop
        isRunning = false; //this is optional, just security
        minutes = 25; //resets minutes
        seconds = 0; //resets seconds
        displayTimer(); //refreshes the display
        updateSessionLabel('Pomodoro'); //call session label function, updating text of label to Pomodoro
        // Re-enable break buttons after reset
        shortPomodoroBreak.disabled = false;
        longPomodoroBreak.disabled = false;       
        // Reset session counters
	        workSessions = 0;
	        shortBreaks = 0;
	        longBreaks = 0;
	        updateSessionDisplay();
  
});

/*******************************BREAKS*******************************/
function startBreak(breakMinutes, breakButton){
    breakButton.disabled = true; //disables the short break button
    clearInterval(timerId); //stops the timer loop if it's running
    //once it's cleared the following happens:
    isRunning = false; //avoids auto-start
    minutes = breakMinutes; //update the value of the variable 
    seconds = 0;
    updateSessionLabel('Break'); //call session label function, updating text of label to Break
    displayTimer(); //shows breakMinutes set timer
    // Count the right type of break
    if (breakMinutes === 1) shortBreaks++;
    else if (breakMinutes === 15) longBreaks++;
    updateSessionDisplay();

    startPomodoro.textContent = 'Start'; //shows start until clicked
}
/***************************5-MINUTES BREAK***************************/
const shortPomodoroBreak = document.getElementById('short-break');
shortPomodoroBreak.addEventListener('click', () => {
    startBreak(1, shortPomodoroBreak); // 5 minutes for short break    
});

/**************************15-MINUTES BREAK**************************/
const longPomodoroBreak = document.getElementById('long-break');
longPomodoroBreak.addEventListener('click', () => {
    startBreak(15, longPomodoroBreak); // 15 minutes for long break  
});

/***************************LABEL SESSION***************************/
//Update the text of the label depending on the session
function updateSessionLabel(mode) {
    const label = document.getElementById('session-label');
    label.textContent = mode; //getting the text content of the div => the 'mode' parameter is updated in the reset and break functions

    //toggling the class of the div depending on the session
    if (mode === 'Break') {label.classList.add('break');} 
    else {label.classList.remove('break');}
}

/************************DROPDOWN TOGGLE THEME************************/
document.getElementById("toggle-theme").addEventListener("click", () => {
    const dropdown = document.getElementById("bg-selector"); //fetching background selector div
    dropdown.style.display = (dropdown.style.display === "none") ? "block" : "none"; //ternary operator => if not visible, then display in block
});

// Timer variables
let minutes = 25; 
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

/*******************************ALARM SOUND*******************************/
// This function plays an alarm sound when the timer ends.
// Maps the dropdown values to sound file paths
const soundOptions = {
    bell: "sounds/bell.mp3",
    calm: "sounds/calm-simple-and-clean-piano-and-bass.mp3",
    classic: "sounds/notification.mp3"
};
// Plays the selected alarm sound when a timer ends
function playAlarm() {
    const selectedSound = document.getElementById("alarm-sound").value; // Get user choice
    const soundSrc = soundOptions[selectedSound]; // Get file path
    const audio = new Audio(soundSrc);
    audio.play().catch(err => console.warn("Audio play failed:", err)); // Safe play attempt
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
        clearInterval(timerId);// Stop the interval loop (timer)
        isRunning = false;// Update status to show timer is no longer running
        playAlarm(); // Play the alarm sound when the timer ends
        startPomodoro.textContent = 'Start';// Change button text back to "Start"

        const currentLabel = document.getElementById('session-label').textContent;

        if (currentLabel === 'Break') {
            // If we were on a break, switch to Pomodoro mode
            updateSessionLabel('Pomodoro');
            minutes = 25;
            seconds = 0;
            displayTimer();
        } else {
            // If we were on a Pomodoro session, increment counter
            workSessions++;
        }

        updateSessionDisplay();

        // Re-enable break buttons
        shortPomodoroBreak.disabled = false;
        longPomodoroBreak.disabled = false;
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
    if (breakMinutes === 5) shortBreaks++;
    else if (breakMinutes === 15) longBreaks++;
    updateSessionDisplay();

    startPomodoro.textContent = 'Start'; //shows start until clicked
}
/***************************5-MINUTES BREAK***************************/
const shortPomodoroBreak = document.getElementById('short-break');
shortPomodoroBreak.addEventListener('click', () => {
    startBreak(5, shortPomodoroBreak); // 5 minutes for short break    
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
/**********************BACKGROUND THEME SELECTION**********************/
const themeSelector = document.getElementById("bg-theme"); //fetching the dropdown for theme selection
const body = document.body;
//adding event listener on "change" event => it triggers when the element value (in the select tag) is changed
themeSelector.addEventListener("change", () => {
    const selectedTheme = themeSelector.value; //fetching the value selected in dropdown

    //removing any previously applied background class
    body.classList.remove("bg-scifi", "bg-hp-night", "bg-lotr-day", "bg-hg-day", "bg-hp-day", "bg-starwars-sunset");

    //applying the selected background class
    body.classList.add(`bg-${selectedTheme}`); //changing the class in HTML, which triggers the corresponding style in CSS (linking to the right background picture)
});



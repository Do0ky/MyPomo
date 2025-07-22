let minutes = 25;
let seconds = 0;
let timerId;
let isRunning = false;


/*******************************TIMER DISPLAY*******************************/
function displayTimer (){
    // (seconds < 10 ? '0' : '') + seconds => if the second goes down 10 like 7 this is gone add 0 infront resulting 07
    document.querySelector("#time").textContent = `${(minutes < 10 ? '0' : '') + minutes} : ${(seconds < 10 ? '0' : '') + seconds}`;
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

/*******************************Toggle between START and PAUSE on the same button*******************************/
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
        }
    }, 1000); // This function runs once per second    
}

/*******************************PAUSE*******************************/
// Function to pause the timer
function pauseTimer(){  
        clearInterval(timerId); // Stop the interval loop (pause the timer)      
    }

/*******************************RESET*******************************/
const resetPomodoro = document.getElementById('reset');
resetPomodoro.addEventListener('click', () => {    
        startPomodoro.textContent = 'Start';// Change button text back to "Start"        
        clearInterval(timerId); //stops the timer loop
        isRunning = false; //this is optional, just security
        minutes = 25; //resets minutes
        seconds = 0; //resets seconds
        displayTimer(); //refreshes the display  
        // Re-enable break buttons after reset
        shortPomodoroBreak.disabled = false;
        longPomodoroBreak.disabled = false;         
});

function startBreak(breakMinutes, breakButton){
    breakButton.disabled = true; //disables the short break button
    
    if (isRunning) clearInterval(timerId); //stops the timer loop if it's running
    //once it's cleared the following happens:
    isRunning = true; //security check
    minutes = breakMinutes; //update the value of the variable 
    seconds = 0;
    displayTimer(); //shows breakMinutes set timer
    startPomodoro.textContent = 'Pause';
    startTimer();
}
/***************************5-MINUTES BREAK***************************/
//Note: this way our break can only be activated IF the session is/has been running
//Later we may consider making reset work when the break is on, to reset to 05 : 00
const shortPomodoroBreak = document.getElementById('short-break');
shortPomodoroBreak.addEventListener('click', () => {
    startBreak(5, shortPomodoroBreak); // 5 minutes for short break    
});

/***************************15-MINUTES BREAK***************************/
//Note: this way our break can only be activated IF the session is/has been running
//Later we may consider making reset work when the break is on, to reset to 15 : 00
const longPomodoroBreak = document.getElementById('long-break');
longPomodoroBreak.addEventListener('click', () => {
    startBreak(15, longPomodoroBreak); // 15 minutes for long break  
});
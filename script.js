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

/*******************************START*******************************/
const startPomodoro = document.getElementById('start');
startPomodoro.addEventListener('click', start);

function start(){
    if (!isRunning) {
        isRunning = true;
        document.querySelector("#start").disabled = true; // Disables the Start button after it's clicked and keeps it disabled until the timer finishes
        timerId = setInterval( () => {
            decreaseTime();
            displayTimer();
            if (minutes === 0 && seconds === 0) {
                clearInterval(timerId);
                document.querySelector("#start").disabled = false;
            }
        }, 1000);
    }
}

/*******************************PAUSE*******************************/
const pausePomodoro = document.getElementById('pause');
pausePomodoro.addEventListener('click', () => { 
    clearInterval(timerId);
});

/*******************************RESET*******************************/
const resetPomodoro = document.getElementById('reset');
resetPomodoro.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerId); //stops the timer loop
        isRunning = false; //this is optional, just security
        minutes = 25; //resets minutes
        seconds = 0; //resets seconds
        displayTimer(); //refreshes the display
        document.querySelector("#start").disabled = false; //re-enable the start button
    }
});

/***************************5-MINUTES BREAK***************************/
//Note: this way our break can only be activated IF the session is/has been running
//Later we may consider making reset work when the break is on, to reset to 05 : 00
const shortPomodoroBreak = document.getElementById('short-break');
shortPomodoroBreak.addEventListener('click', () => {
    document.querySelector("#short-break").disabled = true; //disables the short break button
    
    if (isRunning) {
        clearInterval(timerId); //stops the timer loop if it's running
    }
    //once it's cleared the following happens:
    isRunning = true; //security check
    minutes = 5; //update the value of the variable 
    seconds = 0;
    displayTimer(); //shows directly 05:00

    timerId = setInterval( () => {
            decreaseTime();
            displayTimer();
            if (minutes === 0 && seconds === 0) {
                clearInterval(timerId);
                isRunning = false; //this is optional, just security
                document.querySelector("#short-break").disabled = false; //re-enable the break button
                document.querySelector("#start").disabled = false; //re-enable the start button
            }
        }, 1000);
});

/***************************15-MINUTES BREAK***************************/
//Note: this way our break can only be activated IF the session is/has been running
//Later we may consider making reset work when the break is on, to reset to 15 : 00
const longPomodoroBreak = document.getElementById('long-break');
longPomodoroBreak.addEventListener('click', () => {
    document.querySelector("#long-break").disabled = true; //disables the short break button
    
    if (isRunning) {
        clearInterval(timerId); //stops the timer loop if it's running
    }
    //once it's cleared the following happens:
    isRunning = true; //security check
    minutes = 15; //update the value of the variable 
    seconds = 0;
    displayTimer(); //shows directly 05:00

    timerId = setInterval( () => {
            decreaseTime();
            displayTimer();
            if (minutes === 0 && seconds === 0) {
                clearInterval(timerId);
                isRunning = false; //this is optional, just security
                document.querySelector("#short-break").disabled = false; //re-enable the break button
                document.querySelector("#start").disabled = false; //re-enable the start button
            }
        }, 1000);
});
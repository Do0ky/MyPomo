let minutes = 25;
let seconds = 0;
let timerId;
let isRunning = false;
// a function that displays the timer
function displayTimer (){
// (seconds < 10 ? '0' : '') + seconds => if the second goes down 10 like 7 this is gone add 0 infront resulting 07   
document.querySelector("#time").textContent = `${minutes} : ${(seconds < 10 ? '0' : '') + seconds}`;
}

// This function decreases the timer every second, updating seconds and minutes accordingly. 
// When seconds reach 0, it decreases the minutes by 1 and resets seconds to 59. 
// It continues until both minutes and seconds reach 0.
function decreaseTime(){
    if (seconds === 0){
        if (minutes === 0){
            clearInterval(timerId);
            return;
        }
        minutes--;
        seconds = 59;
    }else {
        seconds--;
        console.log(seconds);
    }
}
const startPomodoro = document.getElementById('start');
startPomodoro = document.addEventListener('click', start);

function start(){
// This disables the Start button after it's clicked and keeps it disabled until the timer finishes.
if (!isRunning) {
    isRunning = true;
    document.querySelector("#start").disabled = true;
    timerId = setInterval(( ) =>{
        decreaseTime();
        displayTimer();
        if(minutes === 0 && seconds === 0){
            clearInterval(timerId);
            document.querySelector("#start").disabled = false;
        }
    }, 1000);
} 
}

const pausePomodoro = document.getElementById('pause');
pausePomodoro.addEventListener('click', () => { 
    clearInterval(timerId);
});
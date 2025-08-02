/********TIMER VARIABLES********/
let minutes = 25;
let seconds = 0;
let timerId;
let isRunning = false;

/********SESSION COUNTER********/
let workSessions = 0;
let shortBreaks = 0;
let longBreaks = 0;

/********DOM COMPONENTS********/
// Timer & Session Display
const timeDisplay = document.querySelector("#time");
const sessionLabel = document.getElementById("session-label");
const sessionInfo = document.getElementById("session-info");

// Control Buttons
const startPomodoro = document.getElementById("start");
const resetPomodoro = document.getElementById("reset");
const shortPomodoroBreak = document.getElementById("short-break");
const longPomodoroBreak = document.getElementById("long-break");

// Alarm Dropdown
const alarmToggle = document.getElementById("alarm-toggle");
const alarmOptions = document.getElementById("alarm-options");

// Theme Dropdown
const themeToggle = document.getElementById("toggle-theme");
const themeOptions = document.querySelector(".bg-options");
const themeItems = document.querySelectorAll(".bg-options li");


/******************************TIMER DISPLAY******************************/
function displayTimer() {
  timeDisplay.textContent = `${(minutes < 10 ? '0' : '') + minutes} : ${(seconds < 10 ? '0' : '') + seconds}`;
  // ternary operator: if the minutes or seconds are < 10, adds 0 in front of it. e.g.: 7 => displays 07
}

/*******************************SESSION DISPLAY*******************************/
// Updates the on-screen counter showing sessions and breaks taken
function updateSessionDisplay() {
  sessionInfo.textContent = `Sessions: ${workSessions} | Short Breaks: ${shortBreaks} | Long Breaks: ${longBreaks}`;
}

/************************************ALARM************************************/
                          // ALARM DROPDOWN TOGGLE
// This plays an alarm sound when the timer ends
// Maps the dropdown values to sound file paths
// Available sounds
const soundOptions = {
  bell: "sounds/bell.mp3",
  calm: "sounds/calm-simple-and-clean-piano-and-bass.mp3",
  classic: "sounds/notification.mp3"
};

let currentAudio = null; // Holds the current audio object for control

// Toggle dropdown menu visibility when bell icon is clicked
alarmToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent this click from triggering the document click listener
  const isVisible = alarmOptions.style.display === "block";
  alarmOptions.style.display = isVisible ? "none" : "block";
});
// Hide dropdown menu if the user clicks anywhere outside of it
document.addEventListener("click", (e) => {
  const isClickInsideToggle = alarmToggle.contains(e.target);
  const isClickInsideMenu = alarmOptions.contains(e.target);
  if (!isClickInsideToggle && !isClickInsideMenu) {alarmOptions.style.display = "none";}
});

                          // ALARM SOUND SELECTION
// Sound selection and playback
alarmOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
      const selectedSound = e.target.getAttribute("data-sound");
      const soundSrc = soundOptions[selectedSound];
    if (!soundSrc) {
        console.warn("No sound source found for:", selectedSound);
        return;}
    // Stop any currently playing audio
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;}
    // Play the newly selected sound
    currentAudio = new Audio(soundSrc);
    currentAudio.play().catch(err => console.warn("Audio play failed:", err));
    // Optionally hide dropdown after selection
    alarmOptions.style.display = "none";
  }
});

/*******************************COUNTDOWN*******************************/
// This function decreases the timer every second, updating seconds and minutes accordingly
function decreaseTime() {
  // When seconds reach 0, decreases minutes by 1 and resets seconds to 59
  if (seconds === 0) {
    if (minutes === 0) {clearInterval(timerId);
      return;}
    minutes--;
    seconds = 59;}
    else {seconds--;}
} // Continues until both minutes and seconds reach 0

/**************************START / PAUSE TOGGLE**************************/
startPomodoro.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    startPomodoro.textContent = 'Pause';
    startTimer();}
  else {
    isRunning = false;
    startPomodoro.textContent = 'Start';
    pauseTimer();}
});

/******************************START TIMER******************************/
function startTimer() {
  clearInterval(timerId);  // Always clear first to avoid double intervals

  timerId = setInterval(() => {
    decreaseTime(); // Decrease the timer by 1 second
    displayTimer(); // Update the timer display on the screen
    // If the timer reaches 0 minutes and 0 seconds, stop the timer
    if (minutes === 0 && seconds === 0) {
      clearInterval(timerId); // Stop the interval loop (timer)
      isRunning = false; // Update status to show timer is no longer running
      playAlarm(); // Play the alarm sound when the timer ends
      startPomodoro.textContent = 'Start'; // Change button text back to "Start"

      const currentLabel = sessionLabel.textContent;

      if (currentLabel === 'Break') {
        // If we were on a break, switch to Pomodoro mode
        updateSessionLabel('Work');
        minutes = 25;
        seconds = 0;
        displayTimer();}
      else {workSessions++;} // If we were on a Pomodoro session, increment counter

      updateSessionDisplay();
      // Re-enable break buttons
      shortPomodoroBreak.disabled = false;
      longPomodoroBreak.disabled = false;
    }
  }, 1000); // Start the timer and run this function every 1000 milliseconds (1 second) 
}

/******************************PAUSE TIMER******************************/
function pauseTimer() {
  clearInterval(timerId);
}

/******************************RESET TIMER******************************/
resetPomodoro.addEventListener('click', () => {
  startPomodoro.textContent = 'Start'; // Change button text back to "Start" 
  clearInterval(timerId); // Stop the timer loop
  isRunning = false; //this is optional, just security
  minutes = 25; //reset minutes
  seconds = 0;//reset seconds 
  displayTimer(); //refresh the display
  updateSessionLabel('Work'); //call session label function, updating text of label
  shortPomodoroBreak.disabled = false; //Re-enable break buttons after reset
  longPomodoroBreak.disabled = false;
  workSessions = 0; //reset session counters
  shortBreaks = 0;
  longBreaks = 0;
  updateSessionDisplay();
});

/*******************************BREAKS*******************************/
function startBreak(breakMinutes, breakButton) {
  breakButton.disabled = true;
  clearInterval(timerId); //stops the timer loop if it's running
  isRunning = false; //avoids auto-start
  minutes = breakMinutes; //updates the value of the variable 
  seconds = 0;
  updateSessionLabel('Break'); //call session label function, updating text of label to Break
  displayTimer();

  if (breakMinutes === 5) shortBreaks++;
  else if (breakMinutes === 15) longBreaks++;

  updateSessionDisplay();
  startPomodoro.textContent = 'Start'; //displays start until clicked
}

/****************************5-MINUTES BREAK****************************/
shortPomodoroBreak.addEventListener("click", () => {
  startBreak(5, shortPomodoroBreak);
});

/***************************15-MINUTES BREAK***************************/
longPomodoroBreak.addEventListener("click", () => {
  startBreak(15, longPomodoroBreak);
});

/*************************UPDATE SESSION LABEL*************************/
function updateSessionLabel(mode) {
  sessionLabel.textContent = mode; //getting the text content of the div => the 'mode' parameter is updated in the reset and break functions
  //toggling the class of the div depending on the session
  if (mode === 'Break') {sessionLabel.classList.add('break');} 
  else {sessionLabel.classList.remove('break');}
}

/********************************THEME********************************/
                          // THEME TOGGLE
themeToggle.addEventListener("click", () => {
  themeOptions.style.display = (themeOptions.style.display === "none") ? "block" : "none"; //ternary operator => if not visible, then display in block
});

                          // THEME SELECTION
window.addEventListener("DOMContentLoaded", () => {applyTheme("scifi");}); //apply default theme
//go through the list and add an event listener on each item
themeItems.forEach((item) => {
  item.addEventListener("click", () => {
      const theme = item.getAttribute("data-value");
      applyTheme(theme);
  });
});

function applyTheme(theme) {
  document.body.classList.remove("bg-scifi", "bg-hp-night", "bg-lotr-light", "bg-hg-light"); //Remove any previous theme classes
  document.body.classList.add(`bg-${theme}`); //Add the selected theme class
}

                  // HIDE THEME DROPDOWN ON OUTSIDE CLICK
document.addEventListener("click", (e) => {
  const clickedInsideToggle = themeToggle.contains(e.target);
  const clickedInsideMenu = themeOptions.contains(e.target);
  if (!clickedInsideToggle && !clickedInsideMenu) {
    themeOptions.style.display = "none";
  }
});

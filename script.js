/********SESSION COUNTER********/
let workSessions = 0;
let shortBreaks = 0;
let longBreaks = 0;

/********DOM REFERENCES********/
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


/************************************TIMER MODULE************************************/
/***********************************POMODORO CLASS***********************************/
class Pomodoro {
  constructor(minutes = 25, seconds = 0) {
    this.minutes = minutes;
    this.seconds = seconds;
    this.isRunning = false;
    this.timerId = null;
  }

  /******************************START TIMER******************************/
  start(callbackOnFinish) {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timerId = setInterval(() => {
      this.decreaseTime();
      displayTimer(this.minutes, this.seconds);

      if (this.minutes === 0 && this.seconds === 0) {
        this.stop();
        playAlarm();
        if (typeof callbackOnFinish === "function") {callbackOnFinish();}
      }

    }, 1000);
  }

  /******************************PAUSE TIMER******************************/
  pause() {
    clearInterval(this.timerId);
    this.isRunning = false;
  }

  /******************************STOP TIMER******************************/
  stop() {
    clearInterval(this.timerId);
    this.isRunning = false;
  }

  /******************************RESET TIMER******************************/
  reset(minutes = 25, seconds = 0) {
    this.stop();
    this.minutes = minutes;
    this.seconds = seconds;
    displayTimer(this.minutes, this.seconds);
  }

  /*******************************COUNTDOWN*******************************/
  decreaseTime() {
    if (this.seconds === 0) {
      if (this.minutes === 0) return;
      this.minutes--;
      this.seconds = 59;}
    else {this.seconds--;}
  }
}


/******************************TIMER DISPLAY******************************/
function displayTimer(min, sec) {
  timeDisplay.textContent = `${(min < 10 ? '0' : '') + min} : ${(sec < 10 ? '0' : '') + sec}`;
  // ternary operator: if the minutes or seconds are < 10, adds 0 in front of it. e.g.: 7 => displays 07
}

/****************************POMODORO INSTANCES****************************/
let currentSession = new Pomodoro(25, 0); //Default work session

const workSession = () => new Pomodoro(25, 0);
const shortBreak = () => new Pomodoro(5, 0);
const longBreak = () => new Pomodoro(15, 0);

/***************************HANDLING SESSION END***************************/
function handleSessionEnd() {
  startPomodoro.textContent = "Start";
  const currentLabel = sessionLabel.textContent;

  if (currentLabel === "Break") {
    currentSession = workSession();
    updateSessionLabel("Work");
    displayTimer(currentSession.minutes, currentSession.seconds);} 
  else {workSessions++;}

  updateSessionDisplay();
  shortPomodoroBreak.disabled = false;
  longPomodoroBreak.disabled = false;
}

/*************************************UI MODULE*************************************/
/******************************RESET BUTTON******************************/
resetPomodoro.addEventListener("click", () => {
  currentSession.reset();
  startPomodoro.textContent = "Start";
  updateSessionLabel("Work");
  shortPomodoroBreak.disabled = false;
  longPomodoroBreak.disabled = false;
  workSessions = 0;
  shortBreaks = 0;
  longBreaks = 0;
  updateSessionDisplay();
});

/**************************START / PAUSE BUTTON**************************/
startPomodoro.addEventListener("click", () => {
  if (!currentSession.isRunning) {
    currentSession.start( () => {
      handleSessionEnd();
    });
    startPomodoro.textContent = "Pause";}
  else {
    currentSession.pause();
    startPomodoro.textContent = "Start";}
});

/****************************5-MIN BREAK BUTTON****************************/
shortPomodoroBreak.addEventListener("click", () => {
  currentSession.stop();
  currentSession = shortBreak();
  updateSessionLabel("Break");
  displayTimer(currentSession.minutes, currentSession.seconds);
  shortBreaks++;
  updateSessionDisplay();
  startPomodoro.textContent = "Start";
  shortPomodoroBreak.disabled = true;
});

/****************************15-MIN BREAK BUTTON****************************/
longPomodoroBreak.addEventListener("click", () => {
  currentSession.stop();
  currentSession = longBreak();
  updateSessionLabel("Break");
  displayTimer(currentSession.minutes, currentSession.seconds);
  longBreaks++;
  updateSessionDisplay();
  startPomodoro.textContent = "Start";
  longPomodoroBreak.disabled = true;
});

/****************************LABEL WORK / BREAK****************************/
function updateSessionLabel(mode) {
  sessionLabel.textContent = mode; //getting the text content of the div => the 'mode' parameter is updated in the reset and break functions
  //toggling the class of the div depending on the session
  if (mode === 'Break') {sessionLabel.classList.add('break');} 
  else {sessionLabel.classList.remove('break');}
}

/*************************DISPLAY NUMBER OF SESSIONS************************/
// Updates the on-screen counter showing sessions and breaks taken
function updateSessionDisplay() {
  sessionInfo.textContent = `Sessions: ${workSessions} | Short Breaks: ${shortBreaks} | Long Breaks: ${longBreaks}`;
}

/***********************************THEME***********************************/
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


/***********************************SETTINGS MODULE***********************************/
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
var pattern = [0, 0, 0, 0, 0];
var prog = 0;
var playing = false;
var soundPlaying = false;
var guessCounter = 0;
var volume = 0.4;
const HOLD = 1000;
const PAUSE = 350;
const WAIT = 1000;

function start() {
  prog = 0;
  playing = true;
  var i = 0;
  for(i = 0; i < pattern.length; i++) {
    pattern[i] = Math.floor(Math.random() * 4) + 1;
  }

  document.getElementById("start").classList.add("hidden");
  document.getElementById("stop").classList.remove("hidden");
  playClueSequence();
}

function stop() {
  playing = false;
  document.getElementById("start").classList.remove("hidden");
  document.getElementById("stop").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

// Sound Synthesis Functions
const freqMap = {
  1: 270,
  2: 340,
  3: 400,
  4: 530
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  soundPlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!soundPlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    soundPlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  soundPlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function playSingleClue(btn) {
  if (playing) {
    lightButton(btn);
    playTone(btn, HOLD);
    setTimeout(clearButton, HOLD, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = WAIT; //set delay to initial wait time
  for (let i = 0; i <= prog; i++) {
    // for ea                   // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += HOLD;
    delay += PAUSE;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!playing) {
    return;
  }
  if(pattern[guessCounter] == btn) {
    if(guessCounter == prog) {
      if(prog == pattern.length - 1) {
        winGame();
      }
      else {
        prog++;
        playClueSequence();
      }
    }
    else {
      guessCounter++;
    }
  }
  else {
      loseGame();
  }

}

function loseGame() {
  stop();
  alert("Game Over. You lost.");
}

function winGame() {
  stop();
  alert("Game over. You won!");
}

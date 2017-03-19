let styles = require('../styles/main.scss');
import Fretboard from './fretboard.js';



// Initialize Fretboard
let fretBoard = new Fretboard({
  numFrets: 17,
  numStrings: 6,
  tuning: 'guitar'
});


let toggle = document.getElementById('toggleControls');
let isControlActive = false;

toggle.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Toggle Click')
  let controls = document.getElementById('controls');

  if (isControlActive) {
    controls.classList.remove('active')
  } else {
    controls.classList.add('active')
  }
  isControlActive = !isControlActive;
});


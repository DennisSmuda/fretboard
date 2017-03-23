let styles = require('../styles/main.scss');
import Fretboard from './fretboard.js';

console.log(styles);


(() => {
  console.log('Document Load');
  console.log(window.getComputedStyle(document.getElementById('root')).backgroundColor)
})();

// Initialize Fretboard
let fretBoard = new Fretboard({
  numFrets: 15,
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

window.addEventListener('resize', () => {
  fretBoard.updateSize();
  fretBoard.init();
  console.log("Resize");
});

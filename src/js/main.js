let styles = require('../styles/main.scss');
import Fretboard from './fretboard.js';

/**
 * Main Entry
 */
(() => {
  let toggle = document.getElementById('toggleControls');
  let isControlActive = false;

  // Initialize Fretboard
  let fretBoard = new Fretboard({
    numFrets: 15,
    numStrings: 6,
    tuning: 'guitar'
  });

  // Toggle Control Sidebar
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

  // Update Fretboard to fit Container
  window.addEventListener('resize', () => {
    fretBoard.updateSize();
    fretBoard.init();
  });

})();


let tonal = require('tonal');
let fret = require('tonal-fretboard');

/** Fretboard Class */
export default class Fretboard {
  /**
   * Fretboard Constructor
   * @constructor (Standard Tuning E Major Scale)
   * @property {number} numFrets - Amount of Frets to display
   * @property {number} numStrings - Amount of strings
   * @property {string} tuning - Tuning: See tonal api docs
   */
  constructor({
    numFrets   = 13,
    numStrings = 6,
    tuning     = 'guitar',
    scale      = 'E major'
  }) {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('fretboard');
    this.ctx = this.canvas.getContext('2d');
    this.scaleSelect = document.getElementById('scaleSelect');
    this.keySelect = document.getElementById('keySelect');

    this.tuning = tuning;

    // Frets
    this.numFrets = numFrets;
    this.zeroFretOffset = 15;

    this.updateSize();

    // Strings
    this.numStrings = numStrings;
    this.stringPadding = this.height / 10;
    this.stringHeight = 0;

    // Notes
    this.numNotes = this.numFrets * this.numStrings;
    this.notes = [this.numNotes];

    // Get Scale Notes from tonal
    this.scales = tonal.scale.names();
    this.keynotes = ['E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb'];
    this.currentScaleName = scale;
    this.currentScale = tonal.scale(scale);
    this.board = fret.notes(this.tuning, 0, this.numFrets, this.currentScale);
    this.rootnote = this.currentScale[0];
    this.third = this.currentScale[2];
    this.fifth = this.currentScale[4];
    this.seven = this.currentScale[6];
    this.colors = {
      rootColor: null,
      thirdColor: null,
      fifthColor: null,
      sevenColor: null,
    };

    this.getColors();
    this.init();
    this.initUi();

  }

  /**
   * Initialize Select Elements with Data from Tonal
   * and setup Event Listeners
   */
  initUi() {
    this.scales.forEach((scale, i) => {
      let option = document.createElement('option');
      option.value = scale;
      option.innerHTML = scale;
      this.scaleSelect.appendChild(option);
    });

    this.keynotes.forEach((key, i) => {
      let option = document.createElement('option');
      option.value = key;
      option.innerHTML = key;
      this.keySelect.appendChild(option);
    });

    this.scaleSelect.onchange = (el) => {
      this.changeScale();
    };
    this.keySelect.onchange = (el) => {
      this.changeScale();
    };
  }

  /**
   * Change Scale Notes+Key+Colors every time
   * a select element fires 'onchange'
   */
  changeScale() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let newScale = `${this.keySelect.value} ${this.scaleSelect.value}`;
    this.currentScaleName = newScale;
    this.currentScale = tonal.scale(newScale);
    this.board = fret.notes(this.tuning, 0, this.numFrets, this.currentScale);
    this.rootnote = this.currentScale[0];
    this.third = this.currentScale[2];
    this.fifth = this.currentScale[4];
    this.seven = this.currentScale[6];
    this.init();
  }

  /**
   * Initialize Fretboard with Strings and Notes
   */
  init() {
    this.ctx.clearRect(0, 0, this.height, this.width);
    this.drawFrets();
    this.drawStrings();
    this.drawFretNumber();
    this.initNotes();
  }

  getColors() {
    this.colors.rootColor  = window.getComputedStyle(document.getElementById('root')).backgroundColor;
    this.colors.thirdColor = window.getComputedStyle(document.getElementById('third')).backgroundColor;
    this.colors.fifthColor = window.getComputedStyle(document.getElementById('fifth')).backgroundColor;
    this.colors.sevenColor = window.getComputedStyle(document.getElementById('seven')).backgroundColor;
  }

  updateSize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.fretWidth = (this.width - this.zeroFretOffset) / this.numFrets;
    this.noteRadius = this.fretWidth / 4;
  }

  /**
   * Trim trailing numbers from Note names
   * @param {string} complete Notename
   * @return {string} trimmed Notename
   */
  trimNumber(note) {
    return note.replace(/\d+$/, "");
  }

  /**
   * Initialize Notes on Fretboard
   */
  initNotes() {
    this.ctx.font = '15px Fira Sans';

    this.board.forEach((string, i) => {
      string.forEach((note, j) => {

        if (note !== null) {
          let name = this.trimNumber(note);
          // Fill Text / Stroke Circle
          if (name == this.rootnote) {
            this.ctx.fillStyle = this.colors.rootColor;
            this.ctx.strokeStyle = this.colors.rootColor;
          } else if (name == this.fifth) {
            this.ctx.fillStyle = this.colors.fifthColor;
            this.ctx.strokeStyle = this.colors.fifthColor;
          } else if (name == this.third) {
            this.ctx.fillStyle = this.colors.thirdColor;
            this.ctx.strokeStyle = this.colors.thirdColor;
          } else if (name == this.seven) {
            this.ctx.fillStyle = this.colors.sevenColor;
            this.ctx.strokeStyle = this.colors.sevenColor;
          } else {
            this.ctx.fillStyle = '#000'
            this.ctx.strokeStyle = '#000'
            this.ctx.lineWidth = 1.5
          }
          this.ctx.fillText(name,
            j * this.fretWidth - this.zeroFretOffset - this.fretWidth/5,
            (5 - i) * this.stringHeight + this.stringPadding + 3
          );
          this.ctx.fillStyle = '#0c0c0c'
        } else {
          this.ctx.fillStyle = '#c0c0c0'
          this.ctx.strokeStyle = '#c0c0c0'
          // Only render Notes of the scale
          return;
        }

        // Draw Note To the Fretboard
        this.ctx.beginPath();
        if (j > 0) {
          this.ctx.arc(
            j * this.fretWidth + this.zeroFretOffset - (this.fretWidth / 2),
            (5 - i) * this.stringHeight + this.stringHeight / 2 + this.stringPadding / 4,
            this.noteRadius, 0, Math.PI * 2
          );
        } else {
          // Zero Fret
          this.ctx.arc(
            j * this.fretWidth + this.zeroFretOffset / 2,
            (5 - i) * this.stringHeight + this.stringHeight / 2 + this.stringPadding / 4,
            this.noteRadius / 2, 0, Math.PI * 2
          );
          this.ctx.fill();
        }
        this.ctx.stroke();
      });
    });
  }

  drawFrets() {
    for (let i = 0; i < this.numFrets; i++) {
      // console.log('Draw Fret: ' + i * this.fretWidth + ':' + i);
      this.ctx.strokeStyle = '#0c0c0c'
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.fretWidth + this.zeroFretOffset, 0);
      this.ctx.lineTo(i * this.fretWidth + this.zeroFretOffset, this.height)
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  /**
   * Draw Fretnumbers at the bottom
   * because Inlays look confusing.
   */
  drawFretNumber() {
    this.board.forEach((string, i) => {
      string.forEach((note, j) => {
        if (i === 0) {
          if (j === 3 || j === 5 ||  j === 7 ||  j === 9 ||  j === 12 ||  j === 15 ||  j === 17) {
            this.ctx.fillStyle = '#00000';
            this.ctx.fillText(j, j * this.fretWidth - this.zeroFretOffset - this.width/12.5, this.height - 10);
            this.ctx.fill();
          }
        }
      });
    });
  }

  /**
   * Draw Strings
   */
  drawStrings() {
    let height = this.height - this.stringPadding;
    this.stringHeight = height / this.numStrings;
    this.ctx.strokeStyle = '#c0c0c0'

    for (let i = 0; i < this.numStrings; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.stringHeight + this.stringPadding);
      this.ctx.lineTo(this.width, i * this.stringHeight + this.stringPadding);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}


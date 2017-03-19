let tonal = require('tonal');
let fret = require('tonal-fretboard');

/** Fretboard Class */
export default class Fretboard {
  /**
   * Fretboard Constructor
   * @constructor
   * @property {number} numFrets - Amount of Frets to display
   * @property {number} numStrings - Amount of strings
   * @property {string} tuning - Tuning: See tonal api docs
   */
  constructor({
    numFrets   = 15,
    numStrings = 6,
    tuning     = 'guitar',
    scale      = 'E major'
  }) {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('fretboard');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.tuning = tuning;

    // Frets
    this.numFrets = numFrets;
    this.zeroFretOffset = 15;
    this.fretWidth = (this.width - this.zeroFretOffset) / this.numFrets;

    // Strings
    this.numStrings = numStrings;
    this.stringPadding = this.height / 10;
    this.stringHeight = 0;

    // Notes
    this.noteRadius = this.fretWidth / 3;
    this.numNotes = this.numFrets * this.numStrings;
    this.notes = [this.numNotes];

    // Get Scale Notes from tonal
    this.scale = tonal.scale(scale);
    this.board = fret.notes(this.tuning, 0, this.numFrets, this.scale);
    // this.board = fret.notes(this.tuning, 0, this.numFrets);
    this.rootnote = this.scale[0];
    this.third = this.scale[2];
    this.fifth = this.scale[4];
    this.seven = this.scale[6];
    this.colors = {
      rootColor: null,
      thirdColor: null,
      fifthColor: null,
      sevenColor: null,
    };

    this.init();
  }

  /**
   * Initialize Fretboard with Strings and Notes
   */
  init() {
    this.getColors();
    this.drawFrets();
    this.drawStrings();
    this.initNotes();
  }

  getColors() {
    this.colors.rootColor = window.getComputedStyle(document.getElementById('root')).backgroundColor;
    this.colors.thirdColor = window.getComputedStyle(document.getElementById('third')).backgroundColor;
    this.colors.fifthColor = window.getComputedStyle(document.getElementById('fifth')).backgroundColor;
    this.colors.sevenColor = window.getComputedStyle(document.getElementById('seven')).backgroundColor;
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
      console.log('String:', i, string);

      string.forEach((note, j) => {
        if (i === 0) {
          if (j === 3 || j === 5 ||  j === 7 ||  j === 9 ||  j === 12 ||  j === 15 ||  j === 17) {
            this.drawFretNumber(j);
          }
        }

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
            j * this.fretWidth - this.zeroFretOffset - 5,
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

  drawFretNumber(fretNumber) {
    this.ctx.fillStyle = '#00000';
    this.ctx.fillText(fretNumber, fretNumber * this.fretWidth - this.zeroFretOffset - 2, this.height - 10)
  }

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


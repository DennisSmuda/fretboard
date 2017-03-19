import tonal from 'tonal';
let fret = require('tonal-fretboard');

/**
 * Fretboard
 * @property numFrets 
 * @property numStrings 
 * @property tuning 
 */
export default class Fretboard {
  constructor({
    numFrets = 15,
    numStrings = 6,
    tuning = 'guitar',
    scale = 'E lydian'
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

    this.init();
  }

  /**
   * Initialize Fretboard with Strings and Notes
   */
  init() {
    this.drawFrets();
    this.drawStrings();
    this.initNotes();
  }
  
  /**
   * Trim trailing numbers from Note names
   * - A#4 -> A#
   */
  trimNumber(note) {
    return note.replace(/\d+$/, "");
  }

  mapNoteToInterval(note) {
    
  }

  initNotes() {
    this.ctx.font = '15px Fira Sans';
    console.log(this.board);
    console.log(this.scale);
    console.log(tonal.harmonics(this.scale));
    this.board.forEach((string, i) => {
      // console.log('String:', i, string);

      string.forEach((note, j) => {

        if (note !== null) {
          let name = this.trimNumber(note);
          // console.log(note);
          this.ctx.fillStyle = '#000'
          this.ctx.fillText(name,
            j * this.fretWidth - this.zeroFretOffset - 5,
            i * this.stringHeight + this.stringPadding + 3
          );
          this.ctx.fillStyle = '#0c0c0c'
          this.ctx.strokeStyle = '#000'
        } else {
          this.ctx.fillStyle = '#c0c0c0'
          this.ctx.strokeStyle = '#c0c0c0'
        }

        this.ctx.beginPath();
        if (j > 0) {
          this.ctx.arc(
            j * this.fretWidth + this.zeroFretOffset - (this.fretWidth / 2),
            i * this.stringHeight + this.stringHeight / 2 + this.stringPadding / 4,
            this.noteRadius, 0, Math.PI * 2
          );
        } else {
          // Zero Fret
          this.ctx.arc(
            j * this.fretWidth + this.zeroFretOffset / 2,
            i * this.stringHeight + this.stringHeight / 2 + this.stringPadding / 4,
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


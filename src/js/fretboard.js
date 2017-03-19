import tonal from 'tonal';

/**
 * Fretboard
 */
export default class Fretboard {
  constructor({
    numFrets = 15,
    numStrings = 6
  }) {
    this.container = document.getElementById('canvas-container');
    this.canvas = document.getElementById('fretboard');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.numFrets = numFrets;
    this.zeroFretOffset = 15;
    this.fretWidth = (this.width - this.zeroFretOffset) / this.numFrets;
    this.numStrings = numStrings;

    this.init();
  }

  /**
   * Initialize Fretboard with Strings and Notes
   */
  init() {
    this.drawFrets();
    this.drawStrings();

    console.log(tonal.scale('Bb lydian'));
  }

  drawFrets() {
    for (let i = 0; i < this.numFrets; i++) {
      // console.log('Draw Fret: ' + i * this.fretWidth + ':' + i);
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.fretWidth + this.zeroFretOffset, 0);
      this.ctx.lineTo(i * this.fretWidth + this.zeroFretOffset, this.height)
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  drawStrings() {
    let stringPadding = this.height / 10;
    let height = this.height - stringPadding ;
    let stringHeight = height / this.numStrings;
    this.ctx.strokeStyle = '#c0c0c0'

    for (let i = 0; i < this.numStrings; i++) {
      console.log(`Draw String: ${i * stringHeight} ` + i * this.fretWidth + ':' + i);
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * stringHeight + stringPadding);
      this.ctx.lineTo(this.width, i * stringHeight + stringPadding);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}


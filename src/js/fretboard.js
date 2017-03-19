import tonal from 'tonal';

/**
 * Fretboard
 */
export default class Fretboard {
  constructor(...args) {
    this.container     = document.getElementById('canvas-container');
    this.canvas        = document.getElementById('fretboard');
    this.ctx           = this.canvas.getContext('2d');
    this.canvas.width  = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.width         = this.canvas.clientWidth;
    this.height        = this.canvas.clientHeight;
    this.numFrets      = 15;
    this.fretWidth     = this.width / this.numFrets;
    this.zeroFretOffset = 15;

    this.init();
  }

  /**
   * Initialize Fretboard with Strings and Notes
   */
  init() {
    this.drawFrets();

    console.log(tonal.scale('Bb lydian'));
  }

  drawFrets() {
    for (let i = 0; i < this.numFrets; i++) {
      console.log('Draw Fret: ' + i * this.fretWidth + ':' + i);
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.fretWidth + this.zeroFretOffset, 0);
      this.ctx.lineTo(i * this.fretWidth + this.zeroFretOffset, this.height)
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}


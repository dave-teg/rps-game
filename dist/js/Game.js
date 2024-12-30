export default class Game {
  constructor(){
    this.active = false;
    this._p1AT = 0;
    this._cpAT = 0;
    this._p1Se = 0;
    this._cpSe = 0;
  }

  getStatus() {
    return this.active;
  }

  startGame() {
    this.active = true;
  }

  endGame() {
    this.active = false;
  }

  getP1AllTime() {
    return this._p1AT;
  }

  setP1AllTime(number) {
    this._p1AT = number;
  }

  getCPAllTime() {
    return this._cpAT;
  }

  setCPAllTime(number) {
    this._cpAT = number;
  }
  
  getP1Session() {
    return this._p1Se;
  }

  getCPSession() {
    return this._cpSe;
  }

  p1win() {
    this._p1AT++;
    this._p1Se++;
  }

  cpWin(){
    this._cpAT++;
    this._cpSe++;
  }
}
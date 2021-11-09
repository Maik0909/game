export default class GameState{
  constructor(){ 
      this.paused =  false,
      this.started =  false,
      this.reverseBulletsActivated = false,
      this.crossBulletsActivated = false,
      this.level =  1,
      this.numberOfEnemiesToThrow =  2,
      this.numberOfEnemiesThrown =  0
  }
}
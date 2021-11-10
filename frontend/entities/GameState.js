
export default class GameState{
  constructor(){ 
      this.paused =  false,
      this.started =  false,
      this.reverseBulletsActivated = false,
      this.crossBulletsActivated = false,
      this.level =  1,
      this.numberOfEnemiesToThrow =  2,
      this.numberOfEnemiesThrown =  0,
      this.rewards = {
        reverseBullets: 0,
        crossBullets: 0,
      },
      this.keys = Array.from(document.getElementsByClassName("key"))
      this.keysState = null
  }
  manage(){
    this.keysState = [this.reverseBulletsActivated,this.crossBulletsActivated]
    this.keysState.forEach( (keyState,i) => {
      if(keyState){
        this.addStyle(i)
        this.keys.forEach( (_,j) =>{j !== i && this.removeStyle(j) })
      }
    })
    if(!this.keysState.some(Boolean)){
      this.keys.forEach( (_,i) => {this.removeStyle(i) } )
    }
  }

  removeStyle(i){
    this.keys[i].style.border = "none"
    this.keys[i].children[0].children[0].style.color = "#140420"
    this.keys[i].children[1].children[0].style.color = "#140420"
  }

  addStyle(i){
    this.keys[i].style.border = "1px solid #AC73F1"
    this.keys[i].children[0].children[0].style.color = "#842EEE"
    this.keys[i].children[1].children[0].style.color = "#842EEE"
  }

  unselect(){
    if(this.rewards.reverseBullets === 0){
      this.reverseBulletsActivated = false
      this.removeStyle(0)
    }else if(this.rewards.crossBullets === 0){
      this.crossBulletsActivated = false
      this.removeStyle(1)
    }
  }
  
}
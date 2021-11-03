import popup from "../components/popup.js";
import { getElements, midX,midY } from "../globalValues.js";
import Player from "./Player.js";

export default class Game{
  constructor(){
    this.playerProps = {
      x: midX,
      y: midY,
      radius: 30,
      color: "rgb(50,32,98)"
    }
    this.player = null
    this.frame = null
    this.projectiles = []
    this.particles = []
    this.enemies = []
    this.score = 0
  }

  animate(){
    this.updateElements()
    this.frame = requestAnimationFrame( () => this.animate)
  }
  updateElements(...entities){
    entities.forEach( entity => entity.forEach(element => {element.update(); element.draw()}) )
  }

  init(){
    const { startButton } = getElements()
    startButton.addEventListener("click",() => this.startGame())
  }

  startGame(){
    //remove popup
    popup(this.score,"startGame")
    //add player
    this.player = new Player(this.playerProps)
    addEventListener("click",this.player.throw.bind(this))
    
  }

}



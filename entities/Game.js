import { canvas, ctx } from "../canvas.js";
import popup from "../components/popup.js";
import { colors, getElements, midX,midY ,} from "../globalValues.js";
import Enemy from "./Enemy.js";
import Particle from "./Particles.js";
import Player from "./Player.js";

const {scoreElement} = getElements()

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

    this.spawnIntervalRef = null

  }


  #removeElementsOutOfScope(){
    this.projectiles = this.projectiles.filter( projectile => projectile.controlScope())
    this.particles =  this.particles.filter(({alpha}) => alpha > 0.1)
  }

  #render(){
    ctx.fillStyle = "rgba(239,233,253,0.1)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    this.player.draw()
  }

  #nearbyElementsPointer(a,b){
    return Math.hypot(a.x-b.x,a.y-b.y)-b.radius-a.radius < 1
  }
  #detectCollisions(){

    for (const [i,enemy] of this.enemies.entries()) {
        for (const [j,projectile] of this.projectiles.entries()) {
          if(this.#nearbyElementsPointer(projectile,enemy)){
            console.log(this.enemies)
            Particle.generateParticles(enemy,projectile,this.particles)     
            
            console.log(enemy.hiddenRadius,enemy.radius)
            if(enemy.hiddenRadius-10 >= 3){

              this.score += 100
              Enemy.reduceEnemySize(enemy)
              this.projectiles = this.projectiles.filter((_,k) => j !== k)
              
            }else{

              this.score += 250
              scoreElement.innerText = this.score
              this.enemies = this.enemies.filter((_,k) => i !== k)
              this.projectiles = this.projectiles.filter((_,k) => j !== k)
              
            }

          }

        }
    }

  }

  #detectCollisionToPlayer(){
    for (const enemy of this.enemies) {
        if(this.#nearbyElementsPointer(this.player,enemy)){
          this.gameOver()
        }
  }
  }



  animate(){
    this.frame = requestAnimationFrame( () => this.animate())
    this.#render()
    this.#detectCollisions()
    this.#detectCollisionToPlayer()
    this.#removeElementsOutOfScope()
    this.#moveElements()

    // console.log(this.projectiles)

  }

  #moveElements(){
    [this.projectiles,this.enemies,this.particles].forEach( entities => entities.forEach(element => {element.update(); element.draw()}) )
  }

  init(){
    const { startButton } = getElements()
    startButton.addEventListener("click",() => this.startGame())
  }

  startGame(state="startGame"){
    //remove popup
    popup(this.score,state)
    scoreElement.innerText = this.score
    //add player
    this.player = new Player(this.playerProps)
    addEventListener("click",this.player.throw.bind(this))
    this.animate()
    this.spawn()
    setInterval(() => {
      console.log(this.enemies)
    }, 2000);
  }

  gameOver(){
    cancelAnimationFrame(this.frame)

    this.ceaseSpawn()
    this.enemies = []
    this.particles = []
    this.projectiles = []

    const scoreCopy = this.score
    popup(scoreCopy,"gameOver")

    this.score = 0

    const {playAgainButton} = getElements()
    playAgainButton.addEventListener("click", () => this.startGame("gameOver"))
  }


  spawn(){
    this.spawnIntervalRef = setInterval(() => {
      const radius = Math.random() * (80-10) + 10
      const enemyProps = {
        radius,
        hiddenRadius: radius,
        color: colors[Math.floor(Math.random()* colors.length)],
      }

      const {x,y} = Enemy.createRandomCords(enemyProps.radius)
      enemyProps["x"] = x
      enemyProps["y"] = y
      
      this.enemies.push( new Enemy(enemyProps))

    }, 1000);
  }

  ceaseSpawn(){
    clearInterval(this.spawnIntervalRef)
  }


}



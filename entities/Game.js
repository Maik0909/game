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

    this.player = new Player(this.playerProps)
    this.frame = null
    this.projectiles = []
    this.particles = []
    this.enemies = []
    this.score = 0
    this.gameState = {
      paused: false
    }

    this.canvas = canvas
    this.canvashandleClick = this.player.throw.bind(this)

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
            Particle.generateParticles(enemy,projectile,this.particles)     
         
            if(enemy.radius-10 >= 5){
              this.score += 10
              scoreElement.innerText = this.score
              Enemy.reduceEnemySize(enemy)
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id )
              
            }else{
              this.score += 25
              scoreElement.innerText = this.score
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id )
              this.enemies = this.enemies.filter( ({id}) => id !== enemy.id)
              
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
    if(!this.gameState.paused){
      this.#render()
      this.#detectCollisions()
      this.#detectCollisionToPlayer()
      this.#removeElementsOutOfScope()
      this.#moveElements()
    }
    // console.log(this.projectiles)

  }

  #moveElements(){
    [this.projectiles,this.enemies,this.particles].forEach( entities => entities.forEach(element => {element.update(); element.draw()}) )
  }


  handleKeyboard({code}){
    if(code === "KeyP"){
        this.gameState.paused = !this.gameState.paused
    }
  }

  init(){
    const { startButton } = getElements()
    startButton.addEventListener("click", () => this.startGame("startGame"))
    addEventListener("keyup",this.handleKeyboard.bind(this))
  }

  startGame(state){
    popup(this.score,state)
    scoreElement.innerText = this.score
    this.gameState.paused = false
    this.animate()
    this.spawn()
    this.canvas.addEventListener("click", this.canvashandleClick)
  }


  gameOver(){

    cancelAnimationFrame(this.frame)
    ctx.clearRect(0,0,canvas.width,canvas.height)

    this.ceaseSpawn()
    this.enemies = []
    this.particles = []
    this.projectiles = []
    this.frame = null
    this.spawnIntervalRef = null
    this.gameState.paused = true
    

    const scoreCopy = this.score
    popup(scoreCopy,"gameOver")

    this.score = 0

    this.canvas.removeEventListener("click", this.canvashandleClick)

    const {playAgainButton} = getElements()
 
    playAgainButton.addEventListener("click", () => this.startGame("gameOver"),{once: true})

  }


  spawn(){
    this.spawnIntervalRef = setInterval(() => {

      if(!this.gameState.paused){

        const radius = Math.random() * (80-10) + 10
        const enemyProps = {
          radius,
          color: colors[Math.floor(Math.random()* colors.length)],
        }
  
        const {x,y} = Enemy.createRandomCords(enemyProps.radius)
        enemyProps["x"] = x
        enemyProps["y"] = y
        
        this.enemies.push( new Enemy(enemyProps))

      }

    }, 1000);
  }

  ceaseSpawn(){
    clearInterval(this.spawnIntervalRef)
  }



}



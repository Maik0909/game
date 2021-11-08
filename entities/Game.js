import { canvas, ctx } from "../canvas.js";
import popup from "../components/popup.js";
import { getElements, midX,midY ,} from "../globalValues.js";
import Enemy from "./Enemy.js";
import GameUI from "./GameUI.js";
import Particle from "./Particles.js";
import Player from "./Player.js";
import Projectile from "./Projectile.js";

const { scoreElement,levelElement } = getElements()

export default class Game{
  
  constructor(){

    this.playerProps = {
      x: midX,
      y: midY,
      radius: 30,
      char: "H",
      fillCharColor: "#5131CC",
      fillCircleColor: "#2D1149",
      color: "transparent"
    }

    this.player = new Player(this.playerProps)
    this.frame = null
    this.gameUI = new GameUI(this.player.x,this.player.y)
    this.projectiles = []
    this.particles = []
    this.enemies = []
    this.score = 0

    this.gameState = {
      paused: false,
      started: false,
      reverseBulletsActivated: false,
      level: 1,
      numberOfEnemiesToThrow: 2,
      numberOfEnemiesThrown: 0
    }
    this.rewards = {
      reverseBullets: 0,
      crossBullets: 0,
    }
    this.canvas = canvas
    this.canvashandleClick = this.saveProjectiles.bind(this)

    this.spawnIntervalRef = null
    this.observeSpawnIntervalRef = null

  }


  #removeElementsOutOfScope(){
    this.projectiles = this.projectiles.filter( projectile => projectile.isWithinRange())
    this.enemies = this.enemies.filter(enemy => enemy.wasHitByReverseProjectile ? enemy.isWithinRange() : true)
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
    for (const enemy of this.enemies) {
        for (const projectile of this.projectiles) {
          if(this.#nearbyElementsPointer(projectile,enemy)){
            Particle.generateParticles(enemy,projectile,this.particles)     
         
            if(enemy.radius-10 >= 5){
              this.score += 25
              scoreElement.innerText = this.score
              Enemy.updateWhenHit(enemy,projectile.type)
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id )
              
            }else{
              this.score += 50
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
    [this.enemies,this.particles].forEach( entities => entities.forEach(element => {element.update(); element.draw()}) )
  
    for (const projectile of this.projectiles) {
      if(projectile.type === "reverse" && !this.gameState.reverseBulletsActivated){
          if(projectile.x === this.player.x && projectile.y === this.player.y){
            continue
          }
      }
      projectile.update()
      projectile.draw()

    }
    
  }


  handleKeyboard({code}){
    if(code === "KeyP"){
        this.gameState.paused = !this.gameState.paused
    }
    if(code === "KeyR"){
      this.gameState.reverseBulletsActivated = !this.gameState.reverseBulletsActivated
    }
  }

  handleVisibility(){
    this.gameState.paused = document.visibilityState !== "visible"
  }

  init(){
    const { startButton } = getElements()

    startButton.addEventListener("click", () => this.startGame("startGame"))

    addEventListener("keyup",this.handleKeyboard.bind(this))
    addEventListener("noEnemies", this.observeSpawn.bind(this))
    
    document.addEventListener("visibilitychange", this.handleVisibility.bind(this))

    addEventListener("load", () => {
      document.getElementById("start").classList.remove("blocked")

    GameUI.drawPlayer.call(this.player)
    this.player.draw()


  })
    

  }

  startGame(state){

    popup(this.score,state)
    scoreElement.innerText = this.score
    levelElement.innerText = this.gameState.level
    this.gameState.paused = false
    this.gameState.started = true
    this.animate()
    this.spawn()
    this.observeSpawn()
    addEventListener("click", this.canvashandleClick)

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
    this.observeSpawnIntervalRef = null

    this.gameState.paused = true
    this.gameState.reverseBulletsActivated = false
    this.gameState.started = false
    this.gameState.numberOfEnemiesToThrow = 2
    this.gameState.numberOfEnemiesThrown = 0
    this.gameState.level = 1
    this.rewards.reverseBullets = 0
    this.rewards.crossBullets = 0
    

    const scoreCopy = this.score
    popup(scoreCopy,"gameOver")

    this.score = 0

    removeEventListener("click", this.canvashandleClick)

    const { playAgainButton } = getElements()
 
    playAgainButton.addEventListener("click", () => this.startGame("gameOver"),{once: true})


  }


  observeSpawn(){
    this.observeSpawnIntervalRef =  setInterval(() => {
      if(this.enemies.length === 0 ){
        this.gameState.numberOfEnemiesThrown = 0
        this.gameState.numberOfEnemiesToThrow += 2  
        this.gameState.level++
        this.rewards.reverseBullets += 5
        levelElement.innerText = this.gameState.level
        this.gameUI.notificate(`reverse bullet x ${this.rewards.reverseBullets}`)
      }
    }, 2000)

  }

  spawn(){
    this.spawnIntervalRef = setInterval(() => {

      if(!this.gameState.paused){

        console.log(this.gameState.numberOfEnemiesThrown,this.gameState.numberOfEnemiesToThrow,this.gameState.level,this.enemies.length)

        if(this.gameState.numberOfEnemiesThrown !== this.gameState.numberOfEnemiesToThrow){
          this.enemies.push( Enemy.crateRandomEnemy())
          this.gameState.numberOfEnemiesThrown++
        }

      }

    }, 1000);
  }

  ceaseSpawn(){
    clearInterval(this.spawnIntervalRef)
    clearInterval(this.observeSpawnIntervalRef)
  }

  saveProjectiles({clientX,clientY}){
    if(!this.gameState.paused){
      const projectileProps = {
        x: midX,
        y: midY,
        radius: 5,
        color: "rgba(133, 92, 248, 1)",
        target:{
          x:clientX,
          y:clientY
        }
      }
      if(this.gameState.reverseBulletsActivated && this.rewards.reverseBullets > 0){
        projectileProps["type"] = "reverse"
        projectileProps.color = "rgba(79,34,124,1)"
        this.rewards.reverseBullets--
      }

      this.projectiles.push(new Projectile(projectileProps))

    }
  
  }

}



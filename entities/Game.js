import KeyboardInteractions from "../components/KeyboardInteractions.js";
import Notification from "../components/Notification.js";
import Popup from "../components/Popup.js";
import { getElements, canvas, ctx, canvasInstance} from "../globals.js";
import Enemy from "./Enemy.js";
import GameState from "./GameState.js";
import Particle from "./Particles.js";
import Player from "./Player.js";
import Projectile from "./Projectile.js";

const { scoreElement,levelElement } = getElements()

export default class Game{
  
  static midX = innerWidth/2
  static midY = innerHeight/2

  constructor(){

    this.frame = null
    this.projectiles = []
    this.particles = []
    this.enemies = []
    this.score = 0

    this.gameState = new GameState()
    this.rewards = {
      reverseBullets: 0,
      crossBullets: 0,
    }
    this.canvas = canvas
    this.canvashandleClick = this.saveProjectiles.bind(this)

    this.spawnIntervalRef = null
    this.observeSpawnIntervalRef = null

    this.player = new Player(Game.midX,Game.midY)
    this.notification = new Notification(this.player)
    this.popup =  new Popup(this.score)
    this.keyboardInteractions = new KeyboardInteractions(this.gameState.reverseBulletsActivated,this.gameState.crossBulletsActivated)

    this.resizeObserver = new ResizeObserver(this.handleResizeEntries.bind(this))
    this.resizeObserver.observe(document.body)


  }


  #removeElementsOutOfScope(){
    this.projectiles = this.projectiles.filter( projectile => projectile.isWithinRange())
    this.enemies = this.enemies.filter(enemy => enemy.radius === 0 ? false : enemy.wasHitByReverseProjectile ? enemy.isWithinRange() : true)
    this.particles =  this.particles.filter(({alpha}) => alpha > 0.1)
  }

  #render(){
    ctx.fillStyle = "rgba(239,233,253,0.1)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    this.player.draw()
  }

  #nearbyElementsPointer(a,b){
    return Math.hypot(a.x-b.x,a.y-b.y)-b.radius-a.radius <= 0
  }

  #detectCollisions(){
    for (const enemy of this.enemies) {
        for (const projectile of this.projectiles) {
          if(this.#nearbyElementsPointer(projectile,enemy)){
            Particle.generateParticles(enemy,projectile,this.particles)     
            if(projectile.type === "cross"){
              this.score += 35
              scoreElement.innerText = this.score
              Enemy.updateWhenHit(enemy,projectile,enemy.radius)
              enemy.isNonCollideable = true   
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id ) 

            }else if(enemy.radius-10 >= 3){
              this.score += 25
              scoreElement.innerText = this.score
              Enemy.updateWhenHit(enemy,projectile)
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id )
              
            }else{
              this.score += 50
              scoreElement.innerText = this.score
              enemy.isNonCollideable = true   
              // Enemy.updateWhenHit(enemy,projectile,enemy.radius)
              this.enemies = this.enemies.filter( ({id}) => id !== enemy.id)
              this.projectiles =  this.projectiles.filter( ({id}) => id !== projectile.id )
              
            }

          }

        }
    }

  }

  #detectCollisionToPlayer(){
    for (const enemy of this.enemies) {
        if(enemy.isNonCollideable){
          continue
        }   
        else if(this.#nearbyElementsPointer(this.player,enemy)){
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

  }

  #moveElements(){
    [this.enemies,this.particles].forEach( entities => entities.forEach(element => {element.update(); element.draw()}) )
  
    for (const projectile of this.projectiles) {
      if(projectile.type === "reverse" && !this.gameState.reverseBulletsActivated || projectile.type === "cross" && !this.gameState.crossBulletsActivated){
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
    if(!this.gameState.paused){
      if(code === "Digit1"){
        this.gameState.reverseBulletsActivated = !this.gameState.reverseBulletsActivated
        if(this.gameState.reverseBulletsActivated){
          this.gameState.crossBulletsActivated = false
        }
      }
      if(code === "Digit2"){
        this.gameState.crossBulletsActivated = !this.gameState.crossBulletsActivated
        if(this.gameState.crossBulletsActivated){
          this.gameState.reverseBulletsActivated = false
        }
      }
      this.keyboardInteractions.manage(this.gameState.reverseBulletsActivated,this.gameState.crossBulletsActivated)

    }
   
  }

  handleVisibility(){
    this.gameState.paused = document.visibilityState !== "visible"
  }

  init(){
    const { startButton } = getElements()

    startButton.addEventListener("click", () => this.startGame("startGame"),{once: true})

    addEventListener("keyup",this.handleKeyboard.bind(this))
    addEventListener("noEnemies", this.observeSpawn.bind(this))
    
    document.addEventListener("visibilitychange", this.handleVisibility.bind(this))

    addEventListener("load", () => {
      document.getElementById("start").classList.remove("blocked")
      this.player.draw()
      console.log("player.x",this.player.x, "player.y",this.player.y)
    })
    

  }

  startGame(state){

    this.popup.delete(state)
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
    

    this.popup.create("gameOver")

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
        this.rewards.crossBullets += 2
        this.rewards.reverseBullets += 5
        levelElement.innerText = this.gameState.level
        this.notification.emit(`reverse bullets: ${this.rewards.reverseBullets}, blackhole bullets: ${this.rewards.crossBullets}`)
      }
    }, 2000)

  }

  spawn(){
    this.spawnIntervalRef = setInterval(() => {

      if(!this.gameState.paused){

        // console.log(this.gameState.numberOfEnemiesThrown,this.gameState.numberOfEnemiesToThrow,this.gameState.level,this.enemies.length)

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
        x: Game.midX,
        y: Game.midY,
        radius: 5,
        color: "rgba(133, 92, 248, 1)",
        target:{
          x:clientX,
          y:clientY
        }
      }
      if(this.gameState.reverseBulletsActivated && this.rewards.reverseBullets > 0){
        projectileProps["type"] = "reverse"
        // projectileProps.color = "rgba(79,34,124,1)"
        projectileProps.color = "rgba(249,132,251,1)"
        this.rewards.reverseBullets--
      }

      if(this.gameState.crossBulletsActivated && this.rewards.crossBullets > 0){
        projectileProps["type"] = "cross"
        projectileProps["color"] = "rgba(113,33,212,0.8)"
        this.rewards.crossBullets--
      }

      this.projectiles.push(new Projectile(projectileProps))

    }
  
  }


  restart(){

    if(this.frame){
      cancelAnimationFrame(this.frame)
    }

    if(this.spawnIntervalRef && this.observeSpawnIntervalRef){
      this.ceaseSpawn()
    }

    this.projectiles = []
    this.enemies = []
    this.spawnIntervalRef = null
    this.observeSpawnIntervalRef = null
    this.gameState.paused = true
    this.gameState.reverseBulletsActivated = false
    this.gameState.started = false
    this.gameState.numberOfEnemiesToThrow = 2
    this.gameState.numberOfEnemiesThrown = 0
    this.gameState.level = 1
    this.score = 0
    this.rewards.reverseBullets = 0
    this.rewards.crossBullets = 0


    removeEventListener("click", this.canvashandleClick)

    const {startButton} = getElements()
    startButton.addEventListener("click", () => this.startGame("startGame"),{once: true})

    
  }

  handleResizeEntries(entries){
    for (const entry of entries) {
      const {contentRect: {width,height}} = entry
      console.log(`Element size: ${width}px x ${height}px`);
      Game.midX = innerWidth/2
      Game.midY = innerHeight/2  
      this.player.x = Game.midX
      this.player.y = Game.midY

      canvasInstance.resizeCanvas()
      this.player.repositionSVGPlayer()
      this.notification.adjustPosition()

      if(this.gameState.started){
        this.popup.create("startGame")
        this.restart()
      }

    }
    
  }

}



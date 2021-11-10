import Projectile from "./Projectile.js";

let w = innerWidth

export default class Enemy extends Projectile{
  
  static colors = [
    "rgba(77, 198, 145, 1)",
    "rgba(239, 224, 80, 1)",
    "rgba(255, 107, 75, 1)",
    "rgba(255, 168, 75, 1)"
  ]
  static maxEnemySize = w <= 320 ? 30 : w <= 375 ? 40 : w <= 425 ? 45 : w <= 768 ? 55 : w <= 1024 ? 60 : w <= 1440 ? 80 : 105
  static minEnemySize = 10

  constructor(props){
    super(props)
    this.wasHitByReverseProjectile = false
    this.wasHitByCrossProjectile = false
    this.isNonCollideable = false
  }
  

  static updateWhenHit(enemy,projectile,value=10){

    const { type } = projectile
    const n = type === "reverse" ? -2 : type === "cross" ? 2.5 : 1.10
    enemy.velocity.x *= n
    enemy.velocity.y *= n

    if(!enemy.wasHitByReverseProjectile){
      enemy.wasHitByReverseProjectile = (type === "reverse")
    }


    this.reduceEnemySize(enemy,value)

    // const n = 1.15
    // this.velocity.x += -(Math.random() * 2)
    // this.velocity.y += -(Math.random() * 2)
  }

  static createRandomCords(radius){
    let x,y
    if(Math.random() < 0.5){
        x = Math.random() <= 0.5 ? 0-radius : innerWidth + radius
        y = Math.random() * innerHeight
    }else{
        x = Math.random() * innerWidth
        y = Math.random() <= 0.5 ? 0-radius : innerHeight + radius
    }
    return {x,y}
  }

  static crateRandomEnemy(){

    const radius = Math.random() * (this.maxEnemySize-this.minEnemySize) + this.minEnemySize
    const enemyProps = {
      radius,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    }

    const {x,y} = this.createRandomCords(enemyProps.radius)
    enemyProps["x"] = x

    enemyProps["y"] = y

    return new this(enemyProps)
  }

  static reduceEnemySize(enemy,value=10){
      gsap.to(enemy,{radius: enemy.radius-value})
  }

}
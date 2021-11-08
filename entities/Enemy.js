import { colors } from "../globalValues.js";
import Projectile from "./Projectile.js";

let w = innerWidth

export default class Enemy extends Projectile{
  
  static maxEnemySize = w <= 320 ? 30 : w <= 375 ? 40 : w <= 425 ? 45 : w <= 768 ? 55 : w <= 1024 ? 60 : w <= 1440 ? 80 : 105
  static minEnemySize = 10

  constructor(props){
    super(props)
    this.wasHitByReverseProjectile = false
  }
  

  static updateWhenHit(enemy,type){

    const n = type === "classic" ? 1.10 : -1
    enemy.velocity.x *= n
    enemy.velocity.y *= n

    if(!enemy.wasHitByReverseProjectile){
      enemy.wasHitByReverseProjectile = (type === "reverse")
    }

    this.reduceEnemySize(enemy)
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
      color: colors[Math.floor(Math.random()* colors.length)],
    }

    const {x,y} = this.createRandomCords(enemyProps.radius)
    enemyProps["x"] = x

    enemyProps["y"] = y

    return new this(enemyProps)
  }

  static reduceEnemySize(enemy){
    gsap.to(enemy,{radius: enemy.radius-10})
  }

}
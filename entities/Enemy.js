import { canvas } from "../canvas.js";
import { colors } from "../globalValues.js";
import Projectile from "./Projectile.js";

export default class Enemy extends Projectile{
  static intervalReference
  constructor(props){
    super(props)
    this.hiddenRadius =  props.hiddenRadius
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

  static reduceEnemySize(enemy){
    enemy.hiddenRadius -= 10
    gsap.to(enemy,{radius: enemy.radius-10})
  }

  static ceaseSpawn(){
    console.warn("Called!")
    clearInterval(this.intervalReference)
  }
  
  static spawn(enemies){
    this.intervalReference = setInterval(() => {
      const radius = Math.random() * (80-10) + 10

      console.count("exec")
      const enemyProps = {
        radius,
        hiddenRadius: radius,
        color: colors[Math.floor(Math.random()* colors.length)],
      }

      const {x,y} = this.createRandomCords(enemyProps.radius)
      enemyProps["x"] = x
      enemyProps["y"] = y
      
      debugger
      enemies.push( new this(enemyProps))

    }, 1000);
  }
}
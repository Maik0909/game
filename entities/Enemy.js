import Projectile from "./Projectile.js";

export default class Enemy extends Projectile{
  constructor(props){
    super(props)
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
    gsap.to(enemy,{radius: enemy.radius-10})
  }

}
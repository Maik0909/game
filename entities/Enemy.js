import Projectile from "./Projectile.js";

export default class Enemy extends Projectile{
  constructor(props){
    super(props)
  }
  

  updateWhenHit(){
    const n = 1.10
    this.velocity.x *= n
    this.velocity.y *= n
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

  static reduceEnemySize(enemy){
    gsap.to(enemy,{radius: enemy.radius-10})
    enemy.updateWhenHit()
  }

}
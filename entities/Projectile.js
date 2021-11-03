import { midX, midY } from "../globalValues.js";
import Circle from "./Circle.js";

export default class Projectile extends Circle{
  constructor({x,y,radius,color,target=null}) {
    super(x,y,radius,color)
    this.angle = !target  ?  Math.atan2(midX-x,midY-y) : Math.atan2(target.x-x,target.y-y)
    this.velocity = this.calcInitialVelocity()
  }
  increaseVelocity(){
    return this.radius <= 10 ?  3.5 : this.radius <= 15 ? 
    3 : this.radius <= 25 ? 2.5 : this.radius <= 50 ? 2 : this.radius <= 70 ? 1.5 :1  
  }

  update(){
    this.x += this.velocity.x * (this.increaseVelocity())
    this.y += this.velocity.y * (this.increaseVelocity())
  }

  calcInitialVelocity(){
    return {
      x: Math.cos(this.angle),
      y: Math.sin(this.angle)
    }
  }
}
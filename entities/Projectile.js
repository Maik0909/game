import { canvas } from "../canvas.js";
import { midX, midY } from "../globalValues.js";
import Circle from "./Circle.js";

export default class Projectile extends Circle{
  constructor({x,y,radius,color,target=null,velocity= null}) {
    super(x,y,radius,color)
    this.target = target
    this.angle = null
    this.velocity = velocity ?? this.calcInitialVelocity()
  }
  increaseVelocity(){
    return this.radius <= 10 ?  3.5 : this.radius <= 15 ? 
    3 : this.radius <= 25 ? 2.5 : this.radius <= 50 ? 2 : this.radius <= 70 ? 1.5 :1  
  }

  update(){
    this.x += this.velocity.x * (this.increaseVelocity())
    this.y += this.velocity.y * (this.increaseVelocity())
  }

  controlScope(){
    return (this.x + this.radius <= canvas.width && 
    this.x-this.radius > 0 && 
    this.y + this.radius <= canvas.height && 
    this.y-this.radius > 0 )
  }

  calcInitialVelocity(){
    this.angle = !this.target  ?  Math.atan2(midY-this.y,midX-this.x) : Math.atan2(this.target.y-this.y,this.target.x-this.x)
    return {
      x: Math.cos(this.angle),
      y: Math.sin(this.angle),
    }
  }
}
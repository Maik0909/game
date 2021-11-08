import { canvas } from "../canvas.js";
import { midX, midY } from "../globalValues.js";
import Circle from "./Circle.js";

export default class Projectile extends Circle{

  constructor({x,y,radius,color,target=null,velocity= null, type="classic"}) {
    
    super(x,y,radius,color)
    this.target = target
    this.angle = null
    this.velocity = velocity ?? this.calcInitialVelocity()
    this.id = "_" + Math.random().toString(36).substr(2, 9)
    this.type = type  // ["classic","reverse","cross"]
    this.acceleration = this.target !== null ?  4 : this.accelerate()
  }
  accelerate(){
    return this.radius <= 5 ? 3.75 : this.radius  <= 10 ?  3.25 : this.radius <= 15 ? 
    3 : this.radius <= 25 ? 2.5 : this.radius <= 40 ? 2 : this.radius <= 60 ? 1.5 : 1  
  }

  update(){
    this.x += this.velocity.x //* (this.accelerate())
    this.y += this.velocity.y //* (this.accelerate())
  }

  isWithinRange(){

    return (this.x <= innerWidth + this.radius && 
    this.x+this.radius >= 0  && 
    this.y  <= innerHeight + this.radius && 
    this.y+this.radius >= 0 )

    // return (this.x + this.radius <= innerWidth && 
    //   this.x-this.radius > 0 && 
    //   this.y + this.radius <= innerHeight && 
    //   this.y-this.radius > 0 )
  }

  calcInitialVelocity(){
    this.angle = !this.target  ?  Math.atan2(midY-this.y,midX-this.x) : Math.atan2(this.target.y-this.y,this.target.x-this.x)
    return {
      x: Math.cos(this.angle) * this.accelerate(),
      y: Math.sin(this.angle) * this.accelerate(),
    }
  }
}
import { ctx } from "../canvas.js";
import Projectile from "./Projectile.js";

export default class Particle extends Projectile{
  constructor(props) {
    super(props);
    this.alpha = 0.2
  }

  draw(){
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }

  update(){
    this.x += this.velocity.x * (this.increaseVelocity())
    this.y += this.velocity.y * (this.increaseVelocity())
    this.alpha  = this.alpha -0.001 >= 0 ? this.alpha-0.001 : this.alpha
  }
  
}
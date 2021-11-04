import { ctx } from "../canvas.js";
import Projectile from "./Projectile.js";

export default class Particle extends Projectile{
  constructor(props) {
    super(props);
    this.alpha = 0.2
    this.friction = 0.97
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

  static generateParticles(enemy,projectile,particles){
    const n =  Math.round(enemy.radius/12)
    for (let index = 0; index < (n < 5 ? 5 : n); index++) {
      particles.push(new this({
        radius: Math.random() * 3.5,
        x: projectile.x,
        y: projectile.y,
        color: enemy.color,
        velocity:{
          x: Math.random() - Math.random() * 3,
          y: Math.random() - Math.random() * 3
        }
      }))
    }

  }

  update(){
    this.x += this.velocity.x * this.friction
    this.y += this.velocity.y * this.friction
    this.alpha  = this.alpha -0.001 >= 0 ? this.alpha-0.001 : this.alpha
  }
  
}
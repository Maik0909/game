import { ctx } from '../canvas.js'
import { midX, midY } from '../globalValues.js'
import Circle from './Circle.js'
import Projectile from './Projectile.js'

export default class Player extends Circle {

  constructor({x,y,radius,fillCircleColor,fillCharColor,char,color}){
    super(x,y,radius,color)
    this.r2 = radius*2,
    this.char = char
    this.fillCircleColor = fillCircleColor,
    this.fillCharColor = fillCharColor
    this.svg = document.createElement("svg")
  }

  
}




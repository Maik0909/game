
import Circle from './Circle.js'


export default class Player extends Circle {

  constructor(x,y){
    super(x,y,30,"transparent")
    this.r2 = this.radius*2,
    this.fillCircleColor = "#2D1149",
    this.fillCharColor = "#5131CC",
    this.SVGPlayer = null
    this.drawSVGPlayer()
  }

  repositionSVGPlayer(){
    this.SVGPlayer.style.right = (this.x - this.radius) + "px"
    this.SVGPlayer.style.top = (this.y  - this.radius) + "px"
    console.log("right position",this.SVGPlayer.style.right, "top position",this.SVGPlayer.style.top)

  }

  drawSVGPlayer(){
 
    document.querySelector("div").insertAdjacentHTML("beforebegin",`
    <svg width="${this.r2}" height="${this.r2}" viewBox="0 0 ${this.r2} ${this.r2}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${this.radius}" cy="${this.radius}" r="${this.radius}" fill="${this.fillCircleColor}"/>
    </svg>
    `)

    this.SVGPlayer = document.querySelector("svg")
    this.SVGPlayer.style.right = (this.x - this.radius) + "px"
    this.SVGPlayer.style.top = (this.y  - this.radius) + "px"


    
  }

  
}




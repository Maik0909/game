export default class Canvas {
  constructor(){
    this.canvasElement = document.querySelector("canvas")
    this.ctx = this.canvasElement.getContext("2d")
    this.scale = devicePixelRatio
    this.resizeCanvas()
  }
  resizeCanvas(){
    console.count("resize canvasElement")
    console.log(innerWidth,innerHeight)
    this.canvasElement.style.width =  innerWidth + "px"
    this.canvasElement.style.height = innerHeight + "px"

    this.canvasElement.width = innerWidth * devicePixelRatio
    this.canvasElement.height = innerHeight * devicePixelRatio

    this.ctx.scale(this.scale,this.scale)
  }
}
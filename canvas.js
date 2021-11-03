const canvas = document.querySelector("canvas")


canvas.style.width =  innerWidth + "px"
canvas.style.height = innerHeight + "px"

const scale = devicePixelRatio
canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const ctx = canvas.getContext('2d')
ctx.scale(scale,scale)
// ctx.fillStyle = "black"


console.log(canvas.width,canvas.height,innerWidth,innerHeight)

export {
  ctx,
  canvas
}
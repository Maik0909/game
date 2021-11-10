import Canvas from "./entities/Canvas.js"

const canvasInstance = new Canvas()
const ctx = canvasInstance.ctx
const canvas = canvasInstance.canvasElement
canvasInstance.resizeCanvas()

const getElements = () => {
  return {
    scoreElement: document.getElementById("score"),
    startButton:document.getElementById("start"),
    playAgainButton: document.getElementById("playAgain"),
    levelElement: document.getElementById("level")
  }
}



export {
  getElements,
  canvas,
  ctx,
  canvasInstance
}
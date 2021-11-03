const midX = innerWidth/2, midY = innerHeight/2
const d = document

const colors = [
  "rgba(77, 198, 145, 1)",
  "rgba(239, 224, 80, 1)",
  "rgba(255, 107, 75, 1)",
  "rgba(255, 168, 75, 1)"
]

const getElements = () => {
  return {
    scoreElement: d.getElementById("score"),
    startButton:d.getElementById("start"),
    playAgainButton: d.getElementById("playAgain")
  }
}



export {
  midX,
  midY,
  colors,
  d,
  getElements,
}
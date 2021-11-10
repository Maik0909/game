export default class SocketConnection{
  constructor(link){
    this.connection = io(link)
    this.init()
  }

  init(){
    this.connection.on("init", (message) => {
      console.log(message)
    })
  }

  // handleGameState(){
  //   this.connection.on("gameState", (gameState) => {
  //      =  JSON.parse(gameState)
  //   })
  // }

}
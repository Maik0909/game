export default class Notification {

  constructor(player){
    this.player = player
    this.topDistance = 70
    this.notificationElement = null
    this.timoutRef = null
  }

  adjustPosition(){
    if(this.notificationElement !== null){
      this.notificationElement.style.top = (this.player.y-20) - this.topDistance + "px" 
      this.notificationElement.style.right = (this.player.x-275)  + "px"
    }
  }
  create(message){
    this.notificationElement = document.createElement("div")
    this.notificationElement.style.width  =  550 + "px"
    this.notificationElement.style.height = 40 + "px"
    this.notificationElement.innerHTML = `<span id="notificationMessage">${message}</span>`
    this.adjustPosition()
    this.notificationElement.classList.add("notification")
  
    return this.notificationElement

  }
  emit(message){
    if(this.notificationElement){
      this.notificationElement.children[0].innerText = message
    }else{
      document.body.append(this.create(message))
    }
    this.show()
    this.timoutRef = setTimeout(() => {this.hide(); clearTimeout(this.timoutRef)}, 1500)
    
  }

  show(){
    if(this.notificationElement.classList.contains("disappearNot")){
      this.notificationElement.classList.remove("disappearNot")
    }
    this.notificationElement.classList.add("appearNot")
  }

  hide(){
    this.notificationElement.classList.replace("appearNot","disappearNot")
  }
}
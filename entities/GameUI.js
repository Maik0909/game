import { d } from "../globalValues.js";

export default class GameUI  {

  constructor(x,y){
    this.topDistance = 70
    this.playerCoords = {x,y}
    this.notification = null
    this.notificationTimoutRef = null
  }

  createNotification(message){

    this.notification =  d.createElement("div")
    this.notification.style.width  =  300 + "px"
    this.notification.style.height = 40 + "px"
    this.notification.innerHTML = `<span id="notificationMessage">${message}</span>`
    this.notification.style.top = (this.playerCoords.y-20) - this.topDistance + "px" 
    this.notification.style.right = (this.playerCoords.x-150)  + "px"
    this.notification.classList.add("notification")

    return this.notification

  }


  notificate(message){
    if(this.notification){
      this.notification.children[0].innerText = message
    }else{
      d.body.append(this.createNotification(message))
    }
    this.showNotification()
    this.notificationTimoutRef = setTimeout(() => {this.hideNotification(); clearTimeout(this.notificationTimoutRef)}, 1500)
    

  }

  showNotification(){
    if(this.notification.classList.contains("disappearNot")){
      this.notification.classList.remove("disappearNot")
    }
    this.notification.classList.add("appearNot")
  }

  hideNotification(){
    this.notification.classList.replace("appearNot","disappearNot")
  }


  static drawPlayer(){
    
    document.querySelector("div").insertAdjacentHTML("beforebegin",`
    <svg width="${this.r2}" height="${this.r2}" viewBox="0 0 ${this.r2} ${this.r2}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${this.radius}" cy="${this.radius}" r="${this.radius}" fill="${this.fillCircleColor}"/>
    </svg>
    `)

    // document.querySelector("div").insertAdjacentHTML("beforebegin",`
    // <svg width="${this.r2}" height="${this.r2}" viewBox="0 0 ${this.r2} ${this.r2}" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <circle cx="${this.radius}" cy="${this.radius}" r="${this.radius}" fill="${this.fillCircleColor}"/>
    //   <text style="font: 600 2rem Inter;" text-anchor="middle" dominant-baseline="central" x="50%" y="50%" fill="${this.fillCharColor}">${this.char}</text>
    // </svg>
    // `)

    const player = document.querySelector("svg")
    player.style.right = (this.x - this.radius) + "px"
    player.style.top = (this.y  - this.radius) + "px"

    console.log("right position",player.style.right, "top position",player.style.top)
  }

}
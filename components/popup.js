 export default class Popup{
  constructor(score){
    this.id =  null
    this.popupElement = null
    this.setTimeoutRef = null
    this.score = score
  }
  create(id){
    this.id = id
    this.popupElement = document.createElement("div")
    this.popupElement.id = id
    if(id === "startGame"){
        this.popupElement.innerHTML = `
        <div class="inputContainer">
        <label  for="nickname">Your nickname</label>
        <input placeholder="Hottie bunny" type="text" id="nickname"/>
      </div>
      <button class="secondary">See leadboard</button>
      <button id="start" class="primary">Play now</button>`
      }else{
        this.popupElement.innerHTML = `
        <span id="points">
          Game Over
        </span>
        <button class="primary" id="playAgain">Play again</button>`
      }
    
    document.body.appendChild(this.popupElement)
    }


  delete(id){
    this.popupElement = document.getElementById(`${id}`)
    this.popupElement.classList.add("disappear")
    this.setTimeoutRef =  setTimeout(() =>{document.body.removeChild(this.popupElement); clearTimeout(this.setTimeoutRef)},350)
  }


  }

 
 
 
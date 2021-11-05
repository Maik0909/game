 const popup = (score=0,id) => {
   const d = document
  const popupElement = d.getElementById(`${id}`)
  if(popupElement){
    popupElement.classList.add("disappear")
    setTimeout(() =>{d.body.removeChild(popupElement)},350)
  }else{
    const div = d.createElement("div")
    div.id = id
    if(id === "gameStart"){
      div.innerHTML = `
      <span id="points">
        ${score}
      </span>
      <span>points</span>
      <button id="start">Start game </button>`
    }else{
      div.innerHTML = `
      <span id="points">
        ${score}
      </span>
      <span>points</span>
      <button class="secondary" id="playAgain">Play again</button>`
    }
    d.body.appendChild(div)
    return div.button
  }
}

export default popup
export default class KeyboardInteractions{
  constructor() {
    this.keys = Array.from(document.getElementsByClassName("key"))
  }
  manage(...keysState){
    keysState.forEach( (keyState,i) => {
      if(keyState){
        this.keys[i].style.border = "1px solid #AC73F1"
        this.keys[i].children[0].children[0].style.color = "#842EEE"
        this.keys[i].children[1].children[0].style.color = "#842EEE"
        this.keys.forEach( (key,j) =>{
          if(j!==i){
            key.style.border = "none"
            key.children[0].children[0].style.color = "#140420"
            key.children[1].children[0].style.color = "#140420"
          }
        })
      }
    })
    if(!keysState.some(Boolean)){
      this.keys.forEach( (key) => {
        key.style.border = "none"
        key.children[0].children[0].style.color = "#140420"
        key.children[1].children[0].style.color = "#140420"
      } )
    }
  }
  
}
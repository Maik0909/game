import { canvas } from "../canvas.js";
import { colors } from "../globalValues.js";
import Projectile from "./Projectile.js";

export default class Enemy extends Projectile{
  constructor(props){
    super({...props,color: colors[Math.floor(Math.random()* colors.length)]})
  }

  static spawnEnemies(enemies){

  }

  // static appearRandomly(radius){
  //   let x,y
  //   if(Math.random() < 0.5){
  //       x = Math.random() <= 0.5 ? 0-radius : canvas.width * 
  //   }else{

  //   }
  // }
  
  spawnEnemies(){
    setInterval(() => {
      const enemyProps = {
        radius : Math.random() * (80-10) + 10
      }

    }, 1000);
  }
}
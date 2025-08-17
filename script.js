import Player from "./classes/Player.js";
import { Enemy, Dengue } from "./classes/Enemy.js";

const canvas = document.getElementById('game_board');
const ctx = canvas.getContext('2d');

canvas.width = 1200
canvas.height = 600

ctx.imageSmoothingEnabled = false;

const player = new Player();

const checkCollision = (rect1, rect2) => {
  if (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y
  ) {
    return true; 
  }
  return false;
};

const keys = {

    left: false,
    right: false,
    space: false
}

const enemies = [];
let spawnTimer = 0;
const spawnInterval = Math.floor(Math.random() * (100 - 80 + 1)) + 80;


const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.left && player.position.x > 0) {
    player.moveLeft();
  }
  if (keys.right && player.position.x <= canvas.width - player.width) {
    player.moveRight();
  }
  if (keys.space) {
    player.jump();
  }

  player.update();
  player.draw(ctx);
  
  spawnTimer++;
  if (spawnTimer >= spawnInterval) {

    let spawnChance = Math.floor(Math.random() * 100);

    if(spawnChance <= 80){
        enemies.push(new Enemy(canvas.width, 540)); 
    }
    else{
        enemies.push(new Dengue(canvas.width, 480));
    }
    spawnTimer = 0; 
  }

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    enemy.update();
    enemy.draw(ctx);

    if (checkCollision(player, enemy)) {
      console.log("Colisão detectada! Game Over!");
      player.position.x = 0;
      player.position.y = player.ground;

    }

    if (enemy.position.x + enemy.width < 0) {
      enemies.splice(i, 1);
      i--; 
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

addEventListener('keydown',(event)=>{
    
    const key = event.key.toLowerCase();

    if(key === 'a'){

        keys.left = true;
    };

    if(key === 'd'){

        keys.right = true;
    };

    if(key === ' '){
        
        keys.space = true;
    }    
});

addEventListener('keyup',(event)=>{

    const key = event.key.toLowerCase();

    if(key === 'a'){

        keys.left = false;
    };
    if(key === 'd'){

        keys.right = false;
    };
    if(key === ' '){
        
        keys.space = false;
    }    

});
import Player from "./classes/Player.js";
import { Enemy, Dengue } from "./classes/Enemy.js";

const canvas = document.getElementById('game_board');
const ctx = canvas.getContext('2d');
const start_button = document.getElementById('start_button');

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

let spawnInterval = Math.floor(Math.random() * (200 - 160 + 1)) + 160;

var vidaAtual = 3; 
const vidaMaxima = 3; 

let isInvincible = false;
const invincibilityFrames = 60; 
let invincibilityTimer = 0;

const lifePointsIcon = new Image();
lifePointsIcon.src = 'assets/sprites/life_points.png';

const lifePointsIconEmpty = new Image();
lifePointsIconEmpty.src = 'assets/sprites/life_points.png';

function desenharHUD() {
  
    const iconSize = 30; 
    const padding = 15; 

    for (let i = 0; i < vidaMaxima; i++) {
       
        const xPos = padding + (i * (iconSize + padding / 2));
        const yPos = padding + iconSize; 

        if (i < vidaAtual) {
            ctx.drawImage(lifePointsIcon, xPos, yPos, iconSize, iconSize)
        } else {
            ctx.drawImage(lifePointsIconEmpty, xPos, yPos, iconSize, iconSize)
        }
    }
}

let gameStatus = 'running';

const gameLoop = () => {

  if (gameStatus === 'gameover') {
 
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      
      // Desenha a mensagem de Game Over
      ctx.font = '72px Arial';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      
      return; // FINALMENTE PARA O requestAnimationFrame AQUI
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharHUD()
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
  
  if (!isInvincible || invincibilityTimer % 10 < 5) { 
      player.draw(ctx);
  }

  spawnTimer++;

  if (spawnTimer >= spawnInterval) {
    let spawnChance = Math.floor(Math.random() * 100);

    if (spawnChance <= 50) {
      enemies.push(new Enemy(canvas.width, 540));
    }
    else {
      enemies.push(new Dengue(canvas.width, 500));
    }

    spawnTimer = 0;
    spawnInterval = Math.floor(Math.random() * (200 - 160 + 1)) + 160;
  }

  for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        enemy.update();
        enemy.draw(ctx);

        if (checkCollision(player, enemy) && !isInvincible) { 
            
            vidaAtual -= 1
            
            enemies.splice(i, 1);
            i--;
            
            isInvincible = true;
            invincibilityTimer = invincibilityFrames; 
            
            if (vidaAtual <= 0) {
                console.log("GAME OVER");
                gameStatus = 'gameover';
            }
        }
        
        if (enemy.position.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    if (isInvincible) {
        invincibilityTimer--;
        
        if (invincibilityTimer <= 0) {
            isInvincible = false;
        }
    }

  requestAnimationFrame(gameLoop);
}

start_button.addEventListener('click', () => {
  const menu_inicial = document.getElementById('menu_inicial');
  menu_inicial.style.display = 'none';
  gameLoop();

})

addEventListener('keydown', (event) => {

  const key = event.key.toLowerCase();

  if (key === 'a') {

    keys.left = true;
  };

  if (key === 'd') {

    keys.right = true;
  };

  if (key === ' ') {

    keys.space = true;
  }
});

addEventListener('keyup', (event) => {

  const key = event.key.toLowerCase();

  if (key === 'a') {

    keys.left = false;
  };
  if (key === 'd') {

    keys.right = false;
  };
  if (key === ' ') {

    keys.space = false;
  }
});
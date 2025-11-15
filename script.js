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
  space: false,
  down: false,
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
lifePointsIconEmpty.src = 'assets/sprites/life_points_negative.png';

const playerDefeatedSprite1 = new Image();
playerDefeatedSprite1.src = 'assets/sprites/sprite-death.png';

const playerDefeatedSprite2 = new Image();
playerDefeatedSprite2.src = 'assets/sprites/sprite-death-1.png';

let deathAnimationFrame = 0;
const deathAnimationSpeed = 50;

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

const restartButton = {
  text: 'PLAY AGAIN',
};


function resetGame() {
  const restart_button = document.getElementById('restart_button');
  restart_button.style.display = 'none';

  vidaAtual = vidaMaxima;
  isInvincible = false;
  invincibilityTimer = 0;
  gameStatus = 'running';
  deathAnimationFrame = 0;

  enemies.length = 0;
  spawnTimer = 0;

  player.position.x = 0;
  player.position.y = player.ground;
  player.isJumping = false;
  player.velocityJump = 0;
}

let gameStatus = 'running';

let lastTime = 0; 
const TARGET_FPS = 60;

const gameLoop = (timestamp) => {

    const deltaTime = (timestamp - lastTime) / 1000; 
    lastTime = timestamp;
    const deltaTimeFactor = deltaTime * TARGET_FPS; 

    if (gameStatus === 'gameover') {
        
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        deathAnimationFrame++; 

        const currentFrameIndex = Math.floor(deathAnimationFrame / deathAnimationSpeed) % 2;

        restart_button.style.display = 'block';
        requestAnimationFrame(gameLoop);
        return;
    }

    ctx.shadowColor = '#000000';
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharHUD();
    

    player.update(); Player
    
    spawnTimer += 1 * deltaTimeFactor; // O timer original era '++' (somava 1)

    if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
    }

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        enemy.update(deltaTimeFactor); 
        enemy.draw(ctx);
    }

    if (isInvincible) {
        invincibilityTimer -= 1 * deltaTimeFactor; 
        
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
  if (key === 's') {

    keys.down = true;
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
  if (key === 's') {
    keys.down = false;
  }
});

const restart_button = document.getElementById('restart_button');
restart_button.addEventListener('click', resetGame);
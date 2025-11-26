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
const deathAnimationSpeed = 100;

let lastTime = 0;
const TARGET_FPS = 120;
const initialEnemySpeed = 5;
let currentEnemySpeed = initialEnemySpeed;
let speedIncreaseTimer = 0;
const speedIncreaseInterval = 600;
const speedIncreaseFactor = 0.05;

function desenharHUD() {
    if (vidaAtual <= 0) {
        return;
    }

    const iconSize = 30;
    const padding = 15;

    for (let i = 0; i < vidaMaxima; i++) {

        const xPos = padding + (i * (iconSize + padding / 2));
        const yPos = padding;

        if (i < vidaAtual) {
            ctx.drawImage(lifePointsIcon, xPos, yPos, iconSize, iconSize)
        } else {
            ctx.drawImage(lifePointsIconEmpty, xPos, yPos, iconSize, iconSize)
        }
    }
}

start_button.addEventListener('click', () => {
    const menu_inicial = document.getElementById('menu_inicial');
    menu_inicial.style.display = 'none';
    
    // 1. Defina o status de JOGO ATIVO
    gameStatus = 'running'; 
    
    // 2. Inicia o loop (depois da checagem de imagem)
    if (player.spriteSheet.complete) {
        requestAnimationFrame(gameLoop);
    } else {
        player.spriteSheet.onload = () => {
            requestAnimationFrame(gameLoop);
        };
    }
});

function resetGame() {
    const restart_button = document.getElementById('restart_button');
    const back_to_menu_button = document.getElementById('back_to_menu_button');
    restart_button.style.display = 'none';
    back_to_menu_button.style.display = 'none';
    
    vidaAtual = vidaMaxima;
    isInvincible = false;
    invincibilityTimer = 0;
    gameStatus = 'running';
    deathAnimationFrame = 0;
    currentEnemySpeed = initialEnemySpeed;

    enemies.length = 0;
    spawnTimer = 0;

    player.position.x = 0;
    player.position.y = player.ground;
    player.isJumping = false;
    player.velocityJump = 0;
    player.width = player.originalWidth;
    player.height = player.originalHeight;
}

function backToMenu() {
    
    // NOVO: Limpa o Canvas imediatamente antes de mostrar o menu
    const canvas = document.getElementById('game_board');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // 1. Limpa variáveis do jogo
    resetGame(); 

    // 2. Oculta os botões de controle do Game Over
    const restart_button = document.getElementById('restart_button');
    const back_to_menu_button = document.getElementById('back_to_menu_button');

    restart_button.style.display = 'none';
    back_to_menu_button.style.display = 'none';
    
    // 3. Mostra o menu inicial
    const menu_inicial = document.getElementById('menu_inicial');
    menu_inicial.style.display = 'flex';
    
    // 4. Define o estado final para parar o gameLoop
    gameStatus = 'menu'; 
}

let gameStatus = 'running';

const gameLoop = (timestamp) => {

    if (lastTime === 0) {
        lastTime = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    const deltaTimeFactor = deltaTime * TARGET_FPS;

    if (gameStatus === 'menu') {
        requestAnimationFrame(gameLoop);
        return; 
    }

    if (gameStatus === 'gameover') {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        deathAnimationFrame++;

        const currentFrameIndex = Math.floor(deathAnimationFrame / deathAnimationSpeed) % 2;
        let currentDefeatedSprite;
        if (currentFrameIndex === 0) {
            currentDefeatedSprite = playerDefeatedSprite1;
        } else {
            currentDefeatedSprite = playerDefeatedSprite2;
        }

        // Desenho de Game Over
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;

        ctx.drawImage(
            currentDefeatedSprite,
            player.position.x,
            player.position.y,
            player.originalWidth,
            player.originalHeight
        );

        ctx.font = '90px Pixelify Sans';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 10;         
        ctx.strokeText('YOU DIED', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'red'; 
        ctx.fillText('YOU DIED', canvas.width / 2, canvas.height / 2); 

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'transparent';

        const restart_button = document.getElementById('restart_button');
        restart_button.style.display = 'block';
        back_to_menu_button.style.display = 'block';
        requestAnimationFrame(gameLoop);
        return;
    }

    // Lógica de Aumento de Velocidade
    speedIncreaseTimer += 1 * deltaTimeFactor;
    if (speedIncreaseTimer >= speedIncreaseInterval) {
        currentEnemySpeed *= (1 + speedIncreaseFactor);
        speedIncreaseTimer = 0;
    }

    // Aplicação da Sombra Global
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharHUD();

    // 1. INPUTS
    if (keys.left && player.position.x > 0) {
        player.moveLeft(deltaTimeFactor);
    }
    if (keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight(deltaTimeFactor);
    }
    if (keys.space) {
        player.jump();
    }
    if (keys.down) {
        player.crouch();
    } else {
        player.stopCrouch();
    }

    player.update(deltaTimeFactor);

    if (!isInvincible || invincibilityTimer % 10 < 5) {
        player.draw(ctx);
    }

    // 2. LÓGICA DE SPAWN
    spawnTimer += 1 * deltaTimeFactor;

    if (spawnTimer >= spawnInterval) {
        let spawnChance = Math.floor(Math.random() * 100);

        if (spawnChance <= 50) {
            enemies.push(new Enemy(canvas.width, 540, currentEnemySpeed));
        }
        else {
            const chanceDeSerAlto = 0.5;
            const highMosquito = Math.random() < chanceDeSerAlto;
            let dengueY = 500;

            if (highMosquito) {
                dengueY = 440;
            }
            enemies.push(new Dengue(canvas.width, dengueY, currentEnemySpeed));
        }

        spawnTimer = 0;
        spawnInterval = Math.floor(Math.random() * (200 - 160 + 1)) + 160;
    }

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        enemy.update(deltaTimeFactor);
        enemy.draw(ctx);

        if (checkCollision(player, enemy) && !isInvincible) {

            vidaAtual -= 1

            enemies.splice(i, 1);
            i--;

            isInvincible = true;
            invincibilityTimer = invincibilityFrames;

            if (vidaAtual <= 0) {
                gameStatus = 'gameover';
            }
        }

        if (enemy.position.x + enemy.width < 0) {
            enemies.splice(i, 1);
            i--;
        }
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

    if (player.spriteSheet.complete) {
        requestAnimationFrame(gameLoop);
    } else {
        player.spriteSheet.onload = () => {
            requestAnimationFrame(gameLoop);
        };
    }
});

addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'a') keys.left = true;
    if (key === 'd') keys.right = true;
    if (key === ' ') keys.space = true;
    if (key === 's') keys.down = true;
});

addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'a') keys.left = false;
    if (key === 'd') keys.right = false;
    if (key === ' ') keys.space = false;
    if (key === 's') keys.down = false;
});

const back_to_menu_button = document.getElementById('back_to_menu_button');
const restart_button = document.getElementById('restart_button');
restart_button.addEventListener('click', resetGame);
back_to_menu_button.addEventListener('click', backToMenu);
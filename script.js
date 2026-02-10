import Player from "./classes/Player.js";
import { Enemy, Dengue } from "./classes/Enemy.js";
// NOVO: Importando itens e projéteis
import { MagicItem, Projectile } from "./classes/Items.js";

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
    shoot: false // NOVO: tecla de tiro
}

const enemies = [];
let spawnTimer = 0;

// NOVO: Listas e timers para itens e projéteis
const items = [];
const projectiles = [];
let itemSpawnTimer = 0;
let itemSpawnInterval = 1000; 

let spawnInterval = Math.floor(Math.random() * (200 - 160 + 1)) + 160;

var vidaAtual = 3;
const vidaMaxima = 3;

let score = 0; 
const scoreIncrement = 1; 
let scoreUpdateTimer = 0;
const scoreUpdateInterval = 60; 

let isInvincible = false;
const invincibilityFrames = 60;
let invincibilityTimer = 0;

const lifePointsIcon = new Image();
lifePointsIcon.src = 'assets/sprites/life_points.png';

const lifePointsIconEmpty = new Image();
lifePointsIconEmpty.src = 'assets/sprites/life_points_negative.png';

const ammoIconHUD = new Image();
ammoIconHUD.src = 'assets/sprites/spell.png'; 

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

const rankingButton = document.getElementById('ranking_button');
const rankingScreen = document.getElementById('ranking_screen');
const closeRankingButton = document.getElementById('close_ranking_button');
const scoreListElement = document.getElementById('score_list');

const nameInputScreen = document.getElementById('name_input_screen');
const playerNameInput = document.getElementById('player_name_input');
const submitScoreButton = document.getElementById('submit_score_button');
const finalScoreDisplay = document.getElementById('final_score_display');
const skipScoreButton = document.getElementById('skip_score_button');
const backgroundMusic = new Audio('assets/sounds/Grimm (Hollow Knight_ The Grimm Troupe) [qmsjvBivRkU] v2.mp3');
const jumpSound = new Audio('assets/sounds/Jump12.wav');
const hurtSound = new Audio('assets/sounds/Hit.wav');
const crouchSound = new Audio('assets/sounds/Hit1.wav');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;
jumpSound.volume = 0.4;
hurtSound.volume = 0.4;
crouchSound.volume = 0.4;

let scoreSaved = false;

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

    // NOVO: Mostrar munição
    if (player.ammo > 0) {
        const ammoX = padding;
        const ammoY = padding + iconSize + 10;
        
        ctx.drawImage(ammoIconHUD, ammoX, ammoY, 30, 30);
        
        ctx.fillStyle = "white";
        ctx.font = "20px Pixelify Sans";
        ctx.textAlign = 'left';
        ctx.fillText("x " + player.ammo, ammoX + 35, ammoY + 22);
    }

    ctx.font = '30px Pixelify Sans';
    ctx.textAlign = 'right';

    const scoreText = `SCORE: ${Math.floor(score)}`;
    const xPos = canvas.width - padding; 
    const yPosScore = padding + iconSize; 
    
    ctx.strokeStyle = 'black'; 
    ctx.lineWidth = 5;        
    ctx.strokeText(scoreText, xPos, yPosScore);
    
    ctx.fillStyle = 'white'; 
    ctx.fillText(scoreText, xPos, yPosScore);
}

start_button.addEventListener('click', () => {
    const menu_inicial = document.getElementById('menu_inicial');
    menu_inicial.style.display = 'none';
    backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
    gameStatus = 'running'; 
    
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
    scoreSaved = false;
    nameInputScreen.style.display = 'none'; 
    playerNameInput.value = ''; 

    vidaAtual = vidaMaxima;
    isInvincible = false;
    invincibilityTimer = 0;
    gameStatus = 'running';
    deathAnimationFrame = 0;
    currentEnemySpeed = initialEnemySpeed;

    score = 0;
    scoreUpdateTimer = 0; 

    enemies.length = 0;
    spawnTimer = 0;

    // NOVO: Resetar itens e projéteis
    items.length = 0;
    projectiles.length = 0;
    player.ammo = 0;
    itemSpawnTimer = 0;

    player.position.x = 0;
    player.position.y = player.ground;
    player.isJumping = false;
    player.velocityJump = 0;
    player.width = player.originalWidth;
    player.height = player.originalHeight;
}

function backToMenu() {
    
    const canvas = document.getElementById('game_board');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    resetGame(); 

    const restart_button = document.getElementById('restart_button');
    const back_to_menu_button = document.getElementById('back_to_menu_button');

    restart_button.style.display = 'none';
    back_to_menu_button.style.display = 'none';
    
    const menu_inicial = document.getElementById('menu_inicial');
    menu_inicial.style.display = 'flex';
    
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

        backgroundMusic.pause();     
        backgroundMusic.currentTime = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!scoreSaved) {
            nameInputScreen.style.display = 'flex';
            finalScoreDisplay.innerText = Math.floor(score);
            playerNameInput.focus(); 
            
            scoreSaved = true; 
        }

        deathAnimationFrame++;
        
        const currentFrameIndex = Math.floor(deathAnimationFrame / deathAnimationSpeed) % 2;
        
        let currentDefeatedSprite;
        if (currentFrameIndex === 0) {
            currentDefeatedSprite = playerDefeatedSprite1;
        } else {
            currentDefeatedSprite = playerDefeatedSprite2;
        }

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

       ctx.font = '40px Pixelify Sans';
        ctx.textAlign = 'center';
        
        const finalScoreYPosition = canvas.height / 2 + 42; // Ajusta posição do score final
        const finalScoreText = `Final Score: ${Math.floor(score)}`;
        
        ctx.strokeStyle = 'black'; 
        ctx.lineWidth = 8;         
        ctx.strokeText(finalScoreText, canvas.width / 2, finalScoreYPosition);
        
        ctx.fillStyle = 'white'; 
        ctx.fillText(finalScoreText, canvas.width / 2, finalScoreYPosition);

        const restart_button = document.getElementById('restart_button');
        restart_button.style.display = 'block';
        back_to_menu_button.style.display = 'block';
        requestAnimationFrame(gameLoop);
        return;
    }

    scoreUpdateTimer += 1 * deltaTimeFactor;
    if (scoreUpdateTimer >= scoreUpdateInterval) {
        score += scoreIncrement;
        scoreUpdateTimer = 0;
    }

    speedIncreaseTimer += 1 * deltaTimeFactor;
    if (speedIncreaseTimer >= speedIncreaseInterval) {
        currentEnemySpeed *= (1 + speedIncreaseFactor);
        speedIncreaseTimer = 0;
    }

    ctx.shadowColor = '#000000';
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharHUD();

    // Movimentação do Player
    if (keys.left && player.position.x > 0) {
        player.moveLeft(deltaTimeFactor);
    }
    if (keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight(deltaTimeFactor);
    }
    if (keys.space) {
        player.jump(jumpSound); 
    }
    if (keys.down) {
        player.crouch(crouchSound);
    } else {
        player.stopCrouch();
    }

    // NOVO: Lógica de Disparo
    if (keys.shoot) {
        if (player.shoot()) {
            projectiles.push(new Projectile(
                player.position.x + player.width, 
                player.position.y + (player.height / 2) - 15
            ));
            // Opcional: Som de tiro aqui
            keys.shoot = false; 
        } else {
            keys.shoot = false; 
        }
    }

    player.update(deltaTimeFactor);

    if (!isInvincible || invincibilityTimer % 10 < 5) {
        player.draw(ctx);
    }

    // NOVO: Atualizar e desenhar projéteis
    for (let i = 0; i < projectiles.length; i++) {
        const proj = projectiles[i];
        proj.update(deltaTimeFactor);
        proj.draw(ctx);

        if (proj.position.x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
            continue;
        }

        // Colisão Projétil x Inimigo
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (checkCollision(proj, enemy)) {
                enemies.splice(j, 1);
                projectiles.splice(i, 1);
                i--;
                
                hurtSound.currentTime = 0; 
                hurtSound.play();
                score += 10; 
                break; 
            }
        }
    }

    itemSpawnTimer += 1 * deltaTimeFactor;
    if (itemSpawnTimer >= itemSpawnInterval) {
        if (Math.random() < 0.8) { 
             const randomY = Math.random() * (450 - 300) + 300;
             items.push(new MagicItem(canvas.width, randomY, currentEnemySpeed));
        }
        itemSpawnTimer = 0;
        itemSpawnInterval = Math.floor(Math.random() * (1500 - 800) + 800); 
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.update(deltaTimeFactor);
        item.draw(ctx);

        if (checkCollision(player, item)) {
            player.ammo += 1;
            items.splice(i, 1);
            i--;
        } else if (item.position.x + item.width < 0) {
            items.splice(i, 1);
            i--;
        }
    }

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
            hurtSound.currentTime = 0;
            hurtSound.play();
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

addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'a' || key === "arrowleft") keys.left = true;
    if (key === 'd' || key === "arrowright") keys.right = true;
    if (key === ' ' || key === "arrowup") keys.space = true;
    if (key === 's' || key === "arrowdown") keys.down = true;
    if (key === 'f') keys.shoot = true; 
});

addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'a' || key === "arrowleft") keys.left = false;
    if (key === 'd' || key === "arrowright") keys.right = false;
    if (key === ' ' || key === "arrowup") keys.space = false;
    if (key === 's' || key === "arrowdown") keys.down = false;
    if (key === 'f') keys.shoot = false; 
});

function getHighScores() {
    const scores = localStorage.getItem('runllow_highscores');
    return scores ? JSON.parse(scores) : [];
}

function saveHighScore(name, score) {
    const highScores = getHighScores();
    const scoreToSave = Math.floor(score);

    const existingIndex = highScores.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingIndex !== -1) {
        if (scoreToSave > highScores[existingIndex].score) {
            highScores[existingIndex].score = scoreToSave; 
        }
        
    } else {
        const newScore = {
            name: name,
            score: scoreToSave
        };
        highScores.push(newScore);
    }

    highScores.sort((a, b) => b.score - a.score);
    
    highScores.splice(10);
    
    localStorage.setItem('runllow_highscores', JSON.stringify(highScores));
}

function showRanking() {
    const highScores = getHighScores();
    scoreListElement.innerHTML = highScores
        .map((score, index) => `<li><span>${index + 1}. ${score.name}</span> <span>${score.score}</span></li>`)
        .join('');
    
    rankingScreen.style.display = 'flex';
}

rankingButton.addEventListener('click', () => {
    showRanking();
});

closeRankingButton.addEventListener('click', () => {
    rankingScreen.style.display = 'none';
});

submitScoreButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || "Anônimo";
    saveHighScore(name, score);
    finalizarGameOverUI();
    
});

function finalizarGameOverUI() {
    console.log("ENTREI AQUI");
    
    nameInputScreen.style.display = 'none';
    restart_button.style.display = 'block';
    back_to_menu_button.style.display = 'block';
}


const back_to_menu_button = document.getElementById('back_to_menu_button');
const restart_button = document.getElementById('restart_button');
restart_button.addEventListener('click', ()=>{
    resetGame();
    backgroundMusic.play();
});
back_to_menu_button.addEventListener('click', backToMenu);
skipScoreButton.addEventListener('click', finalizarGameOverUI);
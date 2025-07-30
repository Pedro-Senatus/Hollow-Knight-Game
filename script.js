import Player from "./classes/Player.js";

const canvas = document.getElementById('game_board');
const ctx = canvas.getContext('2d');

canvas.width = 1200
canvas.height = 600

ctx.imageSmoothingEnabled = false;

const player = new Player();

const keys = {

    left: false,
    right: false,
    space: false
}

const gameLoop = () =>{

ctx.clearRect(0,0,canvas.width, canvas.height);

if(keys.left && player.position.x > 0){
    
    player.moveLeft();
}

if(keys.right && player.position.x <= canvas.width - player.width){

    player.moveRight();

}

if(keys.space){
    player.jump();
};

// player.update();
player.draw(ctx);
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
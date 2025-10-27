class Player {

  constructor() {

    this.width = 44 * 1.42;
    this.height = 87 * 1.42;

    this.originalWidth = 44 * 1.42;
    this.originalHeight = 87 * 1.42;
    this.crouchWidth = this.originalWidth * 1.25; 
    this.crouchHeight = this.originalHeight / 1.42;

    this.velocity = 2;
    this.jumpStrength = -15; 
    this.velocityJump = 10;
    this.gravity = 0.5; 
    this.isJumping = false;
    this.isCrouching = false;
    this.ground = 480;
    this.lifePoints = 3;
   
    this.position = {
      x: 0,
      y: 480,
    };

    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-hollow-knight.png');
    this.sx = 158;
    this.framesCounter = 45; 
  };

  getImage(path) {
    const image = new Image;

    image.src = path;

    return image;
  };

  moveLeft() {

    this.position.x -= this.velocity;

  }

  moveRight() {

    this.position.x += this.velocity;

  }

  jump() {

    if (!this.isJumping && !this.isCrouching) {
        this.isJumping = true;
        this.velocityJump = this.jumpStrength;
    }
  }

  crouch() {
    if (!this.isJumping && !this.isCrouching) {
        this.isCrouching = true;
        
        this.height = this.crouchHeight; 
        const heightDifference = this.originalHeight - this.crouchHeight;
        this.position.y += heightDifference; 
        

        this.width = this.crouchWidth; 
    }
  }

  stopCrouch() {
    if (this.isCrouching) {
        this.isCrouching = false;
        
        this.height = this.originalHeight; 
        const heightDifference = this.originalHeight - this.crouchHeight;
        this.position.y -= heightDifference; 

        this.width = this.originalWidth;
    }
}

  update() {

    if (this.isCrouching) {
        this.velocityJump = 0; 
        this.sx = 475; 
        return; 
    }

    this.velocityJump += this.gravity;
    this.position.y += this.velocityJump;

    if (this.position.y >= this.ground) {

      this.position.y = this.ground;
      this.velocityJump = 0;
      this.isJumping = false;
    }

    if (this.framesCounter === 0) {

      if (this.sx === 0) {
        this.sx = 68;
      }
      else if (this.sx === 68) {
        this.sx = 154;
      }
      else {
        this.sx = 0;
      }
      this.framesCounter = 20;
    }

    this.framesCounter--;

  }

  draw(ctx) {
    ctx.drawImage(
      this.spriteSheet,
      this.sx, 0,
      44, 85,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  death(){
    this.spriteSheet = this.getImage('assets/sprites/sprite-death.png');
    this.position.y = this.ground;
    return true
  }
}

export default Player;
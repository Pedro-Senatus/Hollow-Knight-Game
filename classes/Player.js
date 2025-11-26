class Player {

  constructor() {

    this.frameWidth = 44;
    this.frameHeight = 87;
    this.scale = 1.42;

    this.originalWidth = this.frameWidth * this.scale;
    this.originalHeight = this.frameHeight * this.scale;
    this.crouchWidth = this.originalWidth * 1.25;
    this.crouchHeight = this.originalHeight / 1.60;
    this.crouchDrawWidth = this.frameWidth * 2;
    this.crouchDrawHeight = this.originalHeight * 0.6;

    this.width = this.originalWidth;
    this.height = this.originalHeight;

    this.velocity = 2;
    this.jumpStrength = -15;
    this.velocityJump = 10;
    this.gravity = 0.5;
    this.ground = 480;
    
    this.isJumping = false;
    this.isCrouching = false;
    this.lifePoints = 3;
   
    this.position = {
      x: 0,
      y: this.ground,
    };

    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-hollow-knight.png');
    this.originalSX = 158;
    this.sx = this.originalSX;
    this.framesCounter = 45; 
  };

  getImage(path) {
    const image = new Image;
    image.src = path;
    return image;
  };

  moveLeft(deltaTimeFactor) {
    this.position.x -= this.velocity * deltaTimeFactor;
  };

  moveRight(deltaTimeFactor) {
    this.position.x += this.velocity * deltaTimeFactor;
  };

  jump() {
    if (!this.isJumping && !this.isCrouching) {
      this.isJumping = true;
      this.velocityJump = this.jumpStrength;
    }
  };

  crouch() {
    if (!this.isJumping && !this.isCrouching) {
      this.isCrouching = true;
      
      this.height = this.crouchHeight; 
      const heightDifference = this.originalHeight - this.crouchHeight;
      this.position.y += heightDifference; 
      
      const widthDifference = this.crouchWidth - this.originalWidth;
      this.position.x -= widthDifference / 2; 
      this.width = this.crouchWidth; 
    }
  };

  stopCrouch() {
    if (this.isCrouching) {
      this.isCrouching = false;
      
      this.height = this.originalHeight; 
      const heightDifference = this.originalHeight - this.crouchHeight;
      this.position.y -= heightDifference; 

      const widthDifference = this.crouchWidth - this.originalWidth;
      this.position.x += widthDifference / 2;
      this.width = this.originalWidth; 
    }
  };

  update(deltaTimeFactor = 1) {

    if (this.isCrouching) {
      this.velocityJump = 0; 
      this.sx = 475; 
      return; 
    }

    this.velocityJump += this.gravity * deltaTimeFactor; 
    this.position.y += this.velocityJump * deltaTimeFactor; 

    if (this.position.y >= this.ground) {

      this.position.y = this.ground;
      this.velocityJump = 0;
      this.isJumping = false;
    }

    if (this.framesCounter <= 0) { 

      if (this.sx === 0) {
        this.sx = 68;
      }
      else if (this.sx === 68) {
        this.sx = 154;
      }
      else {
        this.sx = 0;
      }
      this.framesCounter += 20; 
    }

    this.framesCounter -= 1 * deltaTimeFactor; 

  };

  draw(ctx) {

    let drawWidth;
    if (this.isCrouching) {
      drawWidth = this.crouchDrawWidth;
    } else {
      drawWidth = this.originalWidth;
    }

    let drawHeight;
    if (this.isCrouching) {
      drawHeight = this.crouchDrawHeight;
    } else {
      drawHeight = this.originalHeight; 
    }
    
    ctx.drawImage(
      this.spriteSheet,
      this.sx, 0,
      44, 85,
      this.position.x,
      this.position.y,
      drawWidth,
      drawHeight 
    );

// Verificar hitbox do player
//     const originalShadowColor = ctx.shadowColor;
//     const originalShadowBlur = ctx.shadowBlur;
//     ctx.shadowColor = 'transparent';
//     ctx.shadowBlur = 0;

//     ctx.strokeStyle = 'lime'; 
//     ctx.lineWidth = 2; 
//     
//     ctx.strokeRect(
//       this.position.x,
//       this.position.y,
//       this.width, 
//       this.height 
//     );

//     ctx.shadowColor = originalShadowColor;
//     ctx.shadowBlur = originalShadowBlur;
  };

  death() {
    this.spriteSheet = this.getImage('assets/sprites/sprite-death.png');
    this.position.y = this.ground;
    return true
  };
}

export default Player;
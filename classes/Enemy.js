class Enemy {
  constructor(x, y, speed = 3) {
    this.width = 100;
    this.height = 140;
    this.velocity = speed; 
    this.position = {
      x: x,
      y: y,
    };
    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-inseto.png');

    this.animationTimer = 0;
    this.animationSpeed = 40; 
    this.currentFrameIndex = 0;
    this.animationState = 'start';

    this.frames = [
      { sx: 0, sy: 0, sw: 110, sh: 180 },
      { sx: 140, sy: 0, sw: 70, sh: 180 },
      { sx: 240, sy: 0, sw: 80, sh: 180 },
      { sx: 340, sy: 0, sw: 80, sh: 180 }
    ];
  }

  getImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  update(deltaTimeFactor = 1) {
    this.position.x -= this.velocity * deltaTimeFactor;

    this.animationTimer += 1 * deltaTimeFactor;
    
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer -= this.animationSpeed;

      if (this.animationState === 'start') {
        this.currentFrameIndex++;
        if (this.currentFrameIndex >= 2) {
          this.animationState = 'loop';
          this.currentFrameIndex = 2;
        }
      } else if (this.animationState === 'loop') {
        this.currentFrameIndex++;
        if (this.currentFrameIndex >= 4) {
          this.currentFrameIndex = 2;
        }
      }
    }
  }

  draw(ctx) {
    const frame = this.frames[this.currentFrameIndex];
    
    let drawWidth = this.width;
    if (this.animationState === 'loop') {
      drawWidth -= 20;
    }
    ctx.fillStyle = 'blue';

    ctx.drawImage(
      this.spriteSheet,
      frame.sx,
      frame.sy,
      frame.sw,
      frame.sh,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

class Dengue extends Enemy {
  constructor(x, y, speed = 3) {
    super(x, y);

    this.width = 65 * 1.42;
    this.height = 60 * 1.42;
    this.velocity = speed; 

    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-mosquito.png');

    this.frames = [
      { sx: 0, sy: 0, sw: 65, sh: 85 },
      { sx: 100, sy: 25, sw: 65, sh: 65 },
      { sx: 200, sy: 25, sw: 85, sh: 65 },
    ];

    this.currentFrameIndex = 0;
    this.animationTimer = 0;
    this.animationSpeed = 20; 
  }

  update(deltaTimeFactor = 1) {
    this.position.x -= this.velocity * deltaTimeFactor;
    this.animationTimer += 1 * deltaTimeFactor;
    
    if (this.animationTimer >= this.animationSpeed) {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.animationTimer -= this.animationSpeed; // CORREÇÃO: Subtrair o excesso
    }
  }
  
  draw(ctx) {
    const currentFrame = this.frames[this.currentFrameIndex];
    ctx.drawImage(
      this.spriteSheet,
      currentFrame.sx,
      currentFrame.sy,
      currentFrame.sw,
      currentFrame.sh,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

export { Enemy, Dengue };
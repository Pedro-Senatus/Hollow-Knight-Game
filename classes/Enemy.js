class Enemy {
  constructor(x, y) {
    this.width = 100;
    this.height = 140;
    this.velocity = 5;
    this.position = {
      x: x,
      y: y,
    };
    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-inseto.png');

    this.animationTimer = 0;
    this.animationSpeed = 25;
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

  update() {
    this.position.x -= this.velocity;
    
    this.animationTimer++;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer = 0;

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

    ctx.fillStyle = 'green';
    ctx.fillRect(this.position.x, this.position.y, drawWidth, this.height);

    ctx.drawImage(
      this.spriteSheet,
      frame.sx,
      frame.sy,
      frame.sw,
      frame.sh,
      this.position.x,
      this.position.y,
      drawWidth,
      this.height
    );

    this.update();
  }
}

// A classe Dengue herda de Enemy e mantém sua própria lógica
class Dengue extends Enemy {
    constructor(x, y) {
        super(x, y);
        
        // As propriedades de Dengue devem sobrescrever as de Enemy
        this.width = 30 * 1.42;
        this.height = 30 * 1.42;
        this.velocity = 6;
    }
    
    // A classe Dengue agora precisa de sua própria lógica de desenho
    draw(ctx) {
        // A lógica de desenho da Dengue é diferente
        ctx.fillStyle = 'green';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.update();
    }
}

export {Enemy, Dengue};
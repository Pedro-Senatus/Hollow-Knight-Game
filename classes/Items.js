// classes/Items.js

export class MagicItem {
  constructor(x, y, speed) {
    this.width = 45;
    this.height = 45;
    this.position = { x: x, y: y };
    this.baseY = y; 
    this.velocity = speed; 
    
    this.image = new Image();
    this.image.src = 'assets/sprites/spell.png'; 

    this.floatTimer = 0;
  }

  update(deltaTimeFactor) {
    this.position.x -= this.velocity * deltaTimeFactor;

    this.floatTimer += 0.1 * deltaTimeFactor;
    this.position.y = this.baseY + Math.sin(this.floatTimer) * 10; 
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}

export class Projectile {
  constructor(x, y) {
    this.width = 60;
    this.height = 40;
    this.position = { x: x, y: y };
    this.velocity = 12; 

    // Imagem do tiro
    this.image = new Image();
    this.image.src = 'assets/sprites/spell.png';
  }

  update(deltaTimeFactor) {
    this.position.x += this.velocity * deltaTimeFactor;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}
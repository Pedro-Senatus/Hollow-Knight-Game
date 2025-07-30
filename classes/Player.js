class Player {

  constructor() {

    this.width = 44 * 1.42;
    this.height = 87 * 1.42;
    this.velocity = 5;
    this.jumpStrength = -15;
    this.velocityJump = 0;
    this.gravity = 0.8;
    this.isJumping = false;
    this.ground = 480;
    this.position = {
      x: 0,
      y: 480,
    };

    this.spriteSheet = this.getImage('assets/sprites/sprite-sheet-hollow-knight.png');
    this.sx = 158;

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

    if (!this.isJumping) {

      this.isJumping = true;
      this.velocityJump = this.jumpStrength;
    }

  }

  update() {

    this.velocityJump += this.gravity;
    this.position.y += this.velocityJump;

    if (this.position.y >= this.ground) {

      this.position.y = this.ground;
      this.velocityJump = 0;
      this.isJumping = false;
    }

    // Logica que faz os sprites mudarem

    if (this.sx === 0) {
      this.sx = 68;
    }
    else if (this.sx === 68) {
      this.sx = 154;
    }
    else {
      this.sx = 0;
    }
  }

  draw(ctx) {

    ctx.drawImage(

      this.spriteSheet,
      this.sx, 0,
      44, 87,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    this.update();
  }

}



export default Player;
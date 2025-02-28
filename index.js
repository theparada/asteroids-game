const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.rotation = -Math.PI / 2;
  }

  draw() {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.position.x + 30, this.position.y);
    ctx.lineTo(this.position.x - 10, this.position.y - 10);
    ctx.lineTo(this.position.x - 10, this.position.y + 10);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

const keys = {
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const projectiles = [];

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();

    // removing projectile if it goes off screen
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.y + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(i, 1);
    }
  }

  player.velocity.x = 0;
  player.velocity.y = 0;
  if (keys.ArrowUp) {
    player.velocity.x = Math.cos(player.rotation);
    player.velocity.y = Math.sin(player.rotation);
  }
  if (keys.ArrowLeft) player.rotation -= 0.04;
  if (keys.ArrowRight) player.rotation += 0.04;
  player.draw();
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft = true;
      break;
    case "ArrowRight":
      keys.ArrowRight = true;
      break;
  }
  switch (event.code) {
    case "Space":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * 5,
            y: Math.sin(player.rotation) * 5,
          },
        }),
      );
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
      keys.ArrowUp = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft = false;
      break;
    case "ArrowRight":
      keys.ArrowRight = false;
      break;
  }
});

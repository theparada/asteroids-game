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
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();

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
    this.draw();
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
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
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

const projectiles = []; // initialize projectiles array
const asteroids = []; // initialize asteroids array

// creating asteroids
window.setInterval(() => {
  let radius = 50 * Math.random() + 10;
  const randomBinary = [Math.round(Math.random()), Math.round(Math.random())];
  const asteroidVelocity = [Math.random() * 2, Math.random() * 2];

  if (randomBinary[0] === 1) {
    asteroidVelocity[0] *= -1;
  }

  if (randomBinary[1] === 1) {
    asteroidVelocity[1] *= -1;
  }

  asteroids.push(
    new Asteroid({
      position: {
        x: randomBinary[0] * canvas.width,
        y: randomBinary[1] * canvas.height,
      },
      velocity: {
        x: asteroidVelocity[0],
        y: asteroidVelocity[1],
      },
      radius: radius,
    }),
  );
}, 3000);

function objectCollision(obj1, obj2) {
  const xDiff = obj1.position.x - obj2.position.x;
  const yDiff = obj1.position.y - obj2.position.y;
  const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

  if (distance < obj1.radius + obj2.radius) {
    return true;
  } else {
    return false;
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  // removing projectile if it goes off screen
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.y + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(i, 1);
    }
  }

  // removing asteroid if it goes off screen
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();

    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.y + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height
    ) {
      asteroids.splice(i, 1);
    }

    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j];
      if (objectCollision(asteroid, projectile)) {
        asteroids.splice(i, 1);
        projectiles.splice(j, 1);
      }
    }
  }

  player.velocity.x = 0;
  player.velocity.y = 0;
  if (keys.ArrowUp) {
    player.velocity.x = Math.cos(player.rotation) * 2;
    player.velocity.y = Math.sin(player.rotation) * 2;
  }
  if (keys.ArrowLeft) player.rotation -= 0.08;
  if (keys.ArrowRight) player.rotation += 0.08;
}

animate(); // revoke animation

// player controls
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

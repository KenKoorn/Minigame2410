const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size in JavaScript to avoid CSS conflicts
canvas.width = 900;
canvas.height = 500;

// Game variables
let score = 0;
const targets = [];
const bird = { x: 150, y: 300, radius: 15, dx: 0, dy: 0, isMoving: false };

// Load images
const birdImage = new Image();
birdImage.src = "img/angrybird.png"; // Replace with your bird PNG path

const blockImage = new Image();
blockImage.src = "img/smallpig.webp"; // Replace with your block PNG path

// Generate random targets
for (let i = 0; i < 3; i++) {
  targets.push({
    x: Math.random() * (canvas.width - 200) + 200, // Random X
    y: Math.random() * (canvas.height - 100) + 50, // Random Y
    width: 40,
    height: 40,
    hit: false,
  });
}

// Mouse events
let mouseX, mouseY, isDragging = false;
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  if (Math.hypot(mouseX - bird.x, mouseY - bird.y) < bird.radius) {
    isDragging = true;
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    bird.x = e.clientX - rect.left;
    bird.y = e.clientY - rect.top;
  }
});
canvas.addEventListener("mouseup", () => {
  if (isDragging) {
    bird.dx = (150 - bird.x) / 10;
    bird.dy = (300 - bird.y) / 10;
    bird.isMoving = true;
    isDragging = false;
  }
});

// Update game
function update() {
  if (bird.isMoving) {
    bird.x += bird.dx;
    bird.y += bird.dy;
    bird.dy += 0.5; // Gravity

    // Collision with floor
    if (bird.y + bird.radius > canvas.height) {
      bird.dy *= -0.1;
      bird.dx *= 0.9;
      bird.y = canvas.height - bird.radius;
    }
    // Collision with walls
    if (bird.x - bird.radius < 0 || bird.x + bird.radius > canvas.width) {
      bird.dx *= -0.1;
    }

    // Check target collisions
    targets.forEach((target) => {
      if (
        !target.hit &&
        bird.x > target.x &&
        bird.x < target.x + target.width &&
        bird.y > target.y &&
        bird.y < target.y + target.height
      ) {
        target.hit = true;
        score += 20;
        resetBird();
      }
    });

    // Reset bird if it stops moving
    if (Math.abs(bird.dx) < 0.1 && Math.abs(bird.dy) < 0.1 && bird.y + bird.radius >= canvas.height) {
      resetBird();
    }
  }
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.drawImage(birdImage, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);

  // Draw targets
  targets.forEach((target) => {
    if (!target.hit) {
      ctx.drawImage(blockImage, target.x, target.y, target.width, target.height);
    }
  });

  // Draw cursor line
  if (isDragging) {
    ctx.beginPath();
    ctx.moveTo(150, 300); // Bird's original position
    ctx.lineTo(bird.x, bird.y); // Current mouse position
    ctx.strokeStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  // Update score
  document.getElementById("score").innerText = `Score: ${score}`;
}

// Reset bird
function resetBird() {
  bird.x = 150;
  bird.y = 300;
  bird.dx = 0;
  bird.dy = 0;
  bird.isMoving = false;
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();

let snake;
let gameSpeed = 60;
let wait = false;
let counter = 0;
let walls = [];
let objectSize = 16;
let grid = {
  rows: 10,
  columns: 10
};


function setup() {
  createCanvas(windowWidth, windowHeight);

  // Resize to proper screen fit
  if (windowWidth > windowHeight) {
    if (windowHeight / objectSize > 35 || windowWidth / objectSize > 65) {
      objectSize += 8;
      setup();
      return;
    }
  } else {
    if (windowHeight / objectSize > 60 || windowWidth / objectSize > 20) {
      objectSize += 8;
      setup();
      return;
    }
  }


  grid.rows = round(windowHeight / objectSize);
  grid.columns = round(windowWidth / objectSize);
  background(40);

  walls = new Walls(grid, objectSize);
  snake = new Snake(grid, objectSize);
  snake.addCollisionArea(walls.area);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup()
}

function doubleClicked() {
  if (snake.failed) {
    setup();
  }
}

function mouseClicked() {
  if (!snake.failed) {
    snake.setDirection(mouseX, mouseY);
    // prevent default
    return false;
  }
}

function touchStarted() {
  if (!snake.failed) {
    snake.setDirection(mouseX, mouseY);
    // prevent default
    return false;
  }
}

function draw() {
  background(40);
  counter += deltaTime / (60 / gameSpeed);
  wait = true;

  if (counter > 60) {
    counter = 0;
    wait = false;
  }

  if (!wait && !snake.failed) {
    snake.update();

    gameSpeed = round(sqrt(snake.snakeParts) * 10);
    gameSpeed = gameSpeed > 60 ? 60 : gameSpeed;
  }

  walls.show();
  snake.setDirection();
  snake.show();
}
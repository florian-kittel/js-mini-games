class Snake {
  location = createVector(0, 0);
  direction = createVector(1, 0);

  rows = 0;
  columns = 0;

  size = 0;
  snakeParts = 1;
  snack = createVector(0, 0);
  strokeWeight = 1;

  collisionArea = [];
  moveHistory = [];

  failed = false;

  grid = { rows: 0, columns: 0 };

  constructor(grid, size) {
    this.grid = grid;
    this.size = size;

    this.location.x = this.snap(this.grid.columns / 2 * this.size);
    this.location.y = this.snap(this.grid.rows / 2 * this.size);

    this.moveHistory.push(createVector(this.location.x, this.location.y));
    this.addSnack();

    if (this.size > 24) {
      this.strokeWeight = 2;
    }
  }

  show() {
    stroke(255, 100);
    strokeWeight(this.strokeWeight);
    fill(255, 100);

    for (let index = 0; index < this.snakeParts; index++) {
      if (this.moveHistory[index]) {
        square(this.moveHistory[index].x, this.moveHistory[index].y, this.size);
      }
    }

    circle(this.snack.x, this.snack.y, this.size);
  }

  setDirection(x = 0, y = 0) {
    if (x && y) {
      const head = this.moveHistory[this.snakeParts - 1];

      if (!head) { return; }

      // Define leading direction
      const xWide = head.x - x;
      const yWide = head.y - y;
      if (abs(xWide) > abs(yWide)) {
        this.direction.x = xWide > 0 ? -1 : 1;
        this.direction.y = 0;
      } else {
        this.direction.x = 0;
        this.direction.y = yWide > 0 ? -1 : 1;
      }

      return;
    }

    if (keyIsDown(LEFT_ARROW)) {
      this.direction.x = -1;
      this.direction.y = 0;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      this.direction.x = 1;
      this.direction.y = 0;
    }

    if (keyIsDown(UP_ARROW)) {
      this.direction.x = 0;
      this.direction.y = -1;
    }

    if (keyIsDown(DOWN_ARROW)) {
      this.direction.x = 0;
      this.direction.y = 1;
    }
  }

  update() {
    this.moveX(this.direction.x);
    this.moveY(this.direction.y);

    this.moveHistory.push({
      x: this.location.x,
      y: this.location.y
    });

    if (this.moveHistory.length > this.snakeParts) {
      this.moveHistory.shift();
    }

    if (this.eat()) {
      this.snakeParts++;
      this.addSnack();
    }

    this.checkFailed();
  }

  moveX(amount) {
    this.location.x += amount * this.size;
  }

  moveY(amount) {
    this.location.y += amount * this.size;
  }

  addSnack() {
    const randomRow = round(random(1, this.grid.rows - 1));
    const randomColumn = round(random(1, this.grid.columns - 1));

    this.snack.x = this.snap(randomColumn * this.size) - this.size / 2;
    this.snack.y = this.snap(randomRow * this.size) - this.size / 2;

    // Prevent appear in walls
    if (this.collisionArea
      && this.collisionArea[randomRow]
      && this.collisionArea[randomRow][randomColumn]) {
      this.addSnack();
    }
  }

  eat() {
    const head = this.moveHistory[this.snakeParts - 1];
    return (
      head
      && this.snack.x - this.size / 2 === head.x
      && this.snack.y - this.size / 2 === head.y
    );
  }

  addCollisionArea(area) {
    this.collisionArea = area;
  }

  snap(value) {
    let gridOffset = this.size / 2;
    let cell = Math.round((value - gridOffset) / this.size);
    return cell * this.size;
  }

  checkFailed() {
    const head = this.moveHistory[this.snakeParts - 1];

    if (this.failed) {
      return;
    }

    // Check run into walls
    if (head) {
      let column = head.x / this.size;
      let row = head.y / this.size;

      if (this.collisionArea[row] && this.collisionArea[row][column]) {
        this.failed = true;
        return;
      }
    }

    // Check run into itself
    if (head && this.snakeParts > 1) {
      for (let index = 0; index < this.snakeParts - 1; index++) {
        if (this.moveHistory[index].x === head.x
          && this.moveHistory[index].y === head.y) {
          this.failed = true;
        }
      }
    }
  }
}
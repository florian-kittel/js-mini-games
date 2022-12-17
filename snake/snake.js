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
  states = ['right', 'down', 'left', 'up'];
  state = 0;
  nextState = 0;

  failed = false;

  grid = { rows: 0, columns: 0, width: 0, height: 0 };

  constructor(grid, size) {
    this.grid = grid;
    this.size = size;

    this.location.x = this.snap(this.grid.columns / 2 * this.size);
    this.location.y = this.snap(this.grid.rows / 2 * this.size);

    this.moveHistory.push(createVector(this.location.x, this.location.y));

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

    this.addDirectionIndicator();

    circle(this.snack.x, this.snack.y, this.size);
  }

  addDirectionIndicator() {
    const head = this.moveHistory[this.snakeParts - 1];

    if (this.direction.x > 0) {
      triangle(
        head.x,
        head.y,
        head.x,
        head.y + this.size,
        head.x + this.size,
        head.y + this.size / 2
      );

      return;
    }

    if (this.direction.x < 0) {
      triangle(
        head.x + this.size,
        head.y,
        head.x,
        head.y + this.size / 2,
        head.x + this.size,
        head.y + this.size
      );

      return;
    }

    if (this.direction.y > 0) {
      triangle(
        head.x,
        head.y,
        head.x + this.size,
        head.y,
        head.x + this.size / 2,
        head.y + this.size
      );

      return;
    }

    if (this.direction.y < 0) {
      triangle(
        head.x,
        head.y + this.size,
        head.x + this.size / 2,
        head.y,
        head.x + this.size,
        head.y + this.size
      );

      return;
    }
  }

  setDirection(keyCode) {

    if (this.nextState !== this.state) {
      return;
    }

    const states = ['right', 'down', 'left', 'up'];

    if (keyCode === 'ArrowLeft') {
      this.nextState += 1;
      this.nextState = this.nextState > (this.states.length - 1) ? 0 : this.nextState;
    }

    if (keyCode === 'ArrowRight') {
      this.nextState -= 1;
      this.nextState = this.nextState < 0 ? this.states.length - 1 : this.nextState;
    }

    switch (this.nextState) {
      // To right
      case 0:
        this.direction.x = 1;
        this.direction.y = 0;
        break;

      // To down
      case 1:
        this.direction.x = 0;
        this.direction.y = 1;
        break;

      // To left
      case 2:
        this.direction.x = -1;
        this.direction.y = 0;
        break;

      // To up
      case 3:
        this.direction.x = 0;
        this.direction.y = -1;
        break;
    }
  }

  update() {
    this.state = this.nextState;

    this.moveX(this.direction.x);
    this.moveY(this.direction.y);


    if (this.eat()) {
      this.snakeParts++;
      this.addSnack();
    }

    this.moveHistory.push({
      x: this.location.x,
      y: this.location.y
    });

    if (this.moveHistory.length > this.snakeParts) {
      this.moveHistory.shift();
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

    this.snack.x = this.snap(randomColumn * this.size) + this.size / 2;
    this.snack.y = this.snap(randomRow * this.size) + this.size / 2;

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
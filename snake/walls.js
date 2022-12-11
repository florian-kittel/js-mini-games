class Walls {
  area = [];
  size = 0;
  grid = { rows: 0, columns: 0, width: 0, height: 0 };
  strokeWeight = 1;

  constructor(grid, size) {
    this.size = size;
    this.grid = grid;

    if (this.size > 24) {
      this.strokeWeight = 2;
    }

    let rows = this.grid.rows;
    let columns = this.grid.columns;

    for (let index = 0; index < rows; index++) {
      let lineElements = [];

      for (let index2 = 0; index2 < columns; index2++) {
        if (index === 0 || index === rows - 1
          || index2 === 0 || index2 === columns - 1) {
          lineElements.push(1);
        } else if (Math.random() > 0.99) {
          lineElements.push(1);
        } else {
          lineElements.push(0);
        }
      }

      this.area.push(lineElements);
    }
  }

  show() {
    stroke(240, 100);
    strokeWeight(this.strokeWeight);
    fill(139, 0, 0);

    this.area.forEach((line, indexY) => {
      line.forEach((elementInLine, indexX) => {
        if (elementInLine === 1) {
          square(indexX * this.size, indexY * this.size, this.size)
        }
      })
    })
  }

  snap(value) {
    let gridOffset = this.size / 2;
    let cell = Math.round((value - gridOffset) / this.size);
    return cell * this.size;
  }
}
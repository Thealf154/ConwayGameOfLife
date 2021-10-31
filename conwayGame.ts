class GameOfLife {
  cellSize: number;
  aliveColor: string;
  nextGeneration: number[] | any[];
  currentGeneration: number[] | any[];
  deadColor: string;
  columnCells: number;
  rowCells: number;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  generationsPassed: number;

  constructor(cellSize: number, aliveColor: string, canvas: HTMLCanvasElement) {
    this.cellSize = cellSize;
    this.aliveColor = aliveColor;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.aliveColor = this.aliveColor;
    this.deadColor = "#000000";
    // At first we have an empty grid
    this.nextGeneration = [];
    this.currentGeneration = [];
    this.columnCells = Math.floor(canvas.width / cellSize);
    this.rowCells = Math.floor(canvas.height);
    this.currentGeneration = this.createInitialCanvas();
    this.nextGeneration = JSON.parse(JSON.stringify(this.currentGeneration));
    this.generationsPassed = 0;
  }

  // Create an empty grid at the start
  createInitialCanvas = (): number[] => {
    let grid = [];
    for (let i = 0; i < this.rowCells; i++) {
      grid[i] = [];
      for (let j = 0; j < this.columnCells; j++) {
        grid[i][j] = 0;
      }
    }
    return grid;
  };

  // Randomize wether a cell is alive or dead at the start
  randomizeGrid = (): void => {
    for (let i = 0; i < this.rowCells; i++) {
      this.nextGeneration[i] = [];
      for (let j = 0; j < this.columnCells; j++) {
        // Get a random value between 0 and 1
        // Round the number to get one of those two values
        let cellStatus = Math.round(Math.random());
        this.nextGeneration[i][j] = cellStatus;
      }
    }
  };

  fillGrid = () => {
    for (let i = 0; i < this.rowCells; i++) {
      for (let j = 0; j < this.columnCells; j++) {
        // Evaluate if the cell is alive or dead
        let currentCell = this.nextGeneration[i][j];
        let cellColor = currentCell === 1 ? this.aliveColor : this.deadColor;

        // Paint the cell
        let x = j * this.cellSize;
        let y = i * this.cellSize;
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        this.ctx.fillStyle = cellColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
      }
    }
  };

  checkIfItsValid = (i: number, j: number): number => {
    try {
      let value = this.currentGeneration[i][j];
      if (value === undefined) {
        return 0;
      } else {
        return value;
      }
    } catch (e) {
      return 0;
    }
  };

  getNeighbors = (i: number, j: number) => {
    // [ul] [um] [ur]
    // [ml] [!] [mr]
    // [bl] [bm] [br]
    // u = upper
    // m = medium
    // l = left
    // r = right
    // b = bottom
    // Top
    let ul = this.checkIfItsValid(i - 1, j - 1);
    let um = this.checkIfItsValid(i - 1, j);
    let ur = this.checkIfItsValid(i - 1, j + 1);
    // Half
    let ml = this.checkIfItsValid(i, j - 1);
    let mr = this.checkIfItsValid(i, j + 1);
    // Bottom
    let bl = this.checkIfItsValid(i + 1, j - 1);
    let bm = this.checkIfItsValid(i + 1, j);
    let br = this.checkIfItsValid(i + 1, j + 1);

    let neighbors = ul + um + ur + ml + mr + bl + bm + br;
    return neighbors;
  };

  updateLifeStatus = (i: number, j: number) => {
    return this.officialRules(i, j);
  };

  officialRules = (i, j) => {
    const neighbors = this.getNeighbors(i, j);
    const currentCell = this.currentGeneration[i][j];

    if (currentCell === 1 && neighbors < 2) {
      return 0;
    }

    if (currentCell === 1 && neighbors >= 4) {
      return 0;
    }

    if (currentCell === 1 && neighbors === 3) {
      return 1;
    }

    if (currentCell === 0 && neighbors === 3) {
      return 1;
    } else {
      return currentCell;
    }
  };

  updateGeneration = () => {
    try {
      for (let i = 0; i < this.rowCells; i++) {
        for (let j = 0; j < this.columnCells; j++) {
          let newLifeStatus = this.updateLifeStatus(i, j);
          this.nextGeneration[i][j] = newLifeStatus;
        }
      }
      this.generationsPassed += 1;
    } catch (e) {
      console.log(e);
    }
  };

  // Contorls for the game
  resetGame = () => {
    let resetGrid = this.createInitialCanvas();
    this.nextGeneration = resetGrid;
    this.fillGrid();
  };

  run = () => {
    this.currentGeneration = JSON.parse(JSON.stringify(this.nextGeneration));
    this.updateGeneration();
    this.fillGrid();
  };

  runFromDrawing = () => {
    this.currentGeneration = JSON.parse(JSON.stringify(this.nextGeneration));
    this.updateGeneration();
    this.fillGrid();
  };

  // Functions to paint the canvas with new cells
  paintSquare = (x: number, y: number) => {
    let column = Math.floor(y / this.cellSize);
    // For some reason x coordinate is off by +1,
    // substracting that resolves the problem
    let row = Math.floor(x / this.cellSize) - 1;
    console.log(row, column);
    try {
      this.nextGeneration[column][row] = 1;
    } catch (e) {
      console.log(e);
    }
  };

  paintTheGridOnClick = (event: any) => {
    let x = event.clientX;
    let y = event.clientY;
    console.log(event.movementX);
    this.paintSquare(x, y);
  };

  // Change the color on demand
  changeColor = (newColor: string):void => {
    this.aliveColor = newColor;
  }

}

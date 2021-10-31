let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
let speed = <HTMLInputElement>document.getElementById("speed");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight - 80;

// Fill canvas with a black rectangle
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";

// Create the game
let game: GameOfLife;

let isOnPause = true;
let runInterval: number;

window.onload = () => {
  paintControls();
};

const paintControls = () => {
  // Set the value first

  // Paint the canvas
  canvas.addEventListener("click", (event) => {
    // Get the coordinates of the mouse
    let x = event.clientX;
    let y = event.clientY;

    if (game == undefined) {
      createGame();
      game.paintSquare(x, y);
      game.fillGrid();
    } else {
      disableSizeInput();
      game.paintSquare(x, y);
      game.fillGrid();
    }
  });

  let startButton = document.getElementById("startButton");
  startButton.addEventListener("click", () => {
    disableSizeInput();
    if (isOnPause) {
      startOrPauseGame("pause");
    } else {
      startOrPauseGame("start");
    }
  });

  let restartButton = document.getElementById("reset");
  restartButton.addEventListener("click", () => {
    enableSizeInput();
    startOrPauseGame("pause");
    restartGame();
    game = undefined;
  });

  // Randomize the grid and start the game
  let randomButton = document.getElementById("randomize");
  randomButton.addEventListener("click", () => {
    disableSizeInput();
    createGame();
    game.randomizeGrid();
    startOrPauseGame("start");
    // Reset button
  });

  let color = <HTMLInputElement>document.getElementById("color");
  color.addEventListener("change", () => {
    let colorValue = color.value;
    if (game != undefined) {
      game.changeColor(colorValue);
    }
  });

  speed.addEventListener('change', () => {
    let speedValue = parseInt(speed.value);
    if(runInterval != undefined){
      clearInterval(runInterval)
      runInterval = setInterval(start, speedValue)
    }
  });
};


const startOrPauseGame = (action: string): void => {
  // Start and reset the game from the user's drawing
  let startButton = document.getElementById("startButton");
  isOnPause = action === "start" ? false : true;
  // Change behaviour if the button was already pressed
  if (isOnPause) {
    // Pause the game
    isOnPause = false;
    startButton.innerText = "Start";
    clearInterval(runInterval);
  } else {
    // Coninue the game
    isOnPause = true;
    startButton.innerText = "Pause";
    let speedValue = parseInt(speed.value)
    runInterval = setInterval(start, speedValue);
  }
};

const enableSizeInput = ():void => {
  let sizeInput = <HTMLInputElement>document.getElementById("size");
  sizeInput.disabled = false;
}

const disableSizeInput = ():void => {
  let sizeInput = <HTMLInputElement>document.getElementById("size");
  sizeInput.disabled = true;
}

const start = (): void => {
  game.run();
  incrementGenerations();
};

const restartGame = (): void => {
  resetGenerations();
  game.resetGame();
};

const createGame = (): void => {
  // Select the sizefor the cells
  let inputSize = <HTMLInputElement>document.getElementById("size");
  let size = parseInt(inputSize.value);

  // Select the color for the cells
  let color = <HTMLInputElement>document.getElementById("color");
  let colorValue = color.value;

  // Start the game
  game = new GameOfLife(size, colorValue, canvas);
};

const incrementGenerations = (): void => {
  document.getElementById("generations").innerText =
    "Generations: " + game.generationsPassed.toString();
};

const resetGenerations = (): void => {
  document.getElementById("generations").innerText = "Generations: " + 0;
};

// Pencil section
const draw = (canvas, game) => {
  canvas.addEventListener("mousedown", (event) => {
    canvas.addEventListener("mousemove", handleMouseMove, false);
  });

  const handleMouseMove = (event: MouseEvent) => {
    console.log(event.pageX, event.pageY);
    game.paintSquare(event.pageX, event.pageY);
  };

  const handleMouseUp = (event: MouseEvent) => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    game.fillGrid();
  };

  canvas.addEventListener("mouseup", handleMouseUp, false);
};

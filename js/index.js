var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var speed = document.getElementById("speed");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight - 80;
// Fill canvas with a black rectangle
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "black";
// Create the game
var game;
var isOnPause = true;
var runInterval;
window.onload = function () {
    paintControls();
};
var paintControls = function () {
    // Set the value first
    // Paint the canvas
    canvas.addEventListener("click", function (event) {
        // Get the coordinates of the mouse
        var x = event.clientX;
        var y = event.clientY;
        if (game == undefined) {
            createGame();
            game.paintSquare(x, y);
            game.fillGrid();
        }
        else {
            disableSizeInput();
            game.paintSquare(x, y);
            game.fillGrid();
        }
    });
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function () {
        disableSizeInput();
        if (isOnPause) {
            startOrPauseGame("pause");
        }
        else {
            startOrPauseGame("start");
        }
    });
    var restartButton = document.getElementById("reset");
    restartButton.addEventListener("click", function () {
        enableSizeInput();
        startOrPauseGame("pause");
        restartGame();
        game = undefined;
    });
    // Randomize the grid and start the game
    var randomButton = document.getElementById("randomize");
    randomButton.addEventListener("click", function () {
        disableSizeInput();
        createGame();
        game.randomizeGrid();
        startOrPauseGame("start");
        // Reset button
    });
    var color = document.getElementById("color");
    color.addEventListener("change", function () {
        var colorValue = color.value;
        if (game != undefined) {
            game.changeColor(colorValue);
        }
    });
    speed.addEventListener('change', function () {
        var speedValue = parseInt(speed.value);
        if (runInterval != undefined) {
            clearInterval(runInterval);
            runInterval = setInterval(start, speedValue);
        }
    });
};
var startOrPauseGame = function (action) {
    // Start and reset the game from the user's drawing
    var startButton = document.getElementById("startButton");
    isOnPause = action === "start" ? false : true;
    // Change behaviour if the button was already pressed
    if (isOnPause) {
        // Pause the game
        isOnPause = false;
        startButton.innerText = "Start";
        clearInterval(runInterval);
    }
    else {
        // Coninue the game
        isOnPause = true;
        startButton.innerText = "Pause";
        var speedValue = parseInt(speed.value);
        runInterval = setInterval(start, speedValue);
    }
};
var enableSizeInput = function () {
    var sizeInput = document.getElementById("size");
    sizeInput.disabled = false;
};
var disableSizeInput = function () {
    var sizeInput = document.getElementById("size");
    sizeInput.disabled = true;
};
var start = function () {
    game.run();
    incrementGenerations();
};
var restartGame = function () {
    resetGenerations();
    game.resetGame();
};
var createGame = function () {
    // Select the sizefor the cells
    var inputSize = document.getElementById("size");
    var size = parseInt(inputSize.value);
    // Select the color for the cells
    var color = document.getElementById("color");
    var colorValue = color.value;
    // Start the game
    game = new GameOfLife(size, colorValue, canvas);
};
var incrementGenerations = function () {
    document.getElementById("generations").innerText =
        "Generations: " + game.generationsPassed.toString();
};
var resetGenerations = function () {
    document.getElementById("generations").innerText = "Generations: " + 0;
};
// Pencil section
var draw = function (canvas, game) {
    canvas.addEventListener("mousedown", function (event) {
        canvas.addEventListener("mousemove", handleMouseMove, false);
    });
    var handleMouseMove = function (event) {
        console.log(event.pageX, event.pageY);
        game.paintSquare(event.pageX, event.pageY);
    };
    var handleMouseUp = function (event) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        game.fillGrid();
    };
    canvas.addEventListener("mouseup", handleMouseUp, false);
};
//# sourceMappingURL=index.js.map
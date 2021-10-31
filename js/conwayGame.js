var GameOfLife = /** @class */ (function () {
    function GameOfLife(cellSize, aliveColor, canvas) {
        var _this = this;
        // Create an empty grid at the start
        this.createInitialCanvas = function () {
            var grid = [];
            for (var i = 0; i < _this.rowCells; i++) {
                grid[i] = [];
                for (var j = 0; j < _this.columnCells; j++) {
                    grid[i][j] = 0;
                }
            }
            return grid;
        };
        // Randomize wether a cell is alive or dead at the start
        this.randomizeGrid = function () {
            for (var i = 0; i < _this.rowCells; i++) {
                _this.nextGeneration[i] = [];
                for (var j = 0; j < _this.columnCells; j++) {
                    // Get a random value between 0 and 1
                    // Round the number to get one of those two values
                    var cellStatus = Math.round(Math.random());
                    _this.nextGeneration[i][j] = cellStatus;
                }
            }
        };
        this.fillGrid = function () {
            for (var i = 0; i < _this.rowCells; i++) {
                for (var j = 0; j < _this.columnCells; j++) {
                    // Evaluate if the cell is alive or dead
                    var currentCell = _this.nextGeneration[i][j];
                    var cellColor = currentCell === 1 ? _this.aliveColor : _this.deadColor;
                    // Paint the cell
                    var x = j * _this.cellSize;
                    var y = i * _this.cellSize;
                    _this.ctx.fillRect(x, y, _this.cellSize, _this.cellSize);
                    _this.ctx.fillStyle = cellColor;
                    _this.ctx.lineWidth = 3;
                    _this.ctx.strokeStyle = "white";
                    _this.ctx.stroke();
                }
            }
        };
        this.checkIfItsValid = function (i, j) {
            try {
                var value = _this.currentGeneration[i][j];
                if (value === undefined) {
                    return 0;
                }
                else {
                    return value;
                }
            }
            catch (e) {
                return 0;
            }
        };
        this.getNeighbors = function (i, j) {
            // [ul] [um] [ur]
            // [ml] [!] [mr]
            // [bl] [bm] [br]
            // u = upper
            // m = medium
            // l = left
            // r = right
            // b = bottom
            // Top
            var ul = _this.checkIfItsValid(i - 1, j - 1);
            var um = _this.checkIfItsValid(i - 1, j);
            var ur = _this.checkIfItsValid(i - 1, j + 1);
            // Half
            var ml = _this.checkIfItsValid(i, j - 1);
            var mr = _this.checkIfItsValid(i, j + 1);
            // Bottom
            var bl = _this.checkIfItsValid(i + 1, j - 1);
            var bm = _this.checkIfItsValid(i + 1, j);
            var br = _this.checkIfItsValid(i + 1, j + 1);
            var neighbors = ul + um + ur + ml + mr + bl + bm + br;
            return neighbors;
        };
        this.updateLifeStatus = function (i, j) {
            return _this.officialRules(i, j);
        };
        this.officialRules = function (i, j) {
            var neighbors = _this.getNeighbors(i, j);
            var currentCell = _this.currentGeneration[i][j];
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
            }
            else {
                return currentCell;
            }
        };
        this.updateGeneration = function () {
            try {
                for (var i = 0; i < _this.rowCells; i++) {
                    for (var j = 0; j < _this.columnCells; j++) {
                        var newLifeStatus = _this.updateLifeStatus(i, j);
                        _this.nextGeneration[i][j] = newLifeStatus;
                    }
                }
                _this.generationsPassed += 1;
            }
            catch (e) {
                console.log(e);
            }
        };
        // Contorls for the game
        this.resetGame = function () {
            var resetGrid = _this.createInitialCanvas();
            _this.nextGeneration = resetGrid;
            _this.fillGrid();
        };
        this.run = function () {
            _this.currentGeneration = JSON.parse(JSON.stringify(_this.nextGeneration));
            _this.updateGeneration();
            _this.fillGrid();
        };
        this.runFromDrawing = function () {
            _this.currentGeneration = JSON.parse(JSON.stringify(_this.nextGeneration));
            _this.updateGeneration();
            _this.fillGrid();
        };
        // Functions to paint the canvas with new cells
        this.paintSquare = function (x, y) {
            var column = Math.floor(y / _this.cellSize);
            // For some reason x coordinate is off by +1,
            // substracting that resolves the problem
            var row = Math.floor(x / _this.cellSize) - 1;
            console.log(row, column);
            try {
                _this.nextGeneration[column][row] = 1;
            }
            catch (e) {
                console.log(e);
            }
        };
        this.paintTheGridOnClick = function (event) {
            var x = event.clientX;
            var y = event.clientY;
            console.log(event.movementX);
            _this.paintSquare(x, y);
        };
        // Change the color on demand
        this.changeColor = function (newColor) {
            _this.aliveColor = newColor;
        };
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
    return GameOfLife;
}());
//# sourceMappingURL=conwayGame.js.map
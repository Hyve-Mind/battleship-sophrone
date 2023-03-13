const ship = require("./ship");

const gameBoardProto = {
  getPlayerState() {
    return this.board;
  },
  getOpponentState() {
    let opponentBoard = Array.from({ length: this.x }, (_) =>
      new Array(this.y).fill(null)
    );
    for (let i = 0; i < this.board.length; i++) {
      for (let n = 0; n < this.board[i].length; n++) {
        if (typeof this.board[i][n] != "number" && this.board[i][n] != null) {
          opponentBoard[i][n] = this.board[i][n];
        }
      }
    }
    return opponentBoard;
  },
  randomizeShipPlacement(size, index = this.ships.length) {
    let x = Math.floor(Math.random() * this.x);
    let y = Math.floor(Math.random() * this.y);
    let direction =
      Math.floor(Math.random() * 2) == 0 ? "vertical" : "horizontal";
    if (this.testPlaceShip(size, x, y, direction)) {
      if (index >= this.ships.length) {
        const battleship = ship(size);
        this.ships.push(battleship);
      }
      if (direction == "vertical") {
        for (let i = y; i < y + size; i++) {
          this.board[x][i] = index;
        }
      } else if (direction == "horizontal") {
        for (let i = x; i < x + size; i++) {
          this.board[i][y] = index;
        }
      }
      return true;
    } else {
      return this.randomizeShipPlacement(size);
    }
  },
  placeShip(size, x, y, direction, index = this.ships.length) {
    if (this.testPlaceShip(size, x, y, direction)) {
      if (index >= this.ships.length) {
        const battleship = ship(size);
        this.ships.push(battleship);
      }
      if (direction == "vertical") {
        for (let i = y; i < y + size; i++) {
          this.board[x][i] = index;
        }
      } else if (direction == "horizontal") {
        for (let i = x; i < x + size; i++) {
          this.board[i][y] = index;
        }
      }
      return true;
    }
    return false;
  },
  moveShip(
    size,
    currentX,
    currentY,
    currentDirection,
    x,
    y,
    direction = currentDirection
  ) {
    const index = this.board[currentX][currentY];
    if (currentDirection == "vertical") {
      for (let i = 0; i < size; i++) {
        this.board[currentX][currentY + 1] = null;
      }
    } else if (currentDirection == "horizontal") {
      for (let i = 0; i < size; i++) {
        this.board[currentX + 1][currentY] = null;
      }
    }
    let moved = this.placeShip(size, x, y, direction, index);
    if (!moved) {
      this.placeShip(size, currentX, currentY.currentDirection, index);
    }
    return moved;
  },
  testPlaceShip(size, x, y, direction) {
    if (direction == "vertical") {
      if (this.y < y + size) {
        return false;
      }
      for (let i = y; i < y + size; i++) {
        if (this.board[x][i] != null) {
          return false;
        }
      }
    } else if (direction == "horizontal") {
      if (this.x < x + size) {
        return false;
      }
      for (let i = x; i < x + size; i++) {
        if (this.board[i][y] != null) {
          return false;
        }
      }
    }
    return true;
  },
  receiveAttack(x, y) {
    let error = "";
    let ships = this.ships;
    let sunkShip = false;
    console.log(`x: ${x},Y:${y},value ${this.board[x][y]}`);
    if (this.board[x][y] == null) {
      this.board[x][y] = "X";
      return "Miss";
    } else if (this.board[x][y] >= 0 && this.board[x][y] < this.ships.length) {
      ships[this.board[x][y]].hit();
      sunkShip = ships[this.board[x][y]].isSunk();
      this.board[x][y] = "H";
      if (sunkShip == true) {
        return "You sunk my battleship";
      } else {
        return "Hit";
      }
    } else if (this.board[x][y] == "X") {
      error = "Already targeted";
      return error;
    } else {
      error = "No target found";
      return error;
    }
  },
  shipRemaining() {
    for (let ship of this.ships) {
      if (!ship.isSunk()) {
        return true;
      }
    }
    return false;
  },
};

const gameboard = (lengthX, lengthY) => {
  let stateArray = Array.from({ length: lengthX }, (_) =>
    new Array(lengthY).fill(null)
  );
  let shipsArray = [];
  let gameboard = Object.create(gameBoardProto, {
    x: {
      writable: false,
      configurable: false,
      value: lengthX,
    },
    y: {
      writable: false,
      configurable: false,
      value: lengthY,
    },
    board: {
      writable: true,
      configurable: true,
      value: stateArray,
    },
    ships: {
      writable: true,
      configurable: true,
      value: shipsArray,
    },
  });
  return gameboard;
};

module.exports = gameboard;

const ROWS = 6;
const COLS = 7;

let gameBoard = [];
let activePlayer = 1;
let isGameActive = true;

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("resetButton");

function initBoard() {
  boardElement.innerHTML = "";
  gameBoard = [];
  for (let rowIndex = 0; rowIndex < ROWS; rowIndex++) {
    let rowArr = [];
    for (let colIndex = 0; colIndex < COLS; colIndex++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell", "empty");
      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;
      cellDiv.addEventListener("click", () => {
        if (isGameActive) {
          processMove(rowIndex, colIndex);
        }
      });
      boardElement.appendChild(cellDiv);
      rowArr.push(0);
    }
    gameBoard.push(rowArr);
  }
  updateStatusMessage();
}

function processMove(row, col) {
  if (!isGameActive) return;
  if (gameBoard[row][col] === 0) {
    gameBoard[row][col] = activePlayer;
    updateBoardUI();
    const winningCells = findWinningCells(row, col);
    if (winningCells) {
      highlightWinners(winningCells);
      statusElement.textContent = `Player ${activePlayer} wins! 🎉`;
      isGameActive = false;
      console.log(`Game over: Player ${activePlayer} won.`);
    } else if (isDraw()) {
      statusElement.textContent = "It's a draw! Try again.";
      isGameActive = false;
      console.log("Game over: Draw.");
    } else {
      activePlayer = activePlayer === 1 ? 2 : 1;
      updateStatusMessage();
      console.log(`Next turn: Player ${activePlayer}`);
    }
  } else {
    console.log(`Invalid move at row ${row}, col ${col} - cell already occupied.`);
  }
}

function updateBoardUI() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = boardElement.children[r * COLS + c];
      cell.className = "cell";
      if (gameBoard[r][c] === 0) {
        cell.classList.add("empty");
        cell.innerHTML = "";
      } else {
        cell.classList.remove("empty");
        const piece = document.createElement("div");
        piece.className = "piece " + (gameBoard[r][c] === 1 ? "player1" : "player2");
        cell.innerHTML = "";
        cell.appendChild(piece);
      }
      cell.classList.remove("winner");
    }
  }
}

function findWinningCells(row, col) {
  const player = gameBoard[row][col];
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  for (const { dr, dc } of directions) {
    let count = 1;
    let r = row + dr;
    let c = col + dc;
    const cells = [[row, col]];

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === player) {
      count++;
      cells.push([r, c]);
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === player) {
      count++;
      cells.push([r, c]);
      r -= dr;
      c -= dc;
    }

    if (count >= 4) return cells;
  }
  return null;
}

function isDraw() {
  for (let col = 0; col < COLS; col++) {
    if (gameBoard[0][col] === 0) return false;
  }
  return true;
}

function updateStatusMessage() {
  statusElement.textContent = `Player ${activePlayer}'s turn - make your move!`;
}

function resetGame() {
  isGameActive = true;
  activePlayer = 1;
  initBoard();
  clearWinnerHighlight();
  console.log("Game reset. Ready to play!");
}

function highlightWinners(cells) {
  for (const [r, c] of cells) {
    const cell = boardElement.children[r * COLS + c];
    cell.classList.add("winner");
  }
}

function clearWinnerHighlight() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = boardElement.children[r * COLS + c];
      cell.classList.remove("winner");
    }
  }
}

resetBtn.addEventListener("click", resetGame);
initBoard();

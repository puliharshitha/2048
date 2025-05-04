let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function () {
    setGame();
};

function setGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    addRandomTile();
    addRandomTile();
    updateBoard();
    document.addEventListener("keyup", handleInput);
}

function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }

    if (emptyTiles.length === 0) return;

    let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let value = board[r][c];
            tile.innerText = value === 0 ? "" : value;
            tile.className = "tile";
            if (value > 0) {
                tile.classList.add(`x${value}`);
            }
        }
    }

    document.getElementById("score").innerText = score;
}

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }

    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function rotateLeft(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function rotateRight(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function handleInput(e) {
    let played = false;

    if (e.code === "ArrowLeft") {
        for (let r = 0; r < rows; r++) {
            let original = [...board[r]];
            board[r] = slide(board[r]);
            if (!played && board[r].toString() !== original.toString()) played = true;
        }
    } else if (e.code === "ArrowRight") {
        for (let r = 0; r < rows; r++) {
            let original = [...board[r]];
            board[r] = slide(board[r].reverse()).reverse();
            if (!played && board[r].toString() !== original.toString()) played = true;
        }
    } else if (e.code === "ArrowUp") {
        board = rotateLeft(board);
        for (let r = 0; r < rows; r++) {
            board[r] = slide(board[r]);
        }
        board = rotateRight(board);
        played = true;
    } else if (e.code === "ArrowDown") {
        board = rotateLeft(board);
        for (let r = 0; r < rows; r++) {
            board[r] = slide(board[r].reverse()).reverse();
        }
        board = rotateRight(board);
        played = true;
    }

    if (played) {
        addRandomTile();
        updateBoard();
    }
}

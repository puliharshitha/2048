const moveSound = document.getElementById("move-audio");

let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function () {
    setGame();
};

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            tile.innerText = "2";
            tile.className = "tile x2";
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
        }
    }
    return false;
}

document.addEventListener("keyup", (e) => {
    let moved = false;

    if (e.code === "ArrowLeft") {
        moved = slideLeft();
    } else if (e.code === "ArrowRight") {
        moved = slideRight();
    } else if (e.code === "ArrowUp") {
        moved = slideUp();
    } else if (e.code === "ArrowDown") {
        moved = slideDown();
    }

    if (moved) {
        setTwo();
        moveSound.play();
        document.getElementById("score").innerText = score;
    }
});

function slide(row) {
    row = row.filter(num => num !== 0);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = row.filter(num => num !== 0);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            tile.innerText = num === 0 ? "" : num;
            tile.className = "tile";
            if (num > 0) {
                tile.classList.add(num <= 4096 ? "x" + num : "x8192");
            }
        }
    }
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }

        if (originalRow.toString() !== row.toString()) {
            moved = true;
        }
    }

    if (moved) {
        moveSound.play();
        setTwo();
    }
}


function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let original = [...board[r]];
        let reversed = [...board[r]].reverse();
        let newRow = slide(reversed).reverse();
        board[r] = newRow;
        if (!arraysEqual(original, newRow)) moved = true;
    }
    updateBoard();
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [];
        for (let r = 0; r < rows; r++) col.push(board[r][c]);

        let original = [...col];
        let newCol = slide(col);

        for (let r = 0; r < rows; r++) board[r][c] = newCol[r];
        if (!arraysEqual(original, newCol)) moved = true;
    }
    updateBoard();
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let col = [];
        for (let r = 0; r < rows; r++) col.push(board[r][c]);

        let original = [...col];
        let newCol = slide(col.reverse()).reverse();

        for (let r = 0; r < rows; r++) board[r][c] = newCol[r];
        if (!arraysEqual(original, newCol)) moved = true;
    }
    updateBoard();
    return moved;
}

function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

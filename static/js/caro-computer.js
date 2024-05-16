// Khai báo bảng và người chơi đầu được sử dụng "X"
const boardElement = document.getElementById('board');
const board = [];
let currentPlayer = 'X';

// Tạo bảng 20x20 
for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        boardElement.appendChild(cell);
        board.push(cell);
    }
}

// Handle mỗi Click và xử lý logic sau mỗi lần chọn vị trí
function handleClick(e) {
    // Kiểm tra xem ô đã được đánh chưa
    if (e.target.textContent === '') {
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        // Highlight cell sau khi đánh
        e.target.classList.add('highlight');
        const index = board.indexOf(e.target);
        if (checkWin(index, currentPlayer)) {
            setTimeout(function() {
                alert('You win!');
                resetGame();
            }, 100); // Thêm trễ 100ms
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // Máy tính đánh ngay sau khi người chơi đã đánh
        const computerMove = getComputerMove();
        // Kiểm tra xem ô đã được đánh chưa
        if (board[computerMove[0] * 20 + computerMove[1]].textContent === '') {
            board[computerMove[0] * 20 + computerMove[1]].textContent = currentPlayer;
            board[computerMove[0] * 20 + computerMove[1]].classList.add(currentPlayer.toLowerCase());
            board[computerMove[0] * 20 + computerMove[1]].classList.add('highlight'); // Highlight the cell
            if (checkWin(computerMove[0] * 20 + computerMove[1], currentPlayer)) {
                setTimeout(function() {
                    alert('Computer wins!');
                    resetGame();
                }, 100); // Thêm trễ 100ms
                return;
            }
            else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
}

function checkWin(index, player) {
    const row = Math.floor(index / 20); // Lấy số hàng 
    const col = index % 20; // Lấy số cột
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1]
    ];
    for (const [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            const x = row + dx * i;
            const y = col + dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        for (let i = 1; i < 5; i++) {
            const x = row - dx * i;
            const y = col - dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        if (count >= 5) {
            return true;
        }
    }
    return false;
}

// Hàm đánh giá điểm cho từng vị trí trên bảng
function evaluatePosition(row, col, player) {
    const directions = [
        [0, 1], // Ngang
        [1, 0], // Dọc
        [1, 1], // Chéo phải
        [1, -1] // Chéo trái
    ];

    let maxScore = -Infinity;

    for (const [dx, dy] of directions) {
        let count = 1;
        let blocked = 0;

        for (let i = 1; i < 5; i++) {
            const x = row + dx * i;
            const y = col + dy * i;

            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                blocked++;
                break;
            }

            count++;
        }

        for (let i = 1; i < 5; i++) {
            const x = row - dx * i;
            const y = col - dy * i;

            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                blocked++;
                break;
            }

            count++;
        }

        if (blocked === 2) {
            count = 0; // Nếu bị chặn ở cả hai đầu, đặt count = 0
        }

        maxScore = Math.max(maxScore, count);
    }

    return maxScore;
}

// Hàm kiểm tra số điểm phòng thủ
function evaluateDefensePosition(row, col, player) {
    const directions = [
        [0, 1], // Ngang
        [1, 0], // Dọc
        [1, 1], // Chéo phải
        [1, -1] // Chéo trái
    ];

    let maxScore = 0; // Đặt giá trị thấp để ưu tiên phòng thủ

    for (const [dx, dy] of directions) {
        let count = 1;

        for (let i = 1; i < 5; i++) {
            const x = row + dx * i;
            const y = col + dy * i;

            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }

            count++;
        }

        for (let i = 1; i < 5; i++) {
            const x = row - dx * i;
            const y = col - dy * i;

            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }

            count++;
        }

        maxScore = Math.max(maxScore, count);
    }

    return maxScore;
}

// Hàm lấy danh sách các điểm có điểm số cao nhất
function getBestPoints() {
    let maxAttackScore = -Infinity;
    let maxDefenseScore = -Infinity;
    let bestAttackPoints = [];
    let bestDefensePoints = [];

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (board[i * 20 + j].textContent === "") {
                const attackScore = evaluatePosition(i, j, 'O');
                const defenseScore = evaluateDefensePosition(i, j, 'X');

                if (attackScore > maxAttackScore) {
                    maxAttackScore = attackScore;
                    bestAttackPoints = [
                        [i, j]
                    ];
                } else if (attackScore === maxAttackScore) {
                    bestAttackPoints.push([i, j]);
                }

                if (defenseScore > maxDefenseScore) {
                    maxDefenseScore = defenseScore;
                    bestDefensePoints = [
                        [i, j]
                    ];
                } else if (defenseScore === maxDefenseScore) {
                    bestDefensePoints.push([i, j]);
                }
            }
        }
    }

    // Ưu tiên tấn công nếu có điểm tấn công bằng điểm phòng thủ
    return maxAttackScore >= maxDefenseScore ? bestAttackPoints : bestDefensePoints;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const player = maximizingPlayer ? 'O' : 'X';
    const opponent = maximizingPlayer ? 'X' : 'O';
    let bestMove;
    // Tạo một bản sao của board
    const boardCopy = [...board];
    if (depth == 0) {
        // Sử dụng boardCopy thay vì board
        let maxScore = -Infinity;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if (boardCopy[i * 20 + j].textContent === "") {
                    const score = evaluatePosition(i, j, player);
                    const defenseScore = evaluateDefensePosition(i, j, opponent);
                    if (score + defenseScore > maxScore) {
                        maxScore = score + defenseScore;
                        bestMove = [i, j];
                    }
                }
            }
        }
        return { score: maxScore, move: bestMove };
    }

    const bestPoints = getBestPoints();
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const point of bestPoints) {
            // Sử dụng boardCopy thay vì board
            boardCopy[point[0] * 20 + point[1]].textContent = player;
            if (checkWin(point[0] * 20 + point[1], player)) {
                boardCopy[point[0] * 20 + point[1]].textContent = '';
                return { score: 1000, move: point };
            }
            const evalObj = minimax(boardCopy, depth - 1, alpha, beta, false);
            if (evalObj.score > maxEval) {
                maxEval = evalObj.score;
                bestMove = point;
            }
            boardCopy[point[0] * 20 + point[1]].textContent = '';
            alpha = Math.max(alpha, evalObj.score);
            if (beta <= alpha) {
                break;
            }
        }
        return { score: maxEval, move: bestMove };
    } else {
        let minEval = Infinity;
        for (const point of bestPoints) {
            // Sử dụng boardCopy thay vì board
            boardCopy[point[0] * 20 + point[1]].textContent = opponent;
            if (checkWin(point[0] * 20 + point[1], opponent)) {
                boardCopy[point[0] * 20 + point[1]].textContent = '';
                return { score: -1000, move: point };
            }
            const evalObj = minimax(boardCopy, depth - 1, alpha, beta, true);
            if (evalObj.score < minEval) {
                minEval = evalObj.score;
                bestMove = point;
            }
            boardCopy[point[0] * 20 + point[1]].textContent = '';
            beta = Math.min(beta, evalObj.score);
            if (beta <= alpha) {
                break;
            }
        }
        return { score: minEval, move: bestMove };
    }
}

// Hàm trả về nước đi máy tính
function getComputerMove() {
    const bestMove = minimax(board, 7, -Infinity, Infinity, true).move;
    return bestMove;
}

function resetGame() {
    // Xóa tất cả các nước đi trên bảng
    for (let i = 0; i < board.length; i++) {
        board[i].textContent = '';
        // Thêm lại sự kiện click vào ô
        board[i].addEventListener('click', handleClick, { once: true });
        // Xóa các sự kiện highlight và tô màu 
        board[i].classList.remove('x', 'o', 'highlight');
    }
    // Đặt lại người chơi hiện tại
    currentPlayer = 'X';
}

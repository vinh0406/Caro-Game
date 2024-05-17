// Khai báo bảng và người chơi đầu được sử dụng "X"
const boardElement = document.getElementById('board');
const board = [];
let currentPlayer = 'X';
let winSound = new Audio('static/sounds/won.mp3');

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
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());
    // Highlight cell sau khi đánh
    e.target.classList.add('highlight');
    const index = board.indexOf(e.target);
    if (checkWin(index, currentPlayer)) {
        winSound.play(); // Phát âm thanh khi thắng
        setTimeout(function() {
            alert(' Player ' + currentPlayer + ' wins!');
            resetGame();
        }, 100); // Thêm trễ 100ms
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}


// Hàm kiểm tra trả về kết quả (Thắng - Hòa)
function checkWin(index, player) {
    const row = Math.floor(index / 20);
    const col = index % 20;
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

function resetGame() {
    // Xóa tất cả các nước đi trên bảng
    for (let i = 0; i < board.length; i++) {
        board[i].textContent = '';
        board[i].addEventListener('click', handleClick, { once: true }); // Thêm lại sự kiện click vào ô
        board[i].classList.remove('x', 'o', 'highlight'); // Xóa các sự kiện highlight và tô màu 
    }
    // Đặt lại người chơi hiện tại
    currentPlayer = 'X';
}

// Khai báo bảng và người chơi đầu được sử dụng "X"
const boardElement = document.getElementById('board');
/**@const {Object} boardElement - Đối tượng DOM của bảng. Được 
lấy từ document.getElementById('board').*/
const board = [];
/**@const {Array} board - Mảng chứa tất cả các ô trong bảng. Mỗi ô 
là một đối tượng DOM được tạo từ document.createElement('div')*/
let currentPlayer = 'X';
/**@let {String} currentPlayer - Người chơi hiện tại, được khởi tạo là 
'X'. Giá trị này sẽ thay đổi sau mỗi lượt chơi*/
let winSound = new Audio('static/sounds/won.mp3');
/**@let {Object} winSound - Âm thanh được phát khi một người chơi 
thắng. Được tạo từ new Audio('static/sounds/won.mp3')*/

/** Trò chơi bắt đầu bằng việc tạo một bảng 20x20 và thiết lập người 
chơi đầu tiên là 'X'.*/
for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        boardElement.appendChild(cell);
        board.push(cell);
    }
}

/**@function handleClick(e) - Xử lý sự kiện click vào một ô. Cập nhật 
ô được chọn với ký tự của người chơi hiện tại, kiểm tra xem người 
chơi có thắng hay không và chuyển lượt chơi.*/
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


/**@function checkWin(index, player) - Kiểm tra xem người chơi đã 
thắng sau lượt chơi hiện tại hay chưa. Sử dụng thuật toán kiểm tra 
hàng, cột và đường chéo.*/
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

/**@function resetGame() - Đặt lại trò chơi, xóa tất cả các nước đi và 
đặt lại người chơi hiện tại là 'X'. Xóa tất cả các sự kiện highlight và tô 
màu trên bảng.*/
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

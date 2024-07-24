const Gameboard = (function() {
    let board = new Array(9);
    let moves = 0;
    const playMove = function(player, slot) {
        if (slot > 8 || slot < 0 || board[slot] !== undefined) {
            return false;
        }
        board[slot] = player;
        moves++;
        return true;
    }

    const checkEnd = function(slot, mark) {
        const row = Math.floor(slot / 3); // 0 - 2
        const col = slot % 3; // 0 - 2
        
        let res = [];
        for (let i = 0; i < 3; i++) {
            const index = 3 * row + i;
            if (board[index] !== mark) {
                res = [];
                break;
            }
            res.push(index);
        }

        if (res.length) {
            return res;
        }

        for (let i = 0; i < 3; i++) {
            const index = col + 3 * i;
            if (board[index] !== mark) {
                res = [];
                break;
            }
            res.push(index);
        }

        if (res.length) {
            return res;
        }

        if (row === 1 || col === 1 && !(row === 1 && col === 1)) {
            if (moves === 9) {
                return [];
            }
            return null;
        }

        res = [0, 4, 8]
        for (const i of res) {
            if (board[i] !== mark) {
                res = []
            }
        }

        if (res.length) {
            return res;
        }

        res = [2, 4, 6]
        for (const i of res) {
            if (board[i] !== mark) {
                if (moves === 9) {
                    return [];
                }
                return null;
            }
        }

        return res;
    }
    return {playMove, checkEnd};
})();

const createPlayer = (function(mark, name) {
    function getName() {
        return name;
    }
    function playMove(slot) {
        return Gameboard.playMove(mark, slot);
    }
    return {mark, name, getName, playMove};
})

const GameController = (function() {
    const player1 = createPlayer("X", "Tom");
    const player2 = createPlayer("O", "Jerry");

    let currentPlayer;
    let winningCoords = null;

    const start = prompt("start game");

    while (winningCoords === null) {
        currentPlayer = currentPlayer === player1 ? player2 : player1;

        let move = prompt("input move");

        currentPlayer.playMove(move);

        winningCoords = Gameboard.checkEnd(move, currentPlayer.mark);
    }

    if (winningCoords.length === 0) {
        console.log("It's a tie");
    } else {
        console.log(`${currentPlayer.getName()} wins!`);
    }
})();


const Gameboard = (function() {
    let board;
    let moves;
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

    function restart() {
        board = new Array(9);
        moves = 0;
    }
    return {playMove, checkEnd, restart};
})();

const createPlayer = (function(mark, name) {
    let score = 0;
    function getName() {
        return name;
    }
    function playMove(slot) {
        return Gameboard.playMove(mark, slot);
    }
    return {mark, name, score, getName, playMove};
})

const GameController = (function() {
    let player1;
    let player2;
    let currentPlayer;
    function startGame(name1, name2) {
        Gameboard.restart();
        player1 = createPlayer("X", name1);
        player2 = createPlayer("O", name2);
    }
    
    function restart() {
        Gameboard.restart();
    }
    
    function playMove(move) {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    
        currentPlayer.playMove(move);

        const winningCoords = Gameboard.checkEnd(move, currentPlayer.mark);

        if (winningCoords === null) {
            return;
        } else if (winningCoords.length === 0) {
            endGame(0);
        } else {
            let state = 1;
            if (currentPlayer === player2) {
                state = 2;
            }
            endGame(state);
        }
    }

    function endGame(state) {
        if (state !== 0) {
            currentPlayer.score++;
        }
        DisplayController.endGame(state, currentPlayer);
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }
    
    return {startGame, playMove, getCurrentPlayer, restart};
})();

GameController.startGame("Player 1", "Player 2");

const DisplayController = (function() {
    const board = document.querySelector(".board");
    const score1 = document.querySelector(".score1");
    const score2 = document.querySelector(".score2");
    const restartButton = document.querySelector(".restart");  
    const results = document.querySelector(".results");  

    restartButton.addEventListener("click", restart);
    board.addEventListener("click", clickSquare);

    results.addEventListener("click", () => {
        results.close();
    })

    function clickSquare(e) {
        const square = e.target;
        if (square.classList.contains("X") || square.classList.contains("O")) {
            return;
        }
        GameController.playMove(e.target.id);
        square.classList.add(GameController.getCurrentPlayer().mark);
    }

    function restart() {
        for (const square of board.children) {
            square.className = "square";
        }
        board.addEventListener("click", clickSquare);
        GameController.restart();
    }

    function endGame(state, winner) {
        board.removeEventListener("click", clickSquare);
        if (state === 1) {
            score1.textContent = winner.score;
        } else if (state === 2) {
            score2.textContent = winner.score;
        }
        displayResults(state, winner);
    }

    function displayResults(state, winner) {
        if (state === 0) {
            results.textContent = "It's a tie!";
        } else {
            results.textContent = `${winner.name} wins!`;
        }
        results.showModal();
    }

    return {endGame};
})();
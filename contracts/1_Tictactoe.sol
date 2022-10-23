// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title TicTacToe
 * @dev Implements a tic-tac-toe game with betting
 */
contract TicTacToe {
    enum Move {
        None,
        Player1,
        Player2
    }
    enum GameStatus {
        Lobby,
        Playing,
        Draw,
        WinPlayer1,
        WinPlayer2
    }
    address public player1;
    address public player2;
    
    event BoardChange();
    event PlayersChange();
    event GameReset();

    GameStatus public status;
    Move public nextMove;
    /** 
     * 0, 1, 2
     * 3, 4, 5
     * 6, 7, 8
     */
    Move[9] private board;

    constructor() {
        status = GameStatus.Lobby;
        nextMove = Move.Player1;
    }

    function joinGame() external {
        require(player1 == address(0) || player2 == address(0), "Game is full, wait your turn");
        if (player1 == address(0)) {
            player1 = msg.sender;
        } else {
            player2 = msg.sender;
            status = GameStatus.Playing; 
        }
        emit PlayersChange();
    }

    function resetGame() external {
        require(status != GameStatus.Playing, "Game is still running");
        status = GameStatus.Lobby;
        nextMove = Move.Player1;
        player1 = address(0);
        player2 = address(0);
        delete board;
        emit GameReset();
    }

    function doMove(uint8 location) external {

        require(player1 != address(0), "First player hasn't joined");
        require(player2 != address(0), "Second player hasn't joined");
        require(status == GameStatus.Playing, "Game is over");
        require(location < 9, "Give a valid location");
        require(msg.sender == getCurrentPlayer(), "It's not your turn");
        require(board[location] == Move.None, "Someone already made this move");
        board[location] = nextMove;
        status = checkStatus();

        // Who has the next move?
        if (status != GameStatus.Playing) {
            nextMove = Move.None;
        } else if (nextMove == Move.Player1) {
            nextMove = Move.Player2;
        } else if (nextMove == Move.Player2) {
            nextMove = Move.Player1;
        }
        emit BoardChange();

    }

    function getBoard() external view returns(Move[9] memory) {
        return board;
    }

    // Private
    function isBoardFull() private view returns (bool) {
        for (uint i = 0; i < 9; i++) {
            if (board[i] == Move.None) {
                return false;
            }
        }
        return true;
    }

    /** 
    * @dev Return current game status
    */
    function checkStatus() private view returns (GameStatus) {

        uint8[3][8] memory winningMoves = [
            [0,1,2],[3,4,5],[6,7,8],  // rows
            [0,3,6],[1,4,7],[2,5,8],  // columns
            [0,4,8],[6,4,2]           // diagonals
        ];

        // Loop through all potential winning moves, check if they
        // are equal, and in that case return the winning player.
        for (uint8 i = 0; i < winningMoves.length; i++) {
            uint8[3] memory move = winningMoves[i];
            if (
                board[move[0]] == board[move[1]]
                && board[move[1]] == board[move[2]]
                && board[move[2]] != Move.None
            ) {
                if (board[move[0]] == Move.Player1) {
                    return GameStatus.WinPlayer1;
                }
                if (board[move[0]] == Move.Player2) {
                    return GameStatus.WinPlayer2;
                }
            }
        }

        if (isBoardFull()) {
            return GameStatus.Draw;
        }

        return GameStatus.Playing;
    }

    function getCurrentPlayer() private view returns (address player) {
        if (nextMove == Move.Player1) {
            return player1;
        }
        if (nextMove == Move.Player2) {
            return player2;
        }
        return address(0);
    }
}
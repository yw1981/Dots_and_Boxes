var gameLogic;
(function (gameLogic) {
    gameLogic.ROWSIZE = 3; //convenient to change board size later; ROWSIZE and COLSIZE does not need to be the same either.
    gameLogic.COLSIZE = 3;
    /** Returns the initial Dots_and_Boxes board, which is a 3x3 matrix containing 24 edges and 9 empty cells */
    function create2DArray(rowsize, colsize) {
        var arr = [];
        for (var i = 0; i < rowsize; i++) {
            var temp = [];
            for (var j = 0; j < colsize; j++) {
                temp[j] = [];
            }
            arr[i] = temp;
        }
        return arr;
    }
    function getInitialBoard() {
        var board = {};
        board.isGameOver = false;
        board.switchTurn = true;
        board.sumAllEdges = 0;
        board.score = [0, 0];
        board.chains = [];
        board.hor = create2DArray(gameLogic.ROWSIZE + 1, gameLogic.COLSIZE);
        for (var i = 0; i < gameLogic.ROWSIZE + 1; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                board.hor[i][j] = 0;
            }
        }
        board.ver = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE + 1);
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE + 1; ++j) {
                board.ver[i][j] = 0;
            }
        }
        board.color = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE);
        board.sum = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE);
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                board.color[i][j] = '';
                board.sum[i][j] = 0;
            }
        }
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function printBoard(board) {
        if (!board) {
            console.log("board is undefined");
        }
        console.log('isGameOver=' + board.isGameOver, ' switchTurn=' + board.switchTurn, ' sumAllEdges=' + board.sumAllEdges, ' score=' + board.score);
        if (board.hor) {
            var output = '';
            output = output + 'hor: [';
            for (var i = 0; i < gameLogic.ROWSIZE + 1; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.hor[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.ver) {
            var output = '';
            output = output + 'ver: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE + 1; ++j) {
                    output = output + board.ver[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.sum) {
            var output = '';
            output = output + 'sum: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.sum[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.color) {
            var output = '';
            output = output + 'color: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.color[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
    }
    gameLogic.printBoard = printBoard;
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove; turnIndex = 0 for YOU and 1 for ME
     * Returns an empty array if the game is over.
     */
    /*  export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
        var possibleMoves: IMove[] = [];
        for (var i = 0; i < ROWSIZE+1; i++) {
          for (var j = 0; j < COLSIZE; j++) {
            try {
              possibleMoves.push(createMove(board, 'hor', i, j, turnIndexBeforeMove));
            } catch (e) {
              // The cell in that position was full.
            }
          }
        }
        for (var i = 0; i < ROWSIZE; i++) {
          for (var j = 0; j < COLSIZE+1; j++) {
            try {
              possibleMoves.push(createMove(board, 'ver', i, j, turnIndexBeforeMove));
            } catch (e) {
              // The cell in that position was full.
            }
          }
        }
        return possibleMoves;
      } */
    function updateBoard(board, dir, row, col, turnIndexBeforeMove) {
        var boardAfterMove = angular.copy(board);
        if (dir === 'hor') {
            boardAfterMove.hor[row][col] = 1;
            if (row !== 0) {
                boardAfterMove.sum[row - 1][col] += 1;
                if (boardAfterMove.sum[row - 1][col] === 4) {
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row - 1][col] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row - 1][col] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
            if (row !== gameLogic.ROWSIZE) {
                boardAfterMove.sum[row][col] += 1; // check lower cell's sum
                if (boardAfterMove.sum[row][col] === 4) {
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row][col] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row][col] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
        }
        else {
            boardAfterMove.ver[row][col] = 1;
            if (col !== 0) {
                boardAfterMove.sum[row][col - 1] += 1;
                if (boardAfterMove.sum[row][col - 1] === 4) {
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row][col - 1] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row - 1][col] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
            else if (col !== gameLogic.COLSIZE) {
                boardAfterMove.sum[row][col] += 1;
                if (boardAfterMove.sum[row][col] === 4) {
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row][col] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row][col] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
        }
        boardAfterMove.sumAllEdges++;
        if (boardAfterMove.sumAllEdges === 24) {
            boardAfterMove.isGameOver = true;
        }
        return boardAfterMove;
    }
    gameLogic.updateBoard = updateBoard;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(// remember to change the signature of createMove in other files
        board, dir, row, col, turnIndexBeforeMove) {
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        if ((dir === 'hor' && board.hor[row][col] === 1) || (dir === 'ver' && board.ver[row][col] === 1)) {
            throw new Error("One can only make a move in an empty position!");
        }
        if (board.isGameOver) {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove = updateBoard(board, dir, row, col, turnIndexBeforeMove);
        //var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (boardAfterMove.isGameOver) {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: boardAfterMove.score } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            if (boardAfterMove.switchTurn) {
                firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            }
            else {
                firstOperation = { setTurn: { turnIndex: turnIndexBeforeMove } }; // if switchTurn is false, do not change turnIndex
            }
        }
        var delta = { dir: dir, row: row, col: col };
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: delta } }];
    }
    gameLogic.createMove = createMove;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        // The state and turn after move are not needed in Dots_and_Boxes (or in any game where all state is public).
        //var turnIndexAfterMove = params.turnIndexAfterMove;
        //var stateAfterMove = params.stateAfterMove;
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that move is legal.
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]
            var deltaValue = move[2].set.value; //see createMove's return signature
            var dir = deltaValue.dir;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, dir, row, col, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
})(gameLogic || (gameLogic = {}));

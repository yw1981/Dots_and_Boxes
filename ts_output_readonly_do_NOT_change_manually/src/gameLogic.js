var gameLogic;
(function (gameLogic) {
    /** Returns the initial Dots_and_Boxes board, which is a 3x3 matrix containing ''. */
    function getInitialBoard() {
        return { 'hor': [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
            'ver': [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            'color': [['', '', ''], ['', '', ''], ['', '', '']],
            'cellEdgeSum': [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
            'score': [0, 0],
            'chains': []
        };
    }
    gameLogic.getInitialBoard = getInitialBoard;
    /**
     * Returns true if the game ended in a tie because there are no empty cells.
     * Since this is a 3x3 board with two players, there will be no tie condition.
     * E.g., isTie returns true for the following board:
     *     [['X', 'O', 'X'],
     *      ['X', 'O', 'O'],
     *      ['O', 'X', 'X']]
     */
    /* function isTie(board: Board): boolean {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            // If there is an empty cell then we do not have a tie.
            return false;
          }
        }
      }
      // No empty cells, so we have a tie!
      return true;
    } */
    /**
     * Return the winner (either 'X' or 'O') or '' if there is no winner.
     * The board is a matrix of size 3x3 containing either 'X', 'O', or ''.
     * E.g., getWinner returns 'X' for the following board:
     *     [['X', 'O', ''],
     *      ['X', 'O', ''],
     *      ['X', '', '']]
     */
    function getWinner(board) {
        var boardString = '';
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var cell = board[i][j];
                boardString += cell === '' ? ' ' : cell;
            }
        }
        var win_patterns = [
            'XXX......',
            '...XXX...',
            '......XXX',
            'X..X..X..',
            '.X..X..X.',
            '..X..X..X',
            'X...X...X',
            '..X.X.X..'
        ];
        for (i = 0; i < win_patterns.length; i++) {
            var win_pattern = win_patterns[i];
            var x_regexp = new RegExp(win_pattern);
            var o_regexp = new RegExp(win_pattern.replace(/X/g, 'O'));
            if (x_regexp.test(boardString)) {
                return 'X';
            }
            if (o_regexp.test(boardString)) {
                return 'O';
            }
        }
        return '';
    }
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                try {
                    possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
                }
                catch (e) {
                }
            }
        }
        return possibleMoves;
    }
    gameLogic.getPossibleMoves = getPossibleMoves;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(board, dir, row, col, turnIndexBeforeMove) {
        if (!board) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = getInitialBoard();
        }
        if ((dir === 'hor' && board.hor[row][col] === 1) || (dir === 'ver' && board.ver[row][col] === 1)) {
            throw new Error("One can only make a move in an empty position!");
        }
        if (getWinner(board) !== '') {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove = angular.copy(board);
        if (dir === 'hor') {
            boardAfterMove.hor[row][col] = 1;
        }
        else if (dir === 'ver') {
            boardAfterMove.ver[row][col] = 1;
        }
        var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (winner !== '' || isTie(boardAfterMove)) {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: winner === 'X' ? [1, 0] : winner === 'O' ? [0, 1] : [0, 0] } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
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
            var deltaValue = move[2].set.value;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, deltaValue.dir, row, col, turnIndexBeforeMove);
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

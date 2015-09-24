interface Board {
  isGameOver: boolean,
  switchTurn: boolean,
  hor: number[][],
  ver: number[][],
  color: string[][], //color/occupier of each cell/box
  sum: number[][], // sum of all filled edges for each cell
  sumAllEdges: number, //help to identify if game is over
  score: number[], // score[0] = Your score, score[1] = my score
  chains: number[] //don't check chains yet, leave it for when writing AI
}
interface BoardDelta {
  dir: string;
  row: number;
  col: number;
}
interface IState {
  board?: Board;
  delta?: BoardDelta
}

module gameLogic {

  const ROWSIZE = 3; //convenient to change board size later; ROWSIZE and COLSIZE does not need to be the same either.
  const COLSIZE = 3;
  /** Returns the initial Dots_and_Boxes board, which is a 3x3 matrix containing 24 edges and 9 empty cells */
  export function getInitialBoard(): Board {
    var board = <Board>{};
    board.isGameOver = false;
    board.switchTurn = true;
    board.sumAllEdges = 0;
    board.score = [0, 0];
    board.chains = [];
    for (var i = 0; i < ROWSIZE+1; ++i) {
      for (var j = 0; j < COLSIZE; ++j) {
        board.hor[i][j] = 0;
      }
    }
    for (var i = 0; i < ROWSIZE; ++i) {
      for (var j = 0; j < COLSIZE+1; ++j) {
        board.ver[i][j] = 0;
      }
    }
    for (var i = 0; i < ROWSIZE; ++i) {
      for (var j = 0; j < COLSIZE; ++j) {
        board.color[i][j] = '';
        board.sum[i][j] = 0;
      }
    }
    return board;
  }

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

  /*function getWinner(board: Board): string { //check the current winner after each createMove
    if board.score[0]>board.score[1] {
      return 'YOU';
    }
    else return 'ME';
  }*?

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove; turnIndex = 0 for YOU and 1 for ME
   * Returns an empty array if the game is over.
   */
  export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
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
  }

  function updateBoard(board: Board, dir: string, row: number, col: number, turnIndexBeforeMove: number):Board {
    var boardAfterMove = angular.copy(board);
    if (dir === 'hor') {
      boardAfterMove.hor[row][col] = 1;
      if (row !== 0) { //if not any cell on top line, check upper cell's sum
        boardAfterMove.sum[row-1][col] += 1;
        if (boardAfterMove.sum[row-1][col] === 4) {
          boardAfterMove.switchTurn = false;
          if (turnIndexBeforeMove === 0) {
            boardAfterMove.color[row-1][col] = 'YOU';
            boardAfterMove.score[0]++;
          }
          else {
            boardAfterMove.color[row-1][col] = 'ME';
            boardAfterMove.score[1]++;
          }
        }
      }
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

    else { // else if (dir === 'ver')
      boardAfterMove.ver[row][col] = 1;
      if (col !== 0) {
        boardAfterMove.sum[row][col-1] += 1;
        if (boardAfterMove.sum[row][col-1] === 4) {
          boardAfterMove.switchTurn = false;
          if (turnIndexBeforeMove === 0) {
            boardAfterMove.color[row][col-1] = 'YOU';
            boardAfterMove.score[0]++;
          }
          else {
            boardAfterMove.color[row-1][col] = 'ME';
            boardAfterMove.score[1]++;
          }
        }
      }
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
    boardAfterMove.sumAllEdges++;
    if (boardAfterMove.sumAllEdges === 24) {
      boardAfterMove.isGameOver = true;
    }
    return boardAfterMove;
  }
  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove( // remember to change the signature of createMove in other files
      board: Board, dir: string, row: number, col: number, turnIndexBeforeMove: number): IMove {
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
    var boardAfterMove:Board = updateBoard(board, dir, row, col, turnIndexBeforeMove);
    //var winner = getWinner(boardAfterMove);
    var firstOperation: IOperation;
    if (boardAfterMove.isGameOver) {
      // Game over.
      firstOperation = {endMatch: {endMatchScores: boardAfterMove.score}};
    } else {
      // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
      if (boardAfterMove.switchTurn) {
        firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
      }
      /*else {
        firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}}; // if switchTurn is false, do not change turnIndex
      }*/
    }
    var delta: BoardDelta = {dir: dir, row: row, col: col};
    return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: delta}}];
  }

  export function isMoveOk(params: IIsMoveOk): boolean {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove: IState = params.stateBeforeMove;
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
      var deltaValue: BoardDelta = move[2].set.value; //see createMove's return signature
      var dir = deltaValue.dir;
      var row = deltaValue.row;
      var col = deltaValue.col;
      var board = stateBeforeMove.board;
      var expectedMove = createMove(board, dir, row, col, turnIndexBeforeMove);
      if (!angular.equals(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      // if there are any exceptions then the move is illegal
      return false;
    }
    return true;
  }
}

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
  export const ROWSIZE = 3; //convenient to change board size later; ROWSIZE and COLSIZE does not need to be the same either.
  export const COLSIZE = 3;
  /** Returns the initial Dots_and_Boxes board, which is a 3x3 matrix containing 24 edges and 9 empty cells */
  function create2DArray(rowsize: number, colsize: number) {
    var arr: any[] = [];
    for (var i=0; i<rowsize; i++) {
      var temp:any[] = [];
      for (var j=0; j<colsize; j++) {
        temp[j] = [];
      }
      arr[i] = temp;
    }
    return arr;
  }

  export function getInitialBoard(): Board {
    var board = <Board>{};
    board.isGameOver = false;
    board.switchTurn = true;
    board.sumAllEdges = 0;
    board.score = [0, 0];
    board.chains = [];
    board.hor = create2DArray(ROWSIZE+1, COLSIZE);
    for (var i = 0; i < ROWSIZE+1; ++i) {
      for (var j = 0; j < COLSIZE; ++j) {
        board.hor[i][j] = 0;
      }
    }
    board.ver = create2DArray(ROWSIZE, COLSIZE+1);
    for (var i = 0; i < ROWSIZE; ++i) {
      for (var j = 0; j < COLSIZE+1; ++j) {
        board.ver[i][j] = 0;
      }
    }
    board.color = create2DArray(ROWSIZE, COLSIZE);
    board.sum = create2DArray(ROWSIZE, COLSIZE);
    for (var i = 0; i < ROWSIZE; ++i) {
      for (var j = 0; j < COLSIZE; ++j) {
        board.color[i][j] = '';
        board.sum[i][j] = 0;
      }
    }
    return board;
  }
//helper function for debugging
  export function printBoard(board:Board):void {
    if ( !board ) {
      console.log("board is undefined");
    }
    console.log('isGameOver='+board.isGameOver,' switchTurn='+board.switchTurn, ' sumAllEdges='+board.sumAllEdges, ' score='+board.score);
    if (board.hor){
      var output:string = '';
      output = output+'hor: [';
      for (var i = 0; i < ROWSIZE+1; ++i) {
        output = output + '[';
        for (var j = 0; j < COLSIZE; ++j) {
          output = output+board.hor[i][j] + ', ';
        }
        output = output + ']';
      }
      output = output + ']';
      console.log(output);
    }
    if (board.ver){
      var output:string = '';
      output = output+'ver: [';
      for (var i = 0; i < ROWSIZE; ++i) {
        output = output + '[';
        for (var j = 0; j < COLSIZE+1; ++j) {
          output = output+board.ver[i][j] + ', ';
        }
        output = output + ']';
      }
      output = output + ']';
      console.log(output);
    }
    if (board.sum){
      var output:string = '';
      output = output+'sum: [';
      for (var i = 0; i < ROWSIZE; ++i) {
        output = output + '[';
        for (var j = 0; j < COLSIZE; ++j) {
          output = output+board.sum[i][j] + ', ';
        }
        output = output + ']';
      }
      output = output + ']';
      console.log(output);
    }
    if (board.color){
      var output:string = '';
      output = output+'color: [';
      for (var i = 0; i < ROWSIZE; ++i) {
        output = output + '[';
        for (var j = 0; j < COLSIZE; ++j) {
          output = output+board.color[i][j] + ', ';
        }
        output = output + ']';
      }
      output = output + ']';
      console.log(output);
    }
}
  export function printDelta(delta: BoardDelta):void {
    var output:string = '';
    output = delta.dir + ":" + delta.row + "x" + delta.col;
    console.log(output);
  }
  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove; turnIndex = 0 for YOU and 1 for ME
   * Returns an empty array if the game is over.
   */


  export function updateBoard(board: Board, dir: string, row: number, col: number, turnIndexBeforeMove: number):Board {
    board.switchTurn = true;
    var boardAfterMove = angular.copy(board);
    if (dir === 'hor') {
      boardAfterMove.hor[row][col] = 1;
      if (row !== 0) { //if not any cell on top line, check upper cell's sum
        boardAfterMove.sum[row-1][col] += 1;
        if (boardAfterMove.sum[row-1][col] === 4) {
          console.log("set switchTurn to false");
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
      if (row !== ROWSIZE) {
        boardAfterMove.sum[row][col] += 1; // check lower cell's sum
        if (boardAfterMove.sum[row][col] === 4) {
          console.log("set switchTurn to false");
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

    else { // else if (dir === 'ver')
      boardAfterMove.ver[row][col] = 1;
      if (col !== 0) {
        boardAfterMove.sum[row][col-1] += 1;
        if (boardAfterMove.sum[row][col-1] === 4) {
          console.log("set switchTurn to false");
          boardAfterMove.switchTurn = false;
          if (turnIndexBeforeMove === 0) {
            boardAfterMove.color[row][col-1] = 'YOU';
            boardAfterMove.score[0]++;
          }
          else {
            boardAfterMove.color[row][col-1] = 'ME';
            boardAfterMove.score[1]++;
          }
        }
      }
     if (col !== COLSIZE) {
        boardAfterMove.sum[row][col] += 1;
        if (boardAfterMove.sum[row][col] === 4) {
          console.log("set switchTurn to false");
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
      else {
        firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}}; // if switchTurn is false, do not change turnIndex
      }
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

  //helper function to check if a move is legal, different from isMoveOk
  function isMoveLegal(move: IMove): boolean {
    if (move[2].set.value.dir === "hor" && move[1].set.value.hor[move[2].set.value.row][move[2].set.value.col] !== 0 ) {
      return false;
    }
    else return true;
  }

}

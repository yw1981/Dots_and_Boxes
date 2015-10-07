module aiService {
  /** Returns the move that the computer player should do for the given updateUI. */
  export function findComputerMove(updateUI: IUpdateUI): IMove {
    return createComputerMove(
        updateUI.stateAfterMove.board,
        updateUI.turnIndexAfterMove,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000})
  }

  /** helper function to check which edges of a cell are filled and which are not*/
  //function emptyEdge(row: number, col: number): {}

  function stringifyTryMove(tryMove: BoardDelta): string {
    return "dir:"+tryMove.dir+"row:"+tryMove.row+"col:"+tryMove.col;
  }

  function tryAddPossibleMove(board: Board, tryMove: BoardDelta, turnIndexBeforeMove: number,
                              possibleMoves: IMove[], addedMoves: string[]){

    if (addedMoves.indexOf(stringifyTryMove(tryMove)) !== -1){
      return;
    }
    if (tryMove.dir === 'hor'){
      if (board.hor[tryMove.row][tryMove.col] === 0) {
        addedMoves.push(stringifyTryMove(tryMove));
        try {
          possibleMoves.push(gameLogic.createMove(board, 'hor', tryMove.row, tryMove.col, turnIndexBeforeMove));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    } else if (tryMove.dir === 'ver'){
      if (board.hor[tryMove.row][tryMove.col] === 0) { //only one edge can be 0, so can use else if
        addedMoves.push(stringifyTryMove(tryMove));
        try {
          possibleMoves.push(gameLogic.createMove(board, 'hor', tryMove.row, tryMove.col, turnIndexBeforeMove));
        } catch (e) {
          // The cell in that position was full.
        }
      }
    }
  }

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
   export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
     var possibleMoves: IMove[] = [];
     var addedMoves: string[] = [];
    //  for (var i = 0; i<gameLogic.ROWSIZE+1; ++i) {
    //    for (var j = 0; j < gameLogic.COLSIZE; ++j) {
    //      if (board.hor[i][j] === 0) {
    //        try {
    //          possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
    //        } catch (e) {
    //          // The cell in that position was full.
    //        }
    //      }
    //    }
    //  }
    //  for (var i = 0; i<gameLogic.ROWSIZE; ++i) {
    //    for (var j = 0; j < gameLogic.COLSIZE+1; ++j) {
    //      if (board.ver[i][j] === 0) {
    //        try {
    //          possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
    //        } catch (e) {
    //          // The cell in that position was full.
    //        }
    //      }
    //    }
    //  }


     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 3) {
           tryAddPossibleMove(board, {'dir': 'hor', 'row': i, 'col': j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {'dir': 'hor', 'row': i+1, 'col': j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {'dir': 'ver', 'row': i, 'col': j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {'dir': 'ver', 'row': i, 'col': j+1}, turnIndexBeforeMove, possibleMoves, addedMoves);
         }
       }
     }
     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 0 || board.sum[i][j] === 1) {
           tryAddPossibleMove(board, {dir: 'hor', row: i, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'hor', row: i+1, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'ver', row: i, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'ver', row: i, col: j+1}, turnIndexBeforeMove, possibleMoves, addedMoves);
         }
       }
     }
     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 2){
           tryAddPossibleMove(board, {dir: 'hor', row: i, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'hor', row: i+1, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'ver', row: i, col: j}, turnIndexBeforeMove, possibleMoves, addedMoves);
           tryAddPossibleMove(board, {dir: 'ver', row: i, col: j+1}, turnIndexBeforeMove, possibleMoves, addedMoves);
         }
       }
     }

    //console.log("size of possible moves = " + addedMoves.length);
    return possibleMoves;
  }

  /**
   * Returns the move that the computer player should do for the given board.
   * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
   * and it has either a millisecondsLimit or maxDepth field:
   * millisecondsLimit is a time limit, and maxDepth is a depth limit.
   */
  export function createComputerMove(
    board: Board, playerIndex: number, alphaBetaLimits: IAlphaBetaLimits): IMove {
    // We use alpha-beta search, where the search states are Dots_and_Boxes moves.
    // Recal that a Dots_and_Boxes move has 3 operations:
    // 0) endMatch or setTurn
    // 1) {set: {key: 'board', value: ...}}
    // 2) {set: {key: 'delta', value: ...}}]
    var move = alphaBetaService.alphaBetaDecision(
        [null, {set: {key: 'board', value: board}}],
        playerIndex, getNextStates, getStateScoreForIndex0,
        // If you want to see debugging output in the console, then surf to index.html?debug
        window.location.search === '?debug' ? getDebugStateToString : null,
        alphaBetaLimits);
    return move;
  }

  function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
    //return move[1].set.value.score[0] - move[1].set.value.score[1];
    if (move[0].endMatch) {
      console.log("%o", move[0]);
      let endMatchScores = move[0].endMatch.endMatchScores;
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
           : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
           : 0;
    } else if (move[0].set){
      console.log("%o", move[0]);
      return move[0].set.value.score[0] - move[0].set.value.score[1];
    }
    return 0;




  }

  function getNextStates(move: IMove, playerIndex: number): IMove[] {
    return getPossibleMoves(move[1].set.value, playerIndex);
  }

  function getDebugStateToString(move: IMove): string {
    return "\n" + move[1].set.value.join("\n") + "\n";
  }
}

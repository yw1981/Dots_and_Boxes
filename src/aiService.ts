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

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
   export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
     var possibleMoves: IMove[] = [];
     /*for (var i = 0; i<gameLogic.ROWSIZE+1; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; ++j) {
         if (board.hor[i][j] === 0) {
           try {
             possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
           } catch (e) {
             // The cell in that position was full.
           }
         }
       }
     }
     for (var i = 0; i<gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE+1; ++j) {
         if (board.ver[i][j] === 0) {
           try {
             possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
           } catch (e) {
             // The cell in that position was full.
           }
         }
       }
     } */

     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 3) {
           if (board.hor[i][j] === 0) { //only one edge can be 0, so can use else if
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.hor[i+1][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i+1, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j+1] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j+1, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
         }
       }
     }
     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 0 || board.sum[i][j] === 1) {
           if (board.hor[i][j] === 0) { //only one edge can be 0, so can use else if
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.hor[i+1][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i+1, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j+1] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j+1, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
         }
       }
     }
     for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
       for (var j = 0; j < gameLogic.COLSIZE; j++) {
         if (board.sum[i][j] === 2){
           if (board.hor[i][j] === 0) { //only one edge can be 0, so can use else if
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.hor[i+1][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'hor', i+1, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
           if (board.ver[i][j+1] === 0) {
             try {
               possibleMoves.push(gameLogic.createMove(board, 'ver', i, j+1, turnIndexBeforeMove));
             } catch (e) {
               // The cell in that position was full.
             }
           }
         }
       }
     }

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
    //return move[1].set.value.score[0];
    if (move[0].endMatch) {
      let endMatchScores = move[0].endMatch.endMatchScores;
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
          : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
          : 0;
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

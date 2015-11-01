module aiService {
  /** Returns the move that the computer player should do for the given updateUI. */
  export function findComputerMove(updateUI: IUpdateUI): IMove {
    return createComputerMove(
        updateUI.stateAfterMove.board,
        updateUI.turnIndexAfterMove,
        // at most 1 second for the AI to choose a move (but might be much quicker)
        {millisecondsLimit: 1000})
  }

  function printPossibleMoves(possibleMoves: IMove[]):void { //helper function
    let output: string = "possible moves:";
    for (var i = 0; i < possibleMoves.length; ++i) {
      output = output + possibleMoves[i][2].set.value.dir + ":" + possibleMoves[i][2].set.value.row + "x" + possibleMoves[i][2].set.value.col + ",";
    }
    console.log("possibleMoves.length = "+possibleMoves.length);
    console.log(output);
  }

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
   export function getPossibleMoves(board: Board, turnIndexBeforeMove: number): IMove[] {
     var possibleMoves: IMove[] = [];
     var addedMoves: string[] = [];
     for (let i = 0; i < gameLogic.ROWSIZE+1;i++) {
      for (let j = 0; j<gameLogic.COLSIZE; j++) {
        //console.log("i=" + i + ",j=" + j + ", ");
        if ( board.hor[i][j]===0 &&
              ( ( i!==0 && i!==gameLogic.ROWSIZE && (board.sum[i-1][j]===3 || board.sum[i][j]===3) ) ||
                (i===0 && board.sum[i][j]===3) ||
                (i===gameLogic.ROWSIZE && board.sum[i-1][j]===3) ) ) {
              try {
                possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
              } catch (e) {
                // The cell in that position was full.
              }
        }
      }
    }

    for (let i = 0; i < gameLogic.ROWSIZE;i++) {
      for (let j = 0; j<gameLogic.COLSIZE+1; j++) {
        if (  board.ver[i][j]===0 &&
              ( ( j!==0 && j!==gameLogic.COLSIZE && (board.sum[i][j-1]===3 || board.sum[i][j]===3) ) ||
                (j===0 && board.sum[i][j]===3) ||
                (j===gameLogic.COLSIZE && board.sum[i][j-1]===3) ) ) {
              try {
                possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
              } catch (e) {
                // The cell in that position was full.
              }
        }
      }
    }
    if (possibleMoves.length >= 1) {
      return possibleMoves;
    }

    for (let i = 0; i < gameLogic.ROWSIZE+1;i++) {
      for (let j = 0; j<gameLogic.COLSIZE; j++) {
        if ( board.hor[i][j]===0 &&
              ( ( i!==0 && i!==gameLogic.ROWSIZE && (board.sum[i-1][j]!==2 && board.sum[i][j]!==2) ) ||
                (i===0 && (board.sum[i][j]!==2) ) ||
                (i===gameLogic.ROWSIZE && (board.sum[i-1][j]!==2) ) ) ) {
                  try {
                    possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                  } catch (e) {
                    // The cell in that position was full.
                  }
        }
      }
    }

    for (let i = 0; i < gameLogic.ROWSIZE;i++) {
      for (let j = 0; j<gameLogic.COLSIZE+1; j++) {
        if ( board.ver[i][j]===0 &&
              ( ( j!==0 && j!==gameLogic.COLSIZE && (board.sum[i][j-1]!==2 && board.sum[i][j]!==2) ) ||
                (j===0 && (board.sum[i][j]!==2)) ||
                (j===gameLogic.COLSIZE && (board.sum[i][j-1]!==2) ) ) ) {
              try {
                possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
              } catch (e) {
                // The cell in that position was full.
              }
        }
      }
    }
    if (possibleMoves.length >= 1) {
      return possibleMoves;
    }

    for (let i = 0; i < gameLogic.ROWSIZE+1;i++) {
      for (let j = 0; j<gameLogic.COLSIZE; j++) {
          if (board.hor[i][j]===0) {
              try {
                possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
              } catch (e) {
                // The cell in that position was full.
              }
          }
      }
    }

    for (let i = 0; i < gameLogic.ROWSIZE;i++) {
      for (let j = 0; j<gameLogic.COLSIZE+1; j++) {
          if (board.ver[i][j]===0) {
              try {
                possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
              } catch (e) {
                // The cell in that position was full.
              }
          }
      }
    }

    return possibleMoves;
    //console.log("size of possible moves = " + addedMoves.length);
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
    // var move = alphaBetaService.alphaBetaDecision(
    //     [null, {set: {key: 'board', value: board}}],
    //     playerIndex, getNextStates, getStateScoreForIndex0,
    //     // If you want to see debugging output in the console, then surf to index.html?debug
    //     window.location.search === '?debug' ? getDebugStateToString : null,
    //     alphaBetaLimits);

    // choices are filetered at get possible move time.
    // random select among good choices is not bad
    var moves:IMove[] = getPossibleMoves(board, playerIndex);
    var random = Math.floor(moves.length * Math.random())
    return moves[random];
  }

  function getStateScoreForIndex0(move: IMove, playerIndex: number): number {
    //return move[1].set.value.score[0] - move[1].set.value.score[1];
    if (move[0].endMatch) {
      let endMatchScores = move[0].endMatch.endMatchScores;
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
           : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
           : 0;
    } else if (move[1].set){
      //console.log("%o", move[0]);
      return move[1].set.value.score[0] - move[1].set.value.score[1];
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

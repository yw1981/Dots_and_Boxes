var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given updateUI. */
    function findComputerMove(updateUI) {
        return createComputerMove(updateUI.stateAfterMove.board, updateUI.turnIndexAfterMove, 
        // at most 1 second for the AI to choose a move (but might be much quicker)
        { millisecondsLimit: 1000 });
    }
    aiService.findComputerMove = findComputerMove;
    /** helper function to check which edges of a cell are filled and which are not*/
    //function emptyEdge(row: number, col: number): {}
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
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
                    if (board.hor[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.hor[i + 1][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i + 1, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j + 1] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j + 1, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                }
            }
        }
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; j++) {
                if (board.sum[i][j] === 0 || board.sum[i][j] === 1) {
                    if (board.hor[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.hor[i + 1][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i + 1, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j + 1] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j + 1, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                }
            }
        }
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; j++) {
                if (board.sum[i][j] === 2) {
                    if (board.hor[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.hor[i + 1][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'hor', i + 1, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                    if (board.ver[i][j + 1] === 0) {
                        try {
                            possibleMoves.push(gameLogic.createMove(board, 'ver', i, j + 1, turnIndexBeforeMove));
                        }
                        catch (e) {
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }
    aiService.getPossibleMoves = getPossibleMoves;
    /**
     * Returns the move that the computer player should do for the given board.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    function createComputerMove(board, playerIndex, alphaBetaLimits) {
        // We use alpha-beta search, where the search states are Dots_and_Boxes moves.
        // Recal that a Dots_and_Boxes move has 3 operations:
        // 0) endMatch or setTurn
        // 1) {set: {key: 'board', value: ...}}
        // 2) {set: {key: 'delta', value: ...}}]
        var move = alphaBetaService.alphaBetaDecision([null, { set: { key: 'board', value: board } }], playerIndex, getNextStates, getStateScoreForIndex0, 
        // If you want to see debugging output in the console, then surf to index.html?debug
        window.location.search === '?debug' ? getDebugStateToString : null, alphaBetaLimits);
        return move;
    }
    aiService.createComputerMove = createComputerMove;
    function getStateScoreForIndex0(move, playerIndex) {
        //return move[1].set.value.score[0];
        if (move[0].endMatch) {
            var endMatchScores = move[0].endMatch.endMatchScores;
            return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
                : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
                    : 0;
        }
        return 0;
    }
    function getNextStates(move, playerIndex) {
        return getPossibleMoves(move[1].set.value, playerIndex);
    }
    function getDebugStateToString(move) {
        return "\n" + move[1].set.value.join("\n") + "\n";
    }
})(aiService || (aiService = {}));

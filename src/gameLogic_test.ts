describe("In Dots_and_Boxes", function() {

  //import updateBoard from 'gameLogic';
  function expectMove(
      turnIndexBeforeMove: number, stateBeforeMove: IState, move: IMove, isOk: boolean): void {
    expect(gameLogic.isMoveOk({
      turnIndexBeforeMove: turnIndexBeforeMove,
      turnIndexAfterMove: null,
      stateBeforeMove: stateBeforeMove,
      stateAfterMove: null,
      move: move,
      numberOfPlayers: null})).toBe(isOk);
  }

  function expectMoveOk(turnIndexBeforeMove: number, stateBeforeMove: IState, move: IMove): void {
    expectMove(turnIndexBeforeMove, stateBeforeMove, move, true);
  }

  function expectIllegalMove(turnIndexBeforeMove: number, stateBeforeMove: IState, move: IMove): void {
    expectMove(turnIndexBeforeMove, stateBeforeMove, move, false);
  }

  it("Case1: YOU filling edge in hor:0x0 position from initial state is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardAfterMove = gameLogic.updateBoard(board, 'hor', 0, 0, 0);
    expectMoveOk(0, <IState>{},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });

  it("Case2: ME filling edge in ver:2x3 position after YOU filling edge hor:0x0 is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardAfterMove0 = gameLogic.updateBoard(board, 'hor', 0, 0, 0);
    var boardAfterMove1 = gameLogic.updateBoard(boardAfterMove0, 'ver', 2, 3, 1);
    expectMoveOk(1,
      {board: boardAfterMove0, delta: {dir: 'hor', row: 0, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove1}},
        {set: {key: 'delta', value: {dir: 'ver', row: 2, col: 3}}}]);
  });

  it("Case3: YOU filling edge in a non-empty position is illegal", function() {
    var board = gameLogic.getInitialBoard();
    var boardAfterMove0 = gameLogic.updateBoard(board, 'hor', 0, 0, 0);
    var boardAfterMove1 = angular.copy(boardAfterMove0);
    boardAfterMove1.sumAllEdges++;
    expectIllegalMove(1,
      {board: boardAfterMove0, delta: {dir: 'hor', row: 0, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove1}},
        {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });

  it("Case4: YOU filling edge in hor:3x0 is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 12;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,1,0], [1,0,0], [1,1,1], [0,0,0] ];
    boardBeforeMove.ver = [ [0,0,1,1], [0,0,1,0], [1,1,0,1] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[2, 2, 2], [2, 2, 2], [3, 2, 2]];
    gameLogic.printBoard(boardBeforeMove);
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 0, 0);
    gameLogic.printBoard(boardBeforeMove);
    gameLogic.printBoard(boardAfterMove);
    expectMoveOk(0,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 2, col: 1}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 0}}}]);
  });
    /*for (var i = 0; i < gameLogic.ROWSIZE+1; ++i) {
      for (var j = 0; j < gameLogic.COLSIZE; ++j) {
        boardBeforeLastMove.hor[i][j] = 1;
      }
    }
    for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
      for (var j = 0; j < gameLogic.COLSIZE+1; ++j) {
        boardBeforeLastMove.ver[i][j] = 1;
      }
    }
    boardBeforeLastMove.hor[3][1] = 0;
    for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
      for (var j = 0; j < gameLogic.COLSIZE; ++j) {
        boardBeforeLastMove.color[i][j] = 'ME';
        boardBeforeLastMove.sum[i][j] = 4;
      }
    }
    boardBeforeLastMove.sum[2][2] = 3;
    boardBeforeLastMove.color[2][0] = 'YOU';
    boardBeforeLastMove.color[2][2] = 'YOU';

    var boardAfterLastMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 0, 0);
    expectIllegalMove(0,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 0, col: 3}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 0}}}]);
  });*/

  it("case5: YOU wins by filling edge in hor:3x2 is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeLastMove = angular.copy(board);
    //boardBeforeLastMove.isGameOver = false;
    boardBeforeLastMove.switchTurn = true;
    boardBeforeLastMove.sumAllEdges = 23;
    boardBeforeLastMove.score = [2, 6];
    boardBeforeLastMove.hor = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 0]];
    boardBeforeLastMove.ver = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]];
    boardBeforeLastMove.color = [['ME', 'ME', 'ME'], ['ME', 'ME', 'ME'], ['YOU', 'YOU', '']];
    boardBeforeLastMove.sum = [[4, 4, 4], [4, 4, 4], [4, 4, 3]];
    //gameLogic.printBoard(boardBeforeLastMove);
    var boardAfterLastMove = gameLogic.updateBoard(boardBeforeLastMove, 'hor', 3, 2, 0);
    //gameLogic.printBoard(boardBeforeLastMove);
    //gameLogic.printBoard(boardAfterLastMove);
    expectMoveOk(0, { board: boardBeforeLastMove, delta: { dir: 'ver', row: 0, col: 3 } },
      [ { endMatch: {endMatchScores: boardAfterLastMove.score}},
        { set: { key: 'board', value: boardAfterLastMove } },
        { set: { key: 'delta', value: { dir: 'hor', row: 3, col: 2 } } }]);
  });

  /*it("X wins by placing X in 2x0 is legal", function() {
    expectMoveOk(0,
      {board:
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['', '', '']], delta: {row: 1, col: 1}},
      [{endMatch: {endMatchScores: [1, 0]}},
            {set: {key: 'board', value:
              [['X', 'O', ''],
               ['X', 'O', ''],
               ['X', '', '']]}},
            {set: {key: 'delta', value: {row: 2, col: 0}}}]);
  });

  it("O wins by placing O in 1x1 is legal", function() {
    expectMoveOk(1,
      {board:
        [['X', 'X', 'O'],
         ['X', '', ''],
         ['O', '', '']], delta: {row: 0, col: 1}},
      [{endMatch: {endMatchScores: [0, 1]}},
            {set: {key: 'board', value:
              [['X', 'X', 'O'],
               ['X', 'O', ''],
               ['O', '', '']]}},
            {set: {key: 'delta', value: {row: 1, col: 1}}}]);
  });

  it("the game ties when there are no more empty cells", function() {
    expectMoveOk(0,
      {board:
        [['X', 'O', 'X'],
         ['X', 'O', 'O'],
         ['O', 'X', '']], delta: {row: 2, col: 0}},
      [{endMatch: {endMatchScores: [0, 0]}},
            {set: {key: 'board', value:
              [['X', 'O', 'X'],
               ['X', 'O', 'O'],
               ['O', 'X', 'X']]}},
            {set: {key: 'delta', value: {row: 2, col: 2}}}]);
  }); */

  it("null move is illegal", function() {
    expectIllegalMove(0, {}, null);
  });

  it("move without board is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
  });

  it("move without delta is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board}}]);
  });

/*  it("YOU filling edge outside the board (in hor:4x0) is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {row: 3, col: 0}}}]);
  });

  it("placing X in 0x0 but setTurn to yourself is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value:
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']]}},
      {set: {key: 'delta', value: {row: 0, col: 0}}}]);
  });

  it("placing X in 0x0 but setting the board wrong is illegal", function() {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value:
        [['X', 'X', ''],
         ['', '', ''],
         ['', '', '']]}},
      {set: {key: 'delta', value: {row: 0, col: 0}}}]);
  });

  it("getPossibleMoves returns exactly one cell", function() {
    var board =
        [['O', 'O', 'X'],
         ['X', 'X', 'O'],
         ['O', 'X', '']];
    var possibleMoves = gameLogic.getPossibleMoves(board, 0);
    var expectedMove = [{endMatch: {endMatchScores: [0, 0]}},
        {set: {key: 'board', value:
          [['O', 'O', 'X'],
           ['X', 'X', 'O'],
           ['O', 'X', 'X']]}},
        {set: {key: 'delta', value: {row: 2, col: 2}}}];
    expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
  });
*/
});

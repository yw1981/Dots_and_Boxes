describe("In Dots_and_Boxes", function() {

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

//stage1: board's original state, cases when no one complete any cells
  it("YOU filling edge in hor:0x0 position from initial state is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardAfterMove = gameLogic.updateBoard(board, 'hor', 0, 0, 0);
    expectMoveOk(0, <IState>{},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });

  it("ME filling edge in ver:2x3 position after YOU filling edge hor:0x0 is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardAfterMove0 = gameLogic.updateBoard(board, 'hor', 0, 0, 0);
    var boardAfterMove1 = gameLogic.updateBoard(boardAfterMove0, 'ver', 2, 3, 1);
    expectMoveOk(1,
      {board: boardAfterMove0, delta: {dir: 'hor', row: 0, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove1}},
        {set: {key: 'delta', value: {dir: 'ver', row: 2, col: 3}}}]);
  });

  it("YOU filling edge in a non-empty position is illegal", function() {
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

//stage2: cases when someone starts completing cells
  it("YOU filling edge in hor:3x0, completing one cell and setTurn to yourself is legal", function() {
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
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 0, 0);
    expectMoveOk(0,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 2, col: 1}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 0}}}]);
  });

  it("YOU filling edge in ver:2x3, completing one cell and setTurn to yourself is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 12;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,0,1], [1,1,0], [0,0,1], [0,0,1] ];
    boardBeforeMove.ver = [ [0,0,1,0], [1,0,1,0], [1,1,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[2, 2, 2], [2, 2, 2], [2, 2, 3]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'ver', 2, 3, 0);
    expectMoveOk(0,
      {board: boardBeforeMove, delta: {dir: 'hor', row: 1, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'ver', row: 2, col: 3}}}]);
  });

  it("YOU filling edge in hor:2x1, completing two cells and setTurn to yourself is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 12;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,1,0], [0,1,0], [1,0,1], [0,1,0] ];
    boardBeforeMove.ver = [ [0,0,1,1], [0,1,1,0], [0,1,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[1, 3, 2], [2, 3, 2], [2, 3, 2]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 2, 1, 0);
    expectMoveOk(0,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 0, col: 3}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 2, col: 1}}}]);
  });

  it("YOU filling edge in ver:1x2, completing two cells and setTurn to yourself is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 13;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,0,1], [1,1,1], [0,1,1], [0,0,0] ];
    boardBeforeMove.ver = [ [0,0,1,0], [1,1,0,1], [1,0,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[2, 2, 3], [3, 3, 3], [1, 2, 2]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'ver', 1, 2, 0);
    expectMoveOk(0,
      {board: boardBeforeMove, delta: {dir: 'hor', row: 1, col: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'ver', row: 1, col: 2}}}]);
  });

  it("ME filling edge in hor:3x0, completing one cell and setTurn to ME is legal", function() {
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
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 0, 1);
    expectMoveOk(1,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 2, col: 1}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 0}}}]);
  });

  it("ME filling edge in ver:2x3, completing one cell and setTurn to ME is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 12;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,0,1], [1,1,0], [0,0,1], [0,0,1] ];
    boardBeforeMove.ver = [ [0,0,1,0], [1,0,1,0], [1,1,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[2, 2, 2], [2, 2, 2], [2, 2, 3]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'ver', 2, 3, 1);
    expectMoveOk(1,
      {board: boardBeforeMove, delta: {dir: 'hor', row: 1, col: 0}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'ver', row: 2, col: 3}}}]);
  });

  it("ME filling edge in hor:2x1, completing two cells and setTurn to ME is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 12;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,1,0], [0,1,0], [1,0,1], [0,1,0] ];
    boardBeforeMove.ver = [ [0,0,1,1], [0,1,1,0], [0,1,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[1, 3, 2], [2, 3, 2], [2, 3, 2]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 2, 1, 1);
    expectMoveOk(1,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 0, col: 3}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 2, col: 1}}}]);
  });

  it("ME filling edge in ver:1x2, completing two cells and setTurn to ME is legal", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.isGameOver = false;
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 13;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [ [1,0,1], [1,1,1], [0,1,1], [0,0,0] ];
    boardBeforeMove.ver = [ [0,0,1,0], [1,1,0,1], [1,0,1,0] ];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[2, 2, 3], [3, 3, 3], [1, 2, 2]];
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'ver', 1, 2, 1);
    expectMoveOk(1,
      {board: boardBeforeMove, delta: {dir: 'hor', row: 1, col: 0}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'ver', row: 1, col: 2}}}]);
  });

//cases when setTurn wrong
  it("YOU filling edge in hor:0x0 without completing a cell but setTurn to yourself is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });

  it("ME filling edge in hor:0x0 without completing a cell but setTurn to ME is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(1, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });

  it("YOU filling edge in hor:3x0, completing one cell but setTurn to ME is illegal", function() {
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
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 0, 0);
    expectIllegalMove(0,
      {board: boardBeforeMove, delta: {dir: 'ver', row: 2, col: 1}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: boardAfterMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 0}}}]);
  });

//stage3. winning cases. (did not test tie condition here in 3x3 board since tie will only happen when ROWSIZExCOLSIZE = even, may add it later when change board size)

  it("ME wins by filling edge in hor:3x2 is legal", function() {
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
    var boardAfterLastMove = gameLogic.updateBoard(boardBeforeLastMove, 'hor', 3, 2, 0);
    expectMoveOk(0, { board: boardBeforeLastMove, delta: { dir: 'ver', row: 0, col: 3 } },
      [ { endMatch: {endMatchScores: boardAfterLastMove.score}},
        { set: { key: 'board', value: boardAfterLastMove } },
        { set: { key: 'delta', value: { dir: 'hor', row: 3, col: 2 } } }]);
  });

  it("YOU wins by filling edge in ver:2x2 is legal", function() {
     var board = gameLogic.getInitialBoard();
     var boardBeforeLastMove = angular.copy(board);
     //boardBeforeLastMove.isGameOver = false;
     boardBeforeLastMove.switchTurn = true;
     boardBeforeLastMove.sumAllEdges = 23;
     boardBeforeLastMove.score = [6, 2];
     boardBeforeLastMove.hor = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]];
     boardBeforeLastMove.ver = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 1]];
     boardBeforeLastMove.color = [['YOU', 'YOU', 'YOU'], ['YOU', 'YOU', 'YOU'], ['ME', '', 'ME']];
     boardBeforeLastMove.sum = [[4, 4, 4], [4, 4, 4], [4, 3, 4]];
     //gameLogic.printBoard(boardBeforeLastMove);
     var boardAfterLastMove = gameLogic.updateBoard(boardBeforeLastMove, 'ver', 2, 2, 1);
     expectMoveOk(1, { board: boardBeforeLastMove, delta: { dir: 'ver', row: 0, col: 3 } },
       [ { endMatch: {endMatchScores: boardAfterLastMove.score}},
         { set: { key: 'board', value: boardAfterLastMove } },
         { set: { key: 'delta', value: { dir: 'ver', row: 2, col: 2 } } }]);
   });

  it("cannot move when isGameOver=true, no matter what the board looks like", function() { //what will happen if illegal case contains illegal moves
    var board = gameLogic.getInitialBoard();
    board.isGameOver = true;
    expectIllegalMove(0, { board: board, delta: {dir: 'hor', row: 3, col: 2} },
      [ {setTurn: {turnIndex: 1}},
        {set: {key: 'board', value: board}},
        {set: {key: 'delta', value: {dir: 'ver', row: 0, col: 3}}}]);
  });

  it("cannot move when sumAllEdges=24, no matter what the board looks like", function() { //what will happen if illegal case contains illegal moves
    var board = gameLogic.getInitialBoard();
    board.sumAllEdges = 24;
    expectIllegalMove(0, { board: board, delta: {dir: 'hor', row: 3, col: 2} },
      [ {setTurn: {turnIndex: 1}},
        {set: {key: 'board', value: board}},
        {set: {key: 'delta', value: {dir: 'ver', row: 1, col: 3}}}]);
  });

//other undefined behaviors
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

  it("YOU filling edge in hor:0x0 but setting the board wrong is illegal", function() {
    var board = gameLogic.getInitialBoard();
    var board_wrong = angular.copy(board);
    board_wrong.hor[0][1] = 1;
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board_wrong}},
      {set: {key: 'delta', value: {dir: 'hor', row: 0, col: 0}}}]);
  });


//board's boundary condiitons
  it("YOU filling edge outside the board (in hor:4x0) is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {row: 4, col: 0}}}]);
  });

  it("YOU filling edge outside the board (in ver:4x1) is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {dir: 'ver', row: 4, col: 1}}}]);
  });

  it("ME filling edge outside the board (in hor:4x2) is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(1, {}, [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {dir: 'hor', row: 4, col: 2}}}]);
  });

  it("ME filling edge outside the board (in ver:4x3) is illegal", function() {
    var board = gameLogic.getInitialBoard();
    expectIllegalMove(1, {}, [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: board}},
      {set: {key: 'delta', value: {dir: 'ver', row: 4, col: 3}}}]);
  });

/*  it("getPossibleMoves returns exactly one cell", function() {
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

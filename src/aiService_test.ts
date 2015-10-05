describe("aiService", function() {

  it("getPossibleMoves returns exactly one edge", function() {
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
    let possibleMoves = aiService.getPossibleMoves(boardBeforeLastMove, 0);
    let expectedMove = [{endMatch: {endMatchScores: [3, 6]}},
        {set: {key: 'board', value: boardAfterLastMove}},
        {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 2}}}];
    expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
  });

  //inital stage, when no one starts to filling any edges
  it("stage 1. when no one can fill a cell/sum of each cell is less than 3", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 2;
    boardBeforeMove.score = [0, 0];
    boardBeforeMove.hor = [[1, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    boardBeforeMove.ver = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1]];
    boardBeforeMove.color = [['', '', ''], ['', '', ''], ['', '', '']];
    boardBeforeMove.sum = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let move = aiService.createComputerMove(boardBeforeMove, 0, {millisecondsLimit: 1000});
    var boardAfterMove = gameLogic.updateBoard(boardBeforeMove, 'hor', 3, 2, 0);
    let expectedMove = [{setTurn: {turnIndex : 1}},
    {set: {key: 'board', value: boardAfterMove}},
    {set: {key: 'delta', value: {dir: 'hor', row: 3, col: 2}}}];
    expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
  });

/*  it("X finds an immediate winning move", function() {
    let move = aiService.createComputerMove(
        [['', '', 'O'],
         ['O', 'X', 'X'],
         ['O', 'X', 'O']], 0, {maxDepth: 1});
    let expectedMove =
        [{endMatch: {endMatchScores: [1, 0]}},
          {set: {key: 'board', value:
              [['', 'X', 'O'],
               ['O', 'X', 'X'],
               ['O', 'X', 'O']]}},
          {set: {key: 'delta', value: {row: 0, col: 1}}}];
    expect(angular.equals(move, expectedMove)).toBe(true);
  });

  it("O finds an immediate winning move", function() {
    let move = aiService.createComputerMove(
        [['', '', 'O'],
         ['O', 'X', 'X'],
         ['O', 'X', 'O']], 1, {maxDepth: 1});
    expect(angular.equals(move[2].set.value, {row: 0, col: 0})).toBe(true);
  });

  it("X prevents an immediate win", function() {
    let move = aiService.createComputerMove(
        [['X', '', ''],
         ['O', 'O', ''],
         ['X', '', '']], 0, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 1, col: 2})).toBe(true);
  });

  it("O prevents an immediate win", function() {
    let move = aiService.createComputerMove(
        [['X', 'X', ''],
         ['O', '', ''],
         ['', '', '']], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 0, col: 2})).toBe(true);
  });

  it("O prevents another immediate win", function() {
    let move = aiService.createComputerMove(
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['', 'X', '']], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 2, col: 0})).toBe(true);
  });

  it("X finds a winning move that will lead to winning in 2 steps", function() {
    let move = aiService.createComputerMove(
        [['X', '', ''],
         ['O', 'X', ''],
         ['', '', 'O']], 0, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 0, col: 1})).toBe(true);
  });

  it("O finds a winning move that will lead to winning in 2 steps", function() {
    let move = aiService.createComputerMove(
        [['', 'X', ''],
         ['X', 'X', 'O'],
         ['', 'O', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 2, col: 2})).toBe(true);
  });

  it("O finds a cool winning move that will lead to winning in 2 steps", function() {
    let move = aiService.createComputerMove(
        [['X', 'O', 'X'],
         ['X', '', ''],
         ['O', '', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 2, col: 1})).toBe(true);
  });

  it("O finds the wrong move due to small depth", function() {
    let move = aiService.createComputerMove(
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 0, col: 1})).toBe(true);
  });

  it("O finds the correct move when depth is big enough", function() {
    let move = aiService.createComputerMove(
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 1, {maxDepth: 6});
    expect(angular.equals(move[2].set.value, {row: 1, col: 1})).toBe(true);
  });

  it("X finds a winning move that will lead to winning in 2 steps", function() {
    let move = aiService.createComputerMove(
        [['', '', ''],
         ['O', 'X', ''],
         ['', '', '']], 0, {maxDepth: 5});
    expect(angular.equals(move[2].set.value, {row: 0, col: 0})).toBe(true);
  });
*/
});

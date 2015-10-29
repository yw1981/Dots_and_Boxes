describe("aiService", function() {

  it("case1. getPossibleMoves returns exactly one move", function() {
    console.log("case1");
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

  it("case2. YOU/computer find an immediate winning move on top", function() {
    console.log("case2");
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 19;
    boardBeforeMove.score = [0, 4];
    boardBeforeMove.hor = [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]];
    boardBeforeMove.ver = [[1, 1, 0, 1], [1, 1, 1, 1], [0, 0, 1, 1]];
    boardBeforeMove.color = [['ME', '', ''], ['ME', '', 'ME'], ['', '', 'ME']];
    boardBeforeMove.sum = [[4, 2, 3], [4, 2, 4], [2, 2, 4]];
    var boardAfterMove = angular.copy(boardBeforeMove);
    boardAfterMove.switchTurn = false;
    boardAfterMove.sumAllEdges = 20;
    boardAfterMove.score = [1, 4];
    boardAfterMove.hor = [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]];
    boardAfterMove.ver = [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 1, 1]];
    boardAfterMove.color = [['ME', '', 'YOU'], ['ME', '', 'ME'], ['', '', 'ME']];
    boardAfterMove.sum = [[4, 3, 4], [4, 2, 4], [2, 2, 4]];
    gameLogic.printBoard(boardBeforeMove);
    let move = aiService.createComputerMove(boardBeforeMove, 0, {millisecondsLimit: 1000});
    let expectedMove = [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: boardAfterMove}},
      {set: {key: 'delta', value: {dir: 'ver', row: 0, col: 2}}}];
    expect(angular.equals(move, expectedMove)).toBe(true);

  });

  it("case3. YOU/computer find an immediate winning move on the bottom", function() {
    var board = gameLogic.getInitialBoard();
    var boardBeforeMove = angular.copy(board);
    boardBeforeMove.switchTurn = true;
    boardBeforeMove.sumAllEdges = 19;
    boardBeforeMove.score = [0, 4];
    boardBeforeMove.hor = [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]];
    boardBeforeMove.ver = [[1, 1, 0, 0], [1, 1, 1, 1], [1, 0, 1, 1]];
    boardBeforeMove.color = [['ME', '', ''], ['ME', '', 'ME'], ['', '', 'ME']];
    boardBeforeMove.sum = [[4, 2, 2], [4, 2, 4], [3, 2, 4]];
    var boardAfterMove = angular.copy(boardBeforeMove);
    boardAfterMove.switchTurn = false;
    boardAfterMove.sumAllEdges = 20;
    boardAfterMove.score = [1, 4];
    boardAfterMove.hor = [[1, 1, 1], [1, 0, 1], [1, 0, 1], [1, 1, 1]];
    boardAfterMove.ver = [[1, 1, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1]];
    boardAfterMove.color = [['ME', '', ''], ['ME', '', 'ME'], ['YOU', '', 'ME']];
    boardAfterMove.sum = [[4, 2, 2], [4, 2, 4], [4, 3, 4]];
    let move = aiService.createComputerMove(boardBeforeMove, 0, {millisecondsLimit: 1000});
    gameLogic.printDelta(move[2].set.value);
    gameLogic.printBoard(move[1].set.value);
    let expectedMove = [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: boardAfterMove}},
      {set: {key: 'delta', value: {dir: 'ver', row: 2, col: 1}}}];
    expect(angular.equals(move, expectedMove)).toBe(true);
  });
  
});

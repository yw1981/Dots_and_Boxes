var gameLogic;
(function (gameLogic) {
    gameLogic.ROWSIZE = 7; //convenient to change board size later; ROWSIZE and COLSIZE does not need to be the same either.
    gameLogic.COLSIZE = 7;
    /** Returns the initial Dots_and_Boxes board, which is a 7x7 matrix containing 24 edges and 9 empty cells */
    function create2DArray(rowsize, colsize) {
        var arr = [];
        for (var i = 0; i < rowsize; i++) {
            var temp = [];
            for (var j = 0; j < colsize; j++) {
                temp[j] = [];
            }
            arr[i] = temp;
        }
        return arr;
    }
    function getInitialBoard() {
        var board = {};
        board.isGameOver = false;
        board.switchTurn = true;
        board.sumAllEdges = 0;
        board.score = [0, 0];
        board.chains = [];
        board.hor = create2DArray(gameLogic.ROWSIZE + 1, gameLogic.COLSIZE);
        for (var i = 0; i < gameLogic.ROWSIZE + 1; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                board.hor[i][j] = 0;
            }
        }
        board.ver = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE + 1);
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE + 1; ++j) {
                board.ver[i][j] = 0;
            }
        }
        board.color = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE);
        board.sum = create2DArray(gameLogic.ROWSIZE, gameLogic.COLSIZE);
        for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
            for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                board.color[i][j] = '';
                board.sum[i][j] = 0;
            }
        }
        return board;
    }
    gameLogic.getInitialBoard = getInitialBoard;
    //helper function for debugging
    function printBoard(board) {
        if (!board) {
            console.log("board is undefined");
        }
        console.log('isGameOver=' + board.isGameOver, ' switchTurn=' + board.switchTurn, ' sumAllEdges=' + board.sumAllEdges, ' score=' + board.score);
        if (board.hor) {
            var output = '';
            output = output + 'hor: [';
            for (var i = 0; i < gameLogic.ROWSIZE + 1; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.hor[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.ver) {
            var output = '';
            output = output + 'ver: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE + 1; ++j) {
                    output = output + board.ver[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.sum) {
            var output = '';
            output = output + 'sum: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.sum[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
        if (board.color) {
            var output = '';
            output = output + 'color: [';
            for (var i = 0; i < gameLogic.ROWSIZE; ++i) {
                output = output + '[';
                for (var j = 0; j < gameLogic.COLSIZE; ++j) {
                    output = output + board.color[i][j] + ', ';
                }
                output = output + ']';
            }
            output = output + ']';
            console.log(output);
        }
    }
    gameLogic.printBoard = printBoard;
    function printDelta(delta) {
        var output = '';
        output = delta.dir + ":" + delta.row + "x" + delta.col;
        console.log(output);
    }
    gameLogic.printDelta = printDelta;
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove; turnIndex = 0 for YOU and 1 for ME
     * Returns an empty array if the game is over.
     */
    function updateBoard(board, dir, row, col, turnIndexBeforeMove) {
        board.switchTurn = true;
        var boardAfterMove = angular.copy(board);
        if (dir === 'hor') {
            boardAfterMove.hor[row][col] = 1;
            if (row !== 0) {
                boardAfterMove.sum[row - 1][col] += 1;
                if (boardAfterMove.sum[row - 1][col] === 4) {
                    console.log("set switchTurn to false");
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row - 1][col] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row - 1][col] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
            if (row !== gameLogic.ROWSIZE) {
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
        else {
            boardAfterMove.ver[row][col] = 1;
            if (col !== 0) {
                boardAfterMove.sum[row][col - 1] += 1;
                if (boardAfterMove.sum[row][col - 1] === 4) {
                    console.log("set switchTurn to false");
                    boardAfterMove.switchTurn = false;
                    if (turnIndexBeforeMove === 0) {
                        boardAfterMove.color[row][col - 1] = 'YOU';
                        boardAfterMove.score[0]++;
                    }
                    else {
                        boardAfterMove.color[row][col - 1] = 'ME';
                        boardAfterMove.score[1]++;
                    }
                }
            }
            if (col !== gameLogic.COLSIZE) {
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
        if (boardAfterMove.sumAllEdges === (gameLogic.ROWSIZE + 1) * gameLogic.COLSIZE + gameLogic.ROWSIZE * (gameLogic.COLSIZE + 1)) {
            boardAfterMove.isGameOver = true;
        }
        return boardAfterMove;
    }
    gameLogic.updateBoard = updateBoard;
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(// remember to change the signature of createMove in other files
        board, dir, row, col, turnIndexBeforeMove) {
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
        var boardAfterMove = updateBoard(board, dir, row, col, turnIndexBeforeMove);
        //var winner = getWinner(boardAfterMove);
        var firstOperation;
        if (boardAfterMove.isGameOver) {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: boardAfterMove.score } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            if (boardAfterMove.switchTurn) {
                firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
            }
            else {
                firstOperation = { setTurn: { turnIndex: turnIndexBeforeMove } }; // if switchTurn is false, do not change turnIndex
            }
        }
        var delta = { dir: dir, row: row, col: col };
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: delta } }];
    }
    gameLogic.createMove = createMove;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
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
            var deltaValue = move[2].set.value; //see createMove's return signature
            var dir = deltaValue.dir;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, dir, row, col, turnIndexBeforeMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
    //helper function to check if a move is legal, different from isMoveOk
    function isMoveLegal(move) {
        if (move[2].set.value.dir === "hor" && move[1].set.value.hor[move[2].set.value.row][move[2].set.value.col] !== 0) {
            return false;
        }
        else
            return true;
    }
})(gameLogic || (gameLogic = {}));
;var game;
(function (game) {
    var animationEnded = false;
    var canMakeMove = false;
    var isComputerTurn = false;
    var state = null;
    var lastUpdateUI = null;
    // var turnIndex: number = null;
    var RANGE = 6;
    game.isHelpModalShown = false;
    function init() {
        console.log("Translation of 'RULES_OF_DOTS_AND_BOXES' are " + translate('RULES_OF_DOTS_AND_BOXES'));
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
    }
    game.init = init;
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (isComputerTurn) {
                sendComputerMove();
            }
        });
    }
    function sendComputerMove() {
        // gameService.makeMove(
        //     aiService.createComputerMove(state.board, turnIndex,
        //       // at most 1 second for the AI to choose a move (but might be much quicker)
        //       {millisecondsLimit: 1000}));
        gameService.makeMove(aiService.findComputerMove(lastUpdateUI));
    }
    function updateUI(params) {
        animationEnded = false;
        lastUpdateUI = params;
        state = params.stateAfterMove;
        if (!state.board) {
            state.board = gameLogic.getInitialBoard();
        }
        canMakeMove = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        // turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        isComputerTurn = canMakeMove &&
            params.playersInfo[params.yourPlayerIndex].playerId === '';
        if (isComputerTurn) {
            // To make sure the player won't click something and send a move instead of the computer sending a move.
            canMakeMove = false;
            // We calculate the AI move only after the animation finishes,
            // because if we call aiService now
            // then the animation will be paused until the javascript finishes.
            if (!state.delta) {
                // This is the first move in the match, so
                // there is not going to be an animation, so
                // call sendComputerMove() now (can happen in ?onlyAIs mode)
                sendComputerMove();
            }
        }
    }
    function getScore(playerIndex) {
        return state.board.score[playerIndex];
    }
    game.getScore = getScore;
    function cellClicked(row, col) {
        log.info(["Clicked on cell:", row, col]);
        if (!canMakeMove)
            return;
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        var elem = translateToGridElem(row, col);
        if (elem.dir !== "hor" && elem.dir !== "ver") {
            log.info("Clicked on non-action part");
        }
        else {
            log.info(elem.dir, elem.row, elem.col);
            gameLogic.printBoard(state.board);
            cellClickedImpl(elem.dir, elem.row, elem.col);
        }
    }
    game.cellClicked = cellClicked;
    function translateToGridElem(row, col) {
        var elem = {};
        if (row % 2 == 0 && col % 2 == 0) {
            elem.dir = "corner";
        }
        else if (row % 2 == 1 && col % 2 == 1) {
            elem.dir = "cell";
            elem.row = Math.floor(row / 2);
            elem.col = Math.floor(col / 2);
        }
        else if (row % 2 == 0) {
            elem.dir = "hor";
            elem.row = Math.floor(row / 2);
            elem.col = Math.floor(col / 2);
        }
        else {
            elem.dir = "ver";
            elem.row = Math.floor(row / 2);
            elem.col = Math.floor(col / 2);
        }
        return elem;
    }
    function getDir(row, col) {
        if ((row + col) % 2 == 0) {
            return "";
        }
        else if (row % 2 == 0) {
            return "";
        }
    }
    function cellClickedImpl(dir, row, col) {
        if (!canMakeMove) {
            return;
        }
        try {
            canMakeMove = false; // to prevent making another move
            var move = gameLogic.createMove(state.board, dir, row, col, lastUpdateUI.turnIndexAfterMove);
            gameService.makeMove(move);
        }
        catch (e) {
            log.info(["Cell is already full in position:", dir, row, col]);
            return;
        }
    }
    function shouldShowImage(row, col) {
        var elem = translateToGridElem(row, col);
        var cell = "";
        if (elem.dir === "cell") {
            cell = state.board.color[row][col];
        }
        return cell !== "";
    }
    game.shouldShowImage = shouldShowImage;
    function isEdgeFilled(row, col) {
        var elem = translateToGridElem(row, col);
        if (elem.dir === "hor")
            return state.board.hor[elem.row][elem.col] === 1;
        else if (elem.dir === "ver")
            return state.board.ver[elem.row][elem.col] === 1;
        else
            return false;
    }
    game.isEdgeFilled = isEdgeFilled;
    function isNewlyFilledEdge(row, col) {
        var elem = translateToGridElem(row, col);
        return angular.equals(elem, state.delta);
    }
    game.isNewlyFilledEdge = isNewlyFilledEdge;
    function isCellFilled_Player0(row, col) {
        var elem = translateToGridElem(row, col);
        if (elem.dir === "cell") {
            return state.board.color[elem.row][elem.col] === 'YOU';
        }
        return false;
    }
    game.isCellFilled_Player0 = isCellFilled_Player0;
    function isCellFilled_Player1(row, col) {
        var elem = translateToGridElem(row, col);
        if (elem.dir === "cell") {
            return state.board.color[elem.row][elem.col] === 'ME';
        }
        return false;
    }
    game.isCellFilled_Player1 = isCellFilled_Player1;
    function shouldSlowlyAppear(row, col) {
        var elem = translateToGridElem(row, col);
        return !animationEnded &&
            state.delta &&
            state.delta.row === elem.row &&
            state.delta.col === elem.col &&
            state.delta.dir === elem.dir;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
    function divideByTwoThenFloor(row) {
        return Math.floor(row / 2);
    }
    game.divideByTwoThenFloor = divideByTwoThenFloor;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        RULES_OF_DOTS_AND_BOXES: "Rules of Dots_and_Boxes",
        RULES_SLIDE1: "Starting with an empty grid of edges and cells.\n One player fills an empty horizontal or vertical edge.\n Players switch turns if did not complete a cell.",
        RULES_SLIDE2: "A player who completes the fourth side of a cell earns one point and takes another turn.\n When all the cells are filled, whoever earns the higher score wins.",
        CLOSE: "Close"
    });
    game.init();
});
;var aiService;
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
    function printPossibleMoves(possibleMoves) {
        var output = "possible moves:";
        for (var i = 0; i < possibleMoves.length; ++i) {
            output = output + possibleMoves[i][2].set.value.dir + ":" + possibleMoves[i][2].set.value.row + "x" + possibleMoves[i][2].set.value.col + ",";
        }
        console.log("possibleMoves.length = " + possibleMoves.length);
        console.log(output);
    }
    /**
     * Returns all the possible moves for the given board and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    function getPossibleMoves(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        var addedMoves = [];
        for (var i = 0; i < gameLogic.ROWSIZE + 1; i++) {
            for (var j = 0; j < gameLogic.COLSIZE; j++) {
                //console.log("i=" + i + ",j=" + j + ", ");
                if (board.hor[i][j] === 0 &&
                    ((i !== 0 && i !== gameLogic.ROWSIZE && (board.sum[i - 1][j] === 3 || board.sum[i][j] === 3)) ||
                        (i === 0 && board.sum[i][j] === 3) ||
                        (i === gameLogic.ROWSIZE && board.sum[i - 1][j] === 3))) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        for (var i = 0; i < gameLogic.ROWSIZE; i++) {
            for (var j = 0; j < gameLogic.COLSIZE + 1; j++) {
                if (board.ver[i][j] === 0 &&
                    ((j !== 0 && j !== gameLogic.COLSIZE && (board.sum[i][j - 1] === 3 || board.sum[i][j] === 3)) ||
                        (j === 0 && board.sum[i][j] === 3) ||
                        (j === gameLogic.COLSIZE && board.sum[i][j - 1] === 3))) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        if (possibleMoves.length >= 1) {
            return possibleMoves;
        }
        for (var i = 0; i < gameLogic.ROWSIZE + 1; i++) {
            for (var j = 0; j < gameLogic.COLSIZE; j++) {
                if (board.hor[i][j] === 0 &&
                    ((i !== 0 && i !== gameLogic.ROWSIZE && (board.sum[i - 1][j] !== 2 && board.sum[i][j] !== 2)) ||
                        (i === 0 && (board.sum[i][j] !== 2)) ||
                        (i === gameLogic.ROWSIZE && (board.sum[i - 1][j] !== 2)))) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        for (var i = 0; i < gameLogic.ROWSIZE; i++) {
            for (var j = 0; j < gameLogic.COLSIZE + 1; j++) {
                if (board.ver[i][j] === 0 &&
                    ((j !== 0 && j !== gameLogic.COLSIZE && (board.sum[i][j - 1] !== 2 && board.sum[i][j] !== 2)) ||
                        (j === 0 && (board.sum[i][j] !== 2)) ||
                        (j === gameLogic.COLSIZE && (board.sum[i][j - 1] !== 2)))) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        if (possibleMoves.length >= 1) {
            return possibleMoves;
        }
        for (var i = 0; i < gameLogic.ROWSIZE + 1; i++) {
            for (var j = 0; j < gameLogic.COLSIZE; j++) {
                if (board.hor[i][j] === 0) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'hor', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        for (var i = 0; i < gameLogic.ROWSIZE; i++) {
            for (var j = 0; j < gameLogic.COLSIZE + 1; j++) {
                if (board.ver[i][j] === 0) {
                    try {
                        possibleMoves.push(gameLogic.createMove(board, 'ver', i, j, turnIndexBeforeMove));
                    }
                    catch (e) {
                    }
                }
            }
        }
        return possibleMoves;
        //console.log("size of possible moves = " + addedMoves.length);
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
        // var move = alphaBetaService.alphaBetaDecision(
        //     [null, {set: {key: 'board', value: board}}],
        //     playerIndex, getNextStates, getStateScoreForIndex0,
        //     // If you want to see debugging output in the console, then surf to index.html?debug
        //     window.location.search === '?debug' ? getDebugStateToString : null,
        //     alphaBetaLimits);
        // choices are filetered at get possible move time.
        // random select among good choices is not bad
        var moves = getPossibleMoves(board, playerIndex);
        // printPossibleMoves(moves);
        var random = Math.floor(moves.length * Math.random());
        return moves[random];
    }
    aiService.createComputerMove = createComputerMove;
    function getStateScoreForIndex0(move, playerIndex) {
        //return move[1].set.value.score[0] - move[1].set.value.score[1];
        if (move[0].endMatch) {
            var endMatchScores = move[0].endMatch.endMatchScores;
            return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
                : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
                    : 0;
        }
        else if (move[1].set) {
            //console.log("%o", move[0]);
            return move[1].set.value.score[0] - move[1].set.value.score[1];
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

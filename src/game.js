module game {
  var animationEnded = false;
  var canMakeMove = false;
  var isComputerTurn = false;
  var state: IState = null;
  var turnIndex: number = null;
  export var isHelpModalShown: boolean = false;

  export function init() {
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
    gameService.makeMove(
        aiService.createComputerMove(state.board, turnIndex,
          // at most 1 second for the AI to choose a move (but might be much quicker)
          {millisecondsLimit: 1000}));
  }

  function updateUI(params: IUpdateUI): void {
    animationEnded = false;
    state = params.stateAfterMove;
    if (!state.board) {
      state.board = gameLogic.getInitialBoard();
    }
    canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
      params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
    turnIndex = params.turnIndexAfterMove;

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

  export function cellClicked(dir: string, row: number, col: number): void {
    log.info(["Clicked on cell:", row, col]);
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    if (!canMakeMove) {
      return;
    }
    try {
      var move = gameLogic.createMove(state.board, dir, row, col, turnIndex);
      canMakeMove = false; // to prevent making another move
      gameService.makeMove(move);
    } catch (e) {
      log.info(["Cell is already full in position:", dir, row, col]);
      return;
    }
  }

  export function shouldShowImage(row: number, col: number): boolean { //may also add shouldShowEdge function later
    var cell = state.board.color[row][col];
    return cell !== "";
  }

  export function isPieceX(row: number, col: number): boolean {
    return state.board.color[row][col] === 'YOU';
  }

  export function isPieceO(row: number, col: number): boolean {
    return state.board.color[row][col] === 'ME';
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    return !animationEnded &&
        state.delta &&
        state.delta.row === row && state.delta.col === col;
  }
}

angular.module('myApp', ['ngTouch', 'ui.bootstrap'])
  .run(['initGameServices', function (initGameServices: any) {
  $rootScope['game'] = game;
  translate.setLanguage('en',  {
    RULES_OF_DOTS_AND_BOXES: "Rules of Dots_and_Boxes",
    RULES_SLIDE1: "You and your opponent take turns to mark one empty edge but cannot complete a cell.",
    RULES_SLIDE2: "Whoever completes a cell earn one score. When all edges are filled, the player with higher score wins",
    CLOSE: "Close"
  });
  game.init();
}]);

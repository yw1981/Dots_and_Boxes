module game {
  var animationEnded = false;
  var canMakeMove = false;
  var isComputerTurn = false;
  var state: IState = null;
  var lastUpdateUI: IUpdateUI = null;
  // var turnIndex: number = null;
  var RANGE: number  =6;
  export var isHelpModalShown: boolean = false;

  interface GridElem {
    dir: string;
    row?: number;
    col?: number;
  }

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
      log.info("Animation ended - start callback");
      animationEnded = true;
      if (isComputerTurn) {
        sendComputerMove();
      }
      log.info("Animation ended - end callback");
    });
  }

  function sendComputerMove(): void {
    // gameService.makeMove(
    //     aiService.createComputerMove(state.board, turnIndex,
    //       // at most 1 second for the AI to choose a move (but might be much quicker)
    //       {millisecondsLimit: 1000}));
    log.info("sendComputerMove");
    // log.info("explicitly call udpate UI");
    // updateUI(lastUpdateUI);
    gameService.makeMove(aiService.findComputerMove(lastUpdateUI));

    log.info("sendComputerMove..DONE");
  }

  function updateUI(params: IUpdateUI): void {
    log.info("calling updateUI..");
    animationEnded = false;
    lastUpdateUI = params;
    state = params.stateAfterMove;
    if (!state.board) {
      state.board = gameLogic.getInitialBoard();
    }
    canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
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
        log.info("this should be called only once");
        sendComputerMove();
      }
    }
    log.info("calling updateUI..DONE");
  }

  export function getScore (playerIndex: number): number {
    return state.board.score[playerIndex];
  }

  export function cellClicked(row: number, col: number): void {
    log.info(["Clicked on cell:", row, col]);
    if (!canMakeMove) {
      log.info("cannot make move now!");
      return;
    }
    if (window.location.search === '?throwException') { // to test encoding a stack trace with sourcemap
      throw new Error("Throwing the error because URL has '?throwException'");
    }
    let elem = translateToGridElem(row, col);
    if (elem.dir !== "hor" && elem.dir !== "ver") {
      log.info ("Clicked on non-action part");
    } else {
      log.info(elem.dir, elem.row, elem.col);
      //gameLogic.printBoard(state.board);
      cellClickedImpl(elem.dir, elem.row, elem.col);
    }
  }

  function translateToGridElem(row: number, col: number): GridElem {
    let elem = <GridElem>{};
    if ( row % 2 == 0 && col % 2 == 0) {
      elem.dir = "corner";
    } else if ( row % 2 == 1 && col % 2 == 1 ) {
      elem.dir = "cell";
      elem.row = Math.floor(row/2);
      elem.col = Math.floor(col/2);
    } else if (row % 2 == 0) {
      elem.dir = "hor";
      elem.row = Math.floor(row/2);
      elem.col = Math.floor(col/2);
    } else {
      elem.dir = "ver";
      elem.row = Math.floor(row/2);
      elem.col = Math.floor(col/2);
    }
    return elem;
  }


  function getDir(row: number, col: number): string {
    if ( (row + col) % 2 == 0) {
      return "";
    } else if (row % 2 == 0) {
      return ""
    }
  }

  function cellClickedImpl(dir: string, row: number, col: number): void {
    try {
      var move = gameLogic.createMove(state.board, dir, row, col, lastUpdateUI.turnIndexAfterMove);
      canMakeMove = false; // to prevent making another move
      log.info("calling makeMove in cellClickedImpl");
      gameService.makeMove(move);
    } catch (e) {
      log.info(["Cell is already full in position:", dir, row, col]);
      return;
    }
  }

  export function shouldShowImage(row: number, col: number): boolean { //may also add shouldShowEdge function later
    var elem = translateToGridElem (row, col);
    var cell = "";
    if (elem.dir === "cell") {
      cell = state.board.color[row][col];
    }
    return cell !== "";
  }

  export function isEdgeFilled(row: number, col: number):boolean {
    var elem = translateToGridElem (row, col);
    if (elem.dir==="hor") return state.board.hor[elem.row][elem.col]===1;
    else if (elem.dir==="ver") return state.board.ver[elem.row][elem.col]===1;
    else return false;
  }

  export function isNewlyFilledEdge(row: number, col: number ): boolean {
    var elem = translateToGridElem (row, col);
    return angular.equals(elem, state.delta);
  }

  export function isCellFilled_Player0(row: number, col: number): boolean {
    var elem = translateToGridElem (row, col);
    if (elem.dir === "cell") {
      return state.board.color[elem.row][elem.col] === 'YOU';
    }
    return false;
  }

  export function isCellFilled_Player1(row: number, col: number): boolean {
    var elem = translateToGridElem (row, col);
    if (elem.dir === "cell"){
      return state.board.color[elem.row][elem.col] === 'ME';
    }
    return false;
  }

  export function shouldSlowlyAppear(row: number, col: number): boolean {
    var elem = translateToGridElem (row, col);
    return !animationEnded &&
        state.delta &&
        state.delta.row === elem.row &&
        state.delta.col === elem.col &&
        state.delta.dir === elem.dir;
  }

  export function divideByTwoThenFloor(row: number): number {
    return Math.floor(row/2);
  }
}

angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .run(function () {
  $rootScope['game'] = game;
  translate.setLanguage('en',  {
    RULES_OF_DOTS_AND_BOXES: "Rules of Dots_and_Boxes",
    RULES_SLIDE1: "Starting with an empty grid of edges and cells. One player fills an empty horizontal or vertical edge.\n Players switch turns if did not complete a cell.",
    RULES_SLIDE2: "A player who completes the fourth side of a cell earns one point and takes another turn.\n When all the cells are filled, whoever earns the higher score wins.",
    CLOSE: "Close"
  });
  game.init();
});

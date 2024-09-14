import { Cell, CellPos, Figure, FigureColor, GameResult, JSChessEngine, MoveData, stateToFEN } from "../JSChessEngine";
import { useEffect, useState } from "react"
import { checkIsPossibleMove, checkPositionsHas, correctGrabbingPosForArrow, getChessBoardConfig, hasCheck } from "./utils";
import { ArrowCoords, ChangeMove, ChessBoardConfig } from "./models";
import { DEFAULT_CHESSBORD_CONFIG } from "./constants";

type UseChessBoardInteractiveProps = {
  config?: Partial<ChessBoardConfig>;
  onChange: (moveData: MoveData) => void;
  onEndGame: (result: GameResult) => void;
}

export const useChessBoardInteractive = (props: UseChessBoardInteractiveProps) => {
  const { config, onChange, onEndGame } = props;

  const [boardConfig, setBoardConfig] = useState(DEFAULT_CHESSBORD_CONFIG);
  const [initialState, setInitialState] = useState<Cell[][]>([]);
  const [actualState, setActualState] = useState<Cell[][]>([]);
  const [fromPos, setFromPos] = useState<CellPos>([-1, -1]);
  const [holdedFigure, setHoldedFigure] = useState<Figure>();
  const [grabbingPos, setGrabbingPos] = useState<CellPos>([-1, -1]);
  const [possibleMoves, setPossibleMoves] = useState<CellPos[]>([]);
  const [boardReversed, setBoardReversed] = useState(false);
  const [currentColor, setCurrentColor] = useState<FigureColor>('white');
  const [playerColor, setPlayerColor] = useState<FigureColor>();
  const [newMove, setNewMove] = useState<ChangeMove>();
  const [linesWithCheck, setLinesWithCheck] = useState<CellPos[][]>([]);
  const [markedCells, setMarkedCells] = useState<CellPos[]>([]);
  const [grabbingCell, setGrabbingCell] = useState<CellPos>([-1, -1]);

  const [clickedPos, setClickedPos] = useState<CellPos>([-1, -1]);
  const [clickedFigure, setClickedFigure] = useState<Figure>();
  const [clickPossibleMoves, setClickPossibleMoves] = useState<CellPos[]>([]);

  const [startArrowCoord, setStartArrowCoord] = useState<CellPos>([-1, -1]);
  const [arrowsCoords, setArrowsCoords] = useState<ArrowCoords[]>([]);

  // Используется при превращении пешки в фигуру
  const [showFigurePicker, setShowFigurePicker] = useState(false);
  const [targetPos, setTargetPos] = useState<CellPos>([-1, -1]);

  const clearFromPos = () => setFromPos([-1, -1]);
  const clearGrabbingPos = () => setGrabbingPos([-1, -1]);
  const clearPossibleMoves = () => setPossibleMoves([]);
  const clearClickPossibleMoves = () => setClickPossibleMoves([]);
  const toggleCurrentColor = () => setCurrentColor((prevColor) => prevColor === 'white' ? 'black' : 'white');
  const clearMarkedCells = () => setMarkedCells([]);
  const clearClickedPos = () => setClickedPos([-1, -1]);
  const clearArrows = () => setArrowsCoords([]);

  useEffect(() => {
    setBoardConfig(getChessBoardConfig(config));
  }, []);

  useEffect(() => {
    if (linesWithCheck.length > 0) {
      const gameResult = JSChessEngine.getGameResult(
        actualState,
        linesWithCheck,
        currentColor!,
        boardReversed
      );

      if (gameResult)
        onEndGame(gameResult);
    }
  }, [actualState, linesWithCheck, boardReversed, currentColor])

  const cleanAllForFigure = () => {
    setHoldedFigure(undefined);
    clearFromPos();
    clearGrabbingPos();
    clearPossibleMoves();
  }

  const cleanAllForClickedFigure = () => {
    setClickedFigure(undefined);
    clearClickedPos();
    clearClickPossibleMoves();
  }

  const reverseChessBoard = () => {
    cleanAllForFigure();
    setActualState((prevState) => JSChessEngine.reverseChessBoard(prevState));
    setBoardReversed((prevReversed) => !prevReversed);
  }

  // It's common select for click event and hover event  
  const selectFigureFrom = (cellPos: CellPos) => {
    const cell = actualState[cellPos[1]][cellPos[0]];

    if (!cell.figure) {
      cleanAllForFigure();
      return { figure: undefined, nextMoves: [] };
    }

    const { figure } = cell;

    
    if (figure.color !== currentColor && !playerColor) {
      cleanAllForFigure();
      return { figure: undefined, nextMoves: [] };
    }

    if (!!playerColor && figure.color !== playerColor) {
      cleanAllForFigure();
      return { figure: undefined, nextMoves: [] };
    }

    const nextMoves = JSChessEngine.getNextMoves(
      actualState,
      cellPos,
      linesWithCheck,
      boardReversed
    );

  
    return { figure: cell.figure, nextMoves };
  }

  const selectClickFrom = (cellPos: CellPos) => {
    const { figure, nextMoves } = selectFigureFrom(cellPos);
    if (!figure) return;

    setClickedFigure(figure);
    setClickedPos(cellPos);
    setClickPossibleMoves(nextMoves);
  }

  const selectHoverFrom = (cellPos: CellPos) => {
    const { figure, nextMoves } = selectFigureFrom(cellPos);
    if (!figure) return;

    setHoldedFigure(figure);
    setPossibleMoves(nextMoves);
    setFromPos(cellPos);
  }

  const moveFigure = (from: CellPos, to: CellPos, figure: Figure) => {
    if (!!playerColor && currentColor !== playerColor) {
      cleanAllForFigure();
      return { moveData: undefined, attackedPos: undefined } ;
    }

    const inNextMoves = checkPositionsHas(possibleMoves, to);

    // Проверка, что начальная позиция не равняется следующей
    // и то что inNextMoves будет true
    const conditionForDoMove =
      (to[0] !== from[0] || to[1] !== from[1]) && inNextMoves;

    if (!conditionForDoMove) return {};

    const { updatedCells, attackedPos } = JSChessEngine.changeState(
      actualState,
      figure,
      to,
      from,
      boardReversed
    );

    const linesCheck = JSChessEngine.getLinesWithCheck(
      updatedCells, 
      currentColor, 
      boardReversed
    );

    setLinesWithCheck(linesCheck);
    
    setActualState(updatedCells);

    // Пешка дошла до конца доски
    // Показываем FigurePicker
    // И изменяем состояние с превращением пешки
    if (
      figure.type === 'pawn' &&
      (to[1] === 0 || to[1] === actualState.length - 1)
    ) {
      setTargetPos(to);
      setShowFigurePicker(true);
      return {};
    }

    const colorFEN = currentColor === 'white' ? 'black' : 'white';
    const FEN = stateToFEN(updatedCells, colorFEN)

    // Собранные данные для отправки
    const moveData: MoveData = { figure, from, to, FEN };
    
    // setMoveVector([from, to]);
    // onChange(changedState, moveData);

    toggleCurrentColor();

    setHoldedFigure(undefined);
    clearFromPos();
    clearGrabbingPos();
    clearArrows();
    clearMarkedCells();

    return { moveData, attackedPos };
  }

  const moveFigureByClick = (from: CellPos, to: CellPos, figure: Figure) => {
    if (!!playerColor && currentColor !== playerColor) {
      cleanAllForFigure();
      return { moveData: undefined, attackedPos: undefined } ;
    }

    const inNextMoves = checkPositionsHas(clickPossibleMoves, to);

    // Проверка, что начальная позиция не равняется следующей
    // и то что inNextMoves будет true
    const conditionForDoMove =
      (to[0] !== from[0] || to[1] !== from[1]) && inNextMoves;

    if (!conditionForDoMove) return {};

    const { updatedCells, attackedPos } = JSChessEngine.changeState(
      actualState,
      figure,
      to,
      from,
      boardReversed
    );

    const linesCheck = JSChessEngine.getLinesWithCheck(
      updatedCells, 
      currentColor, 
      boardReversed
    );

    setLinesWithCheck(linesCheck);

    setActualState(updatedCells);

    // Пешка дошла до конца доски
    // Показываем FigurePicker
    // И изменяем состояние с превращением пешки
    if (
      figure.type === 'pawn' &&
      (to[1] === 0 || to[1] === actualState.length - 1)
    ) {
      setTargetPos(to);
      setShowFigurePicker(true);
      return {};
    }

    const colorFEN = currentColor === 'white' ? 'black' : 'white';
    const FEN = stateToFEN(updatedCells, colorFEN)

    // Собранные данные для отправки
    const moveData: MoveData = { figure, from, to, FEN };
    
    // setMoveVector([from, to]);
    // onChange(changedState, moveData);

    toggleCurrentColor();

    setClickedFigure(undefined);
    clearClickedPos();
    clearGrabbingPos();
    clearArrows();
    clearMarkedCells();

    return { moveData, attackedPos };
  }

  const handleGrabbing = (x: number, y: number) => {
    setGrabbingPos([x, y]);
  }

  const handleGrabEnd = (cellPos: CellPos, withTransition = false) => {
    if (fromPos[0] === -1) {
      clearGrabbingPos();
      return;
    }

    if (!holdedFigure) {
      return;
    }

    if (possibleMoves.length === 0) {
      clearGrabbingPos();
      return;
    }
    
    const foundPosInPossible = checkIsPossibleMove(possibleMoves, cellPos);

    if (!foundPosInPossible) {
      clearGrabbingPos();
      return;
    }
    
    const { moveData, attackedPos } = moveFigure(fromPos, cellPos, holdedFigure);
    if (!moveData) {
      clearGrabbingPos();
      return;
    }

    onChange(moveData);

    setNewMove({ move: moveData, withTransition, attackedPos });

    clearGrabbingPos();
    clearPossibleMoves();
  }

  const handleClickForTargetCell = (cellPos: CellPos, withTransition = false) => {
    if (clickedPos[0] === cellPos[0] && clickedPos[1] === cellPos[1]) return;
    if (clickedPos[0] === -1) return;
    if (!clickedFigure) return;
    if (clickPossibleMoves.length === 0) return;
    const foundPosInPossible = checkIsPossibleMove(clickPossibleMoves, cellPos);

    if (!foundPosInPossible) return;
    
    const { moveData, attackedPos } = moveFigureByClick(clickedPos, cellPos, clickedFigure);
    if (!moveData) return;

    onChange(moveData);

    setNewMove({ move: moveData, withTransition, attackedPos });

    clearClickedPos();
    clearClickPossibleMoves();
  }

  const handleClick = (cellPos: CellPos) => {
    clearMarkedCells();
    clearArrows();

    if (clickedPos[0] === -1) {
      selectClickFrom(cellPos);
      return;
    }

    const foundPosInPossible = checkIsPossibleMove(clickPossibleMoves, cellPos);
    if (!foundPosInPossible) {
      cleanAllForClickedFigure();
      return;
    }

    handleClickForTargetCell(cellPos, true);
  }

  const markCell = (cellPos: CellPos) => {
    cleanAllForFigure();

    setMarkedCells((prev) => {
      const preparedPrev = [...prev];
      
      const foundCellIndex = preparedPrev.findIndex(([x, y]) => x === cellPos[0] && y === cellPos[1]);
      if (foundCellIndex !== -1) return prev.filter((_, i) => i !== foundCellIndex);
      return [...preparedPrev, cellPos];
    });
  }
  
  const getHasCheckByCellPos = ([x, y]: CellPos) => {
    if (actualState.length === 0) return false;
    const cell = actualState[y][x];
    if (!cell.figure) return false;
    return hasCheck(cell, currentColor, linesWithCheck);
  }

  const startRenderArrow = (pos: CellPos) => {
    const startPos: CellPos = [
      (pos[0] + 1) * boardConfig.cellSize - boardConfig.cellSize / 2 - 10,
      (pos[1] + 1) * boardConfig.cellSize - boardConfig.cellSize / 2,
    ];

    setStartArrowCoord(startPos);
  }

  const endRenderArrow = ([x, y]: CellPos) => {
    if (startArrowCoord[0] === -1) return;

    setArrowsCoords((arrows) => {
      const copiedArrows = [...arrows];

      return [
        ...copiedArrows, 
        { 
          start: [...startArrowCoord], 
          end: correctGrabbingPosForArrow([x, y], boardConfig),
        }
      ];
    });

    setStartArrowCoord([-1, -1]);
  }

  // Обработка выбора превращения пешки
  const handleSelectFigurePicker = (figure: Figure) => {
    const startPos = fromPos[0] > -1 
      ? fromPos
      : clickedPos

    const updatedCells = JSChessEngine.transformPawnToFigure(
      actualState,
      startPos,
      targetPos,
      figure
    );

    const moveData: MoveData = {
      figure,
      from: startPos,
      to: targetPos,
      type: 'transform',
    };

    onChange(moveData);
    setActualState(updatedCells);
    toggleCurrentColor();
    setNewMove({ 
      move: moveData, 
      withTransition: false, 
      transformTo: figure,
    });

    const linesWithCheck = JSChessEngine.getLinesWithCheck(
      updatedCells, 
      currentColor, 
      boardReversed
    );

    setLinesWithCheck(linesWithCheck);

    // handleEndGame(updatedCells, linesWithCheck);

    clearGrabbingPos();
    clearPossibleMoves();
    clearMarkedCells();
    setShowFigurePicker(false);
    clearClickedPos();
    setHoldedFigure(undefined);
    setFromPos([-1, -1]);
    setClickedPos([-1, -1]);
    clearArrows();
  }

  const handleGrabbingCell = (cellPos: CellPos) => {
    setGrabbingCell(cellPos);
  }

  return {
    fromPos,
    newMove,
    boardConfig,
    markedCells,
    grabbingPos,
    actualState,
    currentColor,
    arrowsCoords,
    initialState,
    holdedFigure,
    grabbingCell,
    possibleMoves,
    linesWithCheck,
    startArrowCoord,
    showFigurePicker,

    markCell,
    setNewMove,
    handleClick,
    clearFromPos,
    handleGrabEnd,
    handleGrabbing,
    endRenderArrow,
    setActualState,
    setPlayerColor,
    setCurrentColor,
    selectClickFrom,
    selectHoverFrom,
    setInitialState,
    startRenderArrow,
    reverseChessBoard,
    handleGrabbingCell,
    getHasCheckByCellPos,
    handleSelectFigurePicker,
  }
}

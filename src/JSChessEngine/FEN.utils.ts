/* eslint-disable */
import {
  LETTER_TO_FIGURE_MAP,
  FIGURES_LATTERS_NOTATIONS,
  LETTERS,
} from './chess.consts';
import type { FigureColor, Cell } from './JSChessEngine';

/**
 * Вовзвращет позицию клетки по состоянию fen
 * @param positionFEN позиция из FEN вида e4
 * @returns координаты для определения клетки на доске
 */
export const getPositionByFEN = (positionFEN: string) => {
  return [
    8 - parseInt(positionFEN[1]) + 1, // +1 Поправка на то что значение взятто из индекса в массиве
    LETTERS.findIndex((letter) => letter === positionFEN[0]),
  ];
};

/**
 * Проверяет по части FEN возможность рокировки
 * и обновляет состояние доски для рокировки
 * @param castlingNotation часть FEN-нотации описывающая рокировку
 * @param state состояние доски
 * @returns обновленное состояние доски
 */
export const prepareCastlingByFEN = (
  castlingNotation: string,
  state: Cell[][]
): Cell[][] => {
  if (castlingNotation === '-') return state;

  const preparedState = [...state];

  if (castlingNotation.includes('K')) {
    if (!!preparedState[preparedState.length - 1][preparedState.length - 1].figure) {
      // Ладья
      preparedState[preparedState.length - 1][preparedState.length - 1].figure = {
        ...preparedState[preparedState.length - 1][preparedState.length - 1]
          .figure!,
        touched: false,
      };
  
      // Король
      preparedState[preparedState.length - 1][4].figure = {
        ...preparedState[preparedState.length - 1][4].figure!,
        touched: false,
      };
    }
  }

  if (castlingNotation.includes('Q')) {
    if (!!preparedState[preparedState.length - 1][0].figure) {
      // Ладья
      preparedState[preparedState.length - 1][0].figure = {
        ...preparedState[preparedState.length - 1][0].figure!,
        touched: false,
      };
  
      // Король
      preparedState[preparedState.length - 1][4].figure = {
        ...preparedState[preparedState.length - 1][4].figure!,
        touched: false,
      };
    }
  }

  if (castlingNotation.includes('k')) {
    if (!!preparedState[0][preparedState.length - 1].figure) {
      // Ладья
      preparedState[0][preparedState.length - 1].figure = {
        ...preparedState[0][preparedState.length - 1].figure!,
        touched: false,
      };
  
      // Король
      preparedState[0][4].figure = {
        ...preparedState[0][4].figure!,
        touched: false,
      };
    }
  }

  if (castlingNotation.includes('q')) {
    if (!!preparedState[0][0].figure) {
      // Ладья
      preparedState[0][0].figure = {
        ...preparedState[0][preparedState.length - 1].figure!,
        touched: false,
      };
  
      // Король
      preparedState[0][4].figure = {
        ...preparedState[0][4].figure!,
        touched: false,
      };
    }
  }

  return preparedState;
};

/**
 * Конвертирует часть FEN-нотации с фигурами в состояние доски
 * @param state состояние доски
 */
export const partFENtoState = (notation: string) => {
  const restoredState: Cell[][] = [];

  const stateRows = notation.split('/');

  stateRows.forEach((stateRow) => {
    const rowCells: Cell[] = [];

    for (let i = 0; i < stateRow.length; i++) {
      const cellNotation = stateRow[i];

      if (cellNotation === '.') {
        rowCells.push({ figure: undefined });
      } else {
        const figure = LETTER_TO_FIGURE_MAP[cellNotation];
        rowCells.push({ figure: { ...figure, touched: true } });
      }
    }

    restoredState.push(rowCells);
  });

  // TODO костыль, откуда-то берется пустой массив в конце, убрать его
  return restoredState.filter((row) => row.length > 0);
};

/**
 * Создает состояние доски
 * по FEN-нотации
 * rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
 * @param notation Описание текущего состояния от Stockfish https://hxim.github.io/Stockfish-Evaluation-Guide/
 */
export const FENtoGameState = (
  FEN: string
): { boardState: Cell[][]; currentColor: FigureColor } => {
  const gameState: { boardState: Cell[][]; currentColor: FigureColor } = {
    boardState: [],
    currentColor: 'white',
  };

  const [stateNotaion, currentColor, FENcastling, beatedField, ..._] =
    FEN.split(' ');

  // Сначала подготавливаем stateNotaion, чтобы вместо цифр были "." - пустые поля
  let preparedStateNotation = '';
  for (let i = 0; i < stateNotaion.length; i++) {
    // Если симвло число, то заполняем готовую нотацию
    // точками в таком количестве какое число в нотации
    if (!isNaN(parseInt(stateNotaion[i]))) {
      const dotsCount = parseInt(stateNotaion[i]);
      for (let dotI = 0; dotI < dotsCount; dotI++) preparedStateNotation += '.';
      continue;
    }

    preparedStateNotation += stateNotaion[i];
  }

  // Преобразуем часть с фигурами в состояние доски
  gameState.boardState = partFENtoState(preparedStateNotation);

  // Определили текущий цвет
  gameState.currentColor = currentColor === 'w' ? 'white' : 'black';

  // Определение возможностей рокировки
  gameState.boardState = prepareCastlingByFEN(
    FENcastling,
    gameState.boardState
  );

  // Определение битого поля
  if (beatedField !== '-') {
    const posBeatedCell = getPositionByFEN(beatedField);
    gameState.boardState[posBeatedCell[0]][posBeatedCell[1]] = {
      ...gameState.boardState[posBeatedCell[0]][posBeatedCell[1]],
      beated: true,
    };
  }

  return gameState;
};

/**
 * Возвращает FEN битое поле из состояние доски
 * @param state состояние доски
 */
export const getBeatedCellFENfromState = (state: Cell[][]) => {
  let beatedFieldFEN = '-';

  for (let j = 0; j < state.length; j++) {
    for (let i = 0; i < state[j].length; i++) {
      if (state[j][i].beated) {
        beatedFieldFEN = LETTERS[i] + (state.length - j).toString();
        break;
      }
    }
  }

  return beatedFieldFEN;
};

/**
 * Возвращает FEN положение фигур на доске
 * @param state состояние доски
 */
export const getFENpositionsFromState = (state: Cell[][]) => {
  let positionsFEN = '';
  let emptyCellsCount = 0;

  state.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell.figure) {
        if (emptyCellsCount > 0) {
          positionsFEN += emptyCellsCount.toString();
          emptyCellsCount = 0;
        }
        positionsFEN +=
          FIGURES_LATTERS_NOTATIONS[cell.figure.color][cell.figure.type];
      } else {
        emptyCellsCount += 1;
      }
    });

    if (emptyCellsCount > 0) {
      positionsFEN += emptyCellsCount.toString();
      emptyCellsCount = 0;
    }

    if (j !== state.length - 1) {
      positionsFEN += '/';
    }
  });

  return positionsFEN;
};

/**
 * Возвращает FEN-рокеровку из состояния доски
 * @param state состояние доски
 */
export const getFENcastlingFromState = (state: Cell[][]) => {
  let whiteCastlingFEN = '';
  let blackCastlingFEN = '';

  const stateLastCell = state.length - 1;

  state.forEach((row, j) =>
    row.forEach((cell, i) => {
      if (j === 0 && i === 0) {
        // Черная ладья ферзевый фланг | длинная рокеровка
        if (
          !!cell.figure &&
          cell.figure.type === 'rook' &&
          !cell.figure.touched
        ) {
          blackCastlingFEN = 'q';
        }
      }

      if (j === 0 && i === 4) {
        // Черный король
        if (
          !cell.figure ||
          cell.figure.type !== 'king' ||
          cell.figure.touched
        ) {
          blackCastlingFEN = '-';
        }
      }

      if (j === 0 && i === stateLastCell) {
        // Черная ладья королевский фланг | короткая рокеровка
        if (
          !!cell.figure &&
          cell.figure.type === 'rook' &&
          !cell.figure.touched &&
          blackCastlingFEN !== '-'
        ) {
          blackCastlingFEN = 'k' + blackCastlingFEN;
        }
      }

      if (j === stateLastCell && i === 0) {
        // Белая ладья ферзевый фланг | длинная рокеровка
        if (
          !!cell.figure &&
          cell.figure.type === 'rook' &&
          !cell.figure.touched
        ) {
          whiteCastlingFEN = 'Q';
        }
      }

      if (j === stateLastCell && i === 4) {
        // Белый король
        if (
          !cell.figure ||
          cell.figure.type !== 'king' ||
          cell.figure.touched
        ) {
          whiteCastlingFEN = '-';
        }
      }

      if (j === stateLastCell && i === stateLastCell) {
        // Белая ладья королевский фланг | короткая рокеровка
        if (
          !!cell.figure &&
          cell.figure.type === 'rook' &&
          !cell.figure.touched &&
          blackCastlingFEN !== '-'
        ) {
          whiteCastlingFEN = 'K' + whiteCastlingFEN;
        }
      }
    })
  );

  if (whiteCastlingFEN === '-' && blackCastlingFEN === '-') return '-';

  return (whiteCastlingFEN + blackCastlingFEN).replace('-', '');
};

/**
 * Преобразует состояние доски в FEN
 * @param state
 * @param countMoves
 */
export const stateToFEN = (
  state: Cell[][],
  currentColor: FigureColor,
  countMoves: number = 1
) => {
  const casttlingFEN = getFENcastlingFromState(state);
  const positionsFEN = getFENpositionsFromState(state);
  const colorFEN = currentColor === 'white' ? 'w' : 'b';
  const beatedFieldFEN = getBeatedCellFENfromState(state);
  const blackMoves = countMoves === 0 ? 0 : countMoves - 1;

  // Пример: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
  return `${positionsFEN} ${colorFEN} ${casttlingFEN} ${beatedFieldFEN} ${blackMoves} ${countMoves}`;
};

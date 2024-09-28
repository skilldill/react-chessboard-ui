export type FigureType =
  | 'pawn'
  | 'bishop'
  | 'knight'
  | 'rook'
  | 'queen'
  | 'king';
export type FigureColor = 'white' | 'black';

export type CellPos = [number, number];

export interface Figure {
  type: FigureType;
  color: FigureColor;
  touched?: boolean;
  position?: CellPos;
}

export type CellColor = 'white' | 'black';

export interface Cell {
  figure?: Figure;
  beated?: boolean;
}

export interface ChessBoardConfig {
  cellWhiteBg: string;
  cellBlackBg: string;
  cellSelectedBg: string;
  cellSize: number;
  figures: {
    black: { [figureType: string]: string };
    white: { [figureType: string]: string };
  };
}

export interface MoveNotation {
  move: string;
  figure: Figure;
  stateFEN: string;
}

export type MoveDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-left';

export type MoveType =
  | 'move'
  | 'beat'
  | 'check'
  | 'double-check'
  | 'mat'
  | 'transform'
  | '0-0'
  | '0-0-0';

export type GameResultType =
  | 'mat'
  | 'pat'
  | 'draw'
  | 'timeout'
  | 'surrender'
  | undefined;

export interface GameResult {
  resultType: GameResultType;
  winColor?: FigureColor; // Если "Пат" или "Ничья" то нет цвета - победителя
}

export type PawnMoveType = 'first' | 'default' | 'attack';

export interface MoveByPawn {
  pos: CellPos;
  typeMove: PawnMoveType;
}

export interface MoveData {
  from: CellPos;
  to: CellPos;
  figure: Figure;
  type?: MoveType;
  FEN?: string;
  timeWhite?: number;
  timeBlack?: number;
}

export interface BeatedCountsData {
  pawn: number;
  knight: number;
  bishop: number;
  rook: number;
  queen: number;
}

export type CastlingType = '0-0' | '0-0-0';

export type OnCheckPossible = (
  state: Cell[][],
  figurePos: CellPos,
  targetPos: CellPos,
) => boolean;

const DIRECTIONS_D: MoveDirection[] = [
  'top-right',
  'bottom-right',
  'bottom-left',
  'top-left',
];
const DIRECTIONS_VH: MoveDirection[] = ['top', 'right', 'bottom', 'left'];

const FIGURES_COUNTS = {
  PAWNS_COUNT: 8,
  KNIGHTS_COUNT: 2,
  BISHOPS_COUNT: 2,
  ROOKS_COUNT: 2,
  QUEENS_COUNT: 1,
  KINGS_COUNT: 1,
};

export class JSChessEngine {
  /**
   * Возвращает возможные ходы фигуры
   * @param state состояние доски
   * @param param1 позиция фигуры, которой хотим сыграть
   * @param linesWithCheck линии по которым есть шах на союзного короля
   * @param revese перевернута ли доска
   */
  static getNextMoves = (
    state: Cell[][],
    [i, j]: CellPos,
    linesWithCheck: CellPos[][],
    revese = false
  ): CellPos[] => {
    const figure = state[j][i].figure!;
    const { type } = figure;

    let nextPositions: CellPos[] = [];

    switch (type) {
      case 'pawn':
        const pawnPossibleMoves = JSChessEngine.getNextMovesPawn(
          state,
          [i, j],
          revese
        );
        nextPositions = JSChessEngine.correctionPossibleMoves(
          state,
          [i, j],
          pawnPossibleMoves,
          linesWithCheck
        );
        break;

      case 'bishop':
        const bishopPossibleMoves = JSChessEngine.getNextMovesBishop(state, [
          i,
          j,
        ]);
        nextPositions = JSChessEngine.correctionPossibleMoves(
          state,
          [i, j],
          bishopPossibleMoves,
          linesWithCheck
        );
        break;

      case 'knight':
        const knigtPossibleMoves = JSChessEngine.getNextMovesKnight(state, [
          i,
          j,
        ]);
        nextPositions = JSChessEngine.correctionPossibleMoves(
          state,
          [i, j],
          knigtPossibleMoves,
          linesWithCheck
        );
        break;

      case 'rook':
        const rookPossibleMovese = JSChessEngine.getNextMovesRook(state, [
          i,
          j,
        ]);
        nextPositions = JSChessEngine.correctionPossibleMoves(
          state,
          [i, j],
          rookPossibleMovese,
          linesWithCheck
        );
        break;

      case 'queen':
        const queenPossibleMoves = JSChessEngine.getNextMovesQueen(state, [
          i,
          j,
        ]);
        nextPositions = JSChessEngine.correctionPossibleMoves(
          state,
          [i, j],
          queenPossibleMoves,
          linesWithCheck
        );
        break;

      case 'king':
        nextPositions = JSChessEngine.getNextMovesKing(state, [i, j], revese);
        break;
    }

    return nextPositions;
  };

  /**
   * Возвращает первернутое состояние доски
   * @param state состояние доски
   */
  static reverseChessBoard = (state: Cell[][]) => {
    const prepareCells = [...state];
    const reversedCells = [...prepareCells.reverse()];

    return reversedCells.map((row) => [...row].reverse());
  };

  /**
   * Обновляет данные хода для того чтобы
   * можно было применить ход к перевернутой доске
   * @param moveData данные хода
   * @param boardSize размер доски
   */
  static reverseMove = (moveData: MoveData, boardSize: number) => {
    const { from, to, figure, type } = moveData;

    const reversedMove: MoveData = {
      figure,
      from: [boardSize - (from[0] + 1), boardSize - (from[1] + 1)],
      to: [boardSize - (to[0] + 1), boardSize - (to[1] + 1)],
      type,
    };

    return reversedMove;
  };

  /**
   * Возвращет перевернутое значение для начала и конца хода фигуры
   * Использовать при подсветке хода если доска перевернута
   * @param moveVector Координаты начала и конца хода фигуры
   * @param boardSize размер доски
   */
  static reverseMoveVector = (moveVector: CellPos[], boardSize = 8) => {
    const [from, to] = moveVector;
    const reversedMoveVector = [
      [boardSize - (from[0] + 1), boardSize - (from[1] + 1)],
      [boardSize - (to[0] + 1), boardSize - (to[1] + 1)],
    ];

    return reversedMoveVector;
  };

  /**
   * Проверка на то что позиция находится в пределах доски
   * @param state состояние доски
   * @param pos проверяемая позиция
   */
  static checkInBorderBoard = (state: Cell[][], pos: CellPos) => {
    return (
      pos[0] >= 0 &&
      pos[0] < state.length &&
      pos[1] >= 0 &&
      pos[1] < state.length
    );
  };

  /**
   * Возвращает цвет фигуры
   * @param state состояние доски
   * @param pos позиция фигуры
   */
  static getFigureColor = (state: Cell[][], pos: CellPos) => {
    return state[pos[1]][pos[0]].figure!.color;
  };

  /**
   * Возвращает тип фигры
   * @param state состояние доски
   * @param pos позиция фигуры
   */
  static getFigureType = (state: Cell[][], pos: CellPos) => {
    return state[pos[1]][pos[0]].figure?.type;
  };

  /**
   * Проверка находится ли в указанной клетке вражеская фигура
   * @param state состояние доски
   * @param pos положение фигуры союзного цвета
   * @param target положение фигуры - цели
   */
  static checkEnemy = (state: Cell[][], pos: CellPos, target: CellPos) => {
    const color = JSChessEngine.getFigureColor(state, pos);
    const targetColor = state[target[1]][target[0]]?.figure?.color;

    return !!targetColor && targetColor !== color;
  };

  /**
   * Проверка находится ли в указанной клетке союзная фигура
   * @param state состояние доски
   * @param pos положение фигуры союзного цвета
   * @param target положение фигуры - цели
   */
  static checkTeammate = (state: Cell[][], pos: CellPos, target: CellPos) => {
    const color = JSChessEngine.getFigureColor(state, pos);
    const targetColor = state[target[1]][target[0]].figure?.color;

    return !!targetColor && targetColor === color;
  };

  /**
   * Проверка на то что фигура-цель вражеский король
   * @param state состояние доски
   * @param pos положение фигуры союзного цвета
   * @param target положение фигуры - цели
   */
  static checkEnemyKing = (
    state: Cell[][],
    pos: CellPos,
    target: CellPos
  ) => {
    const isKing = state[target[1]][target[0]]?.figure?.type === 'king';

    if (!isKing) return false;

    return JSChessEngine.checkEnemy(state, pos, target);
  };

  /**
   * Проверяет битая ли клетка, клетка становится битой после того
   * как пешка сделает ход на две клетки веперед
   * @param state состояние доски
   * @param target позиция проверяемой клетки
   */
  static checkBeatedCell = (state: Cell[][], target: CellPos) => {
    return !!state[target[1]][target[0]]?.beated;
  };

  /**
   * Возвращает есть ли фигура в указаной позиции
   * @param state состояние доски
   * @param pos проверяемая позиция
   * @returns
   */
  static hasFigure = (state: Cell[][], pos: CellPos) => {
    return !!state[pos[1]][pos[0]]?.figure;
  };

  /**
   * Проверяет дальнобойная ли фигура
   * слон, ладья или ферзь
   * @param state состояние доски
   * @param figurePos позиция фигуры
   */
  static checkFigureIsLongRange = (state: Cell[][], figurePos: CellPos) => {
    const { figure } = state[figurePos[1]][figurePos[0]];
    return (
      figure?.type === 'bishop' ||
      figure?.type === 'rook' ||
      figure?.type === 'queen'
    );
  };

  /**
   * Возвращает количество вражеских которые можно атаковать (кроме короля) фигур из массива позиций
   * @param state состояние доски
   * @param figurePos позиция фигуры
   * @param positions проверяемые позиции
   */
  static getCountEnemys = (
    state: Cell[][],
    figurePos: CellPos,
    positions: CellPos[]
  ) => {
    let count = 0;

    for (let pos of positions) {
      if (JSChessEngine.checkEnemyKing(state, figurePos, pos)) break;

      if (
          JSChessEngine.checkEnemy(state, figurePos, pos)
          && !JSChessEngine.checkEnemyKing(state, figurePos, pos)
      ) count += 1;
    }

    return count;
  };

  /**
   * Возвращает позицию союзного короля
   * @param state состояние доски
   * @param figurePos позиция фигуры
   */
  static getTeammateKingPos = (state: Cell[][], figurePos: CellPos) => {
    const figureColor = JSChessEngine.getFigureColor(state, figurePos);

    let kingPos: CellPos | undefined = undefined;

    // Используется цикл для того чтобы можно было остановить поиск
    for (let j = 0; j < state.length; j++) {
      const row = state[j];

      for (let i = 0; i < row.length; i++) {
        const { figure } = row[i];

        if (figure?.color === figureColor && figure.type === 'king') {
          kingPos = [i, j];
          break;
        }
      }

      if (!!kingPos) {
        break;
      }
    }

    return kingPos;
  };

  /**
   * Возвращает все клетки с вражескими фигурами
   * @param state состояние доски
   * @param pos позиция союзной фигуры
   */
  static getAllEnemysPositions = (state: Cell[][], pos: CellPos) => {
    const enemysPos: CellPos[] = [];

    state.forEach((row, j) =>
      row.forEach((_, i) => {
        JSChessEngine.checkEnemy(state, pos, [i, j]) && enemysPos.push([i, j]);
      })
    );

    return enemysPos;
  };

  /**
   * Возвращает позиции фигур-союзников по цвету
   * @param state состояние доски
   * @param color цвет по которому ищем фигуры-союзники
   */
  static getAllTeammatesPositionsByColor = (
    state: Cell[][],
    color: FigureColor
  ) => {
    const positions: CellPos[] = [];

    state.forEach((row, j) =>
      row.forEach((cell, i) => {
        if (!!cell.figure && cell.figure.color === color) {
          positions.push([i, j]);
        }
      })
    );

    return positions;
  };

  /**
   * Полная проверка возможности хода для фигур: pawn, knigt, bishop, rook, queen
   * @param state состояния доски
   * @param pos положение фигуры союзного цвета
   * @param target позиция клетки - цели
   * @returns
   */
  static checkPossibleMoveTo = (
    state: Cell[][],
    pos: CellPos,
    target: CellPos
  ) => {
    // Если позиция находится за пределами доски, то сразу false
    return (
      JSChessEngine.checkInBorderBoard(state, target) &&
      // Если в клетке - цели нет фигуры
      (!JSChessEngine.hasFigure(state, target) ||
        // ИЛИ Если есть фигура и эта фигура вражеская и не король
        (JSChessEngine.hasFigure(state, target) &&
          JSChessEngine.checkEnemy(state, pos, target) &&
          !JSChessEngine.checkEnemyKing(state, pos, target)))
    );
  };

  /**
   * Прооверяет возможность атаки клетки
   * Если в клетке вражеская фигура, считает ее атакованной
   * Необходима для проверки нахождения вражеского короля за атакованной фигурой
   * @param state состояние доски
   * @param figurePos позиция фигураы
   * @param target клетака под атакой
   */
  static checkPossibleAttackTo = (
    state: Cell[][],
    figurePos: CellPos,
    target: CellPos
  ) => {
    // Если позиция находится за пределами доски, то сразу false
    return (
      JSChessEngine.checkInBorderBoard(state, target) &&
      (!JSChessEngine.hasFigure(state, target) ||
        JSChessEngine.checkEnemy(state, figurePos, target))
    );
  };

  /**
   * Проверка находится ли поле под атакой вражеской фигуры
   * (Используется для расчета возможных ходов для короля)
   * @param state состояние доски
   * @param pos позиция фигуры
   * @param target проверяемая клетка
   */
  static checkAttackedCell = (
    state: Cell[][],
    pos: CellPos,
    target: CellPos
  ) => {
    // Если позиция находится за пределами доски, то сразу false
    return JSChessEngine.checkInBorderBoard(state, target);
  };

  /**
   * Проверяет атакованные поля вражеской пешкой
   * (используется для получения возможных ходово для короля)
   * @param state состояние доски
   * @param pos текущая позиция пешки
   * @param target клетка - цель
   */
  static checkAttackedCellByPawn = (
    state: Cell[][],
    pos: CellPos,
    target: MoveByPawn
  ) => {
    switch (target.typeMove) {
      case 'default':
      case 'first':
        return false;
      case 'attack':
        return JSChessEngine.checkInBorderBoard(state, target.pos);
    }
  };

  /**
   * Проверяет находится ли позиция между атакованным королем
   * и атакующей фигурой
   * @param state состояние доски
   * @param pos проверяемая позиция
   * @param kingPos позиция союзного короля
   * @param attackerPos позиция атакующей фигуры
   */
  static checkPosBetweenAttckerAndKing = (
    state: Cell[][],
    pos: CellPos,
    kingPos: CellPos,
    attackerPos: CellPos
  ) => {
    // Проверка горизонтальных и вертикальных атак
    if (pos[0] === attackerPos[0] && pos[0] === kingPos[0]) {
      return (
        (pos[1] > kingPos[1] && pos[1] < attackerPos[1]) ||
        (pos[1] > attackerPos[1] && pos[1] < kingPos[1])
      );
    }

    if (pos[1] === attackerPos[1] && pos[1] === kingPos[1]) {
      return (
        (pos[0] > kingPos[0] && pos[0] < attackerPos[0]) ||
        (pos[0] > attackerPos[0] && pos[0] < kingPos[0])
      );
    }

    // Проверка диагональных атак
    if (
      (pos[1] > kingPos[1] && pos[1] < attackerPos[1]) ||
      (pos[1] > attackerPos[1] && pos[1] < kingPos[1])
    ) {
      return (
        (pos[0] > kingPos[0] && pos[0] < attackerPos[0]) ||
        (pos[0] > attackerPos[0] && pos[0] < kingPos[0])
      );
    }

    if (
      (pos[0] > kingPos[0] && pos[0] < attackerPos[0]) ||
      (pos[0] > attackerPos[0] && pos[0] < kingPos[0])
    ) {
      return (
        (pos[1] > kingPos[1] && pos[1] < attackerPos[1]) ||
        (pos[1] > attackerPos[1] && pos[1] < kingPos[1])
      );
    }

    return false;
  };

  /**
   * Корректирует возможные ходы фигуры в зависимости от того находится ли
   * фигура под атакой и стоит ли на линии атаки король за фигурой
   * @param state состояние доски
   * @param figurePos позиция фигуры
   * @param possibleMoves возможные ходы фигуры
   * @param linesWithCheck массив линий по которым есть шах на союзного короля
   */
  static correctionPossibleMoves = (
    state: Cell[][],
    figurePos: CellPos,
    possibleMoves: CellPos[],
    linesWithCheck: CellPos[][]
  ) => {
    const kingPos = JSChessEngine.getTeammateKingPos(state, figurePos)!;

    const enemysPos = JSChessEngine.getAllEnemysPositions(state, figurePos);

    // Находим все дальнобойные фигуры противника,
    // так как только они могут атаковать на протяженной дистанции
    const longrangeEnemysPos = enemysPos.filter((pos) =>
      JSChessEngine.checkFigureIsLongRange(state, pos)
    );

    const correctedPossibleMoves: CellPos[] = [];

    let kingBehidFigure = false;

    longrangeEnemysPos.forEach((enemyPos) => {
      const enemyType = state[enemyPos[1]][enemyPos[0]].figure!.type;

      switch (enemyType) {
        case 'bishop':
          DIRECTIONS_D.forEach((direction) => {
            if (!kingBehidFigure) {
              const attackedLine = JSChessEngine.getFullAttackedLine(
                state,
                enemyPos,
                direction
              );

              // Ищем индекс позиции короля
              const foundIndexKingPos = attackedLine.findIndex(
                (pos) => pos[0] === kingPos[0] && pos[1] === kingPos[1]
              );

              // Ищем позицию фигуры на линии атаки
              const foundIndexFigurePos = attackedLine.findIndex(
                (pos) => pos[0] === figurePos[0] && pos[1] === figurePos[1]
              );

              const countFiguresBehindKing = JSChessEngine.getCountEnemys(
                state,
                enemyPos,
                attackedLine
              );

              // Если индексы найдены и индекс короля больше чем индекс фигуры на линии атаки
              // то корректируем возможные движения фигуры
              kingBehidFigure =
                foundIndexKingPos > -1 &&
                foundIndexFigurePos > -1 &&
                foundIndexKingPos > foundIndexFigurePos &&
                countFiguresBehindKing === 1;

              if (kingBehidFigure) {
                // Оставляем только те позиции которые есть и в possibleMoves и в attackedLine
                possibleMoves.forEach((possibleMove) => {
                  // Включаем позиции атакующей фигуры так как ее можно съесть
                  [...attackedLine, enemyPos].forEach((attackedPos) => {
                    if (
                      attackedPos[0] === possibleMove[0] &&
                      attackedPos[1] === possibleMove[1]
                    ) {
                      correctedPossibleMoves.push(possibleMove);
                    }
                  });
                });
              }
            }
          });

          break;

        case 'rook':
          if (kingBehidFigure) {
            break;
          }

          DIRECTIONS_VH.forEach((direction) => {
            if (!kingBehidFigure) {
              const attackedLine = JSChessEngine.getFullAttackedLine(
                state,
                enemyPos,
                direction
              );

              // Ищем индекс позиции короля
              const foundIndexKingPos = attackedLine.findIndex(
                (pos) => pos[0] === kingPos[0] && pos[1] === kingPos[1]
              );

              // Ищем позицию фигуры на линии атаки
              const foundIndexFigurePos = attackedLine.findIndex(
                (pos) => pos[0] === figurePos[0] && pos[1] === figurePos[1]
              );

              const countFiguresBehindKing = JSChessEngine.getCountEnemys(
                state,
                enemyPos,
                attackedLine
              );

              // Если индексы найдены и индекс короля больше чем индекс фигуры на линии атаки
              // то корректируем возможные движения фигуры
              kingBehidFigure =
                foundIndexKingPos > -1 &&
                foundIndexFigurePos > -1 &&
                foundIndexKingPos > foundIndexFigurePos &&
                countFiguresBehindKing === 1;

              if (kingBehidFigure) {
                // Оставляем только те позиции которые есть и в possibleMoves и в attackedLine
                possibleMoves.forEach((possibleMove) => {
                  // Включаем позиции атакующей фигуры так как ее можно съесть
                  [...attackedLine, enemyPos].forEach((attackedPos) => {
                    if (
                      attackedPos[0] === possibleMove[0] &&
                      attackedPos[1] === possibleMove[1]
                    ) {
                      correctedPossibleMoves.push(possibleMove);
                    }
                  });
                });
              }
            }
          });

          break;

        case 'queen':
          if (kingBehidFigure) {
            break;
          }

          [...DIRECTIONS_D, ...DIRECTIONS_VH].forEach((direction) => {
            if (!kingBehidFigure) {
              const attackedLine = JSChessEngine.getFullAttackedLine(
                state,
                enemyPos,
                direction
              );

              // Ищем индекс позиции короля
              const foundIndexKingPos = attackedLine.findIndex(
                (pos) => pos[0] === kingPos[0] && pos[1] === kingPos[1]
              );

              // Ищем позицию фигуры на линии атаки
              const foundIndexFigurePos = attackedLine.findIndex(
                (pos) => pos[0] === figurePos[0] && pos[1] === figurePos[1]
              );

              const countFiguresBehindKing = JSChessEngine.getCountEnemys(
                state,
                enemyPos,
                attackedLine
              );

              // Если индексы найдены и индекс короля больше чем индекс фигуры на линии атаки
              // то корректируем возможные движения фигуры
              kingBehidFigure =
                foundIndexKingPos > -1 &&
                foundIndexFigurePos > -1 &&
                foundIndexKingPos > foundIndexFigurePos &&
                countFiguresBehindKing === 1;

              if (kingBehidFigure) {
                // Оставляем только те позиции которые есть и в possibleMoves и в attackedLine
                possibleMoves.forEach((possibleMove) => {
                  // Включаем позиции атакующей фигуры так как ее можно съесть
                  [...attackedLine, enemyPos].forEach((attackedPos) => {
                    if (
                      attackedPos[0] === possibleMove[0] &&
                      attackedPos[1] === possibleMove[1]
                    ) {
                      correctedPossibleMoves.push(possibleMove);
                    }
                  });
                });
              }
            }
          });

          break;
      }
    });

    const preparedMoves = kingBehidFigure
      ? correctedPossibleMoves
      : possibleMoves;

    // Если линия с шахом только одна
    // то фигура способна зашитить короля
    if (linesWithCheck.length === 1) {
      const correctedMovesForProtectKing: CellPos[] = [];

      const attackedLine = linesWithCheck[0];

      // Так как добавляется последней в линию атаки
      // TODO: поправить, так как непонятно
      const attackerPos = attackedLine[attackedLine.length - 1];

      attackedLine.forEach((attackedPos) => {
        preparedMoves.forEach((possibleMove) => {
          // Если возможный ход совпдает с одной из атакованных позций
          // Значит фигуры может прикрыть короля от шаха

          if (
            attackedPos[0] === possibleMove[0] &&
            attackedPos[1] === possibleMove[1] &&
            // Если фигура находится перед королем
            (JSChessEngine.checkPosBetweenAttckerAndKing(
              state,
              possibleMove,
              kingPos,
              attackerPos
            ) ||
              // Или в атакованной позиции есть атакующая фигура
              JSChessEngine.checkEnemy(state, kingPos, possibleMove))
            // Необходимо добавить условие для того чтобы фигура - защитник
            // Обязательно находилась перед королем
          ) {
            correctedMovesForProtectKing.push(possibleMove);
          }
        });
      });

      return correctedMovesForProtectKing;
    }

    // Если двойной и более шах, то одна фигура не способна
    // защитить от нескольких линий атак
    // следовательно не можем делать ход фигурой
    if (linesWithCheck.length > 1) return [];

    // Атаки на короля нет, фигуры могут свободно ходить
    return preparedMoves;
  };

  /**
   * Возвращает всю атакованную линию дальнобойной фигурой
   * @param state состояние доски
   * @param figurePos позиция фигуры
   * @param direction направление атаки
   */
  static getFullAttackedLine = (
    state: Cell[][],
    figurePos: CellPos,
    direction: MoveDirection
  ) => {
    let nextMove: CellPos;

    const attackedPositions: CellPos[] = [];

    switch (direction) {
      case 'top-right':
        nextMove = [figurePos[0] + 1, figurePos[1] - 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] + 1, nextMove[1] - 1];
        }

        break;

      case 'bottom-right':
        nextMove = [figurePos[0] + 1, figurePos[1] + 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] + 1, nextMove[1] + 1];
        }

        break;

      case 'bottom-left':
        nextMove = [figurePos[0] - 1, figurePos[1] + 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] - 1, nextMove[1] + 1];
        }

        break;

      case 'top-left':
        nextMove = [figurePos[0] - 1, figurePos[1] - 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] - 1, nextMove[1] - 1];
        }

        break;

      case 'top':
        nextMove = [figurePos[0], figurePos[1] - 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0], nextMove[1] - 1];
        }

        break;

      case 'right':
        nextMove = [figurePos[0] + 1, figurePos[1]];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] + 1, nextMove[1]];
        }

        break;

      case 'bottom':
        nextMove = [figurePos[0], figurePos[1] + 1];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0], nextMove[1] + 1];
        }

        break;

      case 'left':
        nextMove = [figurePos[0] - 1, figurePos[1]];

        while (
          JSChessEngine.checkPossibleAttackTo(state, figurePos, nextMove)
        ) {
          attackedPositions.push(nextMove);
          nextMove = [nextMove[0] - 1, nextMove[1]];
        }

        break;
    }

    return attackedPositions;
  };

  /**
   * Возвращает все атакованные врагом позиции
   * используется для проверки ходов короля
   * @param state состояние доски
   * @param figurePos позиция фигуры
   * @param reverse перевернута ли доска
   */
  static getAllAttckedPostionsByEnemys = (
    state: Cell[][],
    figurePos: CellPos,
    reverse: boolean
  ) => {
    const enemysPos = JSChessEngine.getAllEnemysPositions(state, figurePos);
    let attackedPositions: CellPos[] = [];

    enemysPos.forEach(([i, j]) => {
      const figure = state[j][i].figure!;
      const { type } = figure;

      switch (type) {
        case 'pawn':
          const pawnAttackedPos = JSChessEngine.calcPawnMoves(
            state,
            [i, j],
            reverse,
            JSChessEngine.checkAttackedCellByPawn
          );

          attackedPositions = [...attackedPositions, ...pawnAttackedPos];
          break;

        case 'bishop':
          const bishopAttackedPos = JSChessEngine.calcDiagonalMoves(
            state,
            [i, j],
            JSChessEngine.checkAttackedCell,
            (state, _, targetPos) =>
              JSChessEngine.hasFigure(state, targetPos) &&
              !JSChessEngine.checkEnemyKing(state, [i, j], targetPos)
          );

          attackedPositions = [...attackedPositions, ...bishopAttackedPos];
          break;

        case 'knight':
          const knigtAttackedPos = JSChessEngine.calcKnightMoves(
            state,
            [i, j],
            JSChessEngine.checkAttackedCell
          );

          attackedPositions = [...attackedPositions, ...knigtAttackedPos];
          break;

        case 'rook':
          const rookAttackedPos = JSChessEngine.calcHorizontalAndVerticalMoves(
            state,
            [i, j],
            JSChessEngine.checkAttackedCell,
            (state, _, targetPos) =>
              JSChessEngine.hasFigure(state, targetPos) &&
              !JSChessEngine.checkEnemyKing(state, [i, j], targetPos)
          );

          attackedPositions = [...attackedPositions, ...rookAttackedPos];
          break;

        case 'queen':
          const queenAttachedPosD = JSChessEngine.calcDiagonalMoves(
            state,
            [i, j],
            JSChessEngine.checkAttackedCell,
            (state, _, targetPos) =>
              JSChessEngine.hasFigure(state, targetPos) &&
              !JSChessEngine.checkEnemyKing(state, [i, j], targetPos)
          );

          const queenAttachedPosVH =
            JSChessEngine.calcHorizontalAndVerticalMoves(
              state,
              [i, j],
              JSChessEngine.checkAttackedCell,
              (state, _, targetPos) =>
                JSChessEngine.hasFigure(state, targetPos) &&
                !JSChessEngine.checkEnemyKing(state, [i, j], targetPos)
            );

          attackedPositions = [
            ...attackedPositions,
            ...queenAttachedPosD,
            ...queenAttachedPosVH,
          ];
          break;

        case 'king':
          const kingAttackedPos = JSChessEngine.calcKingMoves(
            state,
            [i, j],
            reverse,
            true
          );

          attackedPositions = [...attackedPositions, ...kingAttackedPos];
          break;
      }
    });

    return attackedPositions;
  };

  /**
   * Возвращает возможные позиция для движения по диагонали
   * для Слона и Ферзя
   * @param state состояние доски
   * @param figurePos текущая позиция фигуры
   */
  static calcDiagonalMoves = (
    state: Cell[][],
    figurePos: CellPos,
    onCheckPossible: OnCheckPossible = JSChessEngine.checkPossibleMoveTo,
    onCheckFigureInCell: OnCheckPossible = JSChessEngine.checkEnemy
  ) => {
    const nextMoves: CellPos[] = [];

    // Влево-вверх
    let nextMove: CellPos = [figurePos[0] - 1, figurePos[1] - 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] - 1, nextMove[1] - 1];
    }

    // Вправо-вверх
    nextMove = [figurePos[0] + 1, figurePos[1] - 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] + 1, nextMove[1] - 1];
    }

    // Влево-вниз
    nextMove = [figurePos[0] + 1, figurePos[1] + 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] + 1, nextMove[1] + 1];
    }

    // Вправо-вниз
    nextMove = [figurePos[0] - 1, figurePos[1] + 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] - 1, nextMove[1] + 1];
    }

    return nextMoves;
  };

  /**
   * Возвращает возможные позиция для движения по горизонтали и вертикали
   * для Ладьи и Ферзя
   * @param state состяние доски
   * @param figurePos
   * @returns
   */
  static calcHorizontalAndVerticalMoves = (
    state: Cell[][],
    figurePos: CellPos,
    onCheckPossible: OnCheckPossible = JSChessEngine.checkPossibleMoveTo,
    onCheckFigureInCell: OnCheckPossible = JSChessEngine.checkEnemy
  ) => {
    const nextMoves: CellPos[] = [];

    // Влево
    let nextMove: CellPos = [figurePos[0] - 1, figurePos[1]];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] - 1, nextMove[1]];
    }

    // Вверх
    nextMove = [figurePos[0], figurePos[1] - 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0], nextMove[1] - 1];
    }

    // Вправо
    nextMove = [figurePos[0] + 1, figurePos[1]];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0] + 1, nextMove[1]];
    }

    // Вниз
    nextMove = [figurePos[0], figurePos[1] + 1];

    while (onCheckPossible(state, figurePos, nextMove)) {
      nextMoves.push([...nextMove]);

      if (onCheckFigureInCell(state, figurePos, nextMove)) {
        break;
      }

      nextMove = [nextMove[0], nextMove[1] + 1];
    }

    return nextMoves;
  };

  /**
   * Возвращает возможные ходы для коня
   * @param state состояние доски
   * @param figurePos текущая позиция фигуры
   * @returns
   */
  static calcKnightMoves = (
    state: Cell[][],
    figurePos: CellPos,
    onCheckPossible: OnCheckPossible = JSChessEngine.checkPossibleMoveTo
  ) => {
    const nextMoves: CellPos[] = [];

    const possibleMoves: CellPos[] = [
      [figurePos[0] + 1, figurePos[1] - 2],
      [figurePos[0] - 1, figurePos[1] - 2],
      [figurePos[0] - 2, figurePos[1] + 1],
      [figurePos[0] - 2, figurePos[1] - 1],
      [figurePos[0] + 2, figurePos[1] + 1],
      [figurePos[0] + 2, figurePos[1] - 1],
      [figurePos[0] + 1, figurePos[1] + 2],
      [figurePos[0] - 1, figurePos[1] + 2],
    ];

    possibleMoves.forEach((move) => {
      if (onCheckPossible(state, figurePos, move)) {
        nextMoves.push(move);
      }
    });

    return nextMoves;
  };

  /**
   * Проверяет возможность пешки пойти на клетку - цель
   * @param state состояние доски
   * @param pos текущая позиция пешки
   * @param target клетка - цель
   * @param pawnColor цвет пешки вычисленный заранее
   * @param reverse перевернута ли доска
   */
  static checkPossiblePawnMoveToPos = (
    state: Cell[][],
    pos: CellPos,
    target: MoveByPawn,
    pawnColor: FigureColor,
    reverse: boolean
  ) => {
    switch (target.typeMove) {
      case 'first':
        if (
          (pawnColor === 'white' && reverse) ||
          (pawnColor === 'black' && !reverse)
        ) {
          return (
            pos[1] === 1 &&
            !JSChessEngine.hasFigure(state, [
              target.pos[0],
              target.pos[1] - 1,
            ]) &&
            !JSChessEngine.hasFigure(state, target.pos)
          );
        }

        return (
          pos[1] === state.length - 2 &&
          !JSChessEngine.hasFigure(state, [target.pos[0], target.pos[1] + 1]) &&
          !JSChessEngine.hasFigure(state, target.pos)
        );

      case 'default':
        return !JSChessEngine.hasFigure(state, target.pos);

      case 'attack':
        return (
          (JSChessEngine.checkInBorderBoard(state, target.pos) &&
            JSChessEngine.hasFigure(state, target.pos) &&
            JSChessEngine.checkEnemy(state, pos, target.pos) &&
            !JSChessEngine.checkEnemyKing(state, pos, target.pos)) ||
          // Если поле битое
          (JSChessEngine.checkInBorderBoard(state, target.pos) &&
            JSChessEngine.checkBeatedCell(state, target.pos))
        );
    }
  };

  /**
   * Возвращает возможные позиции для пешки
   * @param state состояние доски
   * @param figurePos текущее положение пешки
   * @param revese перевернута ли доска
   * @returns
   */
  static calcPawnMoves = (
    state: Cell[][],
    figurePos: CellPos,
    revese: boolean,
    onCheckPossible:
      | typeof JSChessEngine.checkPossiblePawnMoveToPos
      | typeof JSChessEngine.checkAttackedCellByPawn = JSChessEngine.checkPossiblePawnMoveToPos
  ) => {
    const pawnColor = JSChessEngine.getFigureColor(state, figurePos);
    const nextMoves: CellPos[] = [];

    // Возможные позиции для пешки
    const possibleMoves: MoveByPawn[] = [
      // Первый ход
      { typeMove: 'first', pos: [figurePos[0], figurePos[1] - 2] },

      // Обычный ход вперед
      { typeMove: 'default', pos: [figurePos[0], figurePos[1] - 1] },

      // Атака
      { typeMove: 'attack', pos: [figurePos[0] - 1, figurePos[1] - 1] },

      // Атака
      { typeMove: 'attack', pos: [figurePos[0] + 1, figurePos[1] - 1] },
    ];

    // В обычном состоянии это возможные ходы за черных
    // с параметром reverse = true возможные ходы за белых
    const possibleMovesReverse: MoveByPawn[] = [
      // Первый ход
      { typeMove: 'first', pos: [figurePos[0], figurePos[1] + 2] },

      // Обычный ход вперед
      { typeMove: 'default', pos: [figurePos[0], figurePos[1] + 1] },

      // Атака
      { typeMove: 'attack', pos: [figurePos[0] - 1, figurePos[1] + 1] },

      // Атака
      { typeMove: 'attack', pos: [figurePos[0] + 1, figurePos[1] + 1] },
    ];

    // Если цвет пещки белый и доска не перевернута ИЛИ цвет пешки черный и доска перевернута => используем обычные ходы
    // Иначе используем перевернутые ходы
    const possibleMovesForColor =
      (pawnColor === 'white' && !revese) || (pawnColor === 'black' && revese)
        ? possibleMoves
        : possibleMovesReverse;

    possibleMovesForColor.forEach((move) => {
      onCheckPossible(state, figurePos, move, pawnColor, revese) &&
        nextMoves.push(move.pos);
    });

    return nextMoves;
  };

  /**
   * Проверяет возможна ли рокеровка
   * @param state состояние доски
   * @param kingPos позиция короля
   * @param reverse перевенута ли доска
   */
  static checkPossibleCastling = (
    state: Cell[][],
    kingPos: CellPos,
    castlingPath: CellPos[],
    reverse: boolean
  ) => {
    // Если короля перемещали - рокеровка невозможна
    if (
      !!state[kingPos[1]][kingPos[0]].figure &&
      state[kingPos[1]][kingPos[0]].figure?.touched
    )
      return false;

    // Проверка на атакованы ли поля для рокеровки
    // Если хоть одно поле кроме для рокеровки атаковано (кроме поля на котором ладья)
    // и если атакован король
    // то рокеровка невозможна
    const allAttackedPositionsByEnemys =
      JSChessEngine.getAllAttckedPostionsByEnemys(state, kingPos, reverse);

    const foundCheckKingPos = allAttackedPositionsByEnemys.find(
      (attackedPos) =>
        attackedPos[0] === kingPos[0] && attackedPos[1] === kingPos[1]
    );

    if (!!foundCheckKingPos) return false;

    // Если ладью перемещали - рокеровка невозможна
    // figurePos[1] - горизонталь на которой изначально находится короля
    // на ней же должны находиться ладьи
    const castlingPathWithoutRook = [...castlingPath];
    const rookPos = castlingPathWithoutRook.pop();

    if (
      !state[rookPos![1]][rookPos![0]] ||
      !state[rookPos![1]][rookPos![0]].figure
    )
      return false;

    if (
      !!state[rookPos![1]][rookPos![0]].figure &&
      state[rookPos![1]][rookPos![0]].figure?.touched
    )
      return false;

    // Если на пути рокеровки есть фигуры - рокеровка невохможна
    const castlinPathWithFigures = castlingPathWithoutRook.filter(
      (castlingPos) => JSChessEngine.hasFigure(state, castlingPos)
    );

    if (castlinPathWithFigures.length > 0) return false;

    let isPossibleCastling = true;

    for (let i = 0; i < allAttackedPositionsByEnemys.length; i++) {
      const attackedPos = allAttackedPositionsByEnemys[i];

      for (let j = 0; j < castlingPathWithoutRook.length; j++) {
        const castlingPos = castlingPathWithoutRook[j];

        if (
          castlingPos[0] === attackedPos[0] &&
          castlingPos[1] === attackedPos[1]
        ) {
          isPossibleCastling = false;
          break;
        }
      }

      if (!isPossibleCastling) break;
    }

    return isPossibleCastling;
  };

  /**
   * Возвращает возможные ходы для короля
   * @param state состояние доски
   * @param figurePos позиция короля
   * @returns
   */
  static calcKingMoves = (
    state: Cell[][],
    figurePos: CellPos,
    reverse: boolean,
    onlyAttacks: boolean = false
  ) => {
    const nextMoves: CellPos[] = [];

    const possibleMoves: CellPos[] = [
      [figurePos[0], figurePos[1] - 1],
      [figurePos[0] + 1, figurePos[1] - 1],
      [figurePos[0] + 1, figurePos[1]],
      [figurePos[0] + 1, figurePos[1] + 1],
      [figurePos[0], figurePos[1] + 1],
      [figurePos[0] - 1, figurePos[1] + 1],
      [figurePos[0] - 1, figurePos[1]],
      [figurePos[0] - 1, figurePos[1] - 1],
    ];

    // Для короткой рокеровки
    const castlingMovesDefault: CellPos[] = [
      [figurePos[0] + 1, figurePos[1]],
      [figurePos[0] + 2, figurePos[1]],
      [figurePos[0] + 3, figurePos[1]],
    ];

    // Для длинной рокеровки
    const longCastlingMovesDefault: CellPos[] = [
      [figurePos[0] - 1, figurePos[1]],
      [figurePos[0] - 2, figurePos[1]],
      [figurePos[0] - 3, figurePos[1]],
      [figurePos[0] - 4, figurePos[1]],
    ];

    // Для короткой рокеровки (доска развернута)
    const castlingMovesReversed: CellPos[] = [
      [figurePos[0] - 1, figurePos[1]],
      [figurePos[0] - 2, figurePos[1]],
      [figurePos[0] - 3, figurePos[1]],
    ];

    // Для длинной рокеровки (доска развернута)
    const longCastlingMovesReversed: CellPos[] = [
      [figurePos[0] + 1, figurePos[1]],
      [figurePos[0] + 2, figurePos[1]],
      [figurePos[0] + 3, figurePos[1]],
      [figurePos[0] + 4, figurePos[1]],
    ];

    const castlingMoves = reverse
      ? castlingMovesReversed
      : castlingMovesDefault;
    const longCastlingMoves = reverse
      ? longCastlingMovesReversed
      : longCastlingMovesDefault;

    if (onlyAttacks) return possibleMoves;

    const allAttackedPositionsByEnemys =
      JSChessEngine.getAllAttckedPostionsByEnemys(state, figurePos, reverse);

    possibleMoves.forEach((move) => {
      if (JSChessEngine.checkPossibleMoveTo(state, figurePos, move)) {
        const foundInAttacked = allAttackedPositionsByEnemys.find(
          (attackedMove) =>
            attackedMove[0] === move[0] && attackedMove[1] === move[1]
        );

        // Если возможный ход не найден в полях находящихся под атакой, то добавляем его в возможные ходы короля
        foundInAttacked === undefined && nextMoves.push(move);
      }
    });

    // Проверка на возможность рокеровки
    // 1. Король не перемещался
    // 2. Ладьи не перемещались
    // 3. Рокеровке не мешают фигуры
    // 4. поля для рокеровки не атакованы
    if (
      JSChessEngine.checkPossibleCastling(
        state,
        figurePos,
        castlingMoves,
        reverse
      )
    ) {
      castlingMoves.forEach((castlingPos) => nextMoves.push(castlingPos));
    }

    if (
      JSChessEngine.checkPossibleCastling(
        state,
        figurePos,
        longCastlingMoves,
        reverse
      )
    ) {
      longCastlingMoves.forEach((castlingPos) => nextMoves.push(castlingPos));
    }

    return nextMoves;
  };

  static getNextMovesPawn = (
    state: Cell[][],
    figurePos: CellPos,
    reverse: boolean
  ) => {
    return JSChessEngine.calcPawnMoves(state, figurePos, reverse);
  };

  static getNextMovesBishop = (state: Cell[][], figurePos: CellPos) => {
    return JSChessEngine.calcDiagonalMoves(state, figurePos);
  };

  static getNextMovesKnight = (state: Cell[][], figurePos: CellPos) => {
    return JSChessEngine.calcKnightMoves(state, figurePos);
  };

  static getNextMovesRook = (state: Cell[][], figurePos: CellPos) => {
    return JSChessEngine.calcHorizontalAndVerticalMoves(state, figurePos);
  };

  static getNextMovesQueen = (state: Cell[][], figurePos: CellPos) => {
    const diagonalMoves = JSChessEngine.calcDiagonalMoves(state, figurePos);
    const verticalAndHorizontalMoves =
      JSChessEngine.calcHorizontalAndVerticalMoves(state, figurePos);
    const moves = [...diagonalMoves, ...verticalAndHorizontalMoves];

    return moves;
  };

  static getNextMovesKing = (
    state: Cell[][],
    figurePos: CellPos,
    reverse: boolean
  ) => {
    return JSChessEngine.calcKingMoves(state, figurePos, reverse);
  };

  /**
   * Возвращает линии по которым есть шах вражескому королю
   * @param state состояние доски
   * @param activeColor цвет фигур, которые сделали ход
   */
  static getLinesWithCheck = (
    state: Cell[][],
    activeColor: FigureColor,
    reverse = false
  ) => {
    const posTeammates = JSChessEngine.getAllTeammatesPositionsByColor(
      state,
      activeColor
    );

    const linesWithCheck: CellPos[][] = [];

    posTeammates.forEach((pos) => {
      const figureType = JSChessEngine.getFigureType(state, pos);

      switch (figureType) {
        case 'bishop':
          DIRECTIONS_D.forEach((direction) => {
            const attackedLineBishop = JSChessEngine.getFullAttackedLine(
              state,
              pos,
              direction
            );

            let hasAttackedEnemyKing = false;

            for (let i = 0; i < attackedLineBishop.length; i++) {
              const attackedPos = attackedLineBishop[i];

              // Проверяем атакованную позицию
              // Если клетка пустая, то продолжаем проверять
              // Необходимое условие чтобы перед королем не было атакованной фигуры
              if (
                JSChessEngine.hasFigure(state, attackedPos) &&
                !JSChessEngine.checkEnemyKing(state, pos, attackedPos)
              ) {
                break;
              }

              // Если доходим до короля, перываем цикл и отмечаем
              // что линия имеет атакованного короля - объявлен шах
              if (JSChessEngine.checkEnemyKing(state, pos, attackedPos)) {
                hasAttackedEnemyKing = true;
                break;
              }
            }

            // Если линия имеет атакованного короля, добавляем ее в линии с шахами
            if (hasAttackedEnemyKing) {
              linesWithCheck.push([...attackedLineBishop, pos]);
            }
          });

          break;

        case 'rook':
          DIRECTIONS_VH.forEach((direction) => {
            const attackedLineRook = JSChessEngine.getFullAttackedLine(
              state,
              pos,
              direction
            );

            let hasAttackedEnemyKing = false;

            for (let i = 0; i < attackedLineRook.length; i++) {
              const attackedPos = attackedLineRook[i];

              // Проверяем атакованную позицию
              // Если клетка пустая, то продолжаем проверять
              // Необходимое условие чтобы перед королем не было атакованной фигуры
              if (
                JSChessEngine.hasFigure(state, attackedPos) &&
                !JSChessEngine.checkEnemyKing(state, pos, attackedPos)
              ) {
                break;
              }

              // Если доходим до короля, перываем цикл и отмечаем
              // что линия имеет атакованного короля - объявлен шах
              if (JSChessEngine.checkEnemyKing(state, pos, attackedPos)) {
                hasAttackedEnemyKing = true;
                break;
              }
            }

            // Если линия имеет атакованного короля, добавляем ее в линии с шахами
            if (hasAttackedEnemyKing) {
              linesWithCheck.push([...attackedLineRook, pos]);
            }
          });

          break;

        case 'queen':
          [...DIRECTIONS_D, ...DIRECTIONS_VH].forEach((direction) => {
            const attackedLineQueen = JSChessEngine.getFullAttackedLine(
              state,
              pos,
              direction
            );

            let hasAttackedEnemyKing = false;

            for (let i = 0; i < attackedLineQueen.length; i++) {
              const attackedPos = attackedLineQueen[i];

              // Проверяем атакованную позицию
              // Если клетка пустая, то продолжаем проверять
              // Необходимое условие чтобы перед королем не было атакованной фигуры
              if (
                JSChessEngine.hasFigure(state, attackedPos) &&
                !JSChessEngine.checkEnemyKing(state, pos, attackedPos)
              ) {
                break;
              }

              // Если доходим до короля, перываем цикл и отмечаем
              // что линия имеет атакованного короля - объявлен шах
              if (JSChessEngine.checkEnemyKing(state, pos, attackedPos)) {
                hasAttackedEnemyKing = true;
                break;
              }
            }

            // Если линия имеет атакованного короля, добавляем ее в линии с шахами
            if (hasAttackedEnemyKing) {
              linesWithCheck.push([...attackedLineQueen, pos]);
            }
          });

          break;

        case 'pawn':
          const pawnAttackedPositions: CellPos[] = [];

          if (
            (reverse && activeColor === 'white') ||
            (!reverse && activeColor === 'black')
          ) {
            // Вниз-вправо
            pawnAttackedPositions.push([pos[0] + 1, pos[1] + 1]);

            // Вниз-влево
            pawnAttackedPositions.push([pos[0] - 1, pos[1] + 1]);
          }

          if (
            (reverse && activeColor === 'black') ||
            (!reverse && activeColor === 'white')
          ) {
            // Вверх-вправо
            pawnAttackedPositions.push([pos[0] + 1, pos[1] - 1]);

            // Вверх-влево
            pawnAttackedPositions.push([pos[0] - 1, pos[1] - 1]);
          }

          pawnAttackedPositions.forEach((attackedPos) => {
            if (
              // Позиция находится в пределах доски
              JSChessEngine.checkInBorderBoard(state, attackedPos) &&
              // И в клетке есть вражеский король
              JSChessEngine.checkEnemyKing(state, pos, attackedPos)
            ) {
              linesWithCheck.push([attackedPos, pos]);
            }
          });

          break;

        case 'knight':
          const knigtAttackedPositions: CellPos[] = [
            [pos[0] + 1, pos[1] - 2],
            [pos[0] - 1, pos[1] - 2],
            [pos[0] - 2, pos[1] + 1],
            [pos[0] - 2, pos[1] - 1],
            [pos[0] + 2, pos[1] + 1],
            [pos[0] + 2, pos[1] - 1],
            [pos[0] + 1, pos[1] + 2],
            [pos[0] - 1, pos[1] + 2],
          ];

          knigtAttackedPositions.forEach((attackedPos) => {
            if (
              // Позиция находится в пределах доски
              JSChessEngine.checkInBorderBoard(state, attackedPos) &&
              // И в клетке есть вражеский король
              JSChessEngine.checkEnemyKing(state, pos, attackedPos)
            ) {
              linesWithCheck.push([attackedPos, pos]);
            }
          });

          break;
      }
    });

    return linesWithCheck;
  };

  /**
   * Принимает данные о фигуре, которой сыграли
   * затем обновляет и возвращает новое состояние доски
   * !!! Какой-то старнный эффект если не использовать мап
   * !!! Как будто происходит мутация состояния
   * @param state состояние доски
   * @param currentFigure фигура, которой сыграли
   * @param targetPos позиция на которую перемещаем фигуру
   * @param prevPos начальная позиция фигуры
   * @param reverse перевернута ли доска
   */
  static changeState = (
    state: Cell[][],
    currentFigure: Figure,
    targetPos: CellPos,
    prevPos: CellPos,
    reverse: boolean
  ): { updatedCells: Cell[][], attackedPos?: CellPos } => {
    // Необходимо для записи атакованного поля
    // на данный момент нужно для того чтобы
    // записать какое было атаковано при переходе на битую позицию
    // чтобы корректно показать анимированный переход на битое поле
    let attackedPos: CellPos | undefined = undefined;

    // Для определения рокировки
    const diffHorizontal = targetPos[0] - prevPos[0];

    if (currentFigure.type === 'pawn') {
      // Если пешка дошла до конца доски
      // Превратить ее в выбранную фигуру
      // ферзь, ладья, слон, конь
      if (targetPos[1] === 0 || targetPos[1] === state.length - 1) {
        // console.log('TRNASFORM');
      }
    }

    if (currentFigure.type === 'king' && Math.abs(diffHorizontal) > 1) {
      // Была сделана рокеровка

      if (diffHorizontal > 0) {
        if (reverse) {
          // 0-0-0
          const updatedCells: Cell[][] = state.map((row, j) =>
            row.map((cell, i) => {
              if (j === prevPos[1] && i === 4) {
                return {
                  ...cell,
                  figure: {
                    type: 'rook',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (j === prevPos[1] && i === 5) {
                return {
                  ...cell,
                  figure: {
                    type: 'king',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (
                (j === prevPos[1] && i === 7) ||
                (j === prevPos[1] && i === prevPos[0])
              ) {
                return {
                  ...cell,
                  figure: undefined,
                };
              }

              return cell;
            })
          );

          return { updatedCells, attackedPos };
        } else {
          // 0-0
          const updatedCells: Cell[][] = state.map((row, j) =>
            row.map((cell, i) => {
              if (j === prevPos[1] && i === 5) {
                return {
                  ...cell,
                  figure: {
                    type: 'rook',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (j === prevPos[1] && i === 6) {
                return {
                  ...cell,
                  figure: {
                    type: 'king',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (
                (j === prevPos[1] && i === 7) ||
                (j === prevPos[1] && i === prevPos[0])
              ) {
                return {
                  ...cell,
                  figure: undefined,
                };
              }

              return cell;
            })
          );

          return { updatedCells, attackedPos };
        }
      }

      if (diffHorizontal < 0) {
        if (reverse) {
          // 0-0
          const updatedCells: Cell[][] = state.map((row, j) =>
            row.map((cell, i) => {
              if (j === prevPos[1] && i === 2) {
                return {
                  ...cell,
                  figure: {
                    type: 'rook',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (j === prevPos[1] && i === 1) {
                return {
                  ...cell,
                  figure: {
                    type: 'king',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (
                (j === prevPos[1] && i === 0) ||
                (j === prevPos[1] && i === prevPos[0])
              ) {
                return {
                  ...cell,
                  figure: undefined,
                };
              }

              return cell;
            })
          );

          return { updatedCells, attackedPos };
        } else {
          // 0-0-0
          const updatedCells: Cell[][] = state.map((row, j) =>
            row.map((cell, i) => {
              if (j === prevPos[1] && i === 3) {
                return {
                  ...cell,
                  figure: {
                    type: 'rook',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (j === prevPos[1] && i === 2) {
                return {
                  ...cell,
                  figure: {
                    type: 'king',
                    color: currentFigure.color,
                    touched: true,
                  },
                };
              }

              if (
                (j === prevPos[1] && i === 0) ||
                (j === prevPos[1] && i === prevPos[0])
              ) {
                return {
                  ...cell,
                  figure: undefined,
                };
              }

              return cell;
            })
          );

          return { updatedCells, attackedPos };
        }
      }
    }

    const updatedCells: Cell[][] = state.map((row, j) =>
      row.map((cell, i) => {
        if (targetPos[0] === i && targetPos[1] === j) {
          return {
            figure: {
              ...currentFigure,
              touched: true,
            },
          };
        }

        if (prevPos[0] === i && prevPos[1] === j) {
          return {
            figure: undefined,
          };
        }

        // Если сходили пешкой на битое поле,
        // то забираем пешку противника,
        // которая оставила битое поле
        if (
          currentFigure.type === 'pawn' &&
          JSChessEngine.checkBeatedCell(state, targetPos) &&
          j === prevPos[1] &&
          i === targetPos[0] //these
        ) {
          attackedPos = [i, j];
          return { figure: undefined, beated: false };
        }

        // Если пешка сходила на две клетки вперед
        // то помечаем поле как битое
        if (currentFigure.type === 'pawn') {
          const diff = targetPos[1] - prevPos[1];

          if (Math.abs(diff) === 2) {
            if (
              (diff > 0 && j === targetPos[1] - 1 && targetPos[0] === i) ||
              (diff < 0 && j === targetPos[1] + 1 && targetPos[0] === i)
            ) {
              return { figure: undefined, beated: true };
            }
          }
        }

        return { ...cell, beated: cell.beated ? false : cell.beated };
      })
    );

    return { updatedCells, attackedPos };
  };

  /**
   * Обновляет состояние с превращение пешки в фигуру
   * @param state состояние доски
   * @param fromPos с какой клетки сделан ход
   * @param targetPos на какую клетку сделали ход
   * @param transformFigure в какую фигуру превратить пешку
   */
  static transformPawnToFigure = (
    state: Cell[][],
    fromPos: CellPos,
    targetPos: CellPos,
    transformFigure: Figure
  ): Cell[][] => {
    const preparedState = [...state];

    return preparedState.map((row, j) =>
      row.map((cell, i) => {
        if (i === fromPos[0] && j === fromPos[1]) {
          return {
            beated: false,
            figure: undefined,
          };
        }

        if (i === targetPos[0] && j === targetPos[1]) {
          return {
            beated: false,
            figure: transformFigure,
          };
        }

        return { ...cell };
      })
    );
  };

  /**
   * Возвращает плоский массив полей с фигурами
   * @param state состояние доски
   */
  static getFieldsWithFigures = (state: Cell[][]) => {
    const fieldsWithFigures: Cell[] = [];

    state.forEach((row) =>
      row.forEach((cell) => {
        if (!!cell.figure) {
          fieldsWithFigures.push(cell);
        }
      })
    );

    return fieldsWithFigures;
  };

  /**
   * Возвращает результат игры
   * mat - Мат
   * pat - Пат
   * undefined - игра продолжается
   * @param state состояние доски
   * @param linesWithCheck линии по которым есть шахом
   * @param activeColor активный цвет
   */
  static getGameResult = (
    state: Cell[][],
    linesWithCheck: CellPos[][],
    activeColor: FigureColor,
    reverse: boolean
  ): GameResult | undefined => {
    const posTeammates = JSChessEngine.getAllTeammatesPositionsByColor(
      state,
      activeColor
    );

    // Проверка на ничью
    // если на поле остались только короли
    // или одна из фигур любого цвеат - конь, слон
    // то это автоматическая ничья
    const cellsWithFigures = JSChessEngine.getFieldsWithFigures(state);

    // Значит остались только короли на доске
    if (cellsWithFigures.length === 2) return { resultType: 'draw' };

    // На доске осталось три фигуры
    // два короля и еще одна, если эта
    // фигура конь или слон - ничья
    if (cellsWithFigures.length === 3) {
      // Фигура для ничьей - конь или слон
      const figureForCommon = cellsWithFigures.find(
        (cell) =>
          cell.figure?.type === 'knight' || cell.figure?.type === 'bishop'
      );

      if (!!figureForCommon) return { resultType: 'draw' };
    }

    // Массив с количеством ходов каждой фигуры
    // Если все элементы массива - 0 и есть атака на короля, то это мат
    // Если атаки на короля нет, но все элементы массива - 0, это пат
    // если есть ходы, то игра продолжается
    const countsNextMoves: number[] = [];

    posTeammates.forEach((pos) => {
      const nextMoves = JSChessEngine.getNextMoves(
        state,
        pos,
        linesWithCheck,
        reverse
      );
      countsNextMoves.push(nextMoves.length);
    });

    // Суммируем все значения
    const countsSumResult = countsNextMoves.reduce(
      (prevValue, curentValue) => prevValue + curentValue
    );

    // Мат
    if (linesWithCheck.length > 0 && countsSumResult === 0)
      return {
        resultType: 'mat',
        winColor: activeColor === 'white' ? 'black' : 'white',
      };

    // Пат
    if (linesWithCheck.length === 0 && countsSumResult === 0)
      return { resultType: 'pat' };

    return undefined;
  };

  /**
   * Возвращает количество фигур указанного типа
   * @param flatState Обработанное состояние - одномерный массив клеток с фигурами одного цвета
   * @param figureType тип фигуры
   */
  static getFiguresCountByType = (
    flatState: Cell[],
    figureType: FigureType
  ) => {
    const filtred = flatState.filter(
      ({ figure }) => figure?.type === figureType
    );
    const count = filtred.length;

    return count;
  };

  /**
   * Возвращает информацию о количестве съеденных фигур одного цвета
   * @param state состояние доски
   * @param color цвет съеденных фигур
   */
  static getBeatedFigures = (
    state: Cell[][],
    color: FigureColor,
    countsConfig: typeof FIGURES_COUNTS = FIGURES_COUNTS
  ) => {
    let cellsWithFigures: Cell[] = [];

    state.forEach((row) => {
      const filtredCells = row.filter(
        (cell) => !!cell.figure && cell.figure.color === color
      );

      if (filtredCells.length > 0) {
        cellsWithFigures = [...cellsWithFigures, ...filtredCells];
      }
    });

    // информация о съеденных фигурах
    const beatedCountsData: BeatedCountsData = {
      pawn:
        countsConfig.PAWNS_COUNT -
        JSChessEngine.getFiguresCountByType(cellsWithFigures, 'pawn'),
      knight:
        countsConfig.KNIGHTS_COUNT -
        JSChessEngine.getFiguresCountByType(cellsWithFigures, 'knight'),
      bishop:
        countsConfig.BISHOPS_COUNT -
        JSChessEngine.getFiguresCountByType(cellsWithFigures, 'bishop'),
      rook:
        countsConfig.ROOKS_COUNT -
        JSChessEngine.getFiguresCountByType(cellsWithFigures, 'rook'),
      queen:
        countsConfig.QUEENS_COUNT -
        JSChessEngine.getFiguresCountByType(cellsWithFigures, 'queen'),
    };

    return beatedCountsData;
  };

  /**
   * По последним шести позициям - трем ходам
   * определяет было ли повторение позиций
   * если да, то это ничья,
   * Определить троекратное повторение
   * можно по последним 8ми ходам
   * поэтому нужно брать на сравнение массив
   * length - 8
   * @param fenMoves история ходов в формате FEN
   */
  static detectDrawByRepeatMoves(fenMoves: string[]) {
    if (fenMoves.length < 8) return false;

    const lastMoves = fenMoves.slice(fenMoves.length - 8);

    // Для понимания было троекратное повторение или нет, нужно
    // первые четыре хода и последние четыре хода из выборки
    // объединить в строку и сравнить полученные строки
    const firstFromSelectedMoves = lastMoves.slice(0, 4);
    const lastFromSelectedMoves = lastMoves.slice(4);

    const firstResultsFENs = firstFromSelectedMoves.join('');
    const lastResultsFENs = lastFromSelectedMoves.join('');

    return firstResultsFENs === lastResultsFENs;
  }

  /**
   * Проверяет является ли ход рокеровкой
   * @param move данные хода
   */
  static getCastlingType(move: MoveData): CastlingType | undefined {
    if (move.figure.touched || move.figure.type !== 'king') return undefined;

    // Разница в ходе по горизонтали
    const horizontalDiff = move.to[0] - move.from[0];

    // Король просто сходил => рокировки не было
    if (horizontalDiff === 0 || Math.abs(horizontalDiff) === 1)
      return undefined;

    // Рокировались вправо
    if (horizontalDiff > 0) return '0-0';

    return '0-0-0';
  }
}

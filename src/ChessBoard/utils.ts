import { Cell, SquarePos, Piece, PieceColor, PieceType, MoveData } from "../JSChessEngine";
import { ChessBoardConfig } from "./models";
import { DEFAULT_CHESSBORD_CONFIG } from "./constants";

/**
 * Возвращает класс для фигуры в клетке
 */
export const getFigureCSS = (figure: Piece) =>
    `${figure.type}-${figure.color}`;

/**
 * Возвращает белая ли клетка
 */
export const getIsLightCell = (rowId: number, cellId: number) =>
    (rowId % 2 === 0) && (cellId % 2 === 0) ||
    (rowId % 2 > 0) && (cellId % 2 > 0)

/**
 * Функция, которая просто создает массив размером size
 */
export const getFilledArrayBySize = (size: number) => {
    const array: number[] = [];

    for (let i = 0; i < size; i++) {
        array.push(i);
    }

    return array;
}

/**
 * Возвращает только массив фигурам у которых
 * есть поле position
 */
export const mapCellsToFiguresArray = (boardState: Cell[][]): Piece[] => {
    const figuresWithPosition: Piece[] = [];

    boardState.forEach((row, j) => row.forEach((cell, i) => {
        if (cell.figure) {
            figuresWithPosition.push({
                ...cell.figure,
                position: [i, j],
            });
        }
    }));

    return figuresWithPosition;
}

/**
 * 
 * @param possibleMoves Список возможных ходов
 * @param position позиция для проверки
 */
export const checkIsPossibleMove = (possibleMoves: SquarePos[], position: SquarePos) => {
    return !!possibleMoves.find((possibleMove) =>
        possibleMove[0] === position[0] && possibleMove[1] === position[1]
    );
}

/**
 * Проверяет находится ли проверяемая позиция в
 * наборе позиций
 * @param positions набор позиций
 * @param pos позиция
 */
export const checkPositionsHas = (
    positions: SquarePos[] | undefined,
    pos: SquarePos
) => {
    if (!positions) return false;

    return !!positions.find(
        (posItem) => posItem[0] === pos[0] && posItem[1] === pos[1]
    );
};

/**
 * Проверяет, является ли ход рокеровкой
 * @param moveData 
 * @returns 
 */
export const checkIsCastlingMove = (moveData: MoveData) => {
    const { figure, from, to } = moveData;
    if (figure.type !== 'king') return false;
    if (from[1] !== to[1]) return false;
    const horizontalDiff = Math.abs(to[0] - from[0]);
    if (horizontalDiff === 1) return false;
    return true;
}

/**
 * Проверка клетки, на то есть ли шах
 */
export const hasCheck = (cell: Cell, currentColor: PieceColor, linesWithCheck: SquarePos[][]) =>
    !!cell.figure &&
    cell.figure.type === 'king' &&
    cell.figure.color === currentColor &&
    linesWithCheck.length > 0

export const degrees = (a: number, b: number) =>
    (Math.atan(a / b) * 180) / Math.PI;

export const calcAngle = (start: number[], end: number[]) => {
    const x = end[0] - start[0];
    const y = end[1] - start[1];

    if (x > 0 && y > 0) {
        return degrees(y, x) - 90;
    }

    if (x < 0 && y < 0) {
        return degrees(y, x) + 90;
    }

    if (x < 0 && y > 0) {
        return degrees(y, x) + 90;
    }

    if (x > 0 && y < 0) {
        return degrees(y, x) - 90;
    }

    if (y === 0 && x > 0) return -90;

    if (y === 0 && x < 0) return 90;

    if (x === 0 && y < 0) return 180;

    return 0;
};

export const getChessBoardConfig = (config: Partial<ChessBoardConfig> | undefined): ChessBoardConfig => {
    if (!config) return DEFAULT_CHESSBORD_CONFIG;

    return {
        ...DEFAULT_CHESSBORD_CONFIG,
        ...config,
    };
}

/**
 * Возвращает массив фигур по заданому цвету
 * @param color цвет фигур
 * @param forPawnTransform только фигуры для превращения пешки
 */
export const getFiguresByColor = (
    color: PieceColor,
    forPawnTransform = false
): Piece[] => {
    if (forPawnTransform) {
        const figureNamesForPawn: PieceType[] = [
            'queen',
            'rook',
            'bishop',
            'knight',
        ];
        return figureNamesForPawn.map((figureName) => ({
            type: figureName,
            color,
            touched: true,
        }));
    }

    const figureNames: PieceType[] = [
        'pawn',
        'knight',
        'bishop',
        'rook',
        'queen',
        'king',
    ];
    return figureNames.map((figureName) => ({
        type: figureName,
        color,
        touched: true,
    }));
};

/**
 * Корректирует позицию захвата курсором
 * коррекция происходит по сроллу
 */
export const correctGrabbingPosByScroll = (pos: SquarePos) => {
    if (typeof window === 'undefined')
        return pos;

    return [
        pos[0] - window.scrollX,
        pos[1] - window.scrollY,
    ] as SquarePos;
}

/**
 * Корректирует указатели стрелки
 */
export const correctGrabbingPosForArrow = (pos: SquarePos, boardConfig: ChessBoardConfig) => [
    (pos[0] * boardConfig.squareSize) + (boardConfig.squareSize / 2 - 10), 
    (pos[1] * boardConfig.squareSize) + (boardConfig.squareSize / 2)
] as SquarePos;


/**
 * Создание тэга для хранение состояния 
 * разворота доски
 * 
 * На момент создания, есть проблема с заданием
 * разворота доски для слоя фигур - происходит двойной
 * рендер. Из-за этого доска возврщает в тоже положение
 * при reversed = true, но состояние игры разворачивается
 * 
 * Поэтому принято решение вынести хранение и задание 
 * разворота доски на уровень data-атрибутов html
 */
export const createHtmlReversedStateHolder = () => {
    if (!window) return;

    const reversedStateHolder = document.createElement('div');
    reversedStateHolder.setAttribute('id', 'reversed-state-holder');
    reversedStateHolder.setAttribute('data-reversed-state', 'false');
    document.body.append(reversedStateHolder);
}

export const setHtmlReversedStateHolderValue = (reversed: boolean) => {
    if (!window) return;

    document.getElementById('reversed-state-holder')
        .setAttribute('data-reversed-state', JSON.stringify(reversed));
}

export const getHtmlReversedStateHolderValue = () => {
    if (!window) return false;

    const chessboardReversed = document.getElementById('reversed-state-holder') && document.getElementById('reversed-state-holder')
        .getAttribute('data-reversed-state') === 'true';

    return chessboardReversed;
}
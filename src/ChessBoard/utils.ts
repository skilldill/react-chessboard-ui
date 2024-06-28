import { Cell, CellPos, Figure, FigureColor, FigureType, MoveData } from "../JSChessEngine";
import { ChessBoardConfig, ChessPiecesMap } from "./models";
import { DEFAULT_CHESSBORD_CONFIG } from "./constants";

/**
 * Возвращает класс для фигуры в клетке
 */
export const getFigureCSS = (figure: Figure) =>
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
export const mapCellsToFiguresArray = (boardState: Cell[][]) => {
    const figuresWithPosition: Figure[] = [];

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
export const checkIsPossibleMove = (possibleMoves: CellPos[], position: CellPos) => {
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
    positions: CellPos[] | undefined,
    pos: CellPos
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
export const hasCheck = (cell: Cell, currentColor: FigureColor, linesWithCheck: CellPos[][]) =>
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

    const configKeyes = Object.keys(DEFAULT_CHESSBORD_CONFIG);

    const buildedConfig: Record<string, string | number | ChessPiecesMap> = {};

    configKeyes.forEach((key) => {
        buildedConfig[key as keyof ChessBoardConfig] =
            config[key as keyof ChessBoardConfig]
            || DEFAULT_CHESSBORD_CONFIG[key as keyof ChessBoardConfig]
    });

    return buildedConfig as ChessBoardConfig;
}

/**
 * Возвращает массив фигур по заданому цвету
 * @param color цвет фигур
 * @param forPawnTransform только фигуры для превращения пешки
 */
export const getFiguresByColor = (
    color: FigureColor,
    forPawnTransform = false
): Figure[] => {
    if (forPawnTransform) {
        const figureNamesForPawn: FigureType[] = [
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

    const figureNames: FigureType[] = [
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
export const correctGrabbingPosByScroll = (pos: CellPos) => {
    if (typeof window === 'undefined')
        return pos;

    return [
        pos[0] - window.scrollX,
        pos[1] - window.scrollY,
    ] as CellPos;
}

/**
 * Корректирует указатели стрелки
 */
export const correctGrabbingPosForArrow = (pos: CellPos, boardConfig: ChessBoardConfig) => [
    (pos[0] * boardConfig.cellSize) + (boardConfig.cellSize / 2 - 10), 
    (pos[1] * boardConfig.cellSize) + (boardConfig.cellSize / 2)
] as CellPos;
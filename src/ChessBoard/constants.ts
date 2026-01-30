import { Figure } from "../JSChessEngine";
import { CHESS_PIECES_MAP } from "./chessPieciesMap";
import { ChessBoardConfig } from "./models";
import styles from './ChessBoard.module.css';

export const DEFAULT_CELL_SIZE = 92;
export const DEFAULT_FIGURE_SIZE_PERCENT = 80;
export const FACTOR_FOR_SIZE_CIRCLE_MARK = 4.6;
export const DEFAULT_CIRCLE_MARK_COLOR = '#3697ce';
export const DEFAULT_WHITE_CELL_COLOR: string = undefined;
export const DEFAULT_BLACK_CELL_COLOR: string = undefined;
export const DEFAULT_SELECTED_CELL_COLOR = '#e3f1fe';
export const DEFAULT_SELECTED_CELL_BORDER = '3px solid #6ac2fd';
export const DEFAULT_ARROW_COLOR = '#6ac2fd';
export const DEFAULT_MARKED_CELL_COLOR = '#3697ce';
export const DEFAULT_CHECKED_CELL_COLOR = '#e95b5c';
export const DEFAULT_PIECES_MAP = CHESS_PIECES_MAP;
export const DEFAULT_SHOW_MOVES_TRAIL = true;
export const DEFAULT_HIDE_PIECES_HANDLER = (figure: Figure) => {
    figure.color === 'white'
        ? figure.position = [8, figure.position![1]]
        : figure.position = [-1, figure.position![1]];
};

// New props values
export const DEFAULT_SQUARE_SIZE = DEFAULT_CELL_SIZE;
export const DEFAULT_PIECE_SIZE_PERCENT = DEFAULT_FIGURE_SIZE_PERCENT;
export const DEFAULT_HIDE_PIECE_EFFECT_CLASS_NAME = styles.hiddenFigureEffect;
export const DEFAULT_LIGHT_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_DARK_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_PICKED_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_CHECKED_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_SQUARE_HIGLIGHT_CLASS_NAME: string = undefined;

export const DEFAULT_CHESSBORD_CONFIG: ChessBoardConfig = {
    cellSize: DEFAULT_CELL_SIZE,
    figureSizePercent: DEFAULT_FIGURE_SIZE_PERCENT,
    whiteCellColor: DEFAULT_WHITE_CELL_COLOR,
    blackCellColor: DEFAULT_BLACK_CELL_COLOR,
    selectedCellColor: DEFAULT_SELECTED_CELL_COLOR,
    selectedCellBorder: DEFAULT_SELECTED_CELL_BORDER,
    checkedCellColor: DEFAULT_CHECKED_CELL_COLOR,
    markedCellColor: DEFAULT_MARKED_CELL_COLOR,

    squareSize: DEFAULT_SQUARE_SIZE,
    pieceSizePercent: DEFAULT_PIECE_SIZE_PERCENT,
    lightSquareClassName: DEFAULT_LIGHT_SQUARE_CLASS_NAME,
    darkSquareClassName: DEFAULT_DARK_SQUARE_CLASS_NAME,
    pickedSquareClassName: DEFAULT_PICKED_SQUARE_CLASS_NAME,
    checkedSquareClassName: DEFAULT_CHECKED_SQUARE_CLASS_NAME,
    squareHighlightClassName: DEFAULT_SQUARE_HIGLIGHT_CLASS_NAME,
    circleMarkColor: DEFAULT_CIRCLE_MARK_COLOR,
    arrowColor: DEFAULT_ARROW_COLOR,
    piecesMap: DEFAULT_PIECES_MAP,
    hidePieceEffectClassName: DEFAULT_HIDE_PIECE_EFFECT_CLASS_NAME,
    showMovesTrail: DEFAULT_SHOW_MOVES_TRAIL,
    onHidePieces: DEFAULT_HIDE_PIECES_HANDLER,
}
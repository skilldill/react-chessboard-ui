import { Figure } from "../JSChessEngine";
import { CHESS_PIECES_MAP } from "./chessPieciesMap";
import { ChessBoardConfig } from "./models";
import styles from './ChessBoard.module.css';

export const DEFAULT_FACTOR_FOR_SIZE_CIRCLE_MARK = 4.6;
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
export const DEFAULT_SQUARE_SIZE = 92;
export const DEFAULT_PIECE_SIZE_PERCENT = 80;
export const DEFAULT_HIDE_PIECE_EFFECT_CLASS_NAME = styles.hiddenFigureEffect;
export const DEFAULT_LIGHT_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_DARK_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_PICKED_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_CHECKED_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_SQUARE_HIGLIGHT_CLASS_NAME: string = undefined;
export const DEFAULT_SELECTED_SQUARE_CLASS_NAME: string = undefined;
export const DEFAULT_HOLDED_PIECE_CLASS_NAME: string = undefined;
export const DEFAULT_POSSIBLE_MOVE_MARK_CLASS_NAME: string = undefined;

export const DEFAULT_CHESSBORD_CONFIG: ChessBoardConfig = {
    squareSize: DEFAULT_SQUARE_SIZE,
    pieceSizePercent: DEFAULT_PIECE_SIZE_PERCENT,
    lightSquareClassName: DEFAULT_LIGHT_SQUARE_CLASS_NAME,
    darkSquareClassName: DEFAULT_DARK_SQUARE_CLASS_NAME,
    pickedSquareClassName: DEFAULT_PICKED_SQUARE_CLASS_NAME,
    selectedSquareClassName: DEFAULT_SELECTED_SQUARE_CLASS_NAME,
    holdedPieceClassName: DEFAULT_HOLDED_PIECE_CLASS_NAME,
    checkedSquareClassName: DEFAULT_CHECKED_SQUARE_CLASS_NAME,
    squareHighlightClassName: DEFAULT_SQUARE_HIGLIGHT_CLASS_NAME,
    circleMarkColor: DEFAULT_CIRCLE_MARK_COLOR,
    factorForSizeCircleMark: DEFAULT_FACTOR_FOR_SIZE_CIRCLE_MARK,
    possibleMoveMarkClassName: DEFAULT_POSSIBLE_MOVE_MARK_CLASS_NAME,
    arrowColor: DEFAULT_ARROW_COLOR,
    piecesMap: DEFAULT_PIECES_MAP,
    hidePieceEffectClassName: DEFAULT_HIDE_PIECE_EFFECT_CLASS_NAME,
    showMovesTrail: DEFAULT_SHOW_MOVES_TRAIL,
    onHidePieces: DEFAULT_HIDE_PIECES_HANDLER,
}
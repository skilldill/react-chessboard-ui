import { CHESS_PIECES_MAP } from "./chessPieciesMap";
import { ChessBoardConfig } from "./models";

export const DEFAULT_CELL_SIZE = 92;
export const FACTOR_FOR_SIZE_CIRCLE_MARK = 4.6;
export const DEFAULT_CIRCLE_MARK_COLOR = '#3697ce';
export const DEFAULT_WHITE_CELL_COLOR = '#fafafc';
export const DEFAULT_BLACK_CELL_COLOR = '#d8d9e6';
export const DEFAULT_SELECTED_CELL_COLOR = '#e3f1fe';
export const DEFAULT_SELECTED_CELL_BORDER = '3px solid #6ac2fd';
export const DEFAULT_ARROW_COLOR = '#6ac2fd';
export const DEFAULT_MARKED_CELL_COLOR = '#3697ce';
export const DEFAULT_CHECKED_CELL_COLOR = '#e95b5c';
export const DEFAULT_PIECES_MAP = CHESS_PIECES_MAP;

export const DEFAULT_CHESSBORD_CONFIG: ChessBoardConfig = {
    cellSize: DEFAULT_CELL_SIZE,
    circleMarkColor: DEFAULT_CIRCLE_MARK_COLOR,
    whiteCellColor: DEFAULT_WHITE_CELL_COLOR,
    blackCellColor: DEFAULT_BLACK_CELL_COLOR,
    selectedCellColor: DEFAULT_SELECTED_CELL_COLOR,
    selectedCellBorder: DEFAULT_SELECTED_CELL_BORDER,
    arrowColor: DEFAULT_ARROW_COLOR,
    markedCellColor: DEFAULT_MARKED_CELL_COLOR,
    checkedCellColor: DEFAULT_CHECKED_CELL_COLOR,
    piecesMap: DEFAULT_PIECES_MAP,
}

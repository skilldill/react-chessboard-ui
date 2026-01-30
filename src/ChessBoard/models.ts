import { CellPos, Figure, MoveData } from "../JSChessEngine"

export interface ChessPiecesMap {
    [key: string]: (size: string) => JSX.Element;
}

export type ChessBoardConfig = {

    // Non domain names with "cell" and "figure"
    cellSize: number;
    figureSizePercent: number;
    whiteCellColor: string;
    blackCellColor: string;
    selectedCellColor: string;
    selectedCellBorder: string;
    markedCellColor: string;
    checkedCellColor: string;

    // Right domain names
    squareSize: number;
    pieceSizePercent: number;
    lightSquareClassName: string;
    darkSquareClassName: string;
    pickedSquareClassName: string;
    checkedSquareClassName: string;
    hidePieceEffectClassName: string;
    squareHighlightClassName: string;

    circleMarkColor: string;
    arrowColor: string;
    piecesMap: ChessPiecesMap;
    showMovesTrail: boolean;
    onHidePieces: (piece: Figure) => void;
}

export type ChangeMove = {
    move: MoveData;
    withTransition?: boolean;
    attackedPos?: CellPos; // for pawn and beated field
    transformTo?: Figure;
}

export type ArrowCoords = { start: number[]; end: number[] };

import { CellPos, Figure, MoveData } from "../JSChessEngine"

export interface ChessPiecesMap {
    [key: string]: (size: string) => JSX.Element;
}

export type ChessBoardConfig = {
    // Right domain names
    squareSize: number;
    pieceSizePercent: number;
    lightSquareClassName: string;
    darkSquareClassName: string;
    pickedSquareClassName: string;
    checkedSquareClassName: string;
    hidePieceEffectClassName: string;
    squareHighlightClassName: string;
    selectedSquareClassName: string;
    holdedPieceClassName: string;
    possibleMoveMarkClassName: string;
    factorForSizeCircleMark: number;

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

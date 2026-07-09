import type { ReactElement } from "react";
import { SquarePos, Piece, MoveData, Cell, CellPos, FigureColor } from "../JSChessEngine"

export interface ChessPiecesMap {
    [key: string]: (size: string) => ReactElement;
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
    onHidePieces: (piece: Piece) => void;
}

export type ChangeMove = {
    move: MoveData;
    withTransition?: boolean;
    attackedPos?: SquarePos; // for pawn and beated field
    transformTo?: Piece;
}

export type ArrowCoords = { start: number[]; end: number[] };

export type ClickData = {
    cellData: Cell,
    pos: CellPos,
    currentColor: FigureColor,
}

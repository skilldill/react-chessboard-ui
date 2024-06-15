import { CellPos, Figure, MoveData } from "../JSChessEngine"

export interface ChessPiecesMap {
    [key: string]: (size: string) => JSX.Element;
}

export type ChessBoardConfig = {
    cellSize: number;
    whiteCellColor: string;
    blackCellColor: string;
    selectedCellColor: string;
    selectedCellBorder: string;
    markedCellColor: string;
    circleMarkColor: string;
    arrowColor: string;
    checkedCellColor: string;
    piecesMap: ChessPiecesMap;
}

export type ChangeMove = {
    move: MoveData;
    withTransition?: boolean;
    attackedPos?: CellPos; // for pawn and beated field
    transformTo?: Figure;
}

export type ArrowCoords = { start: number[]; end: number[] };

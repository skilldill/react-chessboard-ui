import { CellPos, Figure } from "../JSChessEngine";
import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFigureCSS } from "./utils";
import cn from 'classnames';
import { ChessBoardConfig } from "./models";

type HoldedFigureProps = {
    holdedFigure?: Figure;
    grabbingPos: CellPos;
    boardConfig: ChessBoardConfig;
}

export const HoldedFigure: FC<HoldedFigureProps> = (props) => {
    const { holdedFigure, grabbingPos, boardConfig } = props;

    // Эта проверка убирает мерациния фигуры из точки -1 -1
    // в самом начале захвата фигуры
    const isCanShowFigure =
        holdedFigure  
        && grabbingPos[0] > -1 
        && grabbingPos[1] > -1;

    return isCanShowFigure && (
        <div 
            className={cn([
                styles.figure,
                styles.holdedFigure, 
            ])}
            style={{ 
                position: 'fixed',
                zIndex: 6,
                top: `${grabbingPos[1] - boardConfig.cellSize / 2}px`,
                left: `${grabbingPos[0] - boardConfig.cellSize / 2}px`,
                width: boardConfig.cellSize,
                height: boardConfig.cellSize,
            }}
        > {boardConfig.piecesMap[getFigureCSS(holdedFigure)]('80%')}</div>
    );
}

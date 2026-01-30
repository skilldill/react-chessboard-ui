import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize, getIsLightCell } from "./utils";
import { ChessBoardConfig } from "./models";
import { CellPos } from "../JSChessEngine";
import cn from 'classnames';

const BASE_BOARD_SIZE = 8;

type ChessBoardCellsLayoutProps = {
    boardConfig: ChessBoardConfig;
    size?: number;
    movesTrail?: [CellPos, CellPos];
    moveHighlight?: [CellPos, CellPos];
}

export const ChessBoardCellsLayout: FC<ChessBoardCellsLayoutProps> = ({ 
    size = BASE_BOARD_SIZE, 
    boardConfig,
    movesTrail,
    moveHighlight,
}) => {
    return (
        <div>
            {getFilledArrayBySize(size).map((_, j) => 
                <div className={styles.row} key={`cells-layout-${j}`}>
                    {getFilledArrayBySize(size).map((_, i) => (
                        <div
                            style={{
                                width: boardConfig.squareSize,
                                height: boardConfig.squareSize,
                            }}
                            className={cn({
                                [styles.lightSquare]: !boardConfig.lightSquareClassName && getIsLightCell(j, i),
                                [styles.darkSquare]: !boardConfig.darkSquareClassName && !getIsLightCell(j, i),
                                [boardConfig.lightSquareClassName]: !!boardConfig.lightSquareClassName && getIsLightCell(j, i),
                                [boardConfig.darkSquareClassName]: !!boardConfig.darkSquareClassName && !getIsLightCell(j, i),
                            })}
                            key={`cells-layout-${i}`}
                        >
                            {movesTrail && (
                                movesTrail[0][0] === i && movesTrail[0][1] === j ||
                                movesTrail[1][0] === i && movesTrail[1][1] === j
                            ) && <div className={cn(styles.movesTrail, boardConfig.squareHighlightClassName)}/>}

                            {moveHighlight && (
                                moveHighlight[0][0] === i && moveHighlight[0][1] === j ||
                                moveHighlight[1][0] === i && moveHighlight[1][1] === j
                            ) && <div className={cn(styles.movesTrail, boardConfig.squareHighlightClassName)}/>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

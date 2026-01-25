import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize, getIsLightCell } from "./utils";
import { ChessBoardConfig } from "./models";
import { CellPos } from "../JSChessEngine";

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
                                width: boardConfig.cellSize,
                                height: boardConfig.cellSize,
                                backgroundColor: getIsLightCell(j, i) ? boardConfig.whiteCellColor : boardConfig.blackCellColor,
                            }}
                            key={`cells-layout-${i}`}
                        >
                            {movesTrail && (
                                movesTrail[0][0] === i && movesTrail[0][1] === j ||
                                movesTrail[1][0] === i && movesTrail[1][1] === j
                            ) && <div className={styles.movesTrail}/>}

                            {moveHighlight && (
                                moveHighlight[0][0] === i && moveHighlight[0][1] === j ||
                                moveHighlight[1][0] === i && moveHighlight[1][1] === j
                            ) && <div className={styles.movesTrail}/>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

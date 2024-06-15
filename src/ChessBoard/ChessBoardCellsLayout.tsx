import React, { FC } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize, getIsLightCell } from "./utils";
import { ChessBoardConfig } from "./models";

const BASE_BOARD_SIZE = 8;

type ChessBoardCellsLayoutProps = {
    size?: number;
    boardConfig: ChessBoardConfig;
}

export const ChessBoardCellsLayout: FC<ChessBoardCellsLayoutProps> = ({ size = BASE_BOARD_SIZE, boardConfig }) => {
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
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}

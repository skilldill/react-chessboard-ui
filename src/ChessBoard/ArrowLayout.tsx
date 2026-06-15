import React, { FC } from "react";
import { CellPos } from "../JSChessEngine";
import { Arrow } from "./Arrow";
import { ArrowCoords, ChessBoardConfig } from "./models";
import styles from './ChessBoard.module.css';

type ArrowLayoutType = {
    startArrowCoord: CellPos;
    arrowsCoords: ArrowCoords[];
    externalArrowsCoords?: ArrowCoords[]; // DEPRECATED
    externalArrows?: (ArrowCoords & { color?: string })[];
    grabbingPos: CellPos;
    boardConfig: ChessBoardConfig;
}

export const ArrowLayout: FC<ArrowLayoutType> = (props) => {
    const {
        startArrowCoord,
        arrowsCoords,
        grabbingPos,
        boardConfig,
        externalArrowsCoords = [], // DEPRECATED
        externalArrows = [],
    } = props;

    return (
        <div className={styles.arrowsLayer}>
            {(startArrowCoord[0] > -1) && (grabbingPos[0] > -1) && (
                <Arrow start={startArrowCoord} end={grabbingPos} color={boardConfig.arrowColor} />
            )}
            {arrowsCoords.map((coords, i) => (
                <Arrow key={i} {...coords} color={boardConfig.arrowColor} />
            ))}
            {externalArrowsCoords.map((coords, i) => (
                <Arrow key={`extArrow_${i}`} {...coords} color={boardConfig.arrowColor} />
            ))}
            {externalArrows.map((arrow, i) => (
                <Arrow key={`extArrow_${i}`} {...arrow} color={arrow.color || boardConfig.arrowColor} />
            ))}
        </div>
    );
}
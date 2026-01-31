import React, { FC, MouseEvent, useState } from "react";
import styles from './ChessBoard.module.css';
import { getFilledArrayBySize } from "./utils";
import cn from 'classnames';
import { SquarePos } from "../JSChessEngine";
import { ChessBoardConfig } from "./models";

const BASE_BOARD_SIZE = 8

type ChessBoardControlLayoutProps = {
    size?: number;
    boardConfig: ChessBoardConfig;

    onClick: (position: SquarePos) => void;
    onGrabStart: (position: SquarePos) => void;
    onGrabStartRight: (position: SquarePos) => void;
    onGrabEnd: (position: SquarePos) => void;
    onGrabEndRight: (position: SquarePos) => void;
    onGrabbing: (x: number, y: number) => void;
    onRightClick: (position: SquarePos) => void;
    onGrabbingCell: (position: SquarePos) => void;
}

export const ChessBoardControlLayout: FC<ChessBoardControlLayoutProps> = (props) => {
    const { 
        size = BASE_BOARD_SIZE, 
        boardConfig,
        onClick, 
        onGrabEnd,
        onGrabbing,
        onGrabStart,
        onRightClick,
        onGrabbingCell,
        onGrabEndRight,
        onGrabStartRight,
    } = props;

    const [pressed, setPressed] = useState(false);

    const handleClick = (cellPos: SquarePos) => {
        onClick(cellPos);
    }

    const handleGrabStart = (cellPos: SquarePos) => (event: MouseEvent) => {
        setPressed(true);
        if (event.button === 0) {
            onGrabStart(cellPos);
        }

        if (event.button === 2) {
            onGrabStartRight(cellPos);
        }
    }

    const handleGrabEnd = (cellPos: SquarePos) => (event: MouseEvent) => {
        if (event.button === 0) {
            setPressed(false);
            onGrabEnd(cellPos);
        }

        if (event.button === 2) {
            onGrabEndRight(cellPos);
        }
    }

    const handleGrabing = (event: MouseEvent) => {
        if (pressed) {
            const { pageX, pageY} = event;
            onGrabbing(pageX, pageY);
        }
    }

    const handleContextMenu = (cellPos: SquarePos) => (event: MouseEvent) => {
        event.preventDefault();
        onRightClick(cellPos);
    }

    const handleGrabbingCell = (cellPos: SquarePos) => {
        onGrabbingCell(cellPos);
    }

    return (
        <div 
            className={cn(styles.controlLayout, {[styles.controlLayoutGrabbing]: pressed})}
            onMouseMove={handleGrabing}
        >
            {getFilledArrayBySize(size).map((_, j) => 
                <div className={styles.row} key={`control-layout-${j}`}>
                    {getFilledArrayBySize(size).map((_, i) => (
                        <div 
                            key={`control-layout-${i}`}
                            className={styles.controlCell}
                            style={{ 
                                width: boardConfig.squareSize, 
                                height: boardConfig.squareSize 
                            }}
                            onClick={() => handleClick([i, j])}
                            onMouseDown={handleGrabStart([i, j])}
                            onMouseUp={handleGrabEnd([i, j])}
                            onContextMenu={handleContextMenu([i, j])}
                            onMouseMove={() => handleGrabbingCell([i, j])}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    )
}

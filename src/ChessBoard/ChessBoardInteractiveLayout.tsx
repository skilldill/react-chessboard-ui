import React, { FC } from "react";
import { checkIsPossibleMove, getFigureCSS, getFilledArrayBySize } from "./utils";
import styles from './ChessBoard.module.css';
import cn from 'classnames';
import { CellPos, Figure } from "../JSChessEngine";
import { HoldedFigure } from "./HoldedFigure";
import { ChessBoardConfig } from "./models";
import { FACTOR_FOR_SIZE_CIRCLE_MARK } from "./constants";

const BASE_BOARD_SIZE = 8

type ChessBoardInteractiveLayoutProps = {
    size?: number;
    boardConfig: ChessBoardConfig;
    selectedPos: CellPos;
    possibleMoves: CellPos[];
    markedCells: CellPos[];
    holdedFigure?: Figure;
    grabbingPos: CellPos;
    onHasCheck: (cellPos: CellPos) => boolean;
}

export const ChessBoardInteractiveLayout: FC<ChessBoardInteractiveLayoutProps> = (props) => {
    const { 
        size = BASE_BOARD_SIZE,
        boardConfig,
        selectedPos,
        possibleMoves,
        holdedFigure,
        grabbingPos,
        markedCells,
        onHasCheck,
    } = props;

    return (
        <div>
            <HoldedFigure 
                holdedFigure={holdedFigure}
                grabbingPos={grabbingPos}
                boardConfig={boardConfig}
            />
            <div className={styles.interactiveLayout}>
                {getFilledArrayBySize(size).map((_, j) => 
                    <div className={styles.row} key={`interactive-layout-${j}`}>
                        {getFilledArrayBySize(size).map((_, i) => (
                            <div 
                                className={cn(styles.interactiveCell, { 
                                    [styles.selectedCell]: selectedPos[0] === i && selectedPos[1] === j,
                                    [styles.markedCell]: checkIsPossibleMove(markedCells, [i, j]),
                                    [styles.checkedCell]: onHasCheck([i, j])
                                })}
                                key={`interactive-layout-${i}`}
                                style={{
                                    width: boardConfig.cellSize,
                                    height: boardConfig.cellSize,
                                    backgroundColor: selectedPos[0] === i && selectedPos[1] === j 
                                        ? boardConfig.selectedCellColor
                                        : 'transparent',
                                    border: selectedPos[0] === i && selectedPos[1] === j 
                                        ? boardConfig.selectedCellBorder
                                        : 'none',
                                    boxShadow: checkIsPossibleMove(markedCells, [i, j])
                                        ? `inset 0 0 30px ${boardConfig.markedCellColor}`
                                        : onHasCheck([i, j]) ? `inset 0 0 30px ${boardConfig.checkedCellColor}`
                                        : 'none'
                                }}
                            >
                                {selectedPos[0] === i && selectedPos[1] === j && holdedFigure && (
                                    <div 
                                        className={cn([
                                            styles.figure,
                                            styles.holdedFigure,
                                        ], {
                                            [styles.bluredFigure]: grabbingPos[0] !== -1,
                                        })}
                                        style={{
                                            width: boardConfig.cellSize,
                                            height: boardConfig.cellSize,
                                        }}
                                    >{boardConfig.piecesMap[getFigureCSS(holdedFigure)]('80%')}</div>
                                )}
                                {checkIsPossibleMove(possibleMoves, [i, j]) && (
                                    <div 
                                        className={styles.possibleMoveMark}
                                        style={{
                                            width: boardConfig.cellSize / FACTOR_FOR_SIZE_CIRCLE_MARK,
                                            height: boardConfig.cellSize / FACTOR_FOR_SIZE_CIRCLE_MARK,
                                            backgroundColor: boardConfig.circleMarkColor,
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

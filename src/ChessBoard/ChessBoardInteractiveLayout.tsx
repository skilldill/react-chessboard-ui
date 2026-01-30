import React, { FC } from "react";
import { checkIsPossibleMove, getFigureCSS, getFilledArrayBySize } from "./utils";
import styles from './ChessBoard.module.css';
import cn from 'classnames';
import { CellPos, Figure } from "../JSChessEngine";
import { HoldedFigure } from "./HoldedFigure";
import { ChessBoardConfig } from "./models";

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
                                    [`${styles.selectedSquare} ${boardConfig.selectedSquareClassName}`]: selectedPos[0] === i && selectedPos[1] === j,
                                    [`${styles.pickedSquare} ${boardConfig.pickedSquareClassName}`]: checkIsPossibleMove(markedCells, [i, j]),
                                    [`${styles.checkedSquare} ${boardConfig.checkedSquareClassName}`]: onHasCheck([i, j])
                                })}
                                key={`interactive-layout-${i}`}
                                style={{
                                    width: boardConfig.squareSize,
                                    height: boardConfig.squareSize,
                                }}
                            >
                                {selectedPos[0] === i && selectedPos[1] === j && holdedFigure && (
                                    <div 
                                        className={cn([
                                            styles.piece,
                                            styles.holdedPiece,
                                            // boardConfig.holdedPieceClassName, // Доработать
                                        ], {
                                            [styles.bluredPiece]: grabbingPos[0] !== -1,
                                        })}
                                        style={{
                                            width: boardConfig.squareSize,
                                            height: boardConfig.squareSize,
                                        }}
                                    >{boardConfig.piecesMap[getFigureCSS(holdedFigure)](`${boardConfig.pieceSizePercent}%`)}</div>
                                )}
                                {checkIsPossibleMove(possibleMoves, [i, j]) && (
                                    <div 
                                        className={cn([styles.possibleMoveMark, boardConfig.possibleMoveMarkClassName])}
                                        style={{
                                            width: boardConfig.squareSize / boardConfig.factorForSizeCircleMark,
                                            height: boardConfig.squareSize / boardConfig.factorForSizeCircleMark,
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

import { Cell, Figure, JSChessEngine } from "../JSChessEngine";
import React, { FC, useEffect, useState } from "react";
import styles from './ChessBoard.module.css';
import cn from 'classnames';
import { checkIsCastlingMove, getFigureCSS, mapCellsToFiguresArray } from "./utils";
import { ChangeMove, ChessBoardConfig } from "./models";

type ChessBoardFiguresLayoutProps = {
    initialState: Cell[][];
    change?: ChangeMove;
    reversed?: boolean;
    boardConfig: ChessBoardConfig;
}

export const ChessBoardFiguresLayout: FC<ChessBoardFiguresLayoutProps> = (props) => {
    const { initialState, change, reversed, boardConfig } = props;
    const [actualState, setActualState] = useState<Figure[]>([]);

    useEffect(() => {
        setActualState(mapCellsToFiguresArray(initialState));
    }, [initialState])

    useEffect(() => {
        if (!!change) {
            setActualState((prevState) => {
                const updatedState = [...prevState];
                const { move, attackedPos, transformTo } = change;

                if (checkIsCastlingMove(move)) {
                    const castlingType = JSChessEngine.getCastlingType(move);
                    const { color } = move.figure;

                    if (color === 'white') {
                        const kingIndex = updatedState.findIndex((figure) => 
                            figure.color === 'white' && figure.type === 'king'
                        );

                        if (castlingType === '0-0') {
                            const rookIndex = updatedState.findIndex((figure) => 
                                figure.color === color
                                && figure.type === 'rook'
                                && figure.position![0] === 7
                            );
                            updatedState[rookIndex].position![0] = 5;
                            updatedState[kingIndex].position![0] = 6;

                            return updatedState;
                        }

                        const rookIndex = updatedState.findIndex((figure) => 
                            figure.color === color
                            && figure.type === 'rook'
                            && figure.position![0] === 0
                        );
                        updatedState[rookIndex].position![0] = 3;
                        updatedState[kingIndex].position![0] = 2;

                        return updatedState;
                    }

                    if (color === 'black') {
                        const kingIndex = updatedState.findIndex((figure) => 
                            figure.color === 'black' && figure.type === 'king'
                        );

                        if (castlingType === '0-0') {
                            const rookIndex = updatedState.findIndex((figure) => 
                                figure.color === color
                                && figure.type === 'rook'
                                && figure.position![0] === 7
                            );
                            updatedState[rookIndex].position![0] = 5;
                            updatedState[kingIndex].position![0] = 6;

                            return updatedState;
                        }

                        const rookIndex = updatedState.findIndex((figure) => 
                            figure.color === color
                            && figure.type === 'rook'
                            && figure.position![0] === 0
                        );
                        updatedState[rookIndex].position![0] = 3;
                        updatedState[kingIndex].position![0] = 2;

                        return updatedState;
                    }

                    return updatedState;
                }

                const { from, to } = move;

                const foundAttactedFigure = updatedState.find((figure) => {
                    if (attackedPos)
                        return figure.position![0] === attackedPos[0]
                            && figure.position![1] === attackedPos[1];

                    return figure.position![0] === to[0]
                        && figure.position![1] === to[1];
                });

                if (foundAttactedFigure && foundAttactedFigure.color !== move.figure.color) {
                    foundAttactedFigure.color === 'white'
                    ? foundAttactedFigure.position = [8, foundAttactedFigure.position![1]]
                    : foundAttactedFigure.position = [-1, foundAttactedFigure.position![1]]
                };

                const foundFigureByPositionFrom = updatedState.find((figure) => 
                    figure.position![0] === from[0]
                    && figure.position![1] === from[1]
                );

                if (!foundFigureByPositionFrom) return updatedState;

                foundFigureByPositionFrom.position! = move.to;

                if (!!transformTo) {
                    foundFigureByPositionFrom!.type = transformTo.type;
                    foundFigureByPositionFrom!.color = transformTo.color;
                    // console.log(updatedState);
                    // return updatedState.filter(({ position }) => position![0] !== from[1] && position![1] !== from[0]);
                }

                return updatedState;
            });
        }
    }, [change])

    useEffect(() => {
        if (!reversed) return;

        setActualState((prevState) => {
            const preparedState = [...prevState];
            return preparedState.map((figure) => ({
                ...figure,
                position: [
                    Math.abs(7 - figure.position![0]),
                    Math.abs(7 - figure.position![1])
                ]
            }));
        });
    }, [reversed, initialState])

    return (
        <div className={styles.figuresLayout}>
            {actualState.map((figure, i) => 
                <div 
                    key={i}
                    className={cn([styles.figure], {
                        [styles.hiddenFigure]: figure.position![0] === -1 || figure.position![0] === 8 
                    })}
                    style={{ 
                        top: `${boardConfig.cellSize * figure.position![1]}px`, 
                        left: `${boardConfig.cellSize * figure.position![0]}px`,
                        transition: !!change && change.withTransition ? 'all .15s ease-out' : 'none',
                        width: boardConfig.cellSize,
                        height: boardConfig.cellSize,
                    }}
                >
                    {boardConfig.piecesMap[getFigureCSS(figure)]('80%')}
                </div>
            )}
        </div>
    )
}

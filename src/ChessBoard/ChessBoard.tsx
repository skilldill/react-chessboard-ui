import { FENtoGameState, FigureColor, GameResult, MoveData } from "../JSChessEngine";
import React, { FC, useEffect } from "react";
import styles from './ChessBoard.module.css';
import { ChessBoardCellsLayout } from "./ChessBoardCellsLayout";
import { ChessBoardFiguresLayout } from "./ChessBoardFiguresLayout";
import { ChessBoardControlLayout } from "./ChessBoardControlLayout";
import { useChessBoardInteractive } from "./useChessBoardInteractive";
import { ChessBoardInteractiveLayout } from "./ChessBoardInteractiveLayout";
import { ChangeMove, ChessBoardConfig } from "./models";
import { ArrowLayout } from "./ArrowLayout";
import { FigurePicker } from "./FigurePicker";

type ChessBoardProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    onEndGame: (result: GameResult) => void;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
}

export const ChessBoard: FC<ChessBoardProps> = (props) => {
    const { 
        FEN, 
        onChange,
        onEndGame,
        change, 
        reversed,
        config,
    } = props;

    const {
        initialState,
        fromPos,
        holdedFigure,
        grabbingPos,
        possibleMoves,
        newMove,
        markedCells,
        arrowsCoords,
        startArrowCoord,
        boardConfig,
        currentColor,
        showFigurePicker,

        setActualState,
        selectClickFrom,
        startRenderArrow,
        selectHoverFrom,
        handleGrabbing,
        handleGrabEnd,
        handleClick,
        setInitialState,
        setCurrentColor,
        reverseChessBoard,
        setNewMove,
        markCell,
        getHasCheckByCellPos,
        endRenderArrow,
        handleSelectFigurePicker
    } = useChessBoardInteractive({ onChange, onEndGame, config });

    useEffect(() => {
        const { boardState, currentColor } = FENtoGameState(FEN);
        setInitialState(boardState);
        setActualState(boardState);
        setCurrentColor(currentColor);
    }, [FEN]);

    useEffect(() => {
        if (reversed) reverseChessBoard();
    }, [reversed]);

    useEffect(() => {
        setNewMove(change);
    }, [change]);

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout boardConfig={boardConfig} />
            <ChessBoardFiguresLayout
                initialState={initialState}
                change={newMove}
                reversed={reversed}
                boardConfig={boardConfig}
            />
            <ChessBoardInteractiveLayout
                selectedPos={fromPos}
                possibleMoves={possibleMoves}
                holdedFigure={holdedFigure}
                grabbingPos={grabbingPos}
                markedCells={markedCells}
                boardConfig={boardConfig}
                onHasCheck={getHasCheckByCellPos}
            />
            <ArrowLayout 
                arrowsCoords={arrowsCoords}
                startArrowCoord={startArrowCoord}
                grabbingPos={grabbingPos}
                boardConfig={boardConfig}
            />
            <ChessBoardControlLayout
                boardConfig={boardConfig}
                onClick={handleClick}
                onGrabStart={selectHoverFrom}
                onGrabStartRight={startRenderArrow}
                onGrabEnd={handleGrabEnd}
                onGrabEndRight={endRenderArrow}
                onGrabbing={handleGrabbing}
                onRightClick={markCell}
            />
            {showFigurePicker && (
                <div className={styles.chessBoardFigurePicker}>
                    <FigurePicker
                        boardConfig={boardConfig}
                        color={currentColor}
                        forPawnTransform
                        onSelect={handleSelectFigurePicker}
                    />
                </div>
            )}
        </div>
    )
}

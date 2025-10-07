import { FENtoGameState, FigureColor, GameResult, MoveData, JSChessEngine } from "../JSChessEngine";
import React, { FC, useEffect, useState } from "react";
import styles from './ChessBoard.module.css';
import { ChessBoardCellsLayout } from "./ChessBoardCellsLayout";
import { ChessBoardFiguresLayout } from "./ChessBoardFiguresLayout";
import { ChessBoardControlLayout } from "./ChessBoardControlLayout";
import { useChessBoardInteractive } from "./useChessBoardInteractive";
import { ChessBoardInteractiveLayout } from "./ChessBoardInteractiveLayout";
import { ChangeMove, ChessBoardConfig } from "./models";
import { ArrowLayout } from "./ArrowLayout";
import { FigurePicker } from "./FigurePicker";
import { correctGrabbingPosByScroll, correctGrabbingPosForArrow } from "./utils";

type ChessBoardProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    onEndGame: (result: GameResult) => void;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
    playerColor?: FigureColor;
}

export const ChessBoard: FC<ChessBoardProps> = (props) => {
    const { 
        FEN, 
        onChange,
        onEndGame,
        change, 
        reversed,
        config,
        playerColor,
    } = props;

    const [animated, setAnimated] = useState(false);

    const {
        fromPos,
        newMove,
        boardConfig,
        markedCells,
        grabbingPos,
        currentColor,
        arrowsCoords,
        initialState,
        holdedFigure,
        grabbingCell,
        possibleMoves,
        startArrowCoord,
        showFigurePicker,

        markCell,
        setNewMove,
        handleClick,
        handleGrabEnd,
        handleGrabbing,
        endRenderArrow,
        setActualState,
        setPlayerColor,
        setCurrentColor,
        selectClickFrom,
        selectHoverFrom,
        setInitialState,
        startRenderArrow,
        reverseChessBoard,
        handleGrabbingCell,
        getHasCheckByCellPos,
        handleSelectFigurePicker,
    } = useChessBoardInteractive({ onChange, onEndGame, config });

    const handleUpdateFEN = (FEN: string) => {
        const { boardState, currentColor } = FENtoGameState(FEN);
        setInitialState(boardState);
        setActualState(boardState);
        setCurrentColor(currentColor);
    };

    useEffect(() => {
        setPlayerColor(playerColor);
    }, [playerColor]);

    useEffect(() => {
        handleUpdateFEN(FEN);
    }, [FEN]);

    useEffect(() => {
        if (reversed) reverseChessBoard();
    }, [reversed]);

    useEffect(() => {
        if (!change) return;

        const updatedChange = {
            ...change,
            move: reversed ? JSChessEngine.reverseMove(change.move) : change.move
        };

        if (change.withTransition) {
            setAnimated(true);
            setTimeout(() => {
                setNewMove(updatedChange);
            }, 10);
            setTimeout(() => {
                setAnimated(false);
            }, 160); // animation duration 150ms + for 10ms delay
            setTimeout(() => {
                handleUpdateFEN(updatedChange.move.FEN);
            }, 170);
        } else {
            setNewMove(updatedChange);
            handleUpdateFEN(updatedChange.move.FEN);
        }
        
    }, [change, reversed]);

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout boardConfig={boardConfig} />
            <ChessBoardFiguresLayout
                initialState={initialState}
                change={newMove}
                reversed={reversed}
                boardConfig={boardConfig}
                animated={animated}
            />
            <ChessBoardInteractiveLayout
                selectedPos={fromPos}
                possibleMoves={possibleMoves}
                holdedFigure={holdedFigure}
                grabbingPos={correctGrabbingPosByScroll(grabbingPos)}
                markedCells={markedCells}
                boardConfig={boardConfig}
                onHasCheck={getHasCheckByCellPos}
            />
            <ArrowLayout 
                arrowsCoords={arrowsCoords}
                startArrowCoord={startArrowCoord}
                grabbingPos={correctGrabbingPosForArrow(grabbingCell, boardConfig)}
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
                onGrabbingCell={handleGrabbingCell}
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

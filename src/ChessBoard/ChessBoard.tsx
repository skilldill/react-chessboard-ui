import { FENtoGameState, FigureColor, GameResult, MoveData, JSChessEngine } from "../JSChessEngine";
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
import { correctGrabbingPosByScroll, correctGrabbingPosForArrow } from "./utils";

type ChessBoardProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    onEndGame: (result: GameResult) => void;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
    playerColor?: FigureColor;
    viewOnly?: boolean;
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
        viewOnly,
    } = props;

    const {
        fromPos,
        newMove,
        animated,
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
        handleClick,
        handleGrabEnd,
        handleGrabbing,
        endRenderArrow,
        setActualState,
        setPlayerColor,
        setCurrentColor,
        selectHoverFrom,
        setInitialState,
        setBoardReversed,
        startRenderArrow,
        reverseChessBoard,
        cleanAllForFigure,
        handleGrabbingCell,
        getHasCheckByCellPos,
        handleSelectFigurePicker,
        handleChangeFromExternal,
    } = useChessBoardInteractive({ onChange, onEndGame, config });

    const handleUpdateFEN = (FEN: string, reversed: boolean) => {
        const { boardState, currentColor } = FENtoGameState(FEN, reversed);
        cleanAllForFigure();
        setInitialState(boardState);
        setActualState(boardState);
        setCurrentColor(currentColor);
        setBoardReversed(reversed);
    };

    useEffect(() => {
        setPlayerColor(playerColor);
    }, [playerColor]);

    useEffect(() => {
        handleUpdateFEN(FEN, reversed);
    }, [FEN, reversed])

    useEffect(() => {
        if (!change) return;
        const reversedChange = reversed ? JSChessEngine.reverseMove(change.move) : change.move;
        handleChangeFromExternal(reversedChange);
    }, [change]);

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout boardConfig={boardConfig} />
            <ChessBoardFiguresLayout
                initialState={initialState}
                change={newMove}
                boardConfig={boardConfig}
                animated={animated}
                // reversed={reversed} While block this props
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
                onClick={(pos) => handleClick(pos, viewOnly)}
                onGrabStart={viewOnly ? () => {} : selectHoverFrom}
                onGrabStartRight={startRenderArrow}
                onGrabEnd={viewOnly ? () => {} : handleGrabEnd}
                onGrabEndRight={endRenderArrow}
                onGrabbing={viewOnly ? () => {} : handleGrabbing}
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

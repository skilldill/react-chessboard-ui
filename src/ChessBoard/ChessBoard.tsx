import { PieceColor, GameResult, MoveData, JSChessEngine, SquarePos, CellPos, FigureColor, Cell } from "../JSChessEngine";
import React, { FC, useEffect } from "react";
import styles from './ChessBoard.module.css';
import { ChessBoardCellsLayout } from "./ChessBoardCellsLayout";
import { ChessBoardFiguresLayout } from "./ChessBoardFiguresLayout";
import { ChessBoardControlLayout } from "./ChessBoardControlLayout";
import { useChessBoardInteractive } from "./useChessBoardInteractive";
import { ChessBoardInteractiveLayout } from "./ChessBoardInteractiveLayout";
import { ArrowCoords, ChangeMove, ChessBoardConfig, ClickData } from "./models";
import { ArrowLayout } from "./ArrowLayout";
import { FigurePicker } from "./FigurePicker";
import { correctGrabbingPosByScroll, correctGrabbingPosForArrow, createHtmlReversedStateHolder, setHtmlReversedStateHolderValue } from "./utils";

type ChessBoardProps = {
    FEN: string;
    onChange: (moveData: MoveData) => void;
    onEndGame: (result: GameResult) => void;
    onClick?: (data: ClickData) => void;
    change?: ChangeMove;
    reversed?: boolean;
    config?: Partial<ChessBoardConfig>;
    playerColor?: PieceColor;
    viewOnly?: boolean;
    moveHighlight?: [SquarePos, SquarePos];
    moveArrows?: ArrowCoords[];
    arrows?: (ArrowCoords & { color?: string })[];
}

export const ChessBoard: FC<ChessBoardProps> = (props) => {
    const { 
        FEN, 
        onChange,
        onEndGame,
        onClick,
        change, 
        reversed,
        config,
        playerColor,
        viewOnly,
        moveHighlight,
        moveArrows = [], // DEPRECATED
        arrows = [],
    } = props;

    const {
        fromPos,
        newMove,
        animated,
        movesTrail,
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
        setPlayerColor,
        handleUpdateFEN,
        selectHoverFrom,
        startRenderArrow,
        handleGrabbingCell,
        getHasCheckByCellPos,
        handleSelectFigurePicker,
        handleChangeFromExternal,
    } = useChessBoardInteractive({ 
        onChange, 
        onEndGame, 
        onClickByChessBoard: onClick, 
        config 
    });

    useEffect(() => {
        createHtmlReversedStateHolder();
    }, [])

    useEffect(() => {
        setPlayerColor(playerColor);
    }, [playerColor]);

    useEffect(() => {
        handleUpdateFEN(FEN, reversed);

        // For check reversed chessboard in FiguresLayout
        setHtmlReversedStateHolderValue(reversed);
    }, [FEN, reversed])

    useEffect(() => {
        if (!change) return;
        const reversedChange = reversed ? JSChessEngine.reverseMove(change.move) : change.move;
        handleChangeFromExternal(reversedChange, change.withTransition);
    }, [change]);

    // Coordinates will recalculated for board's pixels
    // DEPRECATED
    const DEPRECATED_externalArrows = moveArrows.map((arrow) => ({
        start: correctGrabbingPosForArrow(arrow.start as CellPos, boardConfig),
        end: correctGrabbingPosForArrow(arrow.end as CellPos, boardConfig),
    }));

    const externalArrows = arrows.map((arrow) => ({
        start: correctGrabbingPosForArrow(arrow.start as CellPos, boardConfig),
        end: correctGrabbingPosForArrow(arrow.end as CellPos, boardConfig),
        color: arrow.color,
    }));

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout
                boardConfig={boardConfig}
                movesTrail={boardConfig.showMovesTrail && movesTrail}
                moveHighlight={moveHighlight}
            />
            <ChessBoardFiguresLayout
                initialState={initialState}
                change={newMove}
                boardConfig={boardConfig}
                animated={animated}
                // reversed={reversed} ** While blocked this props **
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
                externalArrowsCoords={DEPRECATED_externalArrows}
                externalArrows={externalArrows}
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
                <div className={styles.chessBoardPiecePicker}>
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

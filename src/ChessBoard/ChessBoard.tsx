import { PieceColor, GameResult, MoveData, JSChessEngine, SquarePos, CellPos, FigureColor, Cell } from "../JSChessEngine";
import React, { FC, MouseEventHandler, useEffect } from "react";
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
    toggleTurn?: boolean;
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
        toggleTurn = true,
    } = props;

    const {
        fromPos,
        newMove,
        animated,
        movesTrail,
        invalidFEN,
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
        setInvalidFEN,
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
        config,
        toggleTurn
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

    const handleHideInvalidFENmessage = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setInvalidFEN(false);
    }

    return (
        <div className={styles.chessBoard}>
            <ChessBoardCellsLayout
                size={initialState.length}
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
                size={initialState.length}
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
                size={initialState.length}
                boardConfig={boardConfig}
                onClick={(pos) => handleClick(pos, viewOnly)}
                onGrabStart={viewOnly ? () => { } : selectHoverFrom}
                onGrabStartRight={startRenderArrow}
                onGrabEnd={viewOnly ? () => { } : handleGrabEnd}
                onGrabEndRight={endRenderArrow}
                onGrabbing={viewOnly ? () => { } : handleGrabbing}
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

            {invalidFEN && (
                <div className={styles.chessBoardInvalidFenMessage}>
                    <div className={styles.fenErrorMessage} role="alert">
                        <div>
                            Invalid FEN notation. The default board position was used instead.{" "}
                            <a href="https://react-chessboard-ui.dev/docs/fen-errors">
                                See common FEN problems
                            </a>
                        .
                        </div>
                        <div>
                            <a className={styles.fenErrorMessageClose} onClick={handleHideInvalidFENmessage} >Hide this message</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

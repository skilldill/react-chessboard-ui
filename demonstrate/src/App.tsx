import { useEffect, useState } from 'react';
import './App.css'
import { ChessBoard, type MoveData } from "../../src";
import { PAUL_MORPHY_OPERA_GAME, TRANSFORMATION_GAME, CASTLING_MOVE } from './moves';


const MOVES = PAUL_MORPHY_OPERA_GAME;

function App() {
    const [moveIndex, setMoveIndex] = useState<number>();
    const [currentMove, setCurrentMove] = useState<any>();
    const [history, setHistory] = useState<MoveData[]>([]);
    const [initialFEN, setInitialFEN] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const [reversed, setReversed] = useState(false);

    const onChange = (move: MoveData) => {
        console.log(move);
        setHistory(() => {
            console.log([...history, move]);
            return [...history, move];
        });
    }

    const nextMove = () => {
        if (moveIndex === undefined) {
            setCurrentMove({
                move: MOVES[0],
                withTransition: true
            });
            setMoveIndex(0);
            return;
        }

        if (moveIndex + 1 === MOVES.length) {
            return;
        }

        setCurrentMove({
            move: MOVES[moveIndex + 1],
            withTransition: true
        });

        setMoveIndex(moveIndex + 1);
    }

    const reverseBoard = () => {
        setReversed((prev) => !prev);
    }

    const setDelayedFen = () => {
        setTimeout(() => {
            setInitialFEN('k7/p7/8/8/8/8/7K/8 w - - 0 1');
            // setReversed(true);
        }, 1000)
    }

    const setDelayedMove = () => {
        setTimeout(() => {
            setCurrentMove({
                move: {
                    "figure": {
                        "type": "pawn",
                        "color": "black",
                        "touched": true
                    },
                    "from": [
                        4,
                        1
                    ],
                    "to": [
                        4,
                        3
                    ],
                    "FEN": "r3k2r/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/R3K2R w - e6 0 1"
                },
                withTransition: true
            });
        }, 3000)
    }

    return (
        <div>
            <button onClick={nextMove}>Next move</button>
            <button onClick={reverseBoard}>Reverse</button>
            <button onClick={setDelayedFen}>Set delayed FEN</button>
            <button onClick={setDelayedMove}>Delayed move</button>
            {/* {MOVES.map((move, index) => (
        <button key={index} onClick={() => {
            setCurrentMove({
                move: move,
                withTransition: true
            });
            // setMoveIndex(index);
        }}>
          Move {index + 1}
        </button>
      ))} */}

            <ChessBoard
                // FEN={initialFEN}
                // FEN={"k7/p6P/8/8/8/8/8/7K w - - 0 1"}
                // FEN={"1K6/3q4/k7/8/8/8/p7/8 b - - 0 1"}
                // FEN={"1K6/3q4/k7/8/8/8/p7/8 b - - 0 1"}
                FEN={"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"}
                // FEN={"r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"}
                onChange={onChange}
                onEndGame={console.log}
                change={currentMove}
                config={{
                    pieceSizePercent: 100,
                    onHidePieces: (piece) => {
                        setTimeout(() => {
                            piece.position = [8, piece.position![1]]
                        }, 1000)
                    },
                    lightSquareClassName: 'lightSquareCustom',
                    darkSquareClassName: 'darkSquareCustom',
                    squareHighlightClassName: 'highlightCustom',
                    possibleMoveMarkClassName: 'customMarkMove',
                    holdedPieceClassName: 'holdedPiece',
                    hidePieceEffectClassName: 'hideFigureEffectWithBurn'
                }}
                playerColor="white"                
                reversed={reversed} // <~~~ flag for reversing board
            // moveHighlight={[[1, 1], [7, 7]]}
            // moveArrows={[{ start: [0, 1], end: [7, 7] }, { start: [2, 2], end: [1, 1] }]}
            // viewOnly={true}
            />
        </div>
    )
}

export default App

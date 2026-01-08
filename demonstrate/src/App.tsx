import { useEffect, useState } from 'react';
import './App.css'
import { ChessBoard, type MoveData } from "../../src";
import { PAUL_MORPHY_OPERA_GAME, TRANSFORMATION_GAME, CASTLING_MOVE } from './moves';


const MOVES = CASTLING_MOVE;

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

    return (
        <div>
            <button onClick={nextMove}>Next move</button>
            <button onClick={reverseBoard}>Reverse</button>
            <button onClick={setDelayedFen}>Set delayed FEN</button>
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
                FEN={"k7/p6P/8/8/8/8/8/7K w - - 0 1"}
                // FEN={"r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"}
                onChange={onChange}
                onEndGame={() => {}}
                change={currentMove}
                config={{ figureSizePercent: 100 }}
                // playerColor="black"                
                reversed={reversed} // <~~~ flag for reversing board
                // viewOnly={true}
            />
        </div>
    )
}

export default App

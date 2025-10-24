import { useEffect, useState } from 'react';
import './App.css'
import { ChessBoard, type MoveData } from "../../src";
import { PAUL_MORPHY_OPERA_GAME, TRANSFORMATION_GAME } from './moves';


function App() {
    const [moveIndex, setMoveIndex] = useState<number>();
    const [currentMove, setCurrentMove] = useState<any>();
    const [history, setHistory] = useState<MoveData[]>([]);
    const [initialFEN, setInitialFEN] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const [reversed, setReversed] = useState(false);

    const onChange = (move: MoveData) => {
        setHistory(() => {
            console.log([...history, move]);
            return [...history, move];
        });
    }

    const nextMove = () => {
        if (moveIndex === undefined) {
            setCurrentMove({
                move: PAUL_MORPHY_OPERA_GAME[0],
                withTransition: true
            });
            setMoveIndex(0);
            return;
        }

        if (moveIndex + 1 === PAUL_MORPHY_OPERA_GAME.length) {
            return;
        }

        setCurrentMove({
            move: PAUL_MORPHY_OPERA_GAME[moveIndex + 1],
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
                FEN={initialFEN}
                // FEN={"k7/p7/8/8/8/8/8/7K w - - 0 1"}
                // onChange={onChange}
                onChange={onChange}
                onEndGame={() => {}}
                change={currentMove}
                // playerColor="black"                
                reversed={reversed} // <~~~ flag for reversing board
                // viewOnly={true}
            />
        </div>
    )
}

export default App

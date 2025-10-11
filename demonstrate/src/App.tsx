import { useState } from 'react';
import './App.css'
import { ChessBoard, type MoveData } from "../../src";
import { PAUL_MORPHY_OPERA_GAME, TRANSFORMATION_GAME } from './moves';


function App() {
    const [moveIndex, setMoveIndex] = useState<number>();
    const [currentMove, setCurrentMove] = useState<any>();
    const [history, setHistory] = useState<MoveData[]>([]);

    const onChange = (move: MoveData) => {
        setHistory(() => {
            console.log([...history, move]);
            return [...history, move];
        });
    }

    const nextMove = () => {
        if (moveIndex === undefined) {
            setCurrentMove({
                move: TRANSFORMATION_GAME[0],
                withTransition: true
            });
            setMoveIndex(0);
            return;
        }

        if (moveIndex + 1 === TRANSFORMATION_GAME.length) {
            return;
        }

        setCurrentMove({
            move: TRANSFORMATION_GAME[moveIndex + 1],
            withTransition: true
        });

        setMoveIndex(moveIndex + 1);
    }

    return (
        <div>
            <button onClick={nextMove}>Next move</button>
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
                // FEN={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
                FEN={"k7/p7/8/8/8/8/8/7K w - - 0 1"}
                // onChange={onChange}
                onChange={onChange}
                onEndGame={() => {}}
                change={currentMove}
                reversed={false} // <~~~ flag for reversing board
            />
        </div>
    )
}

export default App

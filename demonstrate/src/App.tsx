import { useState } from 'react';
import './App.css'
import { ChessBoard, type MoveData } from "../../src";

const MOVES: MoveData[] = [
    {
        "figure": {
            "type": "pawn",
            "color": "white",
            "touched": true
        },
        "from": [
            4,
            6
        ],
        "to": [
            4,
            4
        ],
        "FEN": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    },
    {
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
        "FEN": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 1"
    },
    {
        "figure": {
            "type": "knight",
            "color": "white",
            "touched": true
        },
        "from": [
            6,
            7
        ],
        "to": [
            5,
            5
        ],
        "FEN": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 1"
    },
    {
        "figure": {
            "type": "knight",
            "color": "black",
            "touched": true
        },
        "from": [
            1,
            0
        ],
        "to": [
            2,
            2
        ],
        "FEN": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"
    },
    {
        "figure": {
            "type": "pawn",
            "color": "white",
            "touched": true
        },
        "from": [
            3,
            6
        ],
        "to": [
            3,
            4
        ],
        "FEN": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 1"
    },
    {
        "figure": {
            "type": "pawn",
            "color": "black",
            "touched": true
        },
        "from": [
            4,
            3
        ],
        "to": [
            3,
            4
        ],
        "FEN": "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1"
    }
];

function App() {
  const [moveIndex, setMoveIndex] = useState<number>();
  const [currentMove, setCurrentMove] = useState<any>();

  const nextMove = () => {
    if (moveIndex === undefined) {
      setCurrentMove({
        move: MOVES[0],
        withTransition: true
      });
      setMoveIndex(0);
      return;
    }
    setCurrentMove({
      move: MOVES[moveIndex + 1],
      withTransition: true
    });
    setMoveIndex(moveIndex + 1);
  }

  return (
    <div>
      {/* <button onClick={nextMove}>Next move</button> */}
      {MOVES.map((move, index) => (
        <button key={index} onClick={() => {
            setCurrentMove({
                move: move,
                withTransition: true
            });
            // setMoveIndex(index);
        }}>
          Move {index + 1}
        </button>
      ))}
      
      <ChessBoard 
        FEN={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
        onChange={() => {}}
        onEndGame={() => {}}
        change={currentMove}
        reversed={false} // <~~~ flag for reversing board
      />
    </div>
  )
}

export default App

# react-chessboard-ui

[![NPM](https://img.shields.io/npm/v/react-chessboard-ui.svg)](https://www.npmjs.com/package/react-chessboard-ui)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

React chessboard UI with a built-in chess engine, FEN-based state control, legal move handling, drag-and-drop pieces, game-end callbacks, and styling hooks.

Use it when you need a playable chessboard in a React app without combining a board renderer, a separate chess engine, and custom move/state glue yourself.

<p align="center">
  <img src="./blob/default.png?raw=true" width="23%" alt="Default react-chessboard-ui board" />
  <img src="./blob/customization.png?raw=true" width="23%" alt="Customized react-chessboard-ui board" />
  <img src="./blob/colorfull_arrows.png?raw=true" width="23%" alt="React chessboard with colorful arrows" />
  <img src="./blob/all_queens.png?raw=true" width="23%" alt="React chessboard with custom pieces" />
</p>

## Features

- **Board UI and chess logic in one package**: render the board, validate moves, and receive game events from one component.
- **FEN-first state**: initialize positions, load puzzles, or render custom board sizes from FEN.
- **Ready to play**: drag-and-drop pieces, legal move handling, turn switching, callbacks, and game-end detection are included.
- **Customizable**: override square classes, piece rendering, sizes, highlights, arrows, and interaction behavior.
- **No required CSS import**: package styles are injected automatically when `ChessBoard` is imported.

## Installation

```bash
npm install react-chessboard-ui
```

```bash
yarn add react-chessboard-ui
```

## Quick Start

```tsx
import type { FC } from "react";
import { ChessBoard } from "react-chessboard-ui";

export const App: FC = () => {
  return (
    <ChessBoard
      FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      onChange={(move) => {
        console.log("Move:", move);
      }}
      onEndGame={(result) => {
        console.log("Game ended:", result);
      }}
    />
  );
};
```

## Key Examples

### Training Position

```tsx
import { ChessBoard } from "react-chessboard-ui";

export function TrainingBoard() {
  return (
    <ChessBoard
      FEN="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3"
      playerColor="white"
      moveHighlight={[[2, 5], [3, 3]]}
      arrows={[{ start: [2, 5], end: [3, 3], color: "#1d9bf0" }]}
      onChange={(move) => console.log("User move:", move)}
      onEndGame={console.log}
    />
  );
}
```

### Custom Board Size From FEN

The board size is derived from the FEN rows. This example renders a 12x12 board:

```tsx
import { ChessBoard } from "react-chessboard-ui";

export function CustomSizeBoard() {
  return (
    <ChessBoard
      FEN="qqrnbqkbnrqq/pppppppppppp/12/12/12/12/12/12/12/12/PPPPPPPPPPPP/QQRNBQKBNRQQ w - - 0 1"
      onChange={console.log}
      onEndGame={console.log}
    />
  );
}
```
<p align="center">
  <img src="./blob/12x12.png?raw=true" width="70%" style="max-width: 450px" alt="Default react-chessboard-ui board" />
</p>

### Style the Board With CSS Classes

```tsx
import { ChessBoard } from "react-chessboard-ui";
import "./board.css";

export function StyledBoard() {
  return (
    <ChessBoard
      FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      config={{
        squareSize: 72,
        pieceSizePercent: 92,
        lightSquareClassName: "light-square",
        darkSquareClassName: "dark-square",
        selectedSquareClassName: "selected-square",
        squareHighlightClassName: "move-highlight",
      }}
      onChange={console.log}
      onEndGame={console.log}
    />
  );
}
```

```css
.light-square {
  background: #f7f7f2;
}

.dark-square {
  background: #9aa77f;
}

.selected-square {
  outline: 3px solid #1d9bf0;
  outline-offset: -3px;
}

.move-highlight {
  box-shadow: inset 0 0 0 4px rgba(29, 155, 240, 0.35);
}
```

## API Overview

| Prop | Type | Description |
| --- | --- | --- |
| `FEN` | `string` | Required. Board position in FEN notation. |
| `onChange` | `(moveData: MoveData) => void` | Required. Called after a user move. |
| `onEndGame` | `(result: GameResult) => void` | Required. Called when the engine detects a game result. |
| `onClick` | `(data: ClickData) => void` | Called when a board cell is clicked. |
| `change` | `ChangeMove` | Applies an external move to the board. |
| `reversed` | `boolean` | Renders the board from the opposite side. |
| `config` | `Partial<ChessBoardConfig>` | Board sizing, classes, piece map, and visual configuration. |
| `playerColor` | `"white" \| "black"` | Restricts interaction to one color. |
| `viewOnly` | `boolean` | Disables user moves. |
| `moveHighlight` | `[SquarePos, SquarePos]` | Highlights a move path. |
| `arrows` | `Array<{ start: number[]; end: number[]; color?: string }>` | Draws arrows on the board. |
| `toggleTurn` | `boolean` | Enables or disables automatic turn switching. Defaults to `true`. |

## FEN Notes

- `FEN` controls the initial board state and can be replaced from React state.
- A number in a FEN row means that many consecutive empty cells.
- Standard 8x8 chess positions and larger custom boards are supported.

## Documentation

- Full documentation: [https://react-chessboard-ui.dev/](https://react-chessboard-ui.dev/)
- Customization docs: [https://react-chessboard-ui.dev/properties/config/](https://react-chessboard-ui.dev/properties/config/)

## Authors

- [Tatiana Utbanova](https://www.linkedin.com/in/tatiana-utbanova-6415b8271/) - Design owner
- [Alexander Utbanov](https://linkedin.com/in/alexander-utbanov-a9670a210/) - Code owner

## License

MIT
_________
## Keywords

`react` `react-chess` `react-chessboard` `react-chessboard-ui` `js-chess` `chess` `chessboard` `chessboard component` `chess engine`
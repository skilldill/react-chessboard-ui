# react-chessboard-ui ♟️

[![NPM](https://img.shields.io/npm/v/react-chessboard-ui.svg)](https://www.npmjs.com/package/react-chessboard-ui)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<p align="center">
  <img src="./blob/default.png?raw=true" width="23%" alt="Default react-chessboard-ui board" />
  <img src="./blob/customization.png?raw=true" width="23%" alt="Customized react-chessboard-ui board" />
  <img src="./blob/colorfull_arrows.png?raw=true" width="23%" alt="React chessboard with colorful arrows" />
  <img src="./blob/all_queens.png?raw=true" width="23%" alt="React chessboard with custom pieces" />
</p>

An all-in-one React chessboard component with both the chess engine and UI included. Drop it into your React app and get a ready-to-use chessboard without wiring up separate chess logic, move validation, or board state tools. Control the board position with simple FEN notation and react to moves or game-end events through callbacks.

## 📘 **Full documentation**: [https://react-chessboard-ui.dev/](https://react-chessboard-ui.dev/)

---

## 🚀 Features

- 🎯 Fully controlled via FEN strings
- ♟️ Built-in chess engine and ready-made board UI
- ✅ Move validation included
- ♻️ React functional component with hooks support
- 🎨 Customizable styles (via CSS or override)
- ♟️ Game-end and move-change callbacks
- 🧩 No extra chess packages or setup required

---

## Why react-chessboard-ui?

`react-chessboard-ui` is designed for developers who need a React chessboard, chess UI, and chess engine in one package. It is not just a board renderer: it provides drag-and-drop chess pieces, FEN-based position control, legal move handling, game-end detection, and customization options out of the box.

---

## 📦 Installation

Install via npm:

```bash
npm install react-chessboard-ui
```

Or using yarn:

```bash
yarn add react-chessboard-ui
```

---

## 💡 Usage Example

```tsx
import React from 'react';
import { ChessBoard } from 'react-chessboard-ui';
import 'react-chessboard-ui/dist/index.css'; // Required CSS

export const App = () => {
  return (
    <ChessBoard
      FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      onChange={handleChangePosition}
      onEndGame={handleEndGame}
    />
  );
};
```

## Full customizable

### 📘 **Documentation for customization**: [https://react-chessboard-ui.dev/properties/config/](https://react-chessboard-ui.dev/properties/config/)


---

## 👥 Authors

Created by:

- [Tatiana Utbanova](https://www.linkedin.com/in/tatiana-utbanova-6415b8271/) - Design owner
- [Alexander Utbanov](https://linkedin.com/in/alexander-utbanov-a9670a210/) - Code owner

---

## 📄 License

MIT © [react-chessboard-ui](https://github.com/)

---

## 🧠 Keywords (for discoverability)

`react` `react-chess` `react-chessboard` `react-chessboard-ui` `js-chess` `chess` `chessboard` `chessboard component` `chess engine`
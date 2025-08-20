# react-chessboard-ui ♟️

[![NPM](https://img.shields.io/npm/v/react-chessboard-ui.svg)](https://www.npmjs.com/package/react-chessboard-ui)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A lightweight and customizable React chessboard component built with modern UI in mind. Easily integrate chess functionality into your React apps with FEN support, game-end detection, and position handling.

<img src="./blob/ChessBoard.png?raw=true" width="400px" alt="react-chessboard-ui preview" />

## 📘 **Full documentation**: [https://react-chessboard-ui.dev/](https://react-chessboard-ui.dev/)

---

## 🚀 Features

- 🎯 Fully controlled via FEN strings
- ♻️ React functional component with hooks support
- 🎨 Customizable styles (via CSS or override)
- ♟️ Game-end and move-change callbacks
- 🧩 Easy integration into any React project

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
    <div>
      <ChessBoard
        FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onChange={handleChangePosition}
        onEndGame={handleEndGame}
      />
    </div>
  );
};
```

## Full customizable
<img src="./blob/customization.png?raw=true" width="400px" alt="react-chessboard-ui preview" />

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

`react` `chess` `chessboard` `react-chess` `chess ui` `react chess component` `fen` `chess game` `react board game`

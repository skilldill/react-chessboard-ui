# react-chessboard-ui

[![NPM](https://img.shields.io/npm/v/react-chessboard-ui.svg)](https://www.npmjs.com/package/react-chessboard-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## ❗️ ATTENTION ❗️
This is a package that is currently in active development.

<img src="./blob/ChessBoard.png?raw=true" width="400px">

## Install

```bash
npm install react-chessboard-ui
```

or

```bash
yarn add react-chessboard-ui
```

## Usage
```tsx
import React from 'react';
import { ChessBoard } from 'rechreact-chessboard-ui'; // ChessBoard is a base component of react-chessboard-ui

import 'react-chessboard-ui/dist/index.css'; // required import css for ChessBoard

export const App = () => {

  // This handler for example 
  const handleChangePosition = (data) => {
    console.log(data);
  }

  return (
    <div>
      <ChessBoard 
        FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onChange={handleChangePosition}
        color="white"
        reversed={reversed} // For black
      />
    </div>
  );
}
```

## Designer
[LinkedIn: Tatiana Utbanova](https://www.linkedin.com/in/tatiana-utbanova-6415b8271/)

## License

MIT © [](https://github.com/)
# react-chessboard-ui

[![NPM](https://img.shields.io/npm/v/react-chessboard-ui.svg)](https://www.npmjs.com/package/react-chessboard-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<img src="./blob/ChessBoard.png?raw=true" width="400px">

## See full documentation on https://chessboardui.space


## Install

```bash
npm install react-chessboard-ui
```

or

```bash
yarn add react-chessboard-ui
```

## Usage example
```tsx
import React from 'react';
import { ChessBoard } from 'react-chessboard-ui'; // ChessBoard is a base component of react-chessboard-ui

import 'react-chessboard-ui/dist/index.css'; // required import css for ChessBoard

export const App = () => {

  // ... all handlers

  return (
    <div>
      <ChessBoard 
        FEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        onChange={handleChangePosition}
        onEndGame={handleEndGame}
      />
    </div>
  );
}
```

## Creators
Created by [in: Tanya](https://www.linkedin.com/in/tatiana-utbanova-6415b8271/) and [in: Alex](linkedin.com/in/alexander-utbanov-a9670a210/)

## License
MIT © [](https://github.com/)
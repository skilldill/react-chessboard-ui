# rechess

[![NPM](https://img.shields.io/npm/v/rechess.svg)](https://www.npmjs.com/package/rechess) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## ❗️ ATTENTION ❗️
This is a package that is currently in active development.

<img src="./blob/ChessBoard.png?raw=true" width="400px">

## Install

```bash
npm install rechess
```

or

```bash
yarn add rechess
```

## Usage
```tsx
import React from 'react';
import { ChessBoard } from 'rechess'; // ChessBoard is a base component of rechess

import 'rechess/dist/index.css'; // required import css for ChessBoard

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
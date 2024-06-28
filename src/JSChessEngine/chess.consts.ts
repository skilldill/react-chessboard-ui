/* eslint-disable */
import { Cell, Figure } from './JSChessEngine';

export const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const FIGURES_LATTERS_NOTATIONS = {
  white: {
    pawn: 'P',
    knight: 'N',
    bishop: 'B',
    rook: 'R',
    queen: 'Q',
    king: 'K',
  },

  black: {
    pawn: 'p',
    knight: 'n',
    bishop: 'b',
    rook: 'r',
    queen: 'q',
    king: 'k',
  },
};

export const LETTER_TO_FIGURE_MAP: { [key: string]: Figure } = {
  P: { type: 'pawn', color: 'white' },
  N: { type: 'knight', color: 'white' },
  B: { type: 'bishop', color: 'white' },
  R: { type: 'rook', color: 'white' },
  Q: { type: 'queen', color: 'white' },
  K: { type: 'king', color: 'white' },

  p: { type: 'pawn', color: 'black' },
  n: { type: 'knight', color: 'black' },
  b: { type: 'bishop', color: 'black' },
  r: { type: 'rook', color: 'black' },
  q: { type: 'queen', color: 'black' },
  k: { type: 'king', color: 'black' },
};

export const ALL_FIGURES: Figure[] = [
  { type: 'pawn', color: 'white' },
  { type: 'knight', color: 'white' },
  { type: 'bishop', color: 'white' },
  { type: 'rook', color: 'white' },
  { type: 'queen', color: 'white' },
  { type: 'king', color: 'white' },

  { type: 'pawn', color: 'black' },
  { type: 'knight', color: 'black' },
  { type: 'bishop', color: 'black' },
  { type: 'rook', color: 'black' },
  { type: 'queen', color: 'black' },
  { type: 'king', color: 'black' },
];

export const CHESS_BOARD_CONFIG = {
  cellWhiteBg: '#FFFFFF',
  cellBlackBg: '#E2E4ED',
  cellSelectedBg: '#728bc1',

  cellSize: 80,

  figures: {
    white: {
      pawn: '',
      bishop: '',
      knight: '',
      rook: '',
      queen: '',
      king: '',
    },

    black: {
      pawn: '',
      bishop: '',
      knight: '',
      rook: '',
      queen: '',
      king: '',
    },
  },
};

export const INITIAL_CELLS: Cell[][] = [
  [
    { figure: { type: 'rook', color: 'black', touched: false } },
    { figure: { type: 'knight', color: 'black', touched: false } },
    { figure: { type: 'bishop', color: 'black', touched: false } },
    { figure: { type: 'queen', color: 'black', touched: false } },
    { figure: { type: 'king', color: 'black', touched: false } },
    { figure: { type: 'bishop', color: 'black', touched: false } },
    { figure: { type: 'knight', color: 'black', touched: false } },
    { figure: { type: 'rook', color: 'black', touched: false } },
  ],
  [
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
    { figure: { type: 'pawn', color: 'black', touched: false } },
  ],
  [
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
  ],
  [
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
  ],
  [
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
  ],
  [
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
    { figure: undefined },
  ],
  [
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
    { figure: { type: 'pawn', color: 'white', touched: false } },
  ],
  [
    { figure: { type: 'rook', color: 'white', touched: false } },
    { figure: { type: 'knight', color: 'white', touched: false } },
    { figure: { type: 'bishop', color: 'white', touched: false } },
    { figure: { type: 'queen', color: 'white', touched: false } },
    { figure: { type: 'king', color: 'white', touched: false } },
    { figure: { type: 'bishop', color: 'white', touched: false } },
    { figure: { type: 'knight', color: 'white', touched: false } },
    { figure: { type: 'rook', color: 'white', touched: false } },
  ],
];
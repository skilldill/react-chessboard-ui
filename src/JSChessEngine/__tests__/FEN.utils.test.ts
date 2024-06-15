import {
  INITIAL_CELLS,
  STATE_CELLS_WITHOUT_LONG_CASTLINGS,
} from './chessState.mock';
import { FENtoGameState, stateToFEN } from '../FEN.utils';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const ONLY_ROOKS_FEN = '4r3/8/8/8/8/8/8/4R3 b - - 0 1';
const KINGS_WITHOUT_LONG_CASTLING_FEN =
  'r3kbnr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/R3KBNR w Kk - 0 1';
const FEN_WITH_BEATED_FIELD =
  'rnbqkbnr/pppppppp/8/8/6p1/8/PPPPPP1P/RNBQKBNR b KQkq g4 0 1';
const FEN_WITHOUT_LONG_CASTLINGS =
  '1rbqkb1r/pppppp1p/2n2np1/8/8/2N2PP1/PPPPP2P/1RBQKBNR w Kk - 3 4';

describe('Тесты на FENtoGameState', () => {
  it('FENtoGameState вернет правильный стейт для воссоздани начальной позиции', () => {
    const gameState = FENtoGameState(INITIAL_FEN);

    expect(gameState.currentColor).toBe('white');
    expect(gameState.boardState[0][4].figure?.type).toBe('king');
    expect(gameState.boardState[0][4].figure?.color).toBe('black');
    expect(gameState.boardState[0][0].figure?.touched).toBeFalsy();
  });

  it('FENtoGameState вернет правильный результат для FEN с двумя ладьями', () => {
    const gameState = FENtoGameState(ONLY_ROOKS_FEN);

    expect(gameState.currentColor).toBe('black');
    expect(!!gameState.boardState[1][4].figure).toBeFalsy();
    expect(gameState.boardState[0][4].figure?.type).toBe('rook');
    expect(gameState.boardState[7][4].figure?.type).toBe('rook');
    expect(gameState.boardState[7][4].figure?.touched).toBeTruthy();
  });

  it('FENtoGameState вернет правильный результат для FEN без длинных рокеровок', () => {
    const gameState = FENtoGameState(KINGS_WITHOUT_LONG_CASTLING_FEN);

    expect(gameState.currentColor).toBe('white');
    expect(gameState.boardState[7][4].figure?.touched).toBeFalsy();
    expect(gameState.boardState[0][4].figure?.touched).toBeFalsy();
    expect(gameState.boardState[7][0].figure?.touched).toBeTruthy();
    expect(gameState.boardState[0][0].figure?.touched).toBeTruthy();
  });

  it('FENtoGameState вернет правильный результат для FEN с битым полем g4', () => {
    const gameState = FENtoGameState(FEN_WITH_BEATED_FIELD);

    expect(gameState.currentColor).toBe('black');
    expect(gameState.boardState[5][6].beated).toBeTruthy();
  });
});

describe('Тесты на stateToFEN', () => {
  it('stateToFEN вернет правильный FEN из INITIAL_STATE', () => {
    const FEN = stateToFEN(INITIAL_CELLS, 'white', 1);

    expect(FEN).toBe(INITIAL_FEN);
  });

  it('stateToFEN вернет правильный FEN из STATE_CELLS_WITHOUT_LONG_CASTLINGS', () => {
    const FEN = stateToFEN(STATE_CELLS_WITHOUT_LONG_CASTLINGS, 'white', 4);

    expect(FEN).toBe(FEN_WITHOUT_LONG_CASTLINGS);
  });
});

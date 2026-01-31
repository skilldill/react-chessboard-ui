import React, { FC, useCallback } from 'react';
import styles from './ChessBoard.module.css';
import { getFigureCSS, getFiguresByColor } from './utils';
import { Piece, PieceColor } from '../JSChessEngine';
import { ChessBoardConfig } from './models';

interface FigurePickerProps {
  boardConfig: ChessBoardConfig;
  color: PieceColor;
  forPawnTransform?: boolean;
  onSelect: (figure: Piece) => void;
}

export const FigurePicker: FC<FigurePickerProps> = (props) => {
  const { boardConfig, color, onSelect, forPawnTransform = false } = props;

  const handleChange = useCallback(
    (figure: Piece) => {
      onSelect(figure);
    },
    [onSelect]
  );

  return (
    <div className={styles.piecePicker}>
      {getFiguresByColor(color, forPawnTransform).map((figure) => (
        <div
          key={figure.type}
          className={styles.piecePickerItem}
          style={{
            width: boardConfig.squareSize,
            height: boardConfig.squareSize,
          }}
          onClick={() => handleChange(figure)}
        >
          {boardConfig.piecesMap[getFigureCSS(figure)](`${boardConfig.pieceSizePercent}%`)}
        </div>
      ))}
    </div>
  );
};

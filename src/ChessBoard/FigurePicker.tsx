import React, { FC, useCallback } from 'react';
import styles from './ChessBoard.module.css';
import { getFigureCSS, getFiguresByColor } from './utils';
import { Figure, FigureColor } from '../JSChessEngine';
import { ChessBoardConfig } from './models';

interface FigurePickerProps {
  boardConfig: ChessBoardConfig;
  color: FigureColor;
  forPawnTransform?: boolean;
  onSelect: (figure: Figure) => void;
}

export const FigurePicker: FC<FigurePickerProps> = (props) => {
  const { boardConfig, color, onSelect, forPawnTransform = false } = props;

  const handleChange = useCallback(
    (figure: Figure) => {
      onSelect(figure);
    },
    [onSelect]
  );

  return (
    <div className={styles.figurePicker}>
      {getFiguresByColor(color, forPawnTransform).map((figure) => (
        <div
          key={figure.type}
          className={styles.figurePickerItem}
          style={{
            width: boardConfig.cellSize,
            height: boardConfig.cellSize,
          }}
          onClick={() => handleChange(figure)}
        >
          {boardConfig.piecesMap[getFigureCSS(figure)]('80%')}
        </div>
      ))}
    </div>
  );
};

import React, { FC, useMemo } from 'react';
import styles from './ChessBoard.module.css';
import { calcAngle } from './utils';

interface ArrowProps {
  start: number[];
  end: number[];
  color: string;
}

// Используется для центрирования конца
// стрелки относительно клетки
const ARROW_CORRECTION = 20;

export const Arrow: FC<ArrowProps> = (props) => {
  const { start, end, color } = props;

  const arrowLength = useMemo(
    () =>
      Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
      ),
    [start, end]
  );

  if (arrowLength <= ARROW_CORRECTION * 3) {
    return null;
  }

  return (
    <div
      className={styles.arrow}
      style={{
        height: arrowLength - ARROW_CORRECTION,
        top: `${start[1]}px`,
        left: `${start[0]}px`,
        transformOrigin: `10px 0`,
        transform: `rotate(${calcAngle(start, end)}deg)`,
        backgroundColor: color,
      }}
    >
      <div 
        className={styles.arrowEnd} 
        style={{ borderLeftColor: color }}
      ></div>
    </div>
  );
};
